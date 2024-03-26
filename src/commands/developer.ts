import { EmbedBuilder } from "discord.js";

import { Command, EmbedFieldInterace } from "../types";
import { convertDec } from "../utils";

const introduce: EmbedFieldInterace[] = [
  { name: "GitHub", value: "https://github.com/jiwooproity" },
  { name: "Homepage", value: "https://www.jiwoo.so/" },
];

export const developer: Command = {
  name: "developer",
  description: "데일리 커밋 봇 개발자를 소개합니다.",
  execute: async (_, interaction) => {
    const embed = new EmbedBuilder();
    const color = convertDec("cdb49b");
    embed.setColor(color);
    embed.setDescription("안녕하세요, 프론트엔드 개발자 소지우입니다.");
    embed.setTitle("Front-End Developer Jiwoo.So");
    embed.addFields(introduce);
    embed.setImage("https://res.cloudinary.com/jiwooproity/image/upload/v1711471875/my_profile/profile_pw7cm7.png");
    await interaction.followUp({ embeds: [embed] });
  },
};
