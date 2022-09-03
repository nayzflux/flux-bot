const { SlashCommandBuilder, ActionRowBuilder, SlashCommandSubcommandBuilder, SlashCommandChannelOption, ChannelType, PermissionFlagsBits, Colors, Embed, EmbedBuilder, SlashCommandStringOption, SlashCommandRoleOption, SlashCommandIntegerOption } = require("discord.js");
const rewardManager = require(`../../managers/rewardManager`);

module.exports = {
    data: (new SlashCommandBuilder()
        .setName(`reward`)
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`set`)
                .setDescription(`Définir une récompense de niveau`)
                .addIntegerOption(
                    new SlashCommandIntegerOption()
                        .setName(`niveau`)
                        .setDescription(`Niveau pour recevoir le rôle`)
                        .setRequired(true))
                .addRoleOption(
                    new SlashCommandRoleOption()
                        .setName(`role`)
                        .setDescription(`Rôle à donner au membre`)
                        .setRequired(true)))
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`delete`)
                .setDescription(`Supprimer une récompense de niveau`)
                .addIntegerOption(
                    new SlashCommandIntegerOption()
                        .setName(`niveau`)
                        .setDescription(`Niveau de la récompense`)
                        .setRequired(true)))
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`list`)
                .setDescription(`Lister les récompenses de niveau`))
        .setDescription(`Définir les récompenses de niveaux`)
    ),
    run: async (client, interaction) => {
        const { member, guild } = interaction;
        const subcommand = interaction.options.getSubcommand();
        const role = interaction.options.getRole(`role`);
        const level = interaction.options.getInteger(`niveau`);

        if (subcommand === `list`) {
            const rewards = await rewardManager.getRewards(guild);

            if (rewards.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setDescription(`Il n'y a aucune de récompense de niveau`);

                interaction.reply({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                    .setColor(Colors.Fuchsia)
                    .setAuthor({ name: `Liste des récompenses de niveaux`, iconURL: guild.iconURL() });

                let str = ``;

                for (const reward of rewards) {
                    const role = await guild.roles.fetch(reward.roleId);

                    if (role) {
                        str = str + `${reward.level} - ${role}\n`
                    }
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

            rewardManager.add(level, role);

            const embed = new EmbedBuilder()
                .setColor(Colors.Green)
                .setDescription(`${role} définie comme récompense de niveau ${level}`);

            interaction.reply({ embeds: [embed] });
        }

        if (subcommand === `delete`) {
            if (!member.permissions.has(PermissionFlagsBits.Administrator) && !member.permissions.has(PermissionFlagsBits.ManageGuild)) {
                const permissionMissingEmbed = new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setDescription(`Vous n'avez pas l'autorisation d'effectuer cette action`)

                return interaction.reply({ embeds: [permissionMissingEmbed] });
            }

            rewardManager.remove(level);

            const embed = new EmbedBuilder()
                .setColor(Colors.Green)
                .setDescription(`Récompense de niveau ${level} supprimé`);

            interaction.reply({ embeds: [embed] });
        }
    }
}