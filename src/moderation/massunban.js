import { SlashCommandBuilder } from "discord.js";
import * as caseManager from "../utils/caseManager.js";

export default {
  data: new SlashCommandBuilder()
    .setName("mod massunban")
    .setDescription("Unban multiple users by ID list")
    .addStringOption(opt =>
      opt.setName("ids")
      .setDescription("User IDs separated by spaces or commas")
      .setRequired(true))
    .addStringOption(opt =>
      opt.setName("reason")
      .setDescription("Reason for unban")
      .setRequired(false)),

  async execute(interaction) {
    if (!interaction.member.permissions.has("BanMembers")) {
      return interaction.reply({ content: "You need `Ban Members` permission.", ephemeral: true });
    }

    const idString = interaction.options.getString("ids", true);
    const reason = interaction.options.getString("reason") ?? "No reason provided";

    const ids = idString.replace(/,/g, " ").split(" ").filter(x => x);

    let success = 0;
    let fail = 0;

    for (const id of ids) {
      try {
        await interaction.guild.bans.remove(id, `${reason} — Moderation by ${interaction.user.tag}`);

        caseManager.createCase({
          userId: id,
          modId: interaction.user.id,
          type: "UNBAN",
          reason,
        });

        success++;
      } catch {
        fail++;
      }
    }

    return interaction.reply({
      content: `Massunban complete.\n✔ Success: ${success}\n❌ Failed: ${fail}`,
      ephemeral: false,
    });
  },
};
