import fs from "fs";
import path from "path";

export default function loadContextMenus(client) {
  const folder = path.join(process.cwd(), "src", "contextmenu");
  const files = fs.readdirSync(folder).filter(f => f.endsWith(".js"));

  for (const file of files) {
    const cmd = require(path.join(folder, file)).default;

    if (!cmd || !cmd.data) {
      console.log(`Context menu skipped (no data): ${file}`);
      continue;
    }

    client.commands.set(cmd.data.name, cmd);
  }

  console.log(`Loaded ${files.length} context menu command(s).`);
}
