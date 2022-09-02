const { CommandInteraction, Client, Colors, EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder, PermissionFlagsBits, SlashCommandStringOption, SlashCommandUserOption, SlashCommandBuilder } = require("discord.js");
const banManager = require(`../../managers/banManager`);
const tempbanManager = require(`../../managers/tempbanManager`);
const ms = require(`ms`);
const moment = require(`moment`);

module.exports = {
    data: (new SlashCommandBuilder()
        .setName(`ban`)
        .setDescription(`Bannir un membre`)
        .addUserOption(new SlashCommandUserOption()
            .setName(`membre`)
            .setDescription(`Membre à bannir`)
            .setRequired(true))
        .addStringOption(new SlashCommandStringOption()
            .setName(`raison`)
            .setDescription(`Raison du bannissement`)
            .setRequired(true))
        .addStringOption(new SlashCommandStringOption()
            .setName(`durée`)
            .setDescription(`Durée du bannissement`)
            .setRequired(false))
    ),
    run: async (client, interaction) => {
        const { member } = interaction;
        const target = interaction.options.getMember(`membre`);
        const reason = interaction.options.getString(`raison`);
        const durationStr = interaction.options.getString(`durée`);

        if (!member.permissions.has(PermissionFlagsBits.Administrator) && !member.permissions.has(PermissionFlagsBits.BanMembers)) {
            const permissionMissingEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`Vous n'avez pas l'autorisation d'effectuer cette action`)

            return interaction.reply({ embeds: [permissionMissingEmbed] });
        }

        if (target.user.id === member.user.id) {
            const unableToBanYourself = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`Vous ne pouvez pas vous bannir vous même`);

            return interaction.reply({ embeds: [unableToBanYourself] });
        }

        if (target.roles.highest.position >= member.roles.highest.position) {
            const unableToBanMemberEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`Vous ne pouvez pas bannir ${target}`);

            return interaction.reply({ embeds: [unableToBanMemberEmbed] });
        }

        if (!target.kickable) {
            const unableToBanMemberEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`${target} ne peut pas être banni`);

            return interaction.reply({ embeds: [unableToBanMemberEmbed] });
        }

        if (durationStr) {
            const duration = ms(durationStr)

            if (!duration) {
                const durationFormatEmbed = new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setDescription(`Le format de durée est invalide\nEx: /ban @Dummy Test 1d`);

                return interaction.reply({ embeds: [durationFormatEmbed] });
            }

            if (duration > 15 * 24 * 60 * 60 * 1000) {
                const durationToLongEmbed = new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setDescription(`La durée ne peut pas excéder plus de 15 jours`);

                return interaction.reply({ embeds: [durationToLongEmbed] });
            }

            await tempbanManager.tempban(target, member, reason, duration)

            const targetTempbannedConfirmationEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`${target} a été banni jusqu'au ${moment(Date.now() + duration).format(`DD/MM/YY [à] HH:mm`)} pour ${reason}`);

            return interaction.reply({ embeds: [targetTempbannedConfirmationEmbed] });
        } else {
            await banManager.ban(target, member, reason)

            const targetBannedConfirmationEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`${target} a été banni pour ${reason}`);

            return interaction.reply({ embeds: [targetBannedConfirmationEmbed] });
        }
    }
}