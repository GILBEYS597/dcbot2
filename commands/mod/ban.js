import { SlashCommandBuilder } from "discord.js";


export default {
    data: new SlashCommandBuilder()
     .setName("yasakla")
     .setDescription("İstediğiniz kullanıcıyı yasaklar.")
     .addUserOption(option => option.setName("kullanici").setDescription("Yasaklanacak kullanıcı").setRequired(true))
     .addStringOption(option => option.setName("sebep").setDescription("Yasaklanma sebebi").setRequired(true)),
    async execute(interaction) {
        const userId = interaction.options.getUser("kullanici").id;
        const banUser = interaction.guild.members.cache.get(userId);

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return await interaction.reply({
                content: "Bu komutu kullanabilmek için ban yetkilerine sahip olmalısınız.",
                ephemeral: true
            })
        }

        if (user.id === interaction.user.id) {
            return await interaction.reply({
                content: "Kendinizi yasaklayamazsınız.",
                ephemeral: true,
            });
        }



        let reason = interaction.options.getString("sebep");

        if (reason) {
         reason = "**Sebep:** Belirtilmedi."
        }

    const dmEmbed = new EmbedBuilder()
      .setTitle("Yasaklandın!")
       .setDescription(`Sevgili ${banUser.tag},
         ${interaction.guild.name}
          sunucusundan yasaklandınız. `
        )
      .setColor("Red")

     const banEmbed = new EmbedBuilder()
      .setTitle("Yeni Yasaklama")
      .setDescription(
         `${banUser.tag} isimli kullanıcı sunucudan yasaklanmıştır. `
        )
        .setColor("Red")
         .addFields({
            name: "Sebeb",
            value: `${reason}`,
         });




    await banUser
        .send({
         embeds: [dmEmbed]
         }).catch(error => {
        console.log(`dm gönderilirken bir hata oluştu: ${error}`);
         })

    await interaction.guild.bans.create(banUser.id,{reason}).
    catch(async (err) => {
        return await interaction.reply({
            content: "Yasaklanırken bir hata oluştu.",
            ephemeral: true,
        })
    })

    await interaction.reply({
        embeds: [banEmbed],
    });
    }
}
