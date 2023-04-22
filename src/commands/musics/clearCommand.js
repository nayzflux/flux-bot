const { SlashCommandBuilder, ActionRowBuilder, SlashCommandSubcommandBuilder, SlashCommandChannelOption, ChannelType, SlashCommandStringOption, EmbedBuilder, Colors } = require("discord.js");
const musicHelper = require(`../../helpers/musicHelper`);

module.exports = {
    category: {
        name: `Musique`,
        emoji: `🎧`
    },
    data: (new SlashCommandBuilder()
        .setName(`clear`)
        .setDescription(`Supprimer la file de lecture`)
    ),
    run: async (client, interaction) => {
        const { guild } = interaction;

        // disabled module
        const error = new EmbedBuilder()
        .setColor(Colors.Yellow)
        .setDescription(`⚠️ Le module de musique est désormais désactivé sur <@1013156960167800893> !\n➡️ Merci d'utiliser !play avec <@1099354786245120080>\n📗 Avancement: https://github.com/nayzflux/soundwave-bot`) 
        return interaction.reply({ embeds: [error] });

        const isCleared = musicHelper.clearQueue(guild.id);

        if (isCleared === null) {
            const noQueue = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`Il n'y a actuellement pas de lecture`)

            return interaction.reply({ embeds: [noQueue] });
        }

        if (isCleared) {
            const paused = new EmbedBuilder()
                .setColor(Colors.Aqua)
                .setDescription(`File de lecture en supprimé 🗑️`)

            return interaction.reply({ embeds: [paused] });
        }
    }
}