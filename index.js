const { Client, Intents } = require("discord.js");
const client = new Client({
  Intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.MESSAGE_CONTENT],
});

const moment = require("moment");
require("dotenv").config();

const { commands, command } = require("./command/command");

client.on("message", async (message) => {
  switch (message.channel.type) {
    case "dm":
      break;
    case "text":
      const fetchMessage = await message.channel.messages.fetch(message.author.lastMessageID);
      const parseMessage = fetchMessage.content.split(" ");

      if (parseMessage[0].startsWith("!")) {
        const shift = parseMessage.shift();
        const request = shift.replace("!", "");

        if (!commands.includes(request)) {
          command.message({ message, content: "알 수 없는 명렁어입니다." });
        } else {
          const data = parseMessage.join("");
          command[request] && command[request]({ message, data });
        }
      }
      break;
    default:
      break;
  }
});

// client.once("ready", () => {
//   command.alertChannels({ message: "봇 알림이 활성화 되었습니다." });
// });

setInterval(() => {
  const todayMoment = moment(new Date()).format("HH:mm:ss");
  if (todayMoment === "18:00:00") command.alert();
}, 1000);

client.login(process.env.DISCORD_TOKEN);
