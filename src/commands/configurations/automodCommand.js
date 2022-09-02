const { SlashCommandBuilder, ActionRowBuilder, SlashCommandSubcommandBuilder, SlashCommandChannelOption, ChannelType, PermissionFlagsBits, Colors, Embed, EmbedBuilder, SlashCommandStringOption, SlashCommandRoleOption } = require("discord.js");
const configManager = require(`../../managers/configManager`);

module.exports = {
    data: (new SlashCommandBuilder()
        .setName(`automod`)
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`on`)
                .setDescription(`Activer le système de modération automatique`)
                .addStringOption(
                    new SlashCommandStringOption()
                        .setName(`module`)
                        .setDescription(`Choisissez la protection à activer`)
                        .setRequired(true)
                        .addChoices({ name: `phising`, value: `phising` }, { name: `flood`, value: `flood` }, { name: `spam`, value: `spam` }, { name: `texte`, value: `text` }, { name: `image`, value: `image` }))
                .addStringOption(
                    new SlashCommandStringOption()
                        .setName(`politique`)
                        .setDescription(`Choisissez le niveau de protection`)
                        .setRequired(false)
                        .addChoices({ name: `stricte`, value: `HIGH` }, { name: `normale`, value: `NORMAL` }, { name: `légère`, value: `LOW` })))
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`off`)
                .setDescription(`Désactiver le système de modération automatique`)
                .addStringOption(
                    new SlashCommandStringOption()
                        .setName(`module`)
                        .setDescription(`Choisissez la protection à désactiver`)
                        .setRequired(true)
                        .addChoices({ name: `phising`, value: `phising` }, { name: `flood`, value: `flood` }, { name: `spam`, value: `spam` }, { name: `texte`, value: `text` }, { name: `image`, value: `image` })))
        .setDescription(`Configurer le système de modération automatique`)
    ),
    run: async (client, interaction) => {
        const subcommand = interaction.options.getSubcommand();
        const { guild, member } = interaction;
        const module1 = interaction.options.getString(`module`);
        const policy = interaction.options.getString(`politique`);

        if (!member.permissions.has(PermissionFlagsBits.Administrator) && !member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            const permissionMissingEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`Vous n'avez pas l'autorisation d'effectuer cette action`)

            return interaction.reply({ embeds: [permissionMissingEmbed] });
        }

        logs(guild, `${member.user.tag} a modifié les paramètres de l'auto-modération`, Colors.Red);

        if (subcommand === `on`) {
            if (module1 === `phising`) {
                await configManager.updateConfig(guild, { "automod.phising.enabled": true });
            }

            if (module1 === `spam`) {
                await configManager.updateConfig(guild, { "automod.spam.enabled": true });
            }

            if (module1 === `flood`) {
                await configManager.updateConfig(guild, { "automod.flood.enabled": true });
            }

            if (module1 === `text`) {
                await configManager.updateConfig(guild, { "automod.text.enabled": true });

                if (policy) {
                    await configManager.updateConfig(guild, { "automod.text.policy": policy });
                }
            }

            if (module1 === `image`) {
                await configManager.updateConfig(guild, { "automod.image.enabled": true });

                if (policy) {
                    await configManager.updateConfig(guild, { "automod.image.policy": policy });
                }
            }

            const config = await configManager.getConfig(guild);

            const { phising, spam, flood, text, image } = config?.automod;

            const embed = new EmbedBuilder()
                .setAuthor({ name: `Auto-modération`, iconURL: guild.iconURL() })
                .setDescription(`Statut des modules d'auto-modération`)
                .setColor(Colors.Orange)
                .addFields(
                    { name: `Anti-Phising`, value: phising?.enabled ? `Activé ✅` : `Désactivé ❌`, inline: true },
                    { name: `Anti-Spam`, value: spam?.enabled ? `Activé ✅` : `Désactivé ❌`, inline: true },
                    { name: `Anti-Flood`, value: flood?.enabled ? `Activé ✅` : `Désactivé ❌`, inline: true },
                    { name: `Modération de texte par AI`, value: text?.enabled ? `Activé ✅ - ${text?.policy}` : `Désactivé ❌`, inline: true },
                    { name: `Modération d'image par AI`, value: image?.enabled ? `Activé ✅ - ${image?.policy}` : `Désactivé ❌`, inline: true },
                );


            interaction.reply({ embeds: [embed] });
        }
    }
}