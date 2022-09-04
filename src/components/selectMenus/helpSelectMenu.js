const { SlashCommandBuilder, ActionRowBuilder, SlashCommandSubcommandBuilder, SlashCommandChannelOption, ChannelType, SlashCommandStringOption, EmbedBuilder, Colors, SelectMenuBuilder, SelectMenuOptionBuilder, Embed } = require("discord.js");

module.exports = {
    data: (new SelectMenuBuilder()
        .setCustomId(`help-menu`)
        .setPlaceholder(`Selectionner la catégorie`)
    ),
    run: async (client, interaction) => {
        const { guild } = interaction;
        const commands = client.commands;

        const helpEmbed = new EmbedBuilder();

        let str = ``;
        let catName = ``;

        for (const command of commands.values()) {
            if (command.category.name.toLowerCase() === interaction.values[0]) {
                str = str + `**/${command.data.name}**\n\`${command.data.description}\`\n \n`
                catName = command.category.emoji + " " + command.category.name;
            }
        }

        helpEmbed.setAuthor({ iconURL: client.user.avatarURL(), name: `⛑️ Page d'aide | ${catName}` });
        helpEmbed.setDescription(str);
        helpEmbed.setColor(Colors.Blue);

        interaction.update({ embeds: [helpEmbed] })
    }
}