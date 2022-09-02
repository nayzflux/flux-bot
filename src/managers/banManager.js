const { EmbedBuilder, Colors, GuildMember } = require("discord.js");
const { logs } = require("../helpers/logsHelper");
const BanModel = require("../models/banModel");

/**
 * Bannir un membre
 * @param {GuildMember} member 
 * @param {GuildMember} moderator 
 * @param {String} reason 
 */
module.exports.ban = async (member, moderator, reason) => {
    BanModel.create({ guildId: member.guild.id, userId: member.user.id, moderatorId: moderator.user.id, reason });
    const embed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setDescription(`Vous avez été banni pour ${reason} sur ${member.guild.name}`);
    await member.send({ embeds: [embed] });
    member.ban({ deleteMessageDays: 7, reason });
    // === LOGS ===
    logs(member.guild, `${member.user.tag} a été banni définitivement par ${moderator.user.tag} pour ${reason}`, Colors.Red);
    console.log(`🔨 ${member.guild.name} : ${member.user.tag} a été banni définitivement par ${moderator.user.tag} pour ${reason}`);
}

module.exports.unban = async (guild, user, reason) => {
    guild.bans.remove(user.id, reason).catch(err => {
        console.log(`❌ ${member.guild.name} : Impossible de débannir ${user.username}`);
    });
    // === LOGS ===
    logs(guild, `${user.tag} a été débanni pour ${reason}`, Colors.Red);
    console.log(`🔨 ${guild.name} : ${user.tag} a été débanni pour ${reason}`);
}