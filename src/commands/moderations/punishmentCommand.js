const { SlashCommandBuilder, ActionRowBuilder, SlashCommandSubcommandBuilder, SlashCommandChannelOption, ChannelType, PermissionFlagsBits, Colors, Embed, EmbedBuilder, SlashCommandStringOption, SlashCommandRoleOption, SlashCommandIntegerOption } = require("discord.js");
const ms = require("ms");
const punishmentManager = require(`../../managers/punishmentManager`);
const moment = require(`moment`)

module.exports = {
    data: (new SlashCommandBuilder()
        .setName(`punishment`)
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`set`)
                .setDescription(`Définir une punition`)
                .addIntegerOption(
                    new SlashCommandIntegerOption()
                        .setName(`avertissement`)
                        .setDescription(`Nombre d'avertissement nécessaire pour recevoir la punition`)
                        .setRequired(true))
                .addStringOption(
                    new SlashCommandStringOption()
                        .setName(`punition`)
                        .setDescription(`Punition à donner au membre`)
                        .addChoices(
                            { name: `ban`, value: `BAN` },
                            { name: `tempban`, value: `TEMPBAN` },
                            { name: `kick`, value: `KICK` },
                            { name: `mute`, value: `MUTE` }
                        )
                        .setRequired(true))
                .addStringOption(
                    new SlashCommandStringOption()
                        .setName(`durée`)
                        .setDescription(`Durée de la punition`)
                        .setRequired(false)))
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`delete`)
                .setDescription(`Supprimer une punition`)
                .addIntegerOption(
                    new SlashCommandIntegerOption()
                        .setName(`avertissement`)
                        .setDescription(`Nombre d'avertissement de la punition`)
                        .setRequired(true)))
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`list`)
                .setDescription(`Lister les punitions`))
        .setDescription(`Définir les punitions`)
    ),
    run: async (client, interaction) => {
        const { member, guild } = interaction;
        const subcommand = interaction.options.getSubcommand();
        const durationStr = interaction.options.getString(`durée`);
        const action = interaction.options.getString(`punition`);
        const warnNumber = interaction.options.getInteger(`avertissement`);

        if (subcommand === `list`) {
            const punishments = await punishmentManager.getPunishments(guild);

            if (punishments.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setDescription(`Il n'y a aucune punition`);

                interaction.reply({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                    .setColor(Colors.Fuchsia)
                    .setAuthor({ name: `Liste des punitions`, iconURL: guild.iconURL() });

                let str = ``;

                for (const punishment of punishments) {
                    let actionStr = ``;

                    if (punishment.action === `BAN`) actionStr = `Bannissement`;
                    if (punishment.action === `TEMPBAN`) {
                        actionStr = `Bannissement temporaire (${moment.duration(punishment.actionDuration).humanize()})`;
                    }
                    if (punishment.action === `KICK`) actionStr = `Expulsion`;
                    if (punishment.action === `MUTE`) {
                        actionStr = `Mute temporaire (${moment.duration(punishment.actionDuration).humanize()})`;
                    }

                    str = str = `${punishment.threshold} avertissement - ${actionStr}\n`
                }

                embed.setDescription(str);

                interaction.reply({ embeds: [embed] });
            }
        }

        if (subcommand === `set`) {
            if (!member.permissions.has(PermissionFlagsBits.Administrator) && !member.permissions.has(PermissionFlagsBits.ManageGuild)) {
                const permissionMissingEmbed = new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setDescription(`Vous n'avez pas l'autorisation d'effectuer cette action`)

                return interaction.reply({ embeds: [permissionMissingEmbed] });
            }

            if (action === `BAN`) {
                punishmentManager.set(guild, warnNumber, action, null);

                const embed = new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setDescription(`Au bout de ${warnNumber} avertissement les membres receverront un bannissement`);

                return interaction.reply({ embeds: [embed] });
            }

            if (action === `TEMPBAN`) {
                if (!durationStr) {
                    const missingDuration = new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(`Merci de spécifier la durée du bannissement`);

                    return interaction.reply({ embeds: [missingDuration] });
                }

                const duration = ms(durationStr);

                if (!duration) {
                    const durationFormatEmbed = new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(`Le format de durée est invalide\nEx: /punishement set ${warnNumber} tempban 2d`);

                    return interaction.reply({ embeds: [durationFormatEmbed] });
                }

                punishmentManager.set(guild, warnNumber, action, duration);

                const embed = new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setDescription(`Au bout de ${warnNumber} avertissement les membres receverront un bannissement temporaire (${moment.duration(duration).humanize()})`);

                return interaction.reply({ embeds: [embed] });
            }

            if (action === `KICK`) {
                punishmentManager.set(guild, warnNumber, action, null);

                const embed = new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setDescription(`Au bout de ${warnNumber} avertissement les membres receverront une expulsion`);

                return interaction.reply({ embeds: [embed] });
            }

            if (action === `MUTE`) {
                if (!durationStr) {
                    const missingDuration = new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(`Merci de spécifier la durée du mute`);

                    return interaction.reply({ embeds: [missingDuration] });
                }

                const duration = ms(durationStr);

                if (!duration) {
                    const durationFormatEmbed = new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(`Le format de durée est invalide\nEx: /punishement set ${warnNumber} mute 30m`);

                    return interaction.reply({ embeds: [durationFormatEmbed] });
                }

                if (duration > 15 * 24 * 60 * 60 * 1000) {
                    const durationToLongEmbed = new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(`La durée d'un mute ne peut pas excéder plus de 15 jours`);
    
                    return interaction.reply({ embeds: [durationToLongEmbed] });
                }

                punishmentManager.set(guild, warnNumber, action, duration);

                const embed = new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setDescription(`Au bout de ${warnNumber} avertissement les membres receverront un mute temporaire (${moment.duration(duration).humanize()})`);

                return interaction.reply({ embeds: [embed] });
            }
        }

        if (subcommand === `delete`) {
            if (!member.permissions.has(PermissionFlagsBits.Administrator) && !member.permissions.has(PermissionFlagsBits.ManageGuild)) {
                const permissionMissingEmbed = new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setDescription(`Vous n'avez pas l'autorisation d'effectuer cette action`)

                return interaction.reply({ embeds: [permissionMissingEmbed] });
            }

            punishmentManager.delete(guild, warnNumber);

            const embed = new EmbedBuilder()
                .setColor(Colors.Green)
                .setDescription(`Punition au bout de ${warnNumber} avertissement supprimée`);

            return interaction.reply({ embeds: [embed] });
        }
    }
}