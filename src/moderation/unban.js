import { SlashCommandBuilder } from "discord.js";
import * as caseManager from "../utils/caseManager.js";

export default {
  data: new SlashCommandBuilder()
    .setName("mod unban")
    .setDescription("Unban a user by ID")
    .addStringOption(opt =>
      opt.setName("userid")
      .setDescription("ID of the user to unban")
      .setRequired(true))
    .addStringOption(opt =>
      opt.setName("reason")
      .setDescription("Reason for unban")
      .setRequired(false)),

  async execute(interaction) {
    if (!interaction.member.permissions.has("BanMembers")) {
      return interaction.reply({ content: "You need `Ban Members` permission.", ephemeral: true });
    }

    const userId = interaction.options.getString("userid", true);
    const reason = interaction.options.getString("reason") ?? "No reason provided";

    try {
      await interaction.guild.bans.remove(userId, `${reason} — Moderation by ${interaction.user.tag}`);

      const c = caseManager.createCase({
        userId,
        modId: interaction.user.id,
        type: "UNBAN",
        reason,
        hidden: false,
      });

      return interaction.reply({ content: `🔓 Unbanned **${userId}**. Case #${c.caseId}`, ephemeral: false });
    } catch (err) {
      return interaction.reply({ content: `Unban failed: ${err.message}`, ephemeral: true });
    }
  },
};
