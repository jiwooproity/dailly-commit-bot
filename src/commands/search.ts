import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";

import axios from "axios";
import dayjs from "dayjs";

import { Command, ContributionsResIF, GitHubProfileIF, ContributionsIF } from "../types";
import { convertDec } from "../utils";

const COMMIT_LEVEL = ["ffffff", "9de8ac", "45c36a", "246d3d"];

const getCommits = async (author: string) => {
  const today = dayjs(new Date());
  const year = today.year();
  const day = today.format("YYYY-MM-DD");
  const url = `https://github-contributions-api.jogruber.de/v4/${author}?y=${year}`;
  const { data } = (await axios.get(url)) as { data: ContributionsResIF };
  const todayInfo = data.contributions.find((d) => d.date === day);
  return todayInfo;
};

const getProfile = async (author: string) => {
  const url = `https://api.github.com/users/${author}`;
  const { data } = (await axios.get(url)) as { data: GitHubProfileIF };
  return data;
};

export const createEmbed = async (author: string) => {
  const requests = [getCommits, getProfile];
  const responses = (await Promise.all(requests.map((req) => req(author)))) as [ContributionsIF, GitHubProfileIF];
  const complete = responses[0]?.count !== 0;

  const embed = new EmbedBuilder();
  const color = convertDec(COMMIT_LEVEL[responses[0]?.level || 0]);
  embed.setColor(color);
  embed.setTitle(`${complete ? "오늘 하루도 고생 많으셨습니다." : "가끔은 휴식을 취하는 것도 괜찮아요."}`);
  embed.setDescription("금일 확인된 커밋 내역은 아래와 같습니다.");
  embed.setFields(
    { name: "\u2008", value: "\u2008" },
    { name: `${author}`, value: complete ? "Complete" : "Empty", inline: true },
    { name: "반영 개수", value: `${responses[0]?.count || 0}`, inline: true },
    { name: "반영 레벨", value: `${responses[0]?.level || 0}`, inline: true },
    { name: "\u2008", value: "\u2008" }
  );
  embed.setFooter({
    text: responses[1]?.name || "Not Found",
    iconURL: responses[1]?.avatar_url || "Not Found",
  });
  embed.setTimestamp();
  return embed;
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
    interaction.followUp({ embeds: [embed] });
  },
};
