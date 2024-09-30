import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import os from "os";
import { performance } from "perf_hooks";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("📡 Botun pingini ve sistem performansını gösterir."),
  async execute(interaction) {
    const start = performance.now();
    const msg = await interaction.reply({ content: "🔄 Ping hesaplanıyor...", fetchReply: true });
    const latency = performance.now() - start;
    const { uptime, guilds, users } = interaction.client;
    const apiPing = interaction.client.ws.ping;
    const cpus = os.cpus();
    let idle = 0, total = 0;
    cpus.forEach(cpu => { idle += cpu.times.idle; total += Object.values(cpu.times).reduce((a, b) => a + b, 0); });
    const cpuUsage = ((1 - idle / total) * 100).toFixed(2);
    const embed = new EmbedBuilder()
      .setTitle("📶 Ping & Sistem Durumu")
      .setColor("Green")
      .setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: "🏓 Bot Ping", value: `${latency.toFixed(2)}ms`, inline: true },
        { name: "🔗 API Ping", value: `${apiPing}ms`, inline: true },
        { name: "⏳ Uptime", value: formatUptime(uptime), inline: true },
        { name: "💾 Bellek Kullanımı", value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true },
        { name: "📊 CPU Kullanımı", value: `${cpuUsage}%`, inline: true },
        { name: "💻 CPU Modeli", value: cpus[0].model, inline: true },
        { name: "🧮 CPU Çekirdekleri", value: `${cpus.length} Çekirdek`, inline: true },
        { name: "📁 Sunucu Sayısı", value: `${guilds.cache.size}`, inline: true },
        { name: "👥 Kullanıcı Sayısı", value: `${users.cache.size}`, inline: true }
      )
      .setTimestamp()
      .setFooter({ text: `Komutu kullanan: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
    await msg.edit({ content: null, embeds: [embed] });
  },
};

const formatUptime = ms => {
  const d = Math.floor(ms / 86400000),
        h = Math.floor((ms % 86400000) / 3600000),
        m = Math.floor((ms % 3600000) / 60000),
        s = Math.floor((ms % 60000) / 1000);
  return `${d}d ${h}h ${m}m ${s}s`;
};