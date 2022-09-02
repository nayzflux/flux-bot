const { PermissionFlagsBits } = require("discord.js");
const configManager = require(`../../managers/configManager`);
const warnManager = require(`../../managers/warnManager`);
const axios = require(`axios`);

module.exports.analyzeText = async (client, message) => {
    if (!message.content) return;

    if (message.member.permissions.has(PermissionFlagsBits.Administrator) || message.member.permissions.has(PermissionFlagsBits.ManageMessages) || message.member.owner) {
        return;
    }

    const member = message.member;
    const guild = message.guild;
    const moderator = await message.guild.members.fetch(client.user.id);

    const config = await configManager.getConfig(guild);
    const isTextAutomod = config?.automod?.text?.enabled;
    const textAutomodPolicy = config?.automod?.text?.policy;

    if (!isTextAutomod || !textAutomodPolicy) return;

    /**
     * === LOW ===          
     * Insulte: ✅
     * Menace: ❌
     * Racisme: ❌
     * Toxicité: ✅
     * Outrage: ✅
     * === NORMAL ===          
     * Insulte: ❌
     * Menace: ❌
     * Racisme: ❌
     * Toxicité: ✅
     * Outrage: ✅
     * === HIGH ===          
     * Insulte: ❌
     * Menace: ❌
     * Racisme: ❌
     * Toxicité: ❌
     * Outrage: ❌
     */

    axios({
        method: 'POST',
        url: `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${process.env.PERSPECTIVE_KEY}`,
        data: {
            comment: { text: message.content },
            languages: ["fr"],
            requestedAttributes: {
                TOXICITY: {},
                IDENTITY_ATTACK: {},
                INSULT: {},
                PROFANITY: {},
                THREAT: {}
            }
        },
    }).then(response => {
        const { INSULT, PROFANITY, IDENTITY_ATTACK, TOXICITY, THREAT } = response.data.attributeScores;
        if (textAutomodPolicy === `HIGH`) {
            if (IDENTITY_ATTACK.summaryScore.value >= 0.3) {
                warnManager.warn(member, moderator, `Racisme`);
                message.delete().catch(err => console.log(err));
                return;
            }
            if (THREAT.summaryScore.value >= 0.3) {
                warnManager.warn(member, moderator, `Menace`);
                message.delete().catch(err => console.log(err));
                return;
            }
            if (PROFANITY.summaryScore.value >= 0.3) {
                warnManager.warn(member, moderator, `Manque de respect`);
                message.delete().catch(err => console.log(err));
                return;
            }
            if (INSULT.summaryScore.value >= 0.3) {
                warnManager.warn(member, moderator, `Insulte`);
                message.delete().catch(err => console.log(err));
                return;
            }
            if (TOXICITY.summaryScore.value >= 0.3) {
                warnManager.warn(member, moderator, `Toxicité`);
                message.delete().catch(err => console.log(err));
                return;
            }
        }
        if (textAutomodPolicy === `NORMAL`) {
            if (IDENTITY_ATTACK.summaryScore.value >= 0.5) {
                warnManager.warn(member, moderator, `Racisme`);
                message.delete().catch(err => console.log(err));
                return;
            }
            if (THREAT.summaryScore.value >= 0.5) {
                warnManager.warn(member, moderator, `Menace`);
                message.delete().catch(err => console.log(err));
                return;
            }
            if (INSULT.summaryScore.value >= 0.5) {
                warnManager.warn(member, moderator, `Insulte`);
                message.delete().catch(err => console.log(err));
                return;
            }
        }
        if (textAutomodPolicy === `LOW`) {
            if (IDENTITY_ATTACK.summaryScore.value >= 0.5) {
                warnManager.warn(member, moderator, `Racisme`);
                message.delete().catch(err => console.log(err));
                return;
            }
            if (THREAT.summaryScore.value >= 0.5) {
                warnManager.warn(member, moderator, `Menace`);
                message.delete().catch(err => console.log(err));
                return;
            }
        }
    }).catch(err => {
        console.log(err);
    });
}