import { SlashCommandBuilder } from "discord.js";
import * as caseManager from "../utils/caseManager.js";

export default {
  data: new SlashCommandBuilder()
    .setName("mod case")
    .setDescription("View a single case by its ID")
    .addIntegerOption(opt => opt.setName("id").setDescription("Case ID").setRequired(true)),
  async execute(interaction) {
    const id = interaction.options.getInteger("id", true);
    const c = caseManager.getCase(id);

    if (!c) {
      return interaction.reply({ content: `Case #${id} not found.`, ephemeral: true });
    }

    const hiddenNote = c.hidden ? " (hidden)" : "";
    const createdAt = new Date(c.timestamp).toLocaleString();

    const reply = `**Case #${c.caseId}${hiddenNote}**
- Type: ${c.type}
- User ID: ${c.userId}
- Moderator ID: ${c.modId}
- Reason: ${c.reason}
- Timestamp: ${createdAt}`;

    return interaction.reply({ content: reply, ephemeral: false });
  },
};
