import { ApplicationCommandOptionType } from "discord.js";

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
    try {
      await deleteUser(interaction);
      const msg = "탈퇴가 무사히 완료되었습니다. 또 이용해 주세요!";
      interaction.followUp({ content: msg });
    } catch (e) {
      const msg = "이미 탈퇴하셨거나, 요청에 실패하였습니다. 다시 시도해 주세요!";
      interaction.followUp({ content: msg });
    }
  },
};
