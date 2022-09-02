module.exports = {
    name: `ready`,
    run: async (client) => {
        // Enregistrer les commandes slashs
        client.application.commands.set(client.slashCommands, `1013156687206699030`);
        console.log(`🚩 ${client.user.tag} en ligne`);
    }
}