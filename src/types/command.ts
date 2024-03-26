import {
  CommandInteraction,
  ChatInputApplicationCommandData,
  Client,
} from "discord.js";

export type Command = ChatInputApplicationCommandData & {
  execute: (client: Client, interaction: CommandInteraction) => void;
};
