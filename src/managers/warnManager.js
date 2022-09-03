const { EmbedBuilder, Colors } = require("discord.js");
const WarnModel = require("../models/warnModel");
const punishmentManager = require(`./punishmentManager`);
const { logs } = require("../helpers/logsHelper");

module.exports.warn = async (member, moderator, reason) => {
    await WarnModel.create({ guildId: member.guild.id, userId: member.user.id, moderatorId: moderator.user.id, reason });
    const embed = new EmbedBuilder()
        .setColor(Colors.Yellow)
        .setDescription(`Vous avez été averti pour ${reason} sur ${member.guild.name}`);
    member.send({ embeds: [embed] });
    // === LOGS ===
    logs(member.guild, `${member.user.tag} a été averti par ${moderator.user.tag} pour ${reason}`, Colors.Yellow);
    console.log(`⚠️ ${member.guild.name} : ${member.user.tag} a été averti par ${moderator.user.tag} pour ${reason}`);
    punishmentManager.handleMemberPunishment(member, moderator, reason);
}

module.exports.getMemberWarnings = async (member) => {
    const warnings = await WarnModel.find({guildId: member.guild.id, userId: member.user.id});
    return warnings || null;
}

module.exports.deleteMemberWarings = async (member) => {
    await WarnModel.deleteMany({ guildId: member.guild.id, userId: member.user.id });
}