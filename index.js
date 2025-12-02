import "dotenv/config";
import fs from "fs";
import path from "path";
import { Client, GatewayIntentBits, Collection, REST, Routes } from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();

// Load commands
const commandsPath = path.join(process.cwd(), "src", "commands", "moderation");
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

let slashCommandsJSON = [];

for (const file of commandFiles) {
  const cmd = await import(`./commands/moderation/${file}`);
  client.commands.set(cmd.data.name, cmd);

  slashCommandsJSON.push(cmd.data.toJSON());
}

// Register slash commands
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Registering slash commands...");
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: slashCommandsJSON }
    );
    console.log("Commands registered.");
  } catch (err) {
    console.error(err);
  }
})();

// Interaction handler
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const cmd = client.commands.get(interaction.commandName);
  if (!cmd) return;

  try {
    await cmd.execute(interaction, client);
  } catch (err) {
    console.error(err);
    interaction.reply({ content: "Error executing command.", ephemeral: true });
  }
});

client.login(process.env.TOKEN);