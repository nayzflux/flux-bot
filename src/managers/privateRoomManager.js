const PrivateRoomModel = require(`../models/privateRoomModel`);
const { logs } = require("../helpers/logsHelper");

module.exports.add = async (channel) => {
    const privateRoom = await PrivateRoomModel.create({ guildId: channel.guild.id, channelId: channel.id });
    // === LOGS ===
    logs(guild, `Salon personnel créé ${channel.name}`, Colors.Red);
    console.log(`🔇 ${member.guild.name} : Salon personnel créé ${channel.name}`);
    return privateRoom || null;
}

module.exports.remove = async (channel) => {
    const privateRoom = await PrivateRoomModel.findOneAndRemove({ guildId: channel.guild.id, channelId: channel.id });
    // === LOGS ===
    logs(guild, `Salon personnel supprimé ${channel.name}`, Colors.Red);
    console.log(`🔇 ${guild.name} : Salon personnel supprimé ${channel.name}`);
    return privateRoom || null;
}

module.exports.get = async (channel) => {
    const privateRoom = await PrivateRoomModel.findOne({ guildId: channel.guild.id, channelId: channel.id });
    return privateRoom || null;
}