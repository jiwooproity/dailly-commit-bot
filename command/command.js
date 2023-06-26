const { Client, GatewayIntentBits, Partials } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

require("dotenv").config();
const { embeds } = require("../embed/embed");
const { Convert } = require("../utils/Convert");
const { Fetch } = require("../apis/Fetch");

const onSendMsgToUsers = ({ to, content }) => {
  to.map((user) => user.send(content));
};

const onSendEmbed = ({ channelId, embed }) => {
  client.channels.cache.get(channelId).send({ embeds: [embed] });
};

const onSendContent = ({ channelId, content }) => {
  client.channels.cache.get(channelId).send(content);
};

// -- 명령어 입력 동작 함수
const onSendAlert = async () => {
  const promiseList = [
    embeds.createEmbed({ data: ["jiwooproity"] }),
    client.users.fetch(process.env.DEVELOPER_ID, false),
  ];
  const [embed, userInfo] = await Promise.all(promiseList.map((val) => val));
  userInfo.send({ embeds: [embed] });
};

const onSendGuildNoti = async ({
  message,
  channel,
  guildId,
  channelId,
  username,
  content,
}) => {
  let cannotNoti = false;
  let sendMessage = `${username}님의 공지 메세지 : ${content}`;

  if (!guildId) {
    cannotNoti = true;
    sendMessage = "서버에서만 동작하는 명령어입니다.";
  }

  if (channel.guild && channel.guild.ownerId !== message.author.id) {
    cannotNoti = true;
    sendMessage = "서버 어드민만 사용이 가능한 명령어입니다.";
  }

  if (cannotNoti) {
    onSendContent({ channelId, content: sendMessage });
  } else {
    const userIds = await Fetch.getFetchGuildMemberIds({ guildId });
    const userInfo = await Fetch.getFetchUsers({ userList: userIds });
    onSendMsgToUsers({ to: userInfo, content: sendMessage });
  }
};

const onSendPinch = async ({ username, content }) => {
  const [userId] = content.split(" ");
  const pinchMessage = Convert.getPinchContent({ userId, content });
  const userInfo = await Fetch.getFetchUser({ userId });
  userInfo.send(`${username}님의 재촉 메세지 : ${pinchMessage}`);
};

const onSendHelp = ({ channelId }) => {
  const embed = embeds.helpEmbed();
  onSendEmbed({ channelId, embed });
};

const onSendResult = async ({ channelId, content }) => {
  if (content !== "!search") {
    const embed = await embeds.createEmbed({ data: content.split(" ") });
    onSendEmbed({ channelId, embed });
  } else {
    onSendContent({
      channelId,
      content: "검색할 사용자의 GitHub ID를 입력해주세요.",
    });
  }
};

const onSendMessage = ({ channelId, content }) =>
  onSendContent({ channelId, content });

exports.commands = ["pinch", "noti", "help", "search"];
exports.command = {
  alert: onSendAlert,
  pinch: onSendPinch,
  noti: onSendGuildNoti,
  help: onSendHelp,
  search: onSendResult,
  message: onSendMessage,
};

client.login(process.env.DISCORD_TOKEN);
