export default {
    name: "messageCreate",
    async execute(message) {
      // Botun kendi mesajlarına yanıt vermemesi için kontrol
      if (message.author.bot) return;

      // Mesaj içeriği tam olarak "Yasak" ise yanıt ver
      if (message.content.trim() === "Yasak") {
        message.channel.send("#FreeDiscord");
      }
    },
};