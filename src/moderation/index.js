import fs from "fs";
import path from "path";

export default function loadModerationCommands(client) {
  const moderationPath = path.join(process.cwd(), "moderation");
  const files = fs.readdirSync(moderationPath);

  for (const file of files) {
    if (!file.endsWith(".js")) continue;

    const command = require(path.join(moderationPath, file)).default;
    client.commands.set(command.data.name, command);
  }
}