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

const Fetch = {
  async getFetchGuildMemberIds({ guildId }) {
    const guilds = await client.guilds.fetch(guildId);
    const members = await guilds.members.fetch();
    const users = members.filter((m) => m.user.discriminator !== "2140");
    return users.map((user) => user.id);
  },
  async getFetchUsers({ userList }) {
    return await Promise.all(userList.map((id) => client.users.fetch(id)));
  },
  async getFetchUser({ userId }) {
    return await client.users.fetch(userId);
  },
};

client.login(process.env.DISCORD_TOKEN);

exports.Fetch = Fetch;
