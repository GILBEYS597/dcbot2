import { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Belirtilen kullanıcıyı sunucudan atar.")
    .addUserOption(option =>
      option
        .setName("kullanıcı")
        .setDescription("Atılacak kullanıcıyı seçin.")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("sebep")
        .setDescription("Atılma sebebini belirtin.")
        .setRequired(false)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser("kullanıcı");
    const reason = interaction.options.getString("sebep") || "Sebep belirtilmedi.";
    const executor = interaction.member;

    if (!executor.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return interaction.reply({
        content: "Bu komutu kullanmak için yeterli izniniz yok.",
        ephemeral: true,
      });
    }

    const targetMember = await interaction.guild.members.fetch(targetUser.id);

    if (!targetMember) {
      return interaction.reply({
        content: "Kullanıcı bulunamadı.",
        ephemeral: true,
      });
    }

    if (!targetMember.kickable) {
      return interaction.reply({
        content: "Bu kullanıcıyı atamıyorum. Kullanıcının rolü benim rolümden daha yüksek olabilir veya yeterli iznim yok.",
        ephemeral: true,
      });
    }

    try {
      await targetMember.kick(reason);
    } catch (error) {
      console.error("Kick error:", error);
      return interaction.reply({
        content: `Kullanıcıyı atarken bir hata oluştu: ${error.message}`,
        ephemeral: true,
      });
    }

    const confirmationEmbed = new EmbedBuilder()
      .setTitle("Kullanıcı Başarıyla Atıldı!")
      .setColor("Green")
      .setDescription(`${targetUser.tag} adlı kullanıcı sunucudan atıldı.`)
      .addFields(
        { name: "Atan Kişi", value: `${executor}`, inline: true },
        { name: "Atılma Sebebi", value: reason, inline: true }
      )
      .setTimestamp();

    return interaction.reply({
      embeds: [confirmationEmbed],
      ephemeral: false,
    });
  },
};