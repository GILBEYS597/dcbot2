export default {
    name: "interactionCreate",
    async execute(interaction, client, logger) {
     if (!interaction.isCommand()) return;

      const command = client.commands.get(interaction.commandName);

      if (!command) {
        logger.warn(`Komut bulunamadı: ${interaction.commandName}`);
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        logger.error(`Komut çalıştırılırken hata oluştu: ${interaction.commandName}`, error);
        await interaction.reply({ content: "Komut çalıştırılırken bir hata oluştu.", ephemeral: true });
      }
    },
  };