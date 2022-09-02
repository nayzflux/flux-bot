const { SlashCommandBuilder, ActionRowBuilder, SlashCommandSubcommandBuilder, SlashCommandUserOption, SlashCommandIntegerOption, EmbedBuilder, Colors, PermissionFlagsBits } = require("discord.js");
const levelManager = require(`../../managers/levelManager`);

module.exports = {
    data: (new SlashCommandBuilder()
        .setName(`level`)
        .setDescription(`Gérer le système de niveau`)
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName(`add`)
            .setDescription(`Ajouter un ou plusieurs niveaux au membre`)
            .addUserOption(new SlashCommandUserOption()
                .setName(`membre`)
                .setDescription(`Le membre dont vous voulez ajouter un ou plusieurs niveaux`)
                .setRequired(true))
            .addIntegerOption(new SlashCommandIntegerOption()
                .setName(`nombre`)
                .setDescription(`Nombre de niveau à ajouter`)
                .setRequired(true)))
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName(`remove`)
            .setDescription(`Retirer un ou plusieurs niveaux au membre`)
            .addUserOption(new SlashCommandUserOption()
                .setName(`membre`)
                .setDescription(`Le membre dont vous voulez retirer un ou plusieurs niveaux`)
                .setRequired(true))
            .addIntegerOption(new SlashCommandIntegerOption()
                .setName(`nombre`)
                .setDescription(`Nombre de niveau à retirer`)
                .setRequired(true)))
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName(`set`)
            .setDescription(`Modifier le niveau du membre`)
            .addUserOption(new SlashCommandUserOption()
                .setName(`membre`)
                .setDescription(`Le membre dont vous voulez modifier son niveau`)
                .setRequired(true))
            .addIntegerOption(new SlashCommandIntegerOption()
                .setName(`nombre`)
                .setDescription(`Niveau du membre`)
                .setRequired(true)))
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName(`show`)
            .setDescription(`Voir le niveau du membre`)
            .addUserOption(new SlashCommandUserOption()
                .setName(`membre`)
                .setDescription(`Le membre dont vous voulez voir le niveau`)
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

                const level1 = await levelManager.addLevel(target, amount);

                const levelAddedEmbed = new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setDescription(`Le niveau de ${target} est désormais ${level1.level} (${level1.xp} XP)`);

                interaction.reply({ embeds: [levelAddedEmbed] });
                break;
            case `remove`:
                if (!member.permissions.has(PermissionFlagsBits.Administrator) && !member.permissions.has(PermissionFlagsBits.ManageGuild)) {
                    const permissionMissingEmbed = new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(`Vous n'avez pas l'autorisation d'effectuer cette action`)
        
                    return interaction.reply({ embeds: [permissionMissingEmbed] });
                }

                const level2 = await levelManager.removeLevel(target, amount);

                const levelRemovedEmbed = new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setDescription(`Le niveau de ${target} est désormais ${level2.level} (${level2.xp} XP)`);

                interaction.reply({ embeds: [levelRemovedEmbed] });
                break;
            case `set`:
                if (!member.permissions.has(PermissionFlagsBits.Administrator) && !member.permissions.has(PermissionFlagsBits.ManageGuild)) {
                    const permissionMissingEmbed = new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(`Vous n'avez pas l'autorisation d'effectuer cette action`)
        
                    return interaction.reply({ embeds: [permissionMissingEmbed] });
                }

                const level3 = await levelManager.setLevel(target, amount);

                const levelSettedEmbed = new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setDescription(`Le niveau de ${target} est désormais ${level3.level} (${level3.xp} XP)`);

                interaction.reply({ embeds: [levelSettedEmbed] });
                break;
            case `show`:
                const level4 = await levelManager.getLevel(target);

                const levelShowEmbed = new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setDescription(`Le niveau de ${target} est ${level4.level} (${level4.xp} XP)`);

                interaction.reply({ embeds: [levelShowEmbed] });
                break;
            default:
                break
        }
    }
}