const { SlashCommandBuilder, ActionRowBuilder, SlashCommandSubcommandBuilder, SlashCommandChannelOption, ChannelType, SlashCommandStringOption, EmbedBuilder, Colors } = require("discord.js");
const musicHelper = require(`../../helpers/musicHelper`);

module.exports = {
    data: (new SlashCommandBuilder()
        .setName(`stop`)
        .setDescription(`Stopper la lecture`)
    ),
    run: async (client, interaction) => {
        const { guild } = interaction;

        const isStopped = musicHelper.stop(guild.id);

        if (isStopped === null) {
            const noQueue = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`Il n'y a actuellement pas de lecture`)

            return interaction.reply({ embeds: [noQueue] });
        }

        if (isStopped) {
            const stopped = new EmbedBuilder()
                .setColor(Colors.Aqua)
                .setDescription(`File de lecture stoppé ⏹️`)

            return interaction.reply({ embeds: [stopped] });
        }
    }
}