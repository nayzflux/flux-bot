const { EmbedBuilder, Colors, GuildMember } = require("discord.js");
const moment = require("moment/moment");
const TempbanModel = require("../models/tempbanModel");
const { logs } = require("../helpers/logsHelper");

/**
 * Bannir temporairement un membre
 * @param {GuildMember} member 
 * @param {GuildMember} moderator 
 * @param {String} reason 
 * @param {Number} duration
 */
module.exports.tempban = async (member, moderator, reason, duration) => {
    const expiresAt = Date.now() + duration
    TempbanModel.create({ guildId: member.guild.id, userId: member.user.id, moderatorId: moderator.user.id, reason, expiresAt });
    const formatedExpiresAt = moment(expiresAt).format(`DD/MM/YY [à] HH:mm`);
    const embed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setDescription(`Vous avez été banni jusqu'au ${formatedExpiresAt} pour ${reason} sur ${member.guild.name}`);
    await member.send({ embeds: [embed] });
    member.ban({ deleteMessageDays: 7, reason: `${reason} | Expire le ${formatedExpiresAt}` });

    setTimeout(() => {
        this.unban(member.guild, member.user, `Expiration`);
    }, duration);

    // === LOGS ===
    logs(member.guild, `${member.user.tag} a été banni temporairement par ${moderator.user.tag} pour ${reason} jusqu'au ${moment(expiresAt).format(`DD/MM/YY [à] HH:mm:ss`)}`, Colors.Red);
    console.log(`🔨 ${member.guild.name} : ${member.user.tag} a été banni temporairement par ${moderator.user.tag} pour ${reason} jusqu'au ${moment(expiresAt).format(`DD/MM/YY [à] HH:mm:ss`)}`);
}

module.exports.unban = async (guild, user, reason) => {
    await TempbanModel.findOneAndUpdate({ guildId: guild.id, userId: user.id, expired: false }, { expired: true });

    guild.bans.remove(user.id, reason)
        .then(() => {
            // === LOGS ===
            logs(guild, `${user.tag} a été débanni pour ${reason}`, Colors.Red);
            console.log(`🔨 ${guild.name} : ${user.tag} a été débanni pour ${reason}`);
        }).catch(err => {
            console.log(`❌ ${guild.name} : Impossible de débannir ${user.tag}`);
        });
}

module.exports.getMemberTempbans = async (member) => {
    const tempbans = await TempbanModel.find({ guildId: member.guild.id, userId: member.user.id });
    return tempbans || null;
}

module.exports.deleteMemberTempbans = async (member) => {
    await TempbanModel.deleteMany({ guildId: member.guild.id, userId: member.user.id });
}