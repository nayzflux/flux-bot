const { handleFloodProtection } = require("../helpers/automod/antiFloodHelper");
const { handlePhisingProtection } = require("../helpers/automod/antiPhisingHelper");
const { handleSpamProtection } = require("../helpers/automod/antiSpamHelper");
const { analyzeImages } = require("../helpers/automod/imageModeration");
const { analyzeText } = require("../helpers/automod/textModeration");
const levelManager = require(`../managers/levelManager`);

module.exports = {
    name: `messageCreate`,
    run: async (client, message) => {
        if (message.author.bot) return;
        if (!message.guild) return;

        // === NIVEAU ===
        levelManager.addXp(message.member, 10);

        // === MODERATION ===
        if (message.content) {
            handlePhisingProtection(client, message);
            handleSpamProtection(client, message);
            handleFloodProtection(client, message);
            analyzeText(client, message);
        }

        if (message.attachments) {
            analyzeImages(client, message);
        }
    }
}