import { EmbedBuilder } from "discord.js";

import { Command, EmbedFieldInterace } from "../types";
import { convertDec } from "../utils";

const commands: EmbedFieldInterace[] = [
  { name: "help", value: "데일리 커밋 봇의 명령어를 가이드합니다." },
  { name: "developer", value: "데일리 커밋 봇 개발자를 소개합니다." },
  { name: "search", value: "검색한 사용자의 커밋 상태를 전달합니다." },
];

export const help: Command = {
  name: "help",
  description: "데일리 커밋 봇의 명령어를 가이드합니다.",
  execute: async (_, interaction) => {
    const embed = new EmbedBuilder();
    const color = convertDec("ffffff");
    embed.setColor(color);
    embed.setDescription("명령어는 아래와 같습니다.");

    embed.addFields(commands); // 맵핑된 Field 객체 생성
    await interaction.followUp({ embeds: [embed] });
  },
};
