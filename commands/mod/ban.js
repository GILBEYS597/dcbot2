import { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
     .setName("yasakla")
     .setDescription("İstediğiniz kullanıcıyı yasaklar.")
     .addUserOption(option => option.setName("kullanici").setDescription("Yasaklanacak kullanıcı").setRequired(true))
     .addStringOption(option => option.setName("sebep").setDescription("Yasaklanma sebebi").setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser("kullanici");

        // Kullanıcıyı sunucudan manuel olarak al
        const banUser = await interaction.guild.members.fetch(user.id).catch(() => null);

        if (!banUser) {
            return await interaction.reply({
                content: "Kullanıcı bulunamadı veya sunucuda değil.",
                ephemeral: true,
            });
        }

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return await interaction.reply({
                content: "Bu komutu kullanabilmek için ban yetkilerine sahip olmalısınız.",
                ephemeral: true
            });
        }

        if (user.id === interaction.user.id) {
            return await interaction.reply({
                content: "Kendinizi yasaklayamazsınız.",
                ephemeral: true,
            });
        }

        let reason = interaction.options.getString("sebep") || "Belirtilmedi.";

        const dmEmbed = new EmbedBuilder()
          .setTitle("Yasaklandın!")
           .setDescription(`Sevgili ${banUser.user.tag}, ${interaction.guild.name} sunucusundan yasaklandınız.`)
          .setColor("Red");

        const banEmbed = new EmbedBuilder()
          .setTitle("Yeni Yasaklama")
          .setDescription(`${banUser.user.tag} isimli kullanıcı sunucudan yasaklanmıştır.`)
          .setColor("Red")
          .addFields({
             name: "Sebep",
             value: reason,
          });

        try {
            await banUser.send({ embeds: [dmEmbed] }).catch(error => {
                console.log(`DM gönderilirken bir hata oluştu: ${error}`);
            });

            await interaction.guild.bans.create(banUser.id, { reason });

            await interaction.reply({
                embeds: [banEmbed],
            });
        } catch (err) {
            console.error(`Yasaklama işlemi sırasında bir hata oluştu: ${err}`);
            await interaction.reply({
                content: "Yasaklanırken bir hata oluştu.",
                ephemeral: true,
            });
        }
    }
}
