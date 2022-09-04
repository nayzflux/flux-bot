const { SlashCommandBuilder, ActionRowBuilder, SlashCommandSubcommandBuilder, SlashCommandChannelOption, ChannelType, SlashCommandStringOption, EmbedBuilder, Colors, SelectMenuBuilder, SelectMenuOptionBuilder, Embed } = require("discord.js");
const musicHelper = require(`../../helpers/musicHelper`);

module.exports = {
    category: {
        name: `Autres`,
        emoji: `🤖`
    },
    data: (new SlashCommandBuilder()
        .setName(`help`)
        .setDescription(`Voir la page d'aide`)
    ),
    run: async (client, interaction) => {
        const { guild } = interaction;

        const commands = client.commands;

        const selectMenu = require(`../../components/selectMenus/helpSelectMenu`).data;

        const map = new Map();

        // Trier les commandes par rapport au categorie
        for (const command of commands.values()) {
            const alreadyDone = map.get(command.category.name) || false;

            if (!alreadyDone) {
                map.set(command.category.name, true);

                selectMenu.addOptions(
                    {
                        label: command.category.name,
                        value: command.category.name.toLowerCase(),
                        emoji: command.category.emoji
                    }
                );
            }
        }

        interaction.reply({ components: [new ActionRowBuilder().addComponents(selectMenu)] });

        const filter = (i) => i.customId === 'help-menu' && i.user.id === interaction.user.id;

        const collector = await interaction.channel.createMessageComponentCollector({ filter, time: 30 * 1000 });

        collector.on(`collect`, (i) => {
            const helpEmbed = new EmbedBuilder()
                .setAuthor({ iconURL: client.user.avatarURL(), name: `❓ Page d'aide:` });

            let str = ``;

            for (const command of commands.values()) {
                if (command.category.name.toLowerCase() === i.values[0]) {
                    str = str + `**/${command.data.name}**\n\`${command.data.description}\`\n \n`
                }
            }

            helpEmbed.setDescription(str)

            i.update({ embeds: [helpEmbed] })
        })
    }
}