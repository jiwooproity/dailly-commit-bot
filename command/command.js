const { Client, GatewayIntentBits, Partials } = require("discord.js");
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

require("dotenv").config();
const { embeds } = require("../embed/embed");

const onSendAlert = async () => {
  const promiseList = [embeds.createEmbed({ data: ["jiwooproity"] }), client.users.fetch(process.env.DEVELOPER_ID, false)]; 
  const [ embed, userInfo ] = await Promise.all(promiseList.map((val) => val));
  userInfo.send({ embeds: [embed] });
};

const onSendHelp = ({ channelId }) => {
  const embed = embeds.helpEmbed();
  client.channels.cache.get(channelId).send({ embeds: [embed] });
};

const onSendResult = async ({ channelId, content }) => {
  const embed = await embeds.createEmbed({ data: content.split(",") });
  client.channels.cache.get(channelId).send({ embeds: [embed] });
};

const onSendMessage = ({ channelId, content }) => {
  client.channels.cache.get(channelId).send(content);
};

exports.commands = ["help", "search"];
exports.command = {
  alert: onSendAlert,
  help: onSendHelp,
  search: onSendResult,
  message: onSendMessage,
};

client.login(process.env.DISCORD_TOKEN);
