const axios = require("axios");
const discord = require("discord.js");
const moment = require("moment");

require("dotenv").config();

const client = new discord.Client();

client.login(process.env.DISCORD_TOKEN);

const sendMessage = async ({ message }) => {
  const targetChannel = await client.channels.fetch("907905716893917184");
  await targetChannel.send(message);
};

const checkDailyCommit = async () => {
  const findTodayCommit = (value) => {
    return moment(new Date()).format("YYYY-MM-DD") === moment(value.date).format("YYYY-MM-DD");
  };

  const response = await axios.get("https://github-contributions-api.jogruber.de/v4/jiwooproity?y=last");
  const { date, count, level } = response.data.contributions.find(findTodayCommit);

  if (count > 0) sendMessage({ message: `jiwooproity님은 1일 1커밋을 완료하였습니다. date: ${date}, level: ${level}` });
  else sendMessage({ message: "아직 커밋을 완료하지 않았습니다. 1일 1커밋을 서둘러 주세요." });
};

client.once("ready", async () => {
  sendMessage({ message: "봇이 활성화되었습니다." });
});

setInterval(() => {
  const todayMoment = moment(new Date()).format("HH:mm:ss");
  if (todayMoment === "18:00:00") checkDailyCommit();
}, 1000);
