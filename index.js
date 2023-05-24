const { Client, GatewayIntentBits, Partials } = require("discord.js");
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

const moment = require("moment");
const { commands, command } = require("./command/command");
const { Type } = require("./utils/Type");
const { Convert } = require("./utils/Convert");
require("dotenv").config();

const prefix = process.env.BOT_PREFIX;

client.on("messageCreate", async (message) => {
  let fetchMessage = '';

  const { id, channelId, guildId, author, channel } = message;
  const { discriminator, username } = author;
  const { type } = channel;

  // 디스코드 봇의 DM인 경우 감지하지 않음
  if (discriminator !== '2140') {
    try {
      switch (type) {
        case Type.MESSAGE.DM:
          fetchMessage = await author.dmChannel.messages.fetch(id);
          break;
        case Type.MESSAGE.GUILD:
          fetchMessage = await channel.messages.fetch(id);
          break;
        default:
          break;
      }
    } catch {
      return;
    }

    const { content } = fetchMessage;
    const getCommand = Convert.getCommand({ content: content });
  
    if (getCommand.startsWith(prefix)) {
      const request = getCommand.replace(prefix, "");
      const isExist = commands.includes(request);
      const getContent = Convert.getContent({ command: getCommand, content: content });

      if (isExist) command[request]({ message, channelId, guildId, username, content: getContent });
      else command.message({ channelId, content: "알 수 없는 명렁어입니다." });
    }
  }
});

// client.once("ready", () => {
//   command.alertChannels({ content: "봇 알림이 활성화 되었습니다." });
// });

setInterval(() => {
  const todayMoment = moment(new Date()).format("HH:mm:ss");
  if (todayMoment === "09:00:00") command.alert();
}, 1000);

client.login(process.env.DISCORD_TOKEN);
