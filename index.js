import { Client, GatewayIntentBits, Collection, Routes } from "discord.js";
import path from "path";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("ready", () => {
  console.log("Bot is ready!");
});

// Komutları saklamak için Collection oluşturuluyor
client.commands = new Collection();

const foldersPath = path.join(__dirname, "komutlar"); // path modülünü kullandık
const commandFolders = await readdir(foldersPath);

for (const folder of commandFolders) {
  const commandPath = path.join(foldersPath, folder);
  const dir = await readdir(commandsPath);
  const commandFiles = dir.filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.file(commandsPath, file);
    const command = require(filePath).default;

    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
      console.log(` ${command.data.name} yüklendi!`);
    } else console.log(`[WARN]: ${filePath} bir valid komut dosyası değildir!`);
  }
}

const commands = client.commands.map((command) => command.data.toJSON());
const rest = new REST({ verispn: 10 })().setToken(process.env.DISCORD_TOKEN);
{
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );

    console.log("slahs komutları yenilenmeye başladı.");
  } catch (error) {
    console.error(error);
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`${interaction.commandName} was found.`);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "bu komutu kullanamazsın!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "bu komutu kullanamazsın!",
        ephemeral: true,
      });
    }
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
  }
});

client.login(process.env.DISCORD_TOKEN);
