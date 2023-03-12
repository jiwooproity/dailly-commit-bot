const moment = require("moment");
const axios = require("axios");

const { Client, Intents, MessageEmbed } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.MESSAGE_CONTENT] });

const createContribution = async ({ data }) => {
  const requestContribution = async (user) => {
    return await axios.get(`https://github-contributions-api.jogruber.de/v4/${user}?y=2023`);
  };

  const findToday = (value) => {
    return moment(new Date()).format("YYYY-MM-DD") === moment(value.date).format("YYYY-MM-DD");
  };

  const messageObject = (value, index) => {
    const status = (count) => {
      return count > 0 ? "완료" : "미완료";
    };

    return [
      {
        name: `${data[index]}`,
        value: status(value.count),
        inline: true,
      },
      {
        name: `커밋 개수`,
        value: `${value.count} commits`,
        inline: true,
      },
      {
        name: `반영 레벨`,
        value: `${value.level}`,
        inline: true,
      },
    ];
  };

  const users = [...data];
  const contributions = await Promise.all(users.map((user) => requestContribution(user)));
  const results = contributions.map((c) => c.data.contributions.find(findToday));
  const fields = results.map(messageObject);

  const embed = new MessageEmbed();
  const color = results.every((r) => r.count > 0) ? "0x47e686" : "0xf05454";
  const space = { name: "\u2008", value: "\u2008" };

  embed.setTitle("매일 잔디 심기 챌린지");
  embed.setDescription("매일 6시 정각에 커밋 상태를 확인하고 알림을 전송합니다.");
  embed.setColor(color);

  embed.addFields({ ...space });
  fields.forEach((field) => embed.addFields(...field));
  embed.addFields({ ...space });

  embed.setTimestamp();
  embed.setFooter("jiwooproity", "https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1567128822/noticon/osiivsvhnu4nt8doquo0.png");
  return embed;
};

const channelFetch = async (channelId) => {
  return await client.channels.fetch(channelId);
};

const sendAlert = async () => {
  const embed = await createContribution({ data: ["jiwooproity"] });
  const channelTarget = await channelFetch(process.env.DEVELOPER_CHANNEL);
  await channelTarget.send({ embed: embed });
};

const searchCommand = async ({ message, data }) => {
  const embed = await createContribution({ data: data.split(",") });
  const channelTarget = await channelFetch(message.channel.id);
  await channelTarget.send({ embed: embed });
};

const alertChannels = async ({ message }) => {
  // const channels = client.channels.cache.filter((c) => c.type === "text");
  const channelTarget = await channelFetch(process.env.DEVELOPER_CHANNEL);
  await channelTarget.send(message);
};

const sendMessage = async ({ message, content }) => {
  const channelTarget = await channelFetch(message.channel.id);
  await channelTarget.send(content);
};

exports.commands = ["search"];
exports.command = {
  alert: () => sendAlert(),
  search: ({ message, data }) => searchCommand({ message, data }),
  alertChannels: ({ message }) => alertChannels({ message }),
  message: ({ message, content }) => sendMessage({ message, content }),
};

client.login(process.env.DISCORD_TOKEN);
