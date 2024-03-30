import { Client, Interaction } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

import alert from "./alert";
import commands from "./commands";

const client = new Client({
  intents: [],
});

// 디스코드 봇 준비 활성화 후 처리
const handleReady = async () => {
  if (!client.application) return;
  await client.application.commands.set(commands);
};

// 사용자 입력 감지
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
  alert(client);
};

const start = async () => {
  try {
    await client.login(process.env.DISCORD_TOKEN).then(ready);
  } catch (e) {
    console.log("Daily bot login to failed");
  }
};

start();
