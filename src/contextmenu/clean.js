import {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  PermissionFlagsBits,
} from "discord.js";
import * as caseManager from "../utils/caseManager.js";

export default {
  data: new ContextMenuCommandBuilder()
    .setName("Clean")
    .setType(ApplicationCommandType.Message),

  async execute(interaction) {
    // Check permission
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({
        content: "You need **Manage Messages** to use Clean.",
        ephemeral: true,
      });
    }

    // Fetch the message that was right-clicked
    const message = await interaction.channel.messages
      .fetch(interaction.targetId)
      .catch(() => null);

    if (!message) {
      return interaction.reply({
        content: "Message not found or already deleted.",
        ephemeral: true,
      });
    }

    const targetUser = message.author;

    try {
      await message.delete();

      // Create moderation case
      const c = caseManager.createCase({
        userId: targetUser.id,
        modId: interaction.user.id,
        type: "CLEAN",
        reason: `Message cleaned by ${interaction.user.tag}`,
        hidden: false,
      });

      return interaction.reply({
        content: `🧹 Deleted message from **${targetUser.tag}**. Case #${c.caseId}`,
        ephemeral: true,
      });

    } catch (err) {
      return interaction.reply({
        content: `Failed to clean message: ${err.message}`,
        ephemeral: true,
      });
    }
  },
};