const moment = require("moment");
const axios = require("axios");

const { Client, GatewayIntentBits, Partials, EmbedBuilder } = require("discord.js");
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

const space = { name: "\u2008", value: "\u2008" };

const createContribution = async ({ data }) => {
  const requestContribution = async (user) => {
    try {
      return await axios.get(`https://github-contributions-api.jogruber.de/v4/${user}?y=2023`);
    } catch {
      return {
        data: {
          contributions: [{
            date: new Date(),
            count: 0,
            level: 0,
            failed: true
          }]
        }
      }
    }
  };

  const findToday = (value) => {
    return moment(new Date()).format("YYYY-MM-DD") === moment(value.date).format("YYYY-MM-DD");
  };

  const status = (value) => {
    const { count, failed } = value;

    if (failed) {
      return '대상 없음';
    } else {
      return count > 0 ? "완료" : "미완료";
    }
  };

  const messageObject = (value, index) => {
    const response = [];
    response.push({ name: `${data[index]}`, value: status(value), inline: true });
    response.push({ name: `커밋 개수`, value: `${value.count} commits`, inline: true });
    response.push({ name: `반영 레벨`, value: `${value.level}`, inline: true });
    return response;
  };

  const users = [...data];
  const contributions = await Promise.all(users.map((user) => requestContribution(user)));

  const results = contributions.map((c) => c.data.contributions.find(findToday));
  const fields = results.map(messageObject);

  const color = results.every((r) => r.count > 0) ? 4712070 : 15750228;

  const embed = new EmbedBuilder();

  embed.setTitle("매일 잔디 심기 챌린지");
  embed.setDescription("매일 6시 정각에 커밋 상태를 확인하고 알림을 전송합니다.");
  embed.setColor(color);

  embed.addFields({ ...space });
  fields.forEach((field) => embed.addFields(...field));
  embed.addFields({ ...space });

  embed.setTimestamp();
  embed.setFooter({ text: "jiwooproity", iconURL: "https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1567128822/noticon/osiivsvhnu4nt8doquo0.png" });
  
  return embed;
};

const createHelpEmbed = () => {
  const embed = new EmbedBuilder();
  const color = 4712070;

  embed.setTitle("!help");
  embed.setDescription("매일 잔디 심기 챌린지 봇 명령어는 아래와 같습니다.");
  embed.setColor(color);

  embed.addFields({ ...space });
  embed.addFields({ name: "!help", value: "명령어 목록", inline: true });
  embed.addFields({ name: "!search", value: "유저 커밋 상태 확인\n!search {gitname}, {gitname}", inline: true });
  embed.addFields({ name: "!pinch", value: "그룹에 속한 원하는 유저에게 재촉 메세지를 전송합니다.", inline: false });
  embed.addFields({ name: "!noti", value: "그룹 내 유저들에게 공지 메세지를 전송합니다.", inline: true });
  embed.addFields({ ...space });

  embed.setTimestamp();
  embed.setFooter({ text: "jiwooproity", iconURL: "https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1567128822/noticon/osiivsvhnu4nt8doquo0.png" });
  return embed;
};

exports.embeds = {
  helpEmbed: () => createHelpEmbed(),
  createEmbed: async ({ data }) => await createContribution({ data }),
};

client.login(process.env.DISCORD_TOKEN);
