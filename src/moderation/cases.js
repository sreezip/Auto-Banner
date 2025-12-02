import { SlashCommandBuilder } from "discord.js";
import * as caseManager from "../utils/caseManager.js";

export default {
  data: new SlashCommandBuilder()
    .setName("mod cases")
    .setDescription("List cases for a user")
    .addUserOption(opt => opt.setName("user").setDescription("User to list cases for").setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has("ManageGuild")) {
      return interaction.reply({ content: "You need `Manage Guild` permission to view cases.", ephemeral: true });
    }

    const user = interaction.options.getUser("user", true);
    const cases = caseManager.getCasesForUser(user.id);

    if (!cases.length) {
      return interaction.reply({ content: `No cases found for ${user.tag}.`, ephemeral: true });
    }

    // Build a compact list (show last 10)
    const list = cases
      .slice(-10)
      .map(c => `#${c.caseId} — ${c.type} — ${c.reason} — ${new Date(c.timestamp).toLocaleString()}`)
      .join("\n");

    return interaction.reply({ content: `Cases for ${user.tag}:\n\n${list}`, ephemeral: false });
  },
};
