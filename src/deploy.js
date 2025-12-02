import fs from "fs";
import path from "path";
import { REST, Routes } from "discord.js";
import "dotenv/config";

const commands = [];

function loadFolder(folderPath) {
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith(".js"));
  for (const file of files) {
    const cmd = require(path.join(folderPath, file)).default;
    if (cmd?.data) commands.push(cmd.data.toJSON());
  }
}

loadFolder("src/moderation");
loadFolder("src/contextmenu");

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

async function deploy() {
  try {
    console.log("Deploying commands...");
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log("Commands deployed.");
  } catch (err) {
    console.error(err);
  }
}

deploy();