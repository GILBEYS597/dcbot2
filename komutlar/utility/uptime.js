import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
    .setName("uptime")
    .setDescription("Botun çalışma süresini gösterir."),
    async execute(interaction) {
const data = Bun.file("./data.ayt");
const jsonData = await data.json();

        return interaction.reply({
        content: `${Date.now() - jsonData.startTime}`
    });
  },
};



