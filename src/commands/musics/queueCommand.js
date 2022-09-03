const { SlashCommandBuilder, ActionRowBuilder, SlashCommandSubcommandBuilder, SlashCommandChannelOption, ChannelType, SlashCommandStringOption, EmbedBuilder, Colors } = require("discord.js");
const musicHelper = require(`../../helpers/musicHelper`);

module.exports = {
    data: (new SlashCommandBuilder()
        .setName(`queue`)
        .setDescription(`Afficher la file de lecture`)
    ),
    run: async (client, interaction) => {
        const { guild } = interaction;

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