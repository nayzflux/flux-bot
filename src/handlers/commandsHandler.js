const fs = require(`fs`);

module.exports = (client) => {
    client.handleCommands = async () => {
        const commandFolders = fs.readdirSync(`./src/commands`);
        const { commands, slashCommands } = client;

        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith(`.js`));

            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                commands.set(command.data.name, command);
                slashCommands.push(command.data.toJSON());
                console.log(`👌 Commande /${command.data.name} chargée avec succès`)
            }
        }
    }
}