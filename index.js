import dotenv from "dotenv";
import winston from "winston";
import {
  Client,
  GatewayIntentBits,
  Collection,
  Routes,
  REST,
  Events,
} from "discord.js";
import path from "path";
import { fileURLToPath } from "url";
import { readdir, stat } from "fs/promises";

// dotenv'i yapılandırma
dotenv.config();

// Değişkenlerin yüklendiğini doğrulamak için log ekleyin
console.log("DISCORD_TOKEN:", process.env.DISCORD_TOKEN);
console.log("CLIENT_ID:", process.env.CLIENT_ID);
console.log("GUILD_ID:", process.env.GUILD_ID);

// __dirname'i tanımlama
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

// Collection for Commands
client.commands = new Collection();

// Komutları Yükleme Fonksiyonu
const loadCommands = async (dir) => {
  const files = await readdir(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const fileStat = await stat(filePath);

    if (fileStat.isDirectory()) {
      await loadCommands(filePath);
    } else if (fileStat.isFile() && file.endsWith(".js")) {
      const command = await import(`file://${filePath}`);
      if ("data" in command.default && "execute" in command.default) {
        client.commands.set(command.default.data.name, command.default);
        console.log(`🔹 Yüklendi: ${command.default.data.name}`);
      } else {
        console.warn(`⚠️ Geçersiz komut yapısı: ${filePath}`);
      }
    }
  }
};

// Event'leri Yükleme Fonksiyonu
const loadEvents = async () => {
  const eventsPath = path.join(__dirname, "events");
  const eventFiles = await readdir(eventsPath);

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = await import(`file://${filePath}`);
    if (event.default.name && event.default.execute) {
      if (event.default.once) {
        client.once(event.default.name, (...args) =>
          event.default.execute(...args, client)
        );
      } else {
        client.on(event.default.name, (...args) =>
          event.default.execute(...args, client)
        );
      }
      console.log(`🔹 Yüklendi: ${event.default.name}`);
    } else {
      console.warn(`⚠️ Geçersiz event yapısı: ${filePath}`);
    }
  }
};

// Komutları Discord API'ye Kaydetme Fonksiyonu
const registerCommands = async () => {
  const commands = client.commands.map((cmd) => cmd.data.toJSON());

  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

  try {
    console.log("🔄 Slash komutları Discord API'ye kaydediliyor...");
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), // YOUR_GUILD_ID'i kendi sunucu ID'niz ile değiştirin
      { body: commands }
    );

    console.log("✅ Slash komutları başarıyla kaydedildi.");
  } catch (error) {
    console.error("❌ Slash komutları kaydedilirken hata oluştu:", error);
  }
};

// Botu Başlatma Fonksiyonu
const initializeBot = async () => {
  try {
    await loadCommands(path.join(__dirname, "commands"));
    await loadEvents();
    await registerCommands();
    await client.login(process.env.DISCORD_TOKEN);
    console.log("✅ Bot başarıyla giriş yaptı.");
  } catch (error) {
    console.error("❌ Bot başlatılırken hata oluştu:", error);
    process.exit(1);
  }
};

// Başlatma
initializeBot();
