const { SlashCommandBuilder, ActionRowBuilder, SlashCommandSubcommandBuilder, SlashCommandChannelOption, ChannelType, PermissionFlagsBits, Colors, Embed, EmbedBuilder, SlashCommandStringOption, SlashCommandRoleOption } = require("discord.js");
const { logs } = require("../../helpers/logsHelper");
const configManager = require(`../../managers/configManager`);

module.exports = {
    data: (new SlashCommandBuilder()
        .setName(`autorole`)
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`on`)
                .setDescription(`Activer le système de rôle automatique`)
                .addRoleOption(
                    new SlashCommandRoleOption()
                        .setName(`role`)
                        .setDescription(`Définissez le rôle automatique`)))
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`off`)
                .setDescription(`Désactiver le système de rôle automatique`))
        .setDescription(`Configurer le système de rôle automatique`)
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

        logs(guild, `${member.user.tag} a modifié les paramètres du rôle automatique`, Colors.Red);

        if (subcommand === `on`) {
            const role = interaction.options.getRole(`role`);

            await configManager.updateConfig(guild, { "autorole.enabled": true });

            if (role) {
                await configManager.updateConfig(guild, { "autorole.roleId": role.id });
            }

            const config = await configManager.getConfig(guild);

            interaction.reply(`⚙️ Système de messages de rôle automatique **activé** : ${config?.autorole?.roleId ? `<@&${config?.autorole?.roleId}>` : `⚠️ Non définie`}`);
        }

        if (subcommand === `off`) {
            await configManager.updateConfig(guild, { "autorole.enabled": false });
            interaction.reply(`⚙️ Système de messages de rôle automatique **désactivé**`);
        }
    }
}