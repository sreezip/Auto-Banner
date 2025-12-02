import { SlashCommandBuilder } from "discord.js";
import * as caseManager from "../utils/caseManager.js";

export default {
  data: new SlashCommandBuilder()
    .setName("mod addcase")
    .setDescription("Add a manual case to the case log")
    .addUserOption(opt => opt.setName("user").setDescription("User to add a case for").setRequired(true))
    .addStringOption(opt => opt.setName("type").setDescription("Case type (e.g. NOTE, WARN, BAN)").setRequired(true))
    .addStringOption(opt => opt.setName("reason").setDescription("Reason for the case").setRequired(true))
    .addBooleanOption(opt => opt.setName("hidden").setDescription("Hide this case from public listing").setRequired(false)),
  async execute(interaction) {
    if (!interaction.member.permissions.has("ManageGuild")) {
      return interaction.reply({ content: "You need `Manage Guild` permission to add cases.", ephemeral: true });
    }

    const user = interaction.options.getUser("user", true);
    const type = interaction.options.getString("type", true).toUpperCase();
    const reason = interaction.options.getString("reason", true);
    const hidden = interaction.options.getBoolean("hidden") ?? false;

    const c = caseManager.createCase({
      userId: user.id,
      modId: interaction.user.id,
      type,
      reason,
      hidden,
    });

    return interaction.reply({ content: `Case #${c.caseId} created for ${user.tag} (${type}).`, ephemeral: false });
  },
};