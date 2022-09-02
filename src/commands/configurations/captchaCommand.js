const { SlashCommandBuilder, ActionRowBuilder, SlashCommandSubcommandBuilder, SlashCommandChannelOption, ChannelType, PermissionFlagsBits, Colors, Embed, EmbedBuilder, SlashCommandStringOption, SlashCommandRoleOption } = require("discord.js");
const configManager = require(`../../managers/configManager`);

module.exports = {
    data: (new SlashCommandBuilder()
        .setName(`captcha`)
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`on`)
                .setDescription(`Activer le système de captcha`)
                .addChannelOption(
                    new SlashCommandChannelOption()
                        .setName(`salon`)
                        .setDescription(`Définissez le salon`)
                        .addChannelTypes(ChannelType.GuildText))
                .addRoleOption(
                    new SlashCommandRoleOption()
                        .setName(`role`)
                        .setDescription(`Définissez le rôle à donner`)))
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`off`)
                .setDescription(`Désactiver le système de captcha`))
        .setDescription(`Configurer le système de captcha`)
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

        logs(guild, `${member.user.tag} a modifié les paramètres du captcha`, Colors.Red);

        if (subcommand === `on`) {
            const channel = interaction.options.getChannel(`salon`);
            const role = interaction.options.getRole(`role`);

            await configManager.updateConfig(guild, { "captcha.enabled": true });

            if (channel) {
                await configManager.updateConfig(guild, { "captcha.channelId": channel.id });

                console.log(channel.id);
            }

            if (role) {
                await configManager.updateConfig(guild, { "captcha.roleId": role.id });
                console.log(role.id);
            }

            const config = await configManager.getConfig(guild);

            interaction.reply(`⚙️ Système de messages de captcha **activé** : ${config?.captcha?.roleId ? `<@&${config?.captcha?.roleId}>` : `⚠️ Rôle non définie`} | ${config?.captcha?.channelId ? `<#${config?.captcha?.channelId}>` : `⚠️ Salon non définie`}`);
        }

        if (subcommand === `off`) {
            await configManager.updateConfig(guild, { "captcha.enabled": false });
            interaction.reply(`⚙️ Système de messages de captcha **désactivé**`);
        }
    }
}