import axios from "axios";

export const gitInstance = axios.create({
  baseURL: "https://api.github.com",
});

export const contributionInstance = axios.create({
  baseURL: "https://github-contributions-api.jogruber.de/v4",
});
