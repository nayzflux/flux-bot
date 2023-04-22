const { SlashCommandBuilder, ActionRowBuilder, SlashCommandSubcommandBuilder, SlashCommandChannelOption, ChannelType, SlashCommandStringOption, EmbedBuilder, Colors } = require("discord.js");
const musicHelper = require(`../../helpers/musicHelper`);

module.exports = {
    category: {
        name: `Musique`,
        emoji: `🎧`
    },
    data: (new SlashCommandBuilder()
        .setName(`skip`)
        .setDescription(`Passer à la musique suivante`)
    ),
    run: async (client, interaction) => {
        const { guild } = interaction;

        // disabled module
        const error = new EmbedBuilder()
            .setColor(Colors.Yellow)
            .setDescription(`⚠️ Le module de musique est désormais désactivé sur <@1013156960167800893> !\n➡️ Merci d'utiliser !play avec <@1099354786245120080>\n📗 Avancement: https://github.com/nayzflux/soundwave-bot`)
        return interaction.reply({ embeds: [error] });

        const newSong = musicHelper.skip(guild.id);

        if (newSong === null) {
            const noQueue = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`Il n'y a actuellement pas de lecture`)

            return interaction.reply({ embeds: [noQueue] });
        }

        if (!newSong) {
            const noQueue = new EmbedBuilder()
                .setColor(Colors.Aqua)
                .setDescription(`Il n'y a plus de musique dans la file de lecture`)

            return interaction.reply({ embeds: [noQueue] });
        }

        if (newSong) {
            const skipped = new EmbedBuilder()
                .setColor(Colors.Aqua)
                .setAuthor({ name: `Musique suivante en cours de lecture... ⏩` })
                .setDescription(`[${newSong.title}](${newSong.url})`)
                .setThumbnail(newSong.thumbnail)
                .addFields({ name: `Par`, value: `${newSong.publisher}`, inline: true }, { name: `Durée`, value: `\`${newSong.duration}\``, inline: true });

            return interaction.reply({ embeds: [skipped] });
        }
    }
}