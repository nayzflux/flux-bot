const levelManager = require(`../managers/levelManager`);

module.exports = {
    name: `interactionCreate`,
    run: async (client, interaction) => {
        const { commands, buttons, selectMenus } = client;

        if (interaction.isCommand()) {
            const command = commands.get(interaction.commandName);
            if (!command) return;
            command.run(client, interaction);
        }

        if (interaction.isButton()) {
            const button = buttons.get(interaction.customId);
            if (!button) return;
            button.run(client, interaction);
        }

        if (interaction.isSelectMenu()) {
            const selectMenu = selectMenus.get(interaction.customId);
            if (!selectMenu) return;
            selectMenu.run(client, interaction);
        }
    }
}