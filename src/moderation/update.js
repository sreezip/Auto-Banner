import { SlashCommandBuilder } from "discord.js";
import * as caseManager from "../utils/caseManager.js";

export default {
  data: new SlashCommandBuilder()
    .setName("mod update")
    .setDescription("Update a case's reason or type")
    .addIntegerOption(opt =>
      opt.setName("id")
      .setDescription("Case ID to update")
      .setRequired(true))
    .addStringOption(opt =>
      opt.setName("reason")
      .setDescription("New reason")
      .setRequired(false))
    .addStringOption(opt =>
      opt.setName("type")
      .setDescription("New case type (e.g. WARN, BAN, MUTE)")
      .setRequired(false)),

  async execute(interaction) {
    if (!interaction.member.permissions.has("ManageGuild")) {
      return interaction.reply({ content: "You need `Manage Guild` permission.", ephemeral: true });
    }

    const id = interaction.options.getInteger("id", true);
    const newReason = interaction.options.getString("reason");
    const newType = interaction.options.getString("type")?.toUpperCase();

    const existing = caseManager.getCase(id);
    if (!existing) {
      return interaction.reply({ content: `Case #${id} not found.`, ephemeral: true });
    }

    const updated = caseManager.updateCase(id, {
      reason: newReason ?? existing.reason,
      type: newType ?? existing.type,
    });

    caseManager.createCase({
      userId: existing.userId,
      modId: interaction.user.id,
      type: "UPDATED",
      reason: `Updated case #${id}`,
      hidden: true,
    });

    return interaction.reply({
      content: `Case #${id} updated.\nNew Type: ${updated.type}\nNew Reason: ${updated.reason}`,
      ephemeral: false,
    });
  },
};
