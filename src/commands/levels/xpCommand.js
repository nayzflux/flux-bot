const { SlashCommandBuilder, ActionRowBuilder, SlashCommandSubcommandBuilder, SlashCommandUserOption, SlashCommandIntegerOption, EmbedBuilder, Colors, PermissionFlagsBits } = require("discord.js");
const levelManager = require(`../../managers/levelManager`);

module.exports = {
    data: (new SlashCommandBuilder()
        .setName(`xp`)
        .setDescription(`Gérer le système d'XP`)
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName(`add`)
            .setDescription(`Ajouter de l'XP au membre`)
            .addUserOption(new SlashCommandUserOption()
                .setName(`membre`)
                .setDescription(`Le membre dont vous voulez ajouter de l'XP`)
                .setRequired(true))
            .addIntegerOption(new SlashCommandIntegerOption()
                .setName(`nombre`)
                .setDescription(`Nombre d'XP à ajouter`)
                .setRequired(true)))
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName(`remove`)
            .setDescription(`Retirer de l'XP au membre`)
            .addUserOption(new SlashCommandUserOption()
                .setName(`membre`)
                .setDescription(`Le membre dont vous voulez retirer de l'XP`)
                .setRequired(true))
            .addIntegerOption(new SlashCommandIntegerOption()
                .setName(`nombre`)
                .setDescription(`Nombre d'XP à retirer`)
                .setRequired(true)))
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName(`set`)
            .setDescription(`Modifier l'XP du membre`)
            .addUserOption(new SlashCommandUserOption()
                .setName(`membre`)
                .setDescription(`Le membre dont vous voulez modifier l'XP`)
                .setRequired(true))
            .addIntegerOption(new SlashCommandIntegerOption()
                .setName(`nombre`)
                .setDescription(`XP du membre`)
                .setRequired(true)))
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName(`show`)
            .setDescription(`Voir l'XP du membre`)
            .addUserOption(new SlashCommandUserOption()
                .setName(`membre`)
                .setDescription(`Le membre dont vous voulez voir l'XP`)
                .setRequired(true)))
    ),
    run: async (client, interaction) => {
        const {member} = interaction;
        const subcommand = interaction.options.getSubcommand();
        const target = interaction.options.getMember(`membre`);
        const amount = interaction.options.getInteger(`nombre`);

        switch (subcommand) {
            case `add`:
                if (!member.permissions.has(PermissionFlagsBits.Administrator) && !member.permissions.has(PermissionFlagsBits.ManageGuild)) {
                    const permissionMissingEmbed = new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(`Vous n'avez pas l'autorisation d'effectuer cette action`)

                    return interaction.reply({ embeds: [permissionMissingEmbed] });
                }

                const xp1 = await levelManager.addXp(target, amount);

                const xpAddedEmbed = new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setDescription(`Le niveau de ${target} est désormais ${xp1.level} (${xp1.xp} XP)`);

                interaction.reply({ embeds: [xpAddedEmbed] });
                break;
            case `remove`:
                if (!member.permissions.has(PermissionFlagsBits.Administrator) && !member.permissions.has(PermissionFlagsBits.ManageGuild)) {
                    const permissionMissingEmbed = new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(`Vous n'avez pas l'autorisation d'effectuer cette action`)

                    return interaction.reply({ embeds: [permissionMissingEmbed] });
                }

                const xp2 = await levelManager.removeXp(target, amount);

                const xpRemovedEmbed = new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setDescription(`Le niveau de ${target} est désormais ${xp2.level} (${xp2.xp} XP)`);

                interaction.reply({ embeds: [xpRemovedEmbed] });
                break;
            case `set`:
                if (!member.permissions.has(PermissionFlagsBits.Administrator) && !member.permissions.has(PermissionFlagsBits.ManageGuild)) {
                    const permissionMissingEmbed = new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(`Vous n'avez pas l'autorisation d'effectuer cette action`)

                    return interaction.reply({ embeds: [permissionMissingEmbed] });
                }

                const xp3 = await levelManager.setXp(target, amount);

                const xpSettedEmbed = new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setDescription(`Le niveau de ${target} est désormais ${xp3.level} (${xp3.xp} XP)`);

                interaction.reply({ embeds: [xpSettedEmbed] });
                break;
            case `show`:
                const xp4 = await levelManager.getXp(target);

                const xpShowEmbed = new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setDescription(`Le niveau de ${target} est ${xp4.level} (${xp4.xp} XP)`);

                interaction.reply({ embeds: [xpShowEmbed] });
                break;
            default:
                break
        }
    }
}