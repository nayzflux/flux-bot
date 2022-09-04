const { SlashCommandBuilder, ActionRowBuilder, SlashCommandSubcommandBuilder, SlashCommandChannelOption, ChannelType, PermissionFlagsBits, Colors, Embed, EmbedBuilder, SlashCommandStringOption } = require("discord.js");
const configManager = require(`../../managers/configManager`);

module.exports = {
    category: {
        name: `Configuration`,
        emoji: `⚙️`
    },
    data: (new SlashCommandBuilder()
        .setName(`leave-message`)
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`on`)
                .setDescription(`Activer le système de messages d'aurevoir`)
                .addChannelOption(
                    new SlashCommandChannelOption()
                        .setName(`salon`)
                        .setDescription(`Définissez le salon où seront envoyé les messages d'aurevoir`)
                        .addChannelTypes(ChannelType.GuildText))
                .addStringOption(
                    new SlashCommandStringOption()
                        .setName(`message`)
                        .setDescription(`Définissez le message d'aurevoir`)))
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`off`)
                .setDescription(`Désactiver le système de messages d'aurevoir`))
        .setDescription(`Configurer le système de messages d'aurevoir`)
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

            await configManager.updateConfig(guild, { "messages.leave.enabled": true });

            if (content) {
                await configManager.updateConfig(guild, { "messages.leave.content": content });
            }

            if (channel) {
                await configManager.updateConfig(guild, { "messages.leave.channelId": channel.id });
            }

            const config = await configManager.getConfig(guild);

            interaction.reply(`⚙️ Système de messages d'aurevoir **activé** : ${config?.messages?.leave?.channelId ? `<#${config?.messages?.leave?.channelId}>` : `⚠️ Non spécifié`}`);
        }

        if (subcommand === `off`) {
            await configManager.updateConfig(guild, { "messages.join.enabled": true });
            interaction.reply(`⚙️ Système de messages d'aurevoir **désactivé**`);
        }
    }
}