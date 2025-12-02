import { SlashCommandBuilder } from "discord.js";
import * as caseManager from "../utils/caseManager.js";

export default {
  data: new SlashCommandBuilder()
    .setName("mod kick")
    .setDescription("Kick a user and create a moderation case")
    .addUserOption(opt =>
      opt.setName("user")
      .setDescription("User to kick")
      .setRequired(true))
    .addStringOption(opt =>
      opt.setName("reason")
      .setDescription("Reason for the kick")
      .setRequired(false)),

  async execute(interaction) {
    if (!interaction.member.permissions.has("KickMembers")) {
      return interaction.reply({ content: "You need `Kick Members` permission.", ephemeral: true });
    }

    const user = interaction.options.getUser("user", true);
    const reason = interaction.options.getString("reason") ?? "No reason provided";

    try {
      const member = await interaction.guild.members.fetch(user.id);

      await member.kick(`${reason} — Moderation by ${interaction.user.tag}`);

      const c = caseManager.createCase({
        userId: user.id,
        modId: interaction.user.id,
        type: "KICK",
        reason,
        hidden: false,
      });

      return interaction.reply({ content: `👢 Kicked ${user.tag}. Case #${c.caseId}`, ephemeral: false });

    } catch (err) {
      return interaction.reply({ content: `Kick failed: ${err.message}`, ephemeral: true });
    }
  }
};
