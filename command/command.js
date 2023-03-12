const { Client, Intents } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.MESSAGE_CONTENT] });

const { embeds } = require("../embed/embed");

const channelFetch = async (channelId) => {
  return await client.channels.fetch(channelId);
};

const sendAlert = async () => {
  const embed = await embeds.createEmbed({ data: ["jiwooproity"] });
  const channelTarget = await channelFetch(process.env.DEVELOPER_CHANNEL);
  await channelTarget.send({ embed: embed });
};

const helpCommand = async ({ message }) => {
  const embed = embeds.helpEmbed();
  const channelTarget = await channelFetch(message.channel.id);
  await channelTarget.send({ embed: embed });
};

const searchCommand = async ({ message, data }) => {
  const embed = await embeds.createEmbed({ data: data.split(",") });
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

exports.commands = ["help", "search"];
exports.command = {
  alert: () => sendAlert(),
  help: ({ message }) => helpCommand({ message }),
  search: ({ message, data }) => searchCommand({ message, data }),
  alertChannels: ({ message }) => alertChannels({ message }),
  message: ({ message, content }) => sendMessage({ message, content }),
};

client.login(process.env.DISCORD_TOKEN);
