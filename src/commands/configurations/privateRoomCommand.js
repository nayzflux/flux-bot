const { SlashCommandBuilder, ActionRowBuilder, SlashCommandSubcommandBuilder, SlashCommandChannelOption, ChannelType, PermissionFlagsBits, Colors, Embed, EmbedBuilder } = require("discord.js");
const configManager = require(`../../managers/configManager`);

module.exports = {
    data: (new SlashCommandBuilder()
        .setName(`private-room`)
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`on`)
                .setDescription(`Activer le système de salon personnel`)
                .addChannelOption(
                    new SlashCommandChannelOption()
                        .setName(`salon`)
                        .setDescription(`Définissez le salon où les salons personnels seront créer`)
                        .addChannelTypes(ChannelType.GuildVoice)))
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`off`)
                .setDescription(`Désactiver le système de salon personnel`))
        .setDescription(`Configurer le système de salon personnel`)
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

        logs(guild, `${member.user.tag} a modifié les paramètres des salons personnels`, Colors.Red);

        if (subcommand === `on`) {
            const channel = interaction.options.getChannel(`salon`);

            if (channel) {
                // Activer les logs et modifier le salon
                await configManager.updateConfig(guild, { "privateRoom.channelId": channel.id, "privateRoom.enabled": true });
                interaction.reply(`⚙️ Système de salon personnel **activé** : ${channel}`);
            } else {
                // Activer les logs
                const config = await configManager.updateConfig(guild, { "privateRoom.enabled": true });
                interaction.reply(`⚙️ Système de salon personnel **activé** : ${config.privateRoom.channelId ? `<#${config.privateRoom.channelId}>` : `⚠️ Pas de salon définie`}`);
            }
        }

        if (subcommand === `off`) {
            await configManager.updateConfig(guild, { "privateRoom.enabled": false });
            interaction.reply(`⚙️ Système de salon personnel **désactivé**`);
        }
    }
}