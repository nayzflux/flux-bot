const { SlashCommandBuilder, ActionRowBuilder, SlashCommandSubcommandBuilder, SlashCommandChannelOption, ChannelType, SlashCommandStringOption, EmbedBuilder, Colors } = require("discord.js");
const musicHelper = require(`../../helpers/musicHelper`);

module.exports = {
    category: {
        name: `Musique`,
        emoji: `🎧`
    },
    data: (new SlashCommandBuilder()
        .setName(`stop`)
        .setDescription(`Stopper la lecture`)
    ),
    run: async (client, interaction) => {
        const { guild } = interaction;

        // disabled module
        const error = new EmbedBuilder()
            .setColor(Colors.Yellow)
            .setDescription(`⚠️ Le module de musique est désormais désactivé sur <@1013156960167800893> !\n➡️ Merci d'utiliser !play avec <@1099354786245120080>\n📗 Avancement: https://github.com/nayzflux/soundwave-bot`)
        return interaction.reply({ embeds: [error] });

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