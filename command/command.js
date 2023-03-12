const { Client, GatewayIntentBits, Partials } = require("discord.js");
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

const { embeds } = require("../embed/embed");

const channelFetch = (channelId) => {
  return client.channels.cache.get(channelId);
};

const sendAlert = async () => {
  const embed = await embeds.createEmbed({ data: ["jiwooproity"] });
  client.channels.cache.get(process.env.DEVELOPER_CHANNEL).send({ embeds: [embed] });
};

const helpCommand = async ({ message }) => {
  const embed = embeds.helpEmbed();
  client.channels.cache.get(message.channelId).send({ embeds: [embed] });
};

const searchCommand = async ({ message, data }) => {
  const embed = await embeds.createEmbed({ data: data.split(",") });
  client.channels.cache.get(message.channelId).send({ embeds: [embed] });
};

const alertChannels = async ({ message }) => {
  // const channels = client.channels.cache.filter((c) => c.type === "text");
  client.channels.cache.get(process.env.DEVELOPER_CHANNEL).send(message);
};

const sendMessage = async ({ message, content }) => {
  client.channels.cache.get(message.channelId).send(content);
};

exports.commands = ["help", "search"];
exports.command = {
  alert: () => sendAlert(),
  help: ({ message }) => helpCommand({ message }),
  search: ({ message, data }) => searchCommand({ message, data }),
  alertChannels: ({ message }) => alertChannels({ message }),
  message: ({ message, content }) => sendMessage({ message, content }),
};

client.login(process.env.DISCORD_TOKEN);
