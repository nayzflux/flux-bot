const { EmbedBuilder, Colors } = require("discord.js");
const LevelModel = require("../models/levelModel");
const rewardManager = require(`../managers/rewardManager`);
const { logs } = require("../helpers/logsHelper");

module.exports.getLeaderboard = async (guild) => {
    const leaderboard = await LevelModel.find({ guildId: guild.id }).limit(25).sort({ xp: -1 });
    return leaderboard || null;
}

module.exports.removeLevel = async (member, amount) => {
    const oldLevel = await LevelModel.findOne({ guildId: member.guild.id, userId: member.user.id });

    // === LOGS ===
    logs(member.guild, `Soustraction de ${amount} niveau à ${member.user.tag}`, Colors.Yellow);
    console.log(`🔰 ${member.guild.name} : Soustraction de ${amount} niveau à ${member.user.tag}`);

    if (oldLevel) {
        const level = oldLevel.level - amount > 0 ? oldLevel.level - amount : 0;
        const xp = level * level * 100;

        const newLevel = await LevelModel.findOneAndUpdate({ guildId: member.guild.id, userId: member.user.id }, { xp: xp, level: level }, { new: true });

        if (newLevel.level < oldLevel.level) {
            // === REWARD ===
            rewardManager.handleMemberRewards(member, newLevel.level);
        }

        if (newLevel.level > oldLevel.level) {
            // === REWARD ===
            rewardManager.handleMemberRewards(member, newLevel.level);
        }

        return newLevel;
    }

    return { xp: 0, level: 0 }
}

module.exports.addLevel = async (member, amount) => {
    const oldLevel = await LevelModel.findOne({ guildId: member.guild.id, userId: member.user.id });

    // === LOGS ===
    logs(member.guild, `Ajout de ${amount} niveau à ${member.user.tag}`, Colors.Yellow);
    console.log(`🔰 ${member.guild.name} : Ajout de ${amount} niveau à ${member.user.tag}`);

    if (oldLevel) {
        const level = oldLevel.level + amount > 0 ? oldLevel.level + amount : 0;
        const xp = level * level * 100;

        const newLevel = await LevelModel.findOneAndUpdate({ guildId: member.guild.id, userId: member.user.id }, { xp: xp, level: level }, { new: true });

        if (newLevel.level < oldLevel.level) {
            // === REWARD ===
            rewardManager.handleMemberRewards(member, newLevel.level);
        }

        if (newLevel.level > oldLevel.level) {
            // === REWARD ===
            rewardManager.handleMemberRewards(member, newLevel.level);
        }

        // Si il y a un level up
        if (newLevel.level > oldLevel.level) {
            const levelUpEmbed = new EmbedBuilder()
                .setColor(Colors.Green)
                .setDescription(`👏 Félicitations, vous avez atteint le niveau ${newLevel.level} (${newLevel.xp} XP) sur ${member.guild.name}`);

            member.user.send({ embeds: [levelUpEmbed] }).catch(err => console.log(`❌ Impossible d'envoyer le MP`));

            console.log(`👏 ${member.guild.name} : ${member.user.tag} a atteint le niveau ${newLevel.level}`);
        }

        return newLevel;
    } else {
        const xp = amount * amount * 100;

        const newLevel = await LevelModel.create({ guildId: member.guild.id, userId: member.user.id, xp: xp, level: amount });

        if (newLevel.level > 0) {
            // === REWARD ===
            rewardManager.handleMemberRewards(member, newLevel.level);
        }

        // Si il y a un level up
        if (newLevel.level > 0) {
            const levelUpEmbed = new EmbedBuilder()
                .setColor(Colors.Green)
                .setDescription(`👏 Félicitations, vous avez atteint le niveau ${newLevel.level} (${newLevel.xp} XP) sur ${member.guild.name}`);

            member.user.send({ embeds: [levelUpEmbed] }).catch(err => console.log(`❌ Impossible d'envoyer le MP`));
            console.log(`👏 ${member.guild.name} : ${member.user.tag} a atteint le niveau ${newLevel.level}`);
        }

        return newLevel;
    }
}

module.exports.setLevel = async (member, amount) => {
    const oldLevel = await LevelModel.findOne({ guildId: member.guild.id, userId: member.user.id });

    // === LOGS ===
    logs(member.guild, `Définition de ${amount} niveau à ${member.user.tag}`, Colors.Yellow);
    console.log(`🔰 ${member.guild.name} : Définition de ${amount} niveau à ${member.user.tag}`);

    if (oldLevel) {
        amount = amount > 0 ? amount : 0;
        const xp = amount * amount * 100;

        const newLevel = await LevelModel.findOneAndUpdate({ guildId: member.guild.id, userId: member.user.id }, { xp: xp, level: amount }, { new: true });

        if (newLevel.level < oldLevel.level) {
            // === REWARD ===
            rewardManager.handleMemberRewards(member, newLevel.level);
        }

        if (newLevel.level > oldLevel.level) {
            // === REWARD ===
            rewardManager.handleMemberRewards(member, newLevel.level);
        }

        // Si il y a un level up
        if (newLevel.level > oldLevel.level) {
            const levelUpEmbed = new EmbedBuilder()
                .setColor(Colors.Green)
                .setDescription(`👏 Félicitations, vous avez atteint le niveau ${newLevel.level} (${newLevel.xp} XP) sur ${member.guild.name}`);

            member.user.send({ embeds: [levelUpEmbed] }).catch(err => console.log(`❌ Impossible d'envoyer le MP`));

            console.log(`👏 ${member.guild.name} : ${member.user.tag} a atteint le niveau ${newLevel.level}`);
        }

        return newLevel;
    } else {
        amount = amount > 0 ? amount : 0;
        const xp = amount * amount * 100;

        const newLevel = await LevelModel.create({ guildId: member.guild.id, userId: member.user.id, xp: xp, level: amount });

        if (newLevel.level > 0) {
            // === REWARD ===
            rewardManager.handleMemberRewards(member, newLevel.level);
        }

        // Si il y a un level up
        if (newLevel.level > 0) {
            const levelUpEmbed = new EmbedBuilder()
                .setColor(Colors.Green)
                .setDescription(`👏 Félicitations, vous avez atteint le niveau ${newLevel.level} (${newLevel.xp} XP) sur ${member.guild.name}`);

            member.user.send({ embeds: [levelUpEmbed] }).catch(err => console.log(`❌ Impossible d'envoyer le MP`));
            console.log(`👏 ${member.guild.name} : ${member.user.tag} a atteint le niveau ${newLevel.level}`);
        }

        return newLevel;
    }
}

module.exports.removeXp = async (member, amount) => {
    const oldLevel = await LevelModel.findOne({ guildId: member.guild.id, userId: member.user.id });

    // === LOGS ===
    logs(member.guild, `Soustraction de ${amount} XP à ${member.user.tag}`, Colors.Yellow);
    console.log(`🔰 ${member.guild.name} : Soustraction de ${amount} XP à ${member.user.tag}`);

    if (oldLevel) {
        const xp = oldLevel.xp - amount > 0 ? oldLevel.xp - amount : 0;
        console.log(amount);
        const level = Math.floor(0.1 * Math.sqrt(xp));

        const newLevel = await LevelModel.findOneAndUpdate({ guildId: member.guild.id, userId: member.user.id }, { xp: xp, level: level }, { new: true });

        if (newLevel.level < oldLevel.level) {
            // === REWARD ===
            rewardManager.handleMemberRewards(member, newLevel.level);
        }

        if (newLevel.level > oldLevel.level) {
            // === REWARD ===
            rewardManager.handleMemberRewards(member, newLevel.level);
        }

        return newLevel;
    }

    return { xp: 0, level: 0 };
}

module.exports.addXp = async (member, amount) => {
    const oldLevel = await LevelModel.findOne({ guildId: member.guild.id, userId: member.user.id });

    // === LOGS ===
    logs(member.guild, `Ajout de ${amount} XP à ${member.user.tag}`, Colors.Yellow);
    console.log(`🔰 ${member.guild.name} : Ajout de ${amount} XP à ${member.user.tag}`);

    if (oldLevel) {
        const xp = oldLevel.xp + amount > 0 ? oldLevel.xp + amount : 0;
        const level = Math.floor(0.1 * Math.sqrt(xp));

        const newLevel = await LevelModel.findOneAndUpdate({ guildId: member.guild.id, userId: member.user.id }, { xp: xp, level: level }, { new: true });

        if (newLevel.level < oldLevel.level) {
            // === REWARD ===
            rewardManager.handleMemberRewards(member, newLevel.level);
        }

        if (newLevel.level > oldLevel.level) {
            // === REWARD ===
            rewardManager.handleMemberRewards(member, newLevel.level);
        }

        // Si il y a un level up
        if (newLevel.level > oldLevel.level) {
            const levelUpEmbed = new EmbedBuilder()
                .setColor(Colors.Green)
                .setDescription(`👏 Félicitations, vous avez atteint le niveau ${newLevel.level} (${newLevel.xp} XP) sur ${member.guild.name}`);

            member.user.send({ embeds: [levelUpEmbed] }).catch(err => console.log(`❌ Impossible d'envoyer le MP`));
            console.log(`👏 ${member.guild.name} : ${member.user.tag} a atteint le niveau ${newLevel.level}`);
        }

        return newLevel;
    } else {
        amount = amount > 0 ? amount : 0;
        const level = Math.floor(0.1 * Math.sqrt(amount));

        const newLevel = await LevelModel.create({ guildId: member.guild.id, userId: member.user.id, xp: amount, level: level });

        if (newLevel.level > 0) {
            // === REWARD ===
            rewardManager.handleMemberRewards(member, newLevel.level);
        }

        // Si il y a un level up
        if (newLevel.level > 0) {
            const levelUpEmbed = new EmbedBuilder()
                .setColor(Colors.Green)
                .setDescription(`👏 Félicitations, vous avez atteint le niveau ${newLevel.level} (${newLevel.xp} XP) sur ${member.guild.name}`);

            member.user.send({ embeds: [levelUpEmbed] }).catch(err => console.log(`❌ Impossible d'envoyer le MP`));
            console.log(`👏 ${member.guild.name} : ${member.user.tag} a atteint le niveau ${newLevel.level}`);
        }

        return newLevel;
    }
}

module.exports.setXp = async (member, amount) => {
    const oldLevel = await LevelModel.findOne({ guildId: member.guild.id, userId: member.user.id });

    // === LOGS ===
    logs(member.guild, `Définition de ${amount} XP à ${member.user.tag}`, Colors.Yellow);
    console.log(`🔰 ${member.guild.name} : Définition de ${amount} XP à ${member.user.tag}`);

    if (oldLevel) {
        amount = amount > 0 ? amount : 0;
        const level = Math.floor(0.1 * Math.sqrt(amount));

        const newLevel = await LevelModel.findOneAndUpdate({ guildId: member.guild.id, userId: member.user.id }, { xp: amount, level: level }, { new: true });

        if (newLevel.level < oldLevel.level) {
            // === REWARD ===
            rewardManager.handleMemberRewards(member, newLevel.level);
        }

        if (newLevel.level > oldLevel.level) {
            // === REWARD ===
            rewardManager.handleMemberRewards(member, newLevel.level);
        }

        // Si il y a un level up
        if (newLevel.level > oldLevel.level) {
            const levelUpEmbed = new EmbedBuilder()
                .setColor(Colors.Green)
                .setDescription(`👏 Félicitations, vous avez atteint le niveau ${newLevel.level} (${newLevel.xp} XP) sur ${member.guild.name}`);

            member.user.send({ embeds: [levelUpEmbed] }).catch(err => console.log(`❌ Impossible d'envoyer le MP`));
            console.log(`👏 ${member.guild.name} : ${member.user.tag} a atteint le niveau ${newLevel.level}`);
        }

        return newLevel;
    } else {
        amount = amount > 0 ? amount : 0;
        const level = Math.floor(0.1 * Math.sqrt(amount));

        const newLevel = await LevelModel.create({ guildId: member.guild.id, userId: member.user.id, xp: amount, level: level });

        if (newLevel.level > 0) {
            // === REWARD ===
            rewardManager.handleMemberRewards(member, newLevel.level);
        }

        // Si il y a un level up
        if (newLevel.level > 0) {
            const levelUpEmbed = new EmbedBuilder()
                .setColor(Colors.Green)
                .setDescription(`👏 Félicitations, vous avez atteint le niveau ${newLevel.level} (${newLevel.xp} XP) sur ${member.guild.name}`);


            member.user.send({ embeds: [levelUpEmbed] }).catch(err => console.log(`❌ Impossible d'envoyer le MP`));
            console.log(`👏 ${member.guild.name} : ${member.user.tag} a atteint le niveau ${newLevel.level}`);
        }

        return newLevel;
    }
}

module.exports.getLevel = async (member) => {
    const level = await LevelModel.findOne({ guildId: member.guild.id, userId: member.user.id });

    if (level) return level;

    return { xp: 0, level: 0 };
}

module.exports.getXp = async (member) => {
    const level = await LevelModel.findOne({ guildId: member.guild.id, userId: member.user.id });

    if (level) return level;

    return { xp: 0, level: 0 };
}