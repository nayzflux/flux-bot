const { CommandInteraction, Client, Colors, EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder, PermissionFlagsBits, SlashCommandStringOption, SlashCommandUserOption, SlashCommandBuilder } = require("discord.js");
const warnManager = require(`../../managers/warnManager`);

module.exports = {
    data: (new SlashCommandBuilder()
        .setName(`warn`)
        .setDescription(`Avertir un membre`)
        .addUserOption(new SlashCommandUserOption()
            .setName(`membre`)
            .setDescription(`Membre à avertir`)
            .setRequired(true))
        .addStringOption(new SlashCommandStringOption()
            .setName(`raison`)
            .setDescription(`Raison de l'avertissement`)
            .setRequired(true))
    ),
    run: async (client, interaction) => {
        const { member } = interaction;
        const target = interaction.options.getMember(`membre`);
        const reason = interaction.options.getString(`raison`);

        if (!member.permissions.has(PermissionFlagsBits.Administrator) && !member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            const permissionMissingEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`Vous n'avez pas l'autorisation d'effectuer cette action`)

            return interaction.reply({ embeds: [permissionMissingEmbed] });
        }

        if (target.user.id === member.user.id) {
            const unableToWarnYourself = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`Vous ne pouvez pas vous avertir vous même`);

            return interaction.reply({ embeds: [unableToWarnYourself] });
        }

        if (target.roles.highest.position >= member.roles.highest.position) {
            const unableToWarnMemberEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`Vous ne pouvez pas avertir ${target}`);

            return interaction.reply({ embeds: [unableToWarnMemberEmbed] });
        }

        if (!target.manageable || !target.moderatable) {
            const unableToWarnMemberEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`${target} ne peut pas être averti`);

            return interaction.reply({ embeds: [unableToWarnMemberEmbed] });
        }

        await warnManager.warn(target, member, reason);

        const targetWarnedConfirmationEmbed = new EmbedBuilder()
            .setColor(Colors.Yellow)
            .setDescription(`${target} a été averti pour ${reason}`);

        return interaction.reply({ embeds: [targetWarnedConfirmationEmbed] });
    }
}