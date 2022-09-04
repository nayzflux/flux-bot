const { CommandInteraction, Client, Colors, EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder, PermissionFlagsBits, SlashCommandStringOption, SlashCommandUserOption, SlashCommandBuilder } = require("discord.js");
const muteManager = require(`../../managers/muteManager`);
const ms = require(`ms`);
const moment = require(`moment`);

module.exports = {
    category: {
        name: `Modération`,
        emoji: `⛔`
    },
    data: (new SlashCommandBuilder()
        .setName(`unmute`)
        .setDescription(`Démute un membre`)
        .addUserOption(new SlashCommandUserOption()
            .setName(`membre`)
            .setDescription(`Membre à démute`)
            .setRequired(true))
    ),
    run: async (client, interaction) => {
        const { member, guild } = interaction;
        const target = interaction.options.getMember(`membre`);

        if (!member.permissions.has(PermissionFlagsBits.Administrator) && !member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            const permissionMissingEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`Vous n'avez pas l'autorisation d'effectuer cette action`)

            return interaction.reply({ embeds: [permissionMissingEmbed] });
        }

        await muteManager.unmute(target, `Manuel`)

        const targetUnmutedConfirmationEmbed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setDescription(`${target} a été démute`);

        return interaction.reply({ embeds: [targetUnmutedConfirmationEmbed] });
    }
}