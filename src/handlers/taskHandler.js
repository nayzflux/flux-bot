const TempbanModel = require("../models/tempbanModel")
const tempbanManager = require("../managers/tempbanManager")

// gérer les bans et le mode raid pendant que le bot était hors ligne
module.exports = async (client) => {
    client.handleTempbans = async () => {
        const tempbans = await TempbanModel.find({ expired: false });

        for (const tempban of tempbans) {
            const guild = await client.guilds.fetch(tempban.guildId);
            const user = await client.users.fetch(tempban.userId);

            console.log(tempban.expiresAt - Date.now());

            if (Date.now() >= tempban.expiresAt) {
                console.log("ban expiré");
                await tempbanManager.unban(guild, user, "Expiration")
            } else {
                const duration = tempban.expiresAt - Date.now();
                console.log("ban expire dans " + duration + " secondes");
                setTimeout(() => {
                    tempbanManager.unban(guild, user, "Expiration")
                }, duration);
            }
        }
    }
}