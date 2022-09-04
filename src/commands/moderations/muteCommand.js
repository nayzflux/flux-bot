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
        .setName(`mute`)
        .setDescription(`Rednre muet un membre`)
        .addUserOption(new SlashCommandUserOption()
            .setName(`membre`)
            .setDescription(`Membre à rendre muet`)
            .setRequired(true))
        .addStringOption(new SlashCommandStringOption()
            .setName(`raison`)
            .setDescription(`Raison du mute`)
            .setRequired(true))
        .addStringOption(new SlashCommandStringOption()
            .setName(`durée`)
            .setDescription(`Durée du mute`)
            .setRequired(true))
    ),
    run: async (client, interaction) => {
        const { member } = interaction;
        const target = interaction.options.getMember(`membre`);
        const reason = interaction.options.getString(`raison`);
        const durationStr = interaction.options.getString(`durée`);

        if (!member.permissions.has(PermissionFlagsBits.Administrator) && !member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            const permissionMissingEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`Vous n'avez pas l'autorisation d'effectuer cette action`)

            return interaction.reply({ embeds: [permissionMissingEmbed] });
        }

        if (target.user.id === member.user.id) {
            const unableToMuteYourself = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`Vous ne pouvez pas vous rendre muet vous même`);

            return interaction.reply({ embeds: [unableToMuteYourself] });
        }

        if (target.roles.highest.position >= member.roles.highest.position) {
            const unableToMuteMemberEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`Vous ne pouvez pas rendre muet ${target}`);

            return interaction.reply({ embeds: [unableToMuteMemberEmbed] });
        }

        if (!target.kickable) {
            const unableToMuteMemberEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`${target} ne peut pas être rendu muet`);

            return interaction.reply({ embeds: [unableToMuteMemberEmbed] });
        }

        const duration = ms(durationStr)

        if (!duration) {
            const durationFormatEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`Le format de durée est invalide\nEx: /mute @Dummy Test 15m`);

            return interaction.reply({ embeds: [durationFormatEmbed] });
        }

        if (duration > 15 * 24 * 60 * 60 * 1000) {
            const durationToLongEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`La durée ne peut pas excéder plus de 15 jours`);

            return interaction.reply({ embeds: [durationToLongEmbed] });
        }

        await muteManager.mute(target, member, reason, duration);

        const targetMutedConfirmationEmbed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(`${target} a été rendu muet jusqu'au ${moment(Date.now() + duration).format(`DD/MM/YY [à] HH:mm`)} pour ${reason}`);

        return interaction.reply({ embeds: [targetMutedConfirmationEmbed] });
    }
}