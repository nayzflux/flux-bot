// Variable d'environnement de dév
// require(`dotenv`).config({ path: `.env` });

const { Client, Collection, User } = require("discord.js");

const client = new Client({ intents: 3276799 });
client.commands = new Collection();
client.slashCommands = [];
client.buttons = new Collection();
client.selectMenus = new Collection();

// Base de donnés
require(`./database/mongodb`);

/**
 * 
 * @param {User} user 
 * @returns 
 */


// Handler
require(`./handlers/commandsHandler`)(client);
require(`./handlers/eventsHandler`)(client);
// require(`./handlers/componentsHandler`)(client);
client.handleCommands();
client.handleEvents();
client.handleComponents();

// Se connecter à l'API de discord
client.login(process.env.DISCORD_TOKEN);