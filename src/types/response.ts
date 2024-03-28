interface TotalIF {
  [key: string]: number;
}

export interface ContributionsIF {
  date: string;
  count: 0;
  level: 0;
}

export interface ContributionsResIF {
  total: TotalIF;
  contributions: ContributionsIF[];
  error?: string | undefined
}

export interface GitHubProfileIF {
  avatar_url: string;
  name: string;
  message: string;
}
