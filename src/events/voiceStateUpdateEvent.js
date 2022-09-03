const privateRoomManager = require(`../managers/privateRoomManager`);
const levelManager = require(`../managers/levelManager`);
const configManager = require(`../managers/configManager`);
const moment = require(`moment`);
const { ChannelType } = require("discord.js");
const map = new Map();
const XP_AMOUNT = 10;

module.exports = {
    name: `voiceStateUpdate`,
    run: async (client, oldState, newState) => {
        const guild = oldState.guild || newState.guild;
        const member = oldState.member || newState.member;

        // lorsqu'un membre rejoint un salon
        if (!oldState.channel && newState.channel) {
            if (member.user.bot) return;
            // PRIVATE ROOM
            checkCreate(guild, member, newState);

            // NIVEAU
            map.set(newState.member.id, Date.now());
        }

        // lorsqu'un membre quitte un salon
        if (oldState.channel && !newState.channel) {
            // PRIVATE ROOM
            checkDelete(guild, member, oldState);

            // NIVEAU & LEVEL
            if (member.user.bot) return;

            const joinedAt = map.get(oldState.member.id);

            if (joinedAt) {
                const minutes = Math.round((Date.now() - joinedAt) / 1000 / 60);
                levelManager.addXp(member, minutes * XP_AMOUNT);
                console.log(minutes);
            }
        }

        // lorsqu'un membre change de salon
        if (oldState.channel && newState.channel) {
            // PRIVATE ROOM
            checkDelete(guild, member, oldState);

            if (member.user.bot) return;

            checkCreate(guild, member, newState);

            // NIVEAU
            const joinedAt = map.get(newState.member.id);

            if (joinedAt) {
                const minutes = Math.round((Date.now() - joinedAt) / 1000 / 60);
                levelManager.addXp(member, minutes * XP_AMOUNT);
                console.log(minutes);
            }

            map.set(newState.member.id, Date.now());
        }
    }
}

const checkCreate = async (guild, member, newState) => {
    const config = await configManager.getConfig(guild);

    if (newState.channel.id === config?.privateRoom?.channelId) {
        guild.channels.create({ name: `🔊〡Salon de ${member.displayName}`, parent: newState.channel.parent, position: newState.channel.position + 1, type: ChannelType.GuildVoice }).then(channel => {
            member.voice.setChannel(channel);
            privateRoomManager.add(channel);
            console.log(`🔐 Salon créé par ${member.user.tag}`);
        });
    }
}

const checkDelete = async (guild, member, oldState) => {
    const privateRoom = await privateRoomManager.get(oldState.channel)

    if (privateRoom && oldState.channel.members.size <= 0) {
        oldState.channel.delete();
        privateRoomManager.remove(oldState.channel);
        console.log(`🔐 Salon supprimé par ${member.user.tag}`);
    }
}