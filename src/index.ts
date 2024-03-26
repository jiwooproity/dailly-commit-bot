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
  const finding = ({ name }: { name: string }) => name === commandName;
  const cmd = commands.find(finding);

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
    await client.login(process.env.DISCORD_TOKEN);
  } catch (e) {
    console.log("Daily bot login to failed");
  } finally {
    ready();
  }
};

start();

setInterval(() => {
  const today = dayjs(new Date()).format("HH:mm:ss");
  if (today === "04:09:00") {
    const alert = async () => {
      const clientId = process.env.DEVELOPER_ID as string;
      const requests = [createEmbed("jiwooproity"), client.users.fetch(clientId)];
      const responses = await Promise.all(requests.map((req) => req));
      const [embed, info] = responses as [EmbedBuilder, User];
      info.send({ embeds: [embed] });
    };

    alert();
  }
}, 1000);
