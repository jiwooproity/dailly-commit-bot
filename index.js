const { Client, GatewayIntentBits, Partials } = require("discord.js");
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

const moment = require("moment");
require("dotenv").config();

const { commands, command } = require("./command/command");

client.on("messageCreate", async (message) => {
  const prefix = "!";

  switch (message.channel.type) {
    case "dm":
      break;
    case 0:
      const fetchMessage = await message.channel.messages.fetch(message.id);
      const parseMessage = fetchMessage.content.split(" ");

      if (parseMessage[0].startsWith(prefix)) {
        const shift = parseMessage.shift();
        const request = shift.replace(prefix, "");

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

client.once("ready", () => {
  command.alertChannels({ message: "봇 알림이 활성화 되었습니다." });
});

setInterval(() => {
  const todayMoment = moment(new Date()).format("HH:mm:ss");
  if (todayMoment === "18:00:00") command.alert();
}, 1000);

client.login(process.env.DISCORD_TOKEN);
