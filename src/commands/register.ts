import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { Command } from "../types";
import { addUser } from "../firebase";

export const register: Command = {
  name: "register",
  description: "데일리 알림을 받기 위한 가입 명령어입니다.",
  options: [
    {
      required: true,
      name: "author",
      description: "커밋 정보를 받을 깃 아이디를 입력해 주세요.",
      type: ApplicationCommandOptionType.String,
    },
  ],
  execute: async (_, interaction) => {
    const author = interaction.options.get("author")?.value as string;
    const embed = new EmbedBuilder();

    try {
      await addUser(interaction, author);
      embed.setTitle(`"${interaction.user.globalName}"님! 가입해 주셔서 감사합니다.`);
      embed.setDescription("매일 6시마다 DM으로 알림이 진행됩니다. 같이 힘내봅시다.");
      interaction.followUp({ embeds: [embed] });
    } catch (e) {
      embed.setTitle("이미 가입된 내역이 있거나, 요청에 실패하였습니다.");
      embed.setDescription("아이디 변경은 탈퇴 후 다시 등록해 주세요.");
      interaction.followUp({ embeds: [embed] });
    }
  },
};
