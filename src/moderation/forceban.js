import { SlashCommandBuilder } from "discord.js";
import * as caseManager from "../utils/caseManager.js";

export default {
  data: new SlashCommandBuilder()
    .setName("mod forceban")
    .setDescription("Force-ban a user by ID (even if not in the server)")
    .addStringOption(opt => 
      opt.setName("userid")
      .setDescription("The ID of the user to force-ban")
      .setRequired(true))
    .addStringOption(opt =>
      opt.setName("reason")
      .setDescription("Reason for the force ban")
      .setRequired(false)),

  async execute(interaction) {
    if (!interaction.member.permissions.has("BanMembers")) {
      return interaction.reply({ content: "You need `Ban Members` permission.", ephemeral: true });
    }

    const userId = interaction.options.getString("userid", true);
    const reason = interaction.options.getString("reason") ?? "No reason provided";

    try {
      await interaction.guild.bans.create(userId, {
        reason: `${reason} — Moderation by ${interaction.user.tag}`
      });

      const c = caseManager.createCase({
        userId,
        modId: interaction.user.id,
        type: "FORCEBAN",
        reason,
        hidden: false,
      });

      return interaction.reply({ content: `⛔ Force-banned user ID: ${userId}. Case #${c.caseId}`, ephemeral: false });
    } catch (err) {
      return interaction.reply({ content: `Force-ban failed: ${err.message}`, ephemeral: true });
    }
  }
};
