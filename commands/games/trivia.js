import { SlashCommandBuilder } from "discord.js";

const questions = [
  {
    question: "Dünyanın en yüksek dağı hangisidir?",
    options: ["A) K2", "B) Everest", "C) Kangchenjunga", "D) Lhotse"],
    answer: "B"
  },
  {
    question: "Python programlama dilinin yaratıcısı kimdir?",
    options: ["A) Dennis Ritchie", "B) Bjarne Stroustrup", "C) Guido van Rossum", "D) James Gosling"],
    answer: "C"
  },
  // Daha fazla soru ekleyin
];

export default {
  data: new SlashCommandBuilder()
    .setName("trivia")
    .setDescription("Sıralı bir şekilde şıklı sorular sorar."),
  async execute(interaction) {
    let score = 0;

    for (const question of questions) {
      const optionsText = question.options.join("\n");
      await interaction.reply({
        content: `${question.question}\n${optionsText}`,
        fetchReply: true
      });

      const filter = response => {
        return response.author.id === interaction.user.id;
      };

      const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] })
        .catch(() => null);

      if (collected && collected.first().content.toUpperCase() === question.answer) {
        score++;
        await interaction.followUp("Doğru cevap! 🎉");
      } else {
        await interaction.followUp(`Yanlış cevap. Doğru cevap: ${question.answer}`);
      }
    }

    await interaction.followUp(`Oyun bitti! Toplam doğru cevap sayınız: ${score}`);
  },
};
