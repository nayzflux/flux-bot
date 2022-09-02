const { EmbedBuilder, Colors } = require("discord.js");
const KickModel = require("../models/kickModel");
const { logs } = require("../helpers/logsHelper");

module.exports.kick = async (member, moderator, reason) => {
    KickModel.create({ guildId: member.guild.id, userId: member.user.id, moderatorId: moderator.user.id, reason });
    const embed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setDescription(`Vous avez été expulsé pour ${reason} sur ${member.guild.name}`);
    await member.send({ embeds: [embed] });
    member.kick({ reason });
    // === LOGS ===
    logs(member.guild, `${member.user.tag} a été expulsé par ${moderator.user.tag} pour ${reason}`, Colors.Red);
    console.log(`🔨 ${member.guild.name} : ${member.user.tag} a été expulsé par ${moderator.user.tag} pour ${reason}`);
}