import { SlashCommandBuilder } from "discord.js";

const questions = [
  {
    question: "Dünyanın en yüksek dağı hangisidir?",
    answer: "Everest"
  },
  {
    question: "Python programlama dilinin yaratıcısı kimdir?",
    answer: "Guido van Rossum"
  },
  // Daha fazla soru ekleyin
];

export default {
  data: new SlashCommandBuilder()
    .setName("trivia")
    .setDescription("Rastgele bir soru sorar."),
  async execute(interaction) {
    const randomIndex = Math.floor(Math.random() * questions.length);
    const selectedQuestion = questions[randomIndex];

    await interaction.reply({
      content: selectedQuestion.question,
      fetchReply: true
    });

    const filter = response => {
      return response.content.toLowerCase() === selectedQuestion.answer.toLowerCase() && response.author.id === interaction.user.id;
    };

    interaction.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ['time'] })
      .then(collected => {
        interaction.followUp(`Tebrikler, doğru cevap! 🎉`);
      })
      .catch(collected => {
        interaction.followUp(`Üzgünüm, doğru cevap: ${selectedQuestion.answer}`);
      });
  }
};
