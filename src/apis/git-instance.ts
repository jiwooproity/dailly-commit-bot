import axios from "axios";

const gitInstance = axios.create({
  baseURL: "https://api.github.com",
});

const contributionInstance = axios.create({
  baseURL: "https://github-contributions-api.jogruber.de/v4",
});

export { gitInstance, contributionInstance };
