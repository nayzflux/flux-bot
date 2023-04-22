const { SlashCommandBuilder, ActionRowBuilder, SlashCommandSubcommandBuilder, SlashCommandChannelOption, ChannelType, SlashCommandStringOption, EmbedBuilder, Colors } = require("discord.js");
const musicHelper = require(`../../helpers/musicHelper`);

module.exports = {
    category: {
        name: `Musique`,
        emoji: `🎧`
    },
    data: (new SlashCommandBuilder()
        .setName(`queue`)
        .setDescription(`Afficher la file de lecture`)
    ),
    run: async (client, interaction) => {
        const { guild } = interaction;

        // disabled module
        const error = new EmbedBuilder()
            .setColor(Colors.Yellow)
            .setDescription(`⚠️ Le module de musique est désormais désactivé sur <@1013156960167800893> !\n➡️ Merci d'utiliser !play avec <@1099354786245120080>\n📗 Avancement: https://github.com/nayzflux/soundwave-bot`)
        return interaction.reply({ embeds: [error] });

        const queue = musicHelper.getServerQueue(guild.id);

        if (!queue?.songs && queue?.songs?.length !== 0) {
            const embed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`Aucun musique n'est actuellement dans la file de lecture`);

            return interaction.reply({ embeds: [embed] });
        }

        const embed = new EmbedBuilder()
            .setColor(Colors.Fuchsia);

        let i = 0;
        let str = ``;

        for (const song of queue.songs) {
            i++;

            str = str + `${i} - [${song.title}](${song.url}) | \`${song.duration}\`\n`
        }

        embed.setDescription(str);

        return interaction.reply({ embeds: [embed] });
    }
}