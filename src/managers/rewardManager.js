const { Colors } = require("discord.js");
const RewardModel = require("../models/rewardModel");
const { logs } = require("../helpers/logsHelper");

module.exports.add = async (level, role) => {
    if (!await RewardModel.exists({ guildId: role.guild.id, level })) {
        RewardModel.create({ guildId: role.guild.id, level: level, roleId: role.id });
    } else {
        RewardModel.findOneAndUpdate({ guildId: role.guild.id, level }, { roleId: role.id });
    }

    // === LOGS ===
    logs(role.guild, `Récompense niveau ${level} créé ${role}`, Colors.Yellow);
    console.log(`⚠️ ${role.guild.name} : Récompense niveau ${level} créé ${role.name}`);
}

module.exports.remove = async (level, role) => {
    RewardModel.findOneAndRemove({ guildId: role.guild.id, level });
    // === LOGS ===
    logs(role.guild, `Récompense niveau ${level} supprimée ${role}`, Colors.Yellow);
    console.log(`⚠️ ${role.guild.name} : Récompense niveau ${level} supprimée ${role.name}`);
}

module.exports.getRewards = async (guild) => {
    const rewards = await RewardModel.find({ guildId: guild.id }).sort({ level: 1 });
    return rewards || [];
}

module.exports.handleMemberRewards = async (member, level) => {
    const rewards = await this.getRewards(member.guild)

    for (const reward of rewards) {
        const role = await member.guild.roles.fetch(reward.roleId);

        // Si le membre possède le niveau
        if (reward.level <= level) {
            if (role) {
                member.roles.add(role).catch(err => console.log(`❌ Impossible de donner le rôle`));
                // === LOGS ===
                logs(member.guild, `Récompense de niveau ${level} donné à ${member.user.tag}`, Colors.Yellow);
                console.log(`🔰 ${member.guild.name} : Récompense de niveau ${level} donné à ${member.user.tag}`);
            }
        }

        // Si le membre ne possède pas le niveau
        if (reward.level > level) {
            if (role) {
                member.roles.remove(role).catch(err => console.log(`❌ Impossible de retirer le rôle`));
                // === LOGS ===
                logs(member.guild, `Récompense de niveau ${level} retiré de ${member.user.tag}`, Colors.Yellow);
                console.log(`🔰 ${member.guild.name} : Récompense de niveau ${level} retiré de ${member.user.tag}`);
            }
        }
    }
}