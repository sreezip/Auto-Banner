import { SlashCommandBuilder } from "discord.js";
import * as caseManager from "../utils/caseManager.js";

export default {
  data: new SlashCommandBuilder()
    .setName("mod mute")
    .setDescription("Timeout/mute a user")
    .addUserOption(opt =>
      opt.setName("user")
      .setDescription("User to mute")
      .setRequired(true))
    .addIntegerOption(opt =>
      opt.setName("duration")
      .setDescription("Duration in minutes")
      .setRequired(true))
    .addStringOption(opt =>
      opt.setName("reason")
      .setDescription("Reason for mute")
      .setRequired(false)),

  async execute(interaction) {
    if (!interaction.member.permissions.has("ModerateMembers")) {
      return interaction.reply({ content: "You need `Moderate Members` permission.", ephemeral: true });
    }

    const user = interaction.options.getUser("user", true);
    const duration = interaction.options.getInteger("duration", true);
    const reason = interaction.options.getString("reason") ?? "No reason provided";

    try {
      const member = await interaction.guild.members.fetch(user.id);

      await member.timeout(duration * 60000, `${reason} — Moderation by ${interaction.user.tag}`);

      const c = caseManager.createCase({
        userId: user.id,
        modId: interaction.user.id,
        type: "MUTE",
        reason,
      });

      return interaction.reply({
        content: `🔇 Muted ${user.tag} for ${duration} minutes. Case #${c.caseId}`,
        ephemeral: false,
      });

    } catch (err) {
      return interaction.reply({ content: `Mute failed: ${err.message}`, ephemeral: true });
    }
  }
};