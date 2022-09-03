const { EmbedBuilder, Colors, GuildMember } = require("discord.js");
const moment = require("moment/moment");
const MuteModel = require("../models/muteModel");
const { logs } = require("../helpers/logsHelper");

/**
 * Rendre muet temporairement un membre
 * @param {GuildMember} member 
 * @param {GuildMember} moderator 
 * @param {String} reason 
 * @param {Number} duration
 */
module.exports.mute = async (member, moderator, reason, duration) => {
    const expiresAt = Date.now() + duration
    MuteModel.create({ guildId: member.guild.id, userId: member.user.id, moderatorId: moderator.user.id, reason, expiresAt });
    const formatedExpiresAt = moment(expiresAt).format(`DD/MM/YY [à] HH:mm`);
    const embed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setDescription(`Vous avez été rendu muet jusqu'au ${formatedExpiresAt} pour ${reason} sur ${member.guild.name}`);
    await member.send({ embeds: [embed] });
    member.disableCommunicationUntil(expiresAt, `${reason} | Expire le ${formatedExpiresAt}`);
    // === LOGS ===
    logs(member.guild, `${member.user.tag} a été rendu muet par ${moderator.user.tag} pour ${reason} jusqu'au ${moment(expiresAt).format(`DD/MM/YY [à] HH:mm:ss`)}`, Colors.Red);
    console.log(`🔇 ${member.guild.name} : ${member.user.tag} a été rendu muet par ${moderator.user.tag} pour ${reason} jusqu'au ${moment(expiresAt).format(`DD/MM/YY [à] HH:mm:ss`)}`);
}

module.exports.unmute = async (member, reason) => {
    member.disableCommunicationUntil(null, reason);
    logs(member.guild, `${member.user.tag} n'est plus muet pour ${reason}`, Colors.Red);
    console.log(`🔇 ${member.guild.name} : ${member.user.tag} n'est plus muet pour ${reason}`);
}

module.exports.getMemberMutes = async (member) => {
    const mutes = await MuteModel.find({guildId: member.guild.id, userId: member.user.id});
    return mutes || null;
}

module.exports.deleteMemberMutes = async (member) => {
    await MuteModel.deleteMany({ guildId: member.guild.id, userId: member.user.id });
}