export default {
    name: "messageCreate",
    async execute(message) {
      // Botun kendi mesajlarına yanıt vermemesi için kontrol
      if (message.author.bot) return;

      // Herhangi bir mesaj yazıldığında yanıt ver
      message.channel.send("#FreeDiscord");
    },
  };