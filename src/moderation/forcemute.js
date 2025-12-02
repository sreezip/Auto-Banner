import { SlashCommandBuilder } from "discord.js";
import * as caseManager from "../utils/caseManager.js";

const MUTE_ROLE = process.env.MUTE_ROLE; // ⬅ Set your mute role

export default {
  data: new SlashCommandBuilder()
    .setName("mode forcemute")
    .setDescription("Force-mute a user by ID (even if not cached)")
    .addStringOption(opt =>
      opt.setName("userid")
      .setDescription("User ID to force-mute")
      .setRequired(true))
    .addStringOption(opt =>
      opt.setName("reason")
      .setDescription("Reason for the mute")
      .setRequired(false)),

  async execute(interaction) {
    if (!interaction.member.permissions.has("ModerateMembers")) {
      return interaction.reply({ content: "You need `Moderate Members` permission.", ephemeral: true });
    }

    const userId = interaction.options.getString("userid", true);
    const reason = interaction.options.getString("reason") ?? "No reason provided";

    try {
      const member = await interaction.guild.members.fetch(userId);

      await member.roles.add(MUTE_ROLE);

      const c = caseManager.createCase({
        userId,
        modId: interaction.user.id,
        type: "FORCEMUTE",
        reason,
        hidden: false,
      });

      return interaction.reply({ content: `🔇 Force-muted ${member.user.tag}. Case #${c.caseId}`, ephemeral: false });

    } catch (err) {
      return interaction.reply({ content: `Force-mute failed: ${err.message}`, ephemeral: true });
    }
  }
};