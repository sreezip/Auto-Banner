import { SlashCommandBuilder } from "discord.js";
import * as caseManager from "../utils/caseManager.js";

export default {
  data: new SlashCommandBuilder()
    .setName("mod note")
    .setDescription("Add a private note to a user's moderation record")
    .addUserOption(opt =>
      opt.setName("user")
      .setDescription("User to note")
      .setRequired(true))
    .addStringOption(opt =>
      opt.setName("note")
      .setDescription("The note text")
      .setRequired(true)),

  async execute(interaction) {
    if (!interaction.member.permissions.has("ManageGuild")) {
      return interaction.reply({ content: "You need `Manage Guild` permission.", ephemeral: true });
    }

    const user = interaction.options.getUser("user", true);
    const note = interaction.options.getString("note", true);

    const c = caseManager.createCase({
      userId: user.id,
      modId: interaction.user.id,
      type: "NOTE",
      reason: note,
      hidden: true, // Notes are usually private
    });

    return interaction.reply({
      content: `📝 Added note for ${user.tag}. Case #${c.caseId}`,
      ephemeral: false,
    });
  }
};
