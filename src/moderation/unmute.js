import { SlashCommandBuilder } from "discord.js";
import * as caseManager from "../utils/caseManager.js";

export default {
  data: new SlashCommandBuilder()
    .setName("mod unmute")
    .setDescription("Remove a user's timeout/mute")
    .addUserOption(opt =>
      opt.setName("user")
      .setDescription("User to unmute")
      .setRequired(true))
    .addStringOption(opt =>
      opt.setName("reason")
      .setDescription("Reason for unmute")
      .setRequired(false)),

  async execute(interaction) {
    if (!interaction.member.permissions.has("ModerateMembers")) {
      return interaction.reply({ content: "You need `Moderate Members` permission.", ephemeral: true });
    }

    const user = interaction.options.getUser("user", true);
    const reason = interaction.options.getString("reason") ?? "No reason provided";

    try {
      const member = await interaction.guild.members.fetch(user.id);

      await member.timeout(null, `${reason} — Moderation by ${interaction.user.tag}`);

      const c = caseManager.createCase({
        userId: user.id,
        modId: interaction.user.id,
        type: "UNMUTE",
        reason,
        hidden: false,
      });

      return interaction.reply({ content: `🔊 Unmuted ${user.tag}. Case #${c.caseId}`, ephemeral: false });
    } catch (err) {
      return interaction.reply({ content: `Unmute failed: ${err.message}`, ephemeral: true });
    }
  },
};
