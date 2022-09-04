const { GuildMember, Colors } = require("discord.js");
const PunishmentModel = require("../models/punishmentModel");
const WarnModel = require("../models/warnModel");
const banManager = require(`./banManager`);
const tempbanManager = require(`./tempbanManager`);
const kickManager = require(`./kickManager`);
const muteManager = require(`./muteManager`);
const { logs } = require("../helpers/logsHelper");

module.exports.handleMemberPunishment = async (member, moderator, reason) => {
    const guildId = member.guild.id;

    // Get member warns
    const warnNumber = await WarnModel.count({ guildId, memberId: member.user.id });

    // Get punishment for this warns amount
    const punishment = await PunishmentModel.findOne({ guildId, threshold: warnNumber });

    // If there's no punishment to apply
    if (!punishment) return;

    switch (punishment.action) {
        case `BAN`:
            // Handle member's ban
            await banManager.ban(member, moderator, reason);
            break;
        case `TEMPBAN`:
            // Handle member's ban
            await tempbanManager.tempban(member, moderator, reason, punishment.actionDuration);
            break;
        case `KICK`:
            // Handle member's kick
            await kickManager.kick(member, moderator, reason);
            break;
        case `MUTE`:
            // Handle member's mute
            await muteManager.mute(member, moderator, reason, punishment.actionDuration);
            break;
    }

    // === LOGS ===
    logs(member.guild, `Puntion ${punishment.action} appliqué à ${member.user.tag}`, Colors.Red);
    console.log(`⚠️ ${member.guild.name} : Puntion ${punishment.action} appliqué à ${member.user.tag}`);
}

module.exports.set = async (guild, threshold, action, actionDuration) => {
    if (!await PunishmentModel.exists({ guildId: guild.id, threshold })) {
        PunishmentModel.create({ guildId: guild.id, threshold, action, actionDuration });
    } else {
        PunishmentModel.findOneAndUpdate({ guildId: guild.id, threshold }, { action, actionDuration });
    }
}

module.exports.delete = async (guild, threshold) => {
    await PunishmentModel.findOneAndRemove({ guildId: guild.id, threshold });
}

module.exports.getPunishments = async (guild) => {
    const punishments = await PunishmentModel.find({ guildId: guild.id }).sort({ threshold: 1 });
    return punishments || [];
}