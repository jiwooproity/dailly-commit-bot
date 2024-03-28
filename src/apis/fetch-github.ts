import { gitInstance, contributionInstance } from "./git-instance";

import { getDate } from "../utils";
import { ContributionsIF, GitHubProfileIF } from "../types";

export const getGitHubInfo = async (author: string): Promise<GitHubProfileIF> => {
  const githubInfo = await gitInstance.get(`/users/${author}`);

  if (githubInfo.data.message === "Not Found") {
    throw new Error("검색한 사용자의 정보를 알 수 없습니다.");
  } else {
    return githubInfo.data;
  }
};

export const getGitHubCommit = async (author: string): Promise<ContributionsIF> => {
  const [, year, day] = getDate();
  const url = `https://github-contributions-api.jogruber.de/v4/${author}?y=${year}`;
  const commitInfo = await contributionInstance.get(url);

  if (commitInfo.data.error) {
    throw new Error("검색한 사용자의 정보를 알 수 없습니다.");
  } else {
    const todayInfo = commitInfo.data.contributions.find((d: ContributionsIF) => d.date === day);
    return todayInfo;
  }
};
