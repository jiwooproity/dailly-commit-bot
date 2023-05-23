const { Client, GatewayIntentBits, Partials } = require("discord.js");
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

const moment = require("moment");
require("dotenv").config();
const { commands, command } = require("./command/command");

const prefix = process.env.BOT_PREFIX;

client.on("messageCreate", async (message) => {
  let fetchMessage = '';

  const { id, channelId, author, channel } = message;
  const { discriminator } = author;
  const { type } = channel;

  // 디스코드 봇의 DM인 경우 감지하지 않음
  if (discriminator !== '2140') {
    switch (type) {
      case 1:
        fetchMessage = await author.dmChannel.messages.fetch(id);
        break;
      case 0:
        fetchMessage = await channel.messages.fetch(id);
        break;
      default:
        break;
    }
  
    const parseMessage = fetchMessage.content.split(" ");
    const [cmdName, cmdContent] = parseMessage;
  
    if (cmdName.startsWith(prefix)) {
      const request = cmdName.replace(prefix, "");
      const isExist = commands.includes(request);

      if (isExist) command[request]({ channelId, cmdContent });
      else command.message({ channelId, content: "알 수 없는 명렁어입니다." });
    }
  }
});

// client.once("ready", () => {
//   command.alertChannels({ content: "봇 알림이 활성화 되었습니다." });
// });

setInterval(() => {
  const todayMoment = moment(new Date()).format("HH:mm:ss");
  if (todayMoment === "16:42:00") command.alert();
}, 1000);

client.login(process.env.DISCORD_TOKEN);
