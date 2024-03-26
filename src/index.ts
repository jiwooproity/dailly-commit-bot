import { Client, EmbedBuilder, Interaction, User } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

import commands from "./commands";
import { createEmbed } from "./commands/search";
import dayjs from "dayjs";

const client = new Client({
  intents: [],
});

const handleReady = async () => {
  if (!client.application) return;
  await client.application.commands.set(commands);
};

const handleInteractionCreate = async (interaction: Interaction) => {
  if (!interaction.isCommand()) return;
  const commandName = interaction.commandName;
  const cmd = commands.find(({ name }: { name: string }) => name === commandName);

  if (cmd) {
    await interaction.deferReply();
    cmd.execute(client, interaction);
  }
};

const ready = () => {
  client.on("ready", handleReady);
  client.on("interactionCreate", handleInteractionCreate);
};

const start = async () => {
  try {
    await client.login(process.env.DISCORD_TOKEN).then(ready);
  } catch (e) {
    console.log("Daily bot login to failed");
  }
};

setInterval(() => {
  const today = dayjs(new Date()).format("HH:mm:ss");
  if (today === "09:00:00") {
    async () => {
      const clientId = process.env.DEVELOPER_ID as string;
      const requests = [createEmbed("jiwooproity"), client.users.fetch(clientId)];
      const responses = await Promise.all(requests.map((req) => req));
      const [embed, info] = responses as [EmbedBuilder, User];
      info.send({ embeds: [embed] });
    };
  }
}, 1000);

start();
