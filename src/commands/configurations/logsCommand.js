const { SlashCommandBuilder, ActionRowBuilder, SlashCommandSubcommandBuilder, SlashCommandChannelOption, ChannelType, PermissionFlagsBits, Colors, Embed, EmbedBuilder } = require("discord.js");
const { logs } = require("../../helpers/logsHelper");
const configManager = require(`../../managers/configManager`);

module.exports = {
    data: (new SlashCommandBuilder()
        .setName(`logs`)
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`on`)
                .setDescription(`Activer le système de logs`)
                .addChannelOption(
                    new SlashCommandChannelOption()
                        .setName(`salon`)
                        .setDescription(`Définissez le salon où seront envoyé les logs`)
                        .addChannelTypes(ChannelType.GuildText)))
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`off`)
                .setDescription(`Désactiver le système de logs`))
        .setDescription(`Configurer le système de logs`)
    ),
    run: async (client, interaction) => {
        const subcommand = interaction.options.getSubcommand();
        const { guild, member } = interaction;

        if (!member.permissions.has(PermissionFlagsBits.Administrator) && !member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            const permissionMissingEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`Vous n'avez pas l'autorisation d'effectuer cette action`)

            return interaction.reply({ embeds: [permissionMissingEmbed] });
        }

        logs(guild, `${member.user.tag} a modifié les paramètres des logs`, Colors.Red);

        if (subcommand === `on`) {
            const channel = interaction.options.getChannel(`salon`);

            if (channel) {
                // Activer les logs et modifier le salon
                await configManager.toggleLogs(guild, true);
                await configManager.setLogsChannel(guild, channel);
                interaction.reply(`⚙️ Système de logs **activé** : ${channel}`);
            } else {
                // Activer les logs
                const config = await configManager.toggleLogs(guild, true);
                interaction.reply(`⚙️ Système de logs **activé** : ${config.logs.channelId ? `<#${config.logs.channelId}>` : `⚠️ Pas de salon définie`}`);
            }
        }

        if (subcommand === `off`) {
            // Désactiver les logs
            await configManager.toggleLogs(guild, false);
            interaction.reply(`⚙️ Système de logs **désactivé**`);
        }
    }
}