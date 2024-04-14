import { Client, EmbedBuilder, User } from "discord.js";
import schedule from "node-schedule";

import { createEmbed } from "../commands/search";
import { getUserCollection } from "../firebase";
import { DocumentData } from "firebase/firestore/lite";

const createUsers = async (users: DocumentData, client: Client) => {
  const requests = [createEmbed(users.name), client.users.fetch(users.clientId)];
  return (await Promise.all(requests.map((req) => req))) as [EmbedBuilder, User];
};

const alertJob = async (client: Client) => {
  const users = await getUserCollection();
  const usersChannels = await Promise.all(users.map((user) => createUsers(user, client)));

  // send alert to users
  usersChannels.map((channel) => {
    const [embed, info] = channel;
    info.send({ embeds: [embed] });
  });
};

const alert = (client: Client) => {
  let rule = new schedule.RecurrenceRule();
  rule.hour = 18;
  rule.minute = 0;
  rule.tz = "Asia/Seoul";
  schedule.scheduleJob(rule, () => alertJob(client));
};

export default alert;
