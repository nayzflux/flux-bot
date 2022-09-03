const { CommandInteraction, Client, Colors, EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder, PermissionFlagsBits, SlashCommandStringOption, SlashCommandUserOption, SlashCommandBuilder } = require("discord.js");
const banManager = require(`../../managers/banManager`);
const tempbanManager = require(`../../managers/tempbanManager`);
const kickManager = require(`../../managers/kickManager`);
const muteManager = require(`../../managers/muteManager`);
const warnManager = require(`../../managers/warnManager`);
const ms = require(`ms`);
const moment = require(`moment`);

module.exports = {
    data: (new SlashCommandBuilder()
        .setName(`clear-history`)
        .setDescription(`Supprimer l'historique de modération d'un membre`)
        .addUserOption(new SlashCommandUserOption()
            .setName(`membre`)
            .setDescription(`Membre`)
            .setRequired(true))
    ),
    run: async (client, interaction) => {
        const { member } = interaction;
        const target = interaction.options.getMember(`membre`);

        if (!member.permissions.has(PermissionFlagsBits.Administrator) && !member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            const permissionMissingEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`Vous n'avez pas l'autorisation d'effectuer cette action`)

            return interaction.reply({ embeds: [permissionMissingEmbed] });
        }

        // Supprimer toutes les sanctions
        await banManager.deleteMemberBans(member);
        await tempbanManager.deleteMemberTempbans(member);
        await kickManager.deleteMemberKicks(member);
        await muteManager.deleteMemberMutes(member);
        await warnManager.deleteMemberWarings(member);

        const sanctionsDeleted = new EmbedBuilder()
            .setColor(Colors.Green)
            .setDescription(`Toutes les sanctions de ${target} ont été supprimé`)

        return interaction.reply({ embeds: [sanctionsDeleted] });
    }
}