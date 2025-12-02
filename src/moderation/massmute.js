import { SlashCommandBuilder } from "discord.js";
import * as caseManager from "../utils/caseManager.js";

const MUTE_ROLE = process.env.MUTE_ROLE; // ← Set mute role

export default {
  data: new SlashCommandBuilder()
    .setName("mod massmute")
    .setDescription("Mute multiple users by ID")
    .addStringOption(opt =>
      opt.setName("ids")
      .setDescription("User IDs separated by space/comma")
      .setRequired(true))
    .addStringOption(opt =>
      opt.setName("reason")
      .setDescription("Reason for mute")
      .setRequired(false)),

  async execute(interaction) {
    if (!interaction.member.permissions.has("ModerateMembers")) {
      return interaction.reply({ content: "You need `Moderate Members` permission.", ephemeral: true });
    }

    const idString = interaction.options.getString("ids", true);
    const reason = interaction.options.getString("reason") ?? "No reason provided";
    const ids = idString.replace(/,/g, " ").split(" ").filter(x => x);

    let success = 0;
    let fail = 0;

    for (const id of ids) {
      try {
        const member = await interaction.guild.members.fetch(id);
        await member.roles.add(MUTE_ROLE);

        caseManager.createCase({
          userId: id,
          modId: interaction.user.id,
          type: "MUTE",
          reason,
        });

        success++;
      } catch {
        fail++;
      }
    }

    return interaction.reply({
      content: `Massmute completed.\n✔ Success: ${success}\n❌ Failed: ${fail}`,
      ephemeral: false,
    });
  },
};
