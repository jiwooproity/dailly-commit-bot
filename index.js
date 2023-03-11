const axios = require("axios");
const { Client, Intents, MessageEmbed } = require("discord.js");
const moment = require("moment");
require("dotenv").config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.MESSAGE_CONTENT] });

client.login(process.env.DISCORD_TOKEN);

const getUserHistory = async ({ user }) => {
  return await axios.get(`https://github-contributions-api.jogruber.de/v4/${user}?y=2023`);
};

const sendEmbed = async ({ message }) => {
  const targetChannel = await client.channels.fetch(process.env.DEVELOPER_CHANNEL);
  await targetChannel.send({ embed: message });
};

const sendMessage = async ({ message }) => {
  const targetChannel = await client.channels.fetch(process.env.DEVELOPER_CHANNEL);
  await targetChannel.send(message);
};

const getEmbed = async ({ search }) => {
  const findTodayCommit = (value) => {
    return moment(new Date()).format("YYYY-MM-DD") === moment(value.date).format("YYYY-MM-DD");
  };

  const setMessageObj = (value, index) => {
    const checkCount = (count) => {
      return count > 0 ? "완료" : "미완료";
    };

    return [
      {
        name: `${search[index]}`,
        value: checkCount(value.count),
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

  // user 정보 및 커밋 조회
  const requests = await Promise.all(search.map((user) => getUserHistory({ user })));

  // contribution 정보 입력
  const getResult = requests.map((r) => r.data.contributions.find(findTodayCommit));
  const getField = getResult.map(setMessageObj);

  // embed 생성
  const embed = new MessageEmbed();
  const color = getResult.every((r) => r.count > 0) ? "0xf22c22" : "0xf05454";

  // Embed 메세지 폼 작성 시작
  embed.setTitle("매일 잔디 심기 챌린지");
  embed.setColor(color);
  embed.setDescription("매일 6시 정각에 커밋 상태를 확인하고 알림을 전송합니다.");
  embed.addFields({ name: "\u200B", value: "\u200B" });
  getField.forEach((f) => embed.addFields(...f));
  embed.setTimestamp();
  embed.addFields({ name: "\u200B", value: "\u200B" });
  embed.setFooter("jiwooproity", "https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1567128822/noticon/osiivsvhnu4nt8doquo0.png");
  return embed;
};

const searchDailyCommit = async ({ target, user }) => {
  const embed = await getEmbed({ search: [user] });
  const targetChannel = await client.channels.fetch(target.channel.id);
  await targetChannel.send({ embed: embed });
};

const checkDailyCommit = async ({ target, auto }) => {
  const userDatabase = ["jiwooproity"];
  const embed = await getEmbed({ search: userDatabase });

  if (auto) {
    sendEmbed({ message: embed });
  } else {
    const targetChannel = await client.channels.fetch(target.channel.id);
    await targetChannel.send({ embed: embed });
  }
};

client.on("message", async (message) => {
  const commandList = ["!search"];

  switch (message.channel.type) {
    case "dm":
      if (message.content === "test") checkDailyCommit({ target: message, auto: false });
      break;
    case "text":
      const lastMessage = await message.channel.messages.fetch(message.author.lastMessageID);
      const command = lastMessage.content.split(" ");

      if (command[0].startsWith("!")) {
        if (command[0] === "!" + "search") {
          searchDailyCommit({ target: message, user: command[1] });
        }

        if (!commandList.includes(command[0])) {
          sendMessage({ message: "알 수 없는 명령어입니다." });
        }
      }
      break;
    default:
      break;
  }
});

client.once("ready", () => {
  sendMessage({ message: "봇이 활성화 되었습니다." });
});

setInterval(() => {
  const todayMoment = moment(new Date()).format("HH:mm:ss");
  if (todayMoment === "18:00:00") checkDailyCommit({ target: null, auto: true });
}, 1000);
