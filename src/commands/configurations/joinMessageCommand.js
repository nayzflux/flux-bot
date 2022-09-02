const { SlashCommandBuilder, ActionRowBuilder, SlashCommandSubcommandBuilder, SlashCommandChannelOption, ChannelType, PermissionFlagsBits, Colors, Embed, EmbedBuilder, SlashCommandStringOption } = require("discord.js");
const configManager = require(`../../managers/configManager`);

module.exports = {
    data: (new SlashCommandBuilder()
        .setName(`join-message`)
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`on`)
                .setDescription(`Activer le système de message de bienvenue`)
                .addChannelOption(
                    new SlashCommandChannelOption()
                        .setName(`salon`)
                        .setDescription(`Définissez le salon où seront envoyé les messages de bienvenue`)
                        .addChannelTypes(ChannelType.GuildText))
                .addStringOption(
                    new SlashCommandStringOption()
                        .setName(`message`)
                        .setDescription(`Définissez le message de bienvenue`)))
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`off`)
                .setDescription(`Désactiver le système de message de bienvenue`))
        .setDescription(`Configurer le système de message de bienvenue`)
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

        if (subcommand === `on`) {
            const channel = interaction.options.getChannel(`salon`);
            const content = interaction.options.getString(`message`);

            await configManager.updateConfig(guild, { "messages.join.enabled": true });

            if (content) {
                await configManager.updateConfig(guild, { "messages.join.content": content });
            }

            if (channel) {
                await configManager.updateConfig(guild, { "messages.join.channelId": channel.id });
            }

            const config = await configManager.getConfig(guild);

            interaction.reply(`⚙️ Système de messages de bienvenue **activé** : ${config?.messages?.join?.channelId ? `<#${config?.messages?.join?.channelId}>` : `⚠️ Non spécifié`}`);
        }

        if (subcommand === `off`) {
            await configManager.updateConfig(guild, { "messages.join.enabled": true });
            interaction.reply(`⚙️ Système de messages de bienvenue **désactivé**`);
        }
    }
}