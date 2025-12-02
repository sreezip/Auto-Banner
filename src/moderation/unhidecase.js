import { SlashCommandBuilder } from "discord.js";
import * as caseManager from "../utils/caseManager.js";

export default {
  data: new SlashCommandBuilder()
    .setName("mod unhidecase")
    .setDescription("Unhide a hidden moderation case")
    .addIntegerOption(opt =>
      opt.setName("id")
      .setDescription("Case ID to unhide")
      .setRequired(true)),

  async execute(interaction) {
    if (!interaction.member.permissions.has("ManageGuild")) {
      return interaction.reply({ content: "You need `Manage Guild` permission.", ephemeral: true });
    }

    const id = interaction.options.getInteger("id", true);
    const existing = caseManager.getCase(id);

    if (!existing) {
      return interaction.reply({ content: `Case #${id} not found.`, ephemeral: true });
    }

    caseManager.unhideCase(id);

    caseManager.createCase({
      userId: existing.userId,
      modId: interaction.user.id,
      type: "UNHIDDEN",
      reason: `Case #${id} was unhidden`,
      hidden: true,
    });

    return interaction.reply({ content: `Case #${id} is now unhidden.`, ephemeral: false });
  },
};
