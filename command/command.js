const { Client, GatewayIntentBits, Partials } = require("discord.js");
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

require("dotenv").config();
const { embeds } = require("../embed/embed");
const { Fetch } = require("../apis/fetch");

const onSendMsgToUsers = ({ to, content }) => {
  to.map((user) => user.send(content));
};

// -- 명령어 입력 동작 함수
const onSendAlert = async () => {
  const promiseList = [embeds.createEmbed({ data: ["jiwooproity"] }), client.users.fetch(process.env.DEVELOPER_ID, false)]; 
  const [ embed, userInfo ] = await Promise.all(promiseList.map((val) => val));
  userInfo.send({ embeds: [embed] });
};

const onSendGuildNoti = async ({ message, guildId, channelId, username, content }) => {
  if (guildId) {
    const notiMessage = `${username}님의 공지 메세지 : ${content}`;
    const userIds = await Fetch.getFetchGuildMemberIds({ guildId });
    const userInfo = await Fetch.getFetchUsers({ userList: userIds });

    onSendMsgToUsers({ to: userInfo, content: notiMessage });
  } else {
    onSendMessage({ channelId, content: '서버에서만 동작하는 명령어입니다.' });
  }
}

const onSendPinch = async ({ guildId, from, content }) => {
  // const userIds = await Fetch.getFetchGuildMemberIds({ guildId });
  // const userInfo = await Fetch.getFetchUsers({ userList: userIds });
  // onSendMsgToUsers({ from: from, to: userInfo, content: `${from}님의 재촉 메세지 : ${content}` });
}

const onSendHelp = ({ channelId }) => {
  const embed = embeds.helpEmbed();
  client.channels.cache.get(channelId).send({ embeds: [embed] });
};

const onSendResult = async ({ channelId, content }) => {
  if (content !== '!search') {
    const embed = await embeds.createEmbed({ data: content.split(" ") });
    client.channels.cache.get(channelId).send({ embeds: [embed] });
  } else {
    onSendMessage({ channelId, content: '검색할 사용자의 GitHub ID를 입력해주세요.' });
  }
};

const onSendMessage = ({ channelId, content }) => {
  client.channels.cache.get(channelId).send(content);
};

exports.commands = ['pinch', 'noti', 'help', 'search'];
exports.command = {
  alert: onSendAlert,
  pinch: onSendPinch,
  noti: onSendGuildNoti,
  help: onSendHelp,
  search: onSendResult,
  message: onSendMessage,
};

client.login(process.env.DISCORD_TOKEN);
