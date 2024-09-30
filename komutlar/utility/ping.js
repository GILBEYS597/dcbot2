export default {
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Botun pingini gösterir."),
    async execute(interaction) {
    const PingEmbed = new EmbedBuilder()
    .setTitle("Ping")
    .setColor("Blue")
    .setDescription(`Botun pingi: ${interaction.client.ws.ping}ms`)
    .addFields(
        {name: "Botun pingi", value: `${interaction.client.ws.ping}ms`},
        {name: "Botping", value: `${Date.now() - interaction.createdTimestamp}ms`}
    )
    await interaction.reply({ embeds: [PingEmbed] });
}
}
