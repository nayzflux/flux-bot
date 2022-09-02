const { PermissionFlagsBits } = require('discord.js');
const configManager = require(`../../managers/configManager`);
const warnManager = require(`../../managers/warnManager`);
const axios = require(`axios`);

module.exports.analyzeImages = async (client, message) => {
    if (message.attachments.size === 0) return;

    if (message.member.permissions.has(PermissionFlagsBits.Administrator) || message.member.permissions.has(PermissionFlagsBits.ManageMessages) || message.member.owner) {
        return;
    }

    const member = message.member;
    const guild = message.guild;
    const moderator = await message.guild.members.fetch(client.user.id);

    const config = await configManager.getConfig(guild);
    const isImageAutomod = config.automod.image.enabled;
    const imageAutomodPolicy = config.automod.image.policy;

    if (!isImageAutomod || !imageAutomodPolicy) return;

    /**
     * === LOW ===          
     * Nudité: ❌ || ✅ (nsfw)
     * Nudité partielle: ✅
     * Armes: ✅
     * Alcool: ✅
     * Drogues: ✅
     * Geste/Signe offensifs: ❌
     * Contenu gore: ❌
     * === NORMAL ===          
     * Nudité: ❌
     * Nudité partielle: ✅
     * Armes: ✅
     * Alcool: ✅
     * Drogues: ❌
     * Geste/Signe offensifs: ❌
     * Contenu gore: ❌
     * === HIGH ===          
     * Nudité: ❌
     * Nudité partielle: ❌
     * Armes: ❌
     * Alcool: ❌
     * Drogues: ❌
     * Geste/Signe offensifs: ❌
     * Contenu gore: ❌
     */

    for (attachment of message.attachments.values()) {
        if (!attachment.contentType.startsWith(`image/`)) return;

        console.log(`📌 Analyse de ${attachment.url} en cours...`);

        const FormData = require('form-data');

        data = new FormData();
        data.append('url', attachment.url);
        data.append('models', `nudity,wad,offensive,gore`);
        data.append('api_user', process.env.SIGHTENGINE_USER);
        data.append('api_secret', process.env.SIGHTENGINE_SECRET);

        axios({
            method: 'post',
            url: 'https://api.sightengine.com/1.0/check.json',
            data: data,
            headers: data.getHeaders()
        }).then(response => {
            const rawNudity = response.data.nudity.raw;
            const partialNudity = response.data.nudity.partial;
            const partialNudityTag = response.data.nudity.partial_tag;
            const weapon = response.data.weapon;
            const alcohol = response.data.alcohol;
            const drugs = response.data.drugs;
            const offensive = response.data.offensive.prob;
            const gore = response.data.gore.prob;

            // HIGH settings will warn for nudity offensive symbol or gesture gore content drugs or alcohol and weapon
            if (imageAutomodPolicy === `HIGH`) {
                if (rawNudity >= 0.5) {
                    warnManager.warn(member, moderator, `Contenu à caractère sexuel explicite`);
                    message.delete().catch(err => console.log(err));
                    return;
                }
                if (partialNudity >= 0.5) {
                    warnManager.warn(member, moderator, `Contenu contenant de la nudité partielle (${partialNudityTag})`);
                    message.delete().catch(err => console.log(err));
                    return;
                }
                if (alcohol >= 0.5) {
                    warnManager.warn(member, moderator, `Contenu contenant des boissons alcoolisés`);
                    message.delete().catch(err => console.log(err));
                    return;
                }
                if (weapon >= 0.5) {
                    warnManager.warn(member, moderator, `Contenu contenant des armes`);
                    message.delete().catch(err => console.log(err));
                    return;
                }
                if (offensive >= 0.5) {
                    warnManager.warn(member, moderator, `Contenu contenant des symboles et/ou des gestes offensif`);
                    message.delete().catch(err => console.log(err));
                    return;
                }
                if (gore >= 0.5) {
                    warnManager.warn(member, moderator, `Contenu gore`);
                    message.delete().catch(err => console.log(err));
                    return;
                }
                if (drugs >= 0.5) {
                    warnManager.warn(member, moderator, `Contenu contenant des drogues`);
                    message.delete().catch(err => console.log(err));
                    return;
                }
            }

            // NORMAL settings will warn for raw nudity offensive symbol or gesture gore content and drugs
            if (imageAutomodPolicy === `NORMAL`) {
                if (rawNudity >= 0.5) {
                    warnManager.warn(member, moderator, `Contenu à caractère sexuel explicite`);
                    message.delete().catch(err => console.log(err));
                    return;
                }
                if (offensive >= 0.5) {
                    warnManager.warn(member, moderator, `Contenu contenant des symboles et/ou des gestes offensif`);
                    message.delete().catch(err => console.log(err));
                    return;
                }
                if (gore >= 0.5) {
                    warnManager.warn(member, moderator, `Contenu gore`);
                    message.delete().catch(err => console.log(err));
                    return;
                }
                if (drugs >= 0.5) {
                    warnManager.warn(member, moderator, `Contenu contenant des drogues`);
                    message.delete().catch(err => console.log(err));
                    return;
                }
            }

            // LOW settings will warn for offensive symbol or gesture and gore
            if (imageAutomodPolicy === `LOW`) {
                if (rawNudity >= 0.5 && !message.channel.nsfw) {
                    warnManager.warn(member, moderator, `Contenu à caractère sexuel explicite (hors salon NSFW)`);
                    message.delete().catch(err => console.log(err));
                    return;
                }
                if (offensive >= 0.5) {
                    warnManager.warn(member, moderator, `Contenu contenant des symboles et/ou des gestes offensif`);
                    message.delete().catch(err => console.log(err));
                    return;
                }
                if (gore >= 0.5) {
                    warnManager.warn(member, moderator, `Contenu gore`);
                    message.delete().catch(err => console.log(err));
                    return;
                }
            }

            console.log(`✅ ${attachment.url} analyser`);
        }).catch(err => {
            console.log(`❌ Impossible d'analyser ${attachment.url}`);
        });
    }
}
