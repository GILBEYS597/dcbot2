import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
    .setName("uptime")
    .setDescription("Botun ne kadar süredir çalıştığını gösterir."),

    async execute(interaction) {
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        await interaction.reply(`Bot ${hours} saat, ${minutes} dakika, ${seconds} saniyedir çalışıyor.`);
    },
};