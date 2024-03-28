import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";

import { convertDec } from "../utils";
import { Command, ContributionsIF, GitHubProfileIF } from "../types";
import { getGitHubCommit, getGitHubInfo } from "../apis/fetch-github";

const COMMIT_LEVEL = ["ffffff", "9de8ac", "45c36a", "246d3d"];

export const createEmbed = async (author: string) => {
  const requests = [getGitHubCommit, getGitHubInfo];

  try {
    const responses = await Promise.all(requests.map((req) => req(author)));
    const githubCommitInfo = responses[0] as ContributionsIF;
    const githubInfo = responses[1] as GitHubProfileIF;

    const isComplete = githubCommitInfo.count !== 0;

    const embed = new EmbedBuilder();
    const color = convertDec(COMMIT_LEVEL[githubCommitInfo.level]);
    embed.setColor(color);
    embed.setTitle(`${isComplete ? "오늘 하루도 고생 많으셨습니다." : "가끔은 휴식을 취하는 것도 괜찮아요."}`);
    embed.setDescription("금일 확인된 커밋 내역은 아래와 같습니다.");
    embed.setFields(
      { name: "\u2008", value: "\u2008" },
      { name: `${author}`, value: isComplete ? "Complete" : "Incomplete", inline: true },
      { name: "반영 개수", value: `${githubCommitInfo.count}`, inline: true },
      { name: "반영 레벨", value: `${githubCommitInfo.level}`, inline: true },
      { name: "\u2008", value: "\u2008" }
    );
    embed.setFooter({ text: githubInfo.name, iconURL: githubInfo.avatar_url });
    embed.setTimestamp();
    return embed;
  } catch (e) {
    return "존재하지 않는 사용자입니다. GitHub ID를 다시 확인해 주세요.";
  }
};

export const search: Command = {
  name: "search",
  description: "검색한 사용자의 커밋 상태를 전달합니다.",
  options: [
    {
      required: true,
      name: "author",
      description: "검색하고자 하는 유저 아이디를 입력해 주세요.",
      type: ApplicationCommandOptionType.String,
    },
  ],
  execute: async (_, interaction) => {
    const target = interaction.options.get("author")?.value as string;
    const embed = await createEmbed(target);

    if (typeof embed === "string") {
      interaction.followUp({ content: embed });
    } else {
      interaction.followUp({ embeds: [embed] });
    }
  },
};
