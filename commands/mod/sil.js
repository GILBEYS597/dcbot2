import {SlashCommandBuilder, PermissionsBitField, EmbedBuilder} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("sil")
        .setDescription("Belirtilen miktarda mesajı siler.")
        .addIntegerOption(option =>
             option
             .setName("miktar").setDescription("Silinecek mesaj sayısı")
             .setMinValue(1)
             .setMaxValue(100)
             .setRequired(true)),


   async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        const yetkiYokEmbed = new EmbedBuilder()
         .setTitle("Yetkisiz Erişim")
         .setDescription("Bu komutu kullanmak için gerekli yetkilere sahip olmalısınız.")
         .setColor("Red")

        return await interaction.reply({
          embeds: [yetkiYokEmbed],
          ephemeral: true,
        });
    }

    const amount = interaction.options.getInteger("miktar");

    try {
        await interaction.channel.bulkDelete(amount, true);

        const successEmbed = new EmbedBuilder()
         .setTitle("Mesajlar Silindi")
         .setDescription(`${amount} mesaj başarıyla silindi.`)
         .setColor("Green")

        await interaction.reply({
          embeds: [successEmbed],
          ephemeral: true,
         });

    } catch (error) {
        const hataEmbed = new EmbedBuilder()
          .setTitle("Bir hata oluştu")
          .setDescription(`Bir hata oluştu: ${error.message}`)
          .setColor("Red")

        await interaction.reply({
          embeds: [hataEmbed],
          ephemeral: true,
        });

        console.error(
            `Silme işlemi sırasında bir hata oluştu: ${error}`,
        );
    }



   }
}
