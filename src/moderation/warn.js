import { SlashCommandBuilder } from "discord.js";
import * as caseManager from "../utils/caseManager.js";

export default {
  data: new SlashCommandBuilder()
    .setName("mod warn")
    .setDescription("Warn a user and log a case")
    .addUserOption(opt =>
      opt.setName("user")
      .setDescription("User to warn")
      .setRequired(true))
    .addStringOption(opt =>
      opt.setName("reason")
      .setDescription("Reason for the warning")
      .setRequired(true))
    .addBooleanOption(opt =>
      opt.setName("dm")
      .setDescription("DM the warning to the user?")
      .setRequired(false)),

  async execute(interaction) {
    if (!interaction.member.permissions.has("ManageMessages")) {
      return interaction.reply({ content: "You need `Manage Messages` permission.", ephemeral: true });
    }

    const user = interaction.options.getUser("user", true);
    const reason = interaction.options.getString("reason", true);
    const dm = interaction.options.getBoolean("dm") ?? false;

    const c = caseManager.createCase({
      userId: user.id,
      modId: interaction.user.id,
      type: "WARN",
      reason,
      hidden: false,
    });

    if (dm) {
      user.send(`You have been warned in **${interaction.guild.name}**:\nReason: ${reason}`).catch(() => {});
    }

    return interaction.reply({
      content: `⚠️ Warned ${user.tag}. Case #${c.caseId}`,
      ephemeral: false,
    });
  },
};