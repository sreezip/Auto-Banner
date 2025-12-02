import { SlashCommandBuilder } from "discord.js";
import * as caseManager from "../utils/caseManager.js";

export default {
  data: new SlashCommandBuilder()
    .setName("mod ban")
    .setDescription("Ban a member and create a case")
    .addUserOption(opt => opt.setName("user").setDescription("User to ban").setRequired(true))
    .addStringOption(opt => opt.setName("reason").setDescription("Reason for the ban").setRequired(false))
    .addBooleanOption(opt => opt.setName("delete_messages").setDescription("Days of messages to delete (true = 7 days)").setRequired(false)),
  async execute(interaction) {
    if (!interaction.member.permissions.has("BanMembers")) {
      return interaction.reply({ content: "You need `Ban Members` permission to use this command.", ephemeral: true });
    }

    const user = interaction.options.getUser("user", true);
    const reason = interaction.options.getString("reason") ?? "No reason provided";
    const deleteMessages = interaction.options.getBoolean("delete_messages") ?? false;
    const guild = interaction.guild;

    try {
      const banOptions = { reason: `${reason} — Moderation by ${interaction.user.tag}` };
      if (deleteMessages) banOptions.days = 7;

      await guild.bans.create(user.id, banOptions);

      const c = caseManager.createCase({
        userId: user.id,
        modId: interaction.user.id,
        type: "BAN",
        reason,
        hidden: false,
      });

      return interaction.reply({ content: `🔨 Banned ${user.tag}. Case #${c.caseId}`, ephemeral: false });
    } catch (err) {
      console.error("Ban failed:", err);
      return interaction.reply({ content: `Failed to ban ${user.tag}: ${err.message}`, ephemeral: true });
    }
  },
};
