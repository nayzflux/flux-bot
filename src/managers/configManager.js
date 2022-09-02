const ConfigModel = require("../models/configModel")

module.exports.setLogsChannel = async (guild, channel) => {
    if (await ConfigModel.exists({ guildId: guild.id })) {
        const config = await ConfigModel.findOneAndUpdate({ guildId: guild.id }, { "logs.channelId": channel.id });
        return config;
    } else {
        const config = await ConfigModel.create({ guildId: guild.id, "logs.channelId": channel.id });
        return config;
    }
}

module.exports.getConfig = async (guild) => {
    const config = await ConfigModel.findOne({ guildId: guild.id });
    return config || null;
}

module.exports.updateConfig = async (guild, data) => {
    if (await ConfigModel.exists({ guildId: guild.id })) {
        const config = await ConfigModel.findOneAndUpdate({ guildId: guild.id }, data, { new: true });
        console.log(data);
        return config;
    } else {
        data.guildId = guild.id;
        const config = await ConfigModel.create(data);
        return config;
    }
}

module.exports.toggleLogs = async (guild, status) => {
    if (await ConfigModel.exists({ guildId: guild.id })) {
        const config = await ConfigModel.findOneAndUpdate({ guildId: guild.id }, { "logs.enabled": status }, { new: true });
        return config;
    } else {
        const config = await ConfigModel.create({ guildId: guild.id, "logs.enabled": status },);
        return config;
    }
}