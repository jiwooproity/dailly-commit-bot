import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";

import { Command } from "../types";
import { deleteUser } from "../firebase";

export const unregister: Command = {
  name: "unregister",
  description: "데일리 알림을 받지 않기 위한 탈퇴 명령어입니다.",
  options: [
    {
      required: true,
      name: "flag",
      description: "정말 탈퇴하시겠습니까?",
      type: ApplicationCommandOptionType.Boolean,
    },
  ],
  execute: async (_, interaction) => {
    const embed = new EmbedBuilder();

    try {
      await deleteUser(interaction);
      embed.setTitle("탈퇴가 무사히 완료되었습니다.");
      embed.setDescription("그동안 고생 많으셨습니다. 항상 응원하겠습니다.");
      interaction.followUp({ embeds: [embed] });
    } catch (e) {
      embed.setTitle("이미 탈퇴하셨거나, 요청에 실패하였습니다.");
      embed.setDescription("일시적인 오류일 수도 있습니다. 다시 시도해 주세요.");
      interaction.followUp({ embeds: [embed] });
    }
  },
};
