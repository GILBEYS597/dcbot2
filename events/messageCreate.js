export default {
    name: "messageCreate",
    async execute(message) {
      // Botun kendi mesajlarına yanıt vermemesi için kontrol
      if (message.author.bot) return;

      // Mesaj içeriği "sa" ise yanıt ver
      if (message.content.toLowerCase() === "sa") {
        message.channel.send("as");
      }
    },
  };