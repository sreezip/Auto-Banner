import { SlashCommandBuilder } from "discord.js";
import * as caseManager from "../utils/caseManager.js";

export default {
  data: new SlashCommandBuilder()
    .setName("mod deletecase")
    .setDescription("Delete a case from the case log")
    .addIntegerOption(opt => opt.setName("id").setDescription("Case ID to delete").setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has("ManageGuild")) {
      return interaction.reply({ content: "You need `Manage Guild` permission to delete cases.", ephemeral: true });
    }

    const id = interaction.options.getInteger("id", true);
    const existing = caseManager.getCase(id);
    if (!existing) {
      return interaction.reply({ content: `Case #${id} not found.`, ephemeral: true });
    }

    caseManager.deleteCase(id);
    caseManager.createCase({
      userId: existing.userId,
      modId: interaction.user.id,
      type: "DELETED",
      reason: `Deleted case #${id}`,
      hidden: true,
    });

    return interaction.reply({ content: `Case #${id} deleted.`, ephemeral: false });
  },
};
