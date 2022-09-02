const { CommandInteraction, Client, Colors, EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder, PermissionFlagsBits, SlashCommandStringOption, SlashCommandUserOption, SlashCommandBuilder } = require("discord.js");
const kickManager = require(`../../managers/kickManager`);

module.exports = {
    data: (new SlashCommandBuilder()
        .setName(`kick`)
        .setDescription(`Expulser un membre`)
        .addUserOption(new SlashCommandUserOption()
            .setName(`membre`)
            .setDescription(`Membre à expulser`)
            .setRequired(true))
        .addStringOption(new SlashCommandStringOption()
            .setName(`raison`)
            .setDescription(`Raison de l'expulsion`)
            .setRequired(true))
    ),
    run: async (client, interaction) => {
        const { member } = interaction;
        const target = interaction.options.getMember(`membre`);
        const reason = interaction.options.getString(`raison`);

        if (!member.permissions.has(PermissionFlagsBits.Administrator) && !member.permissions.has(PermissionFlagsBits.KickMembers)) {
            const permissionMissingEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`Vous n'avez pas l'autorisation d'effectuer cette action`)

            return interaction.reply({ embeds: [permissionMissingEmbed] });
        }

        if (target.user.id === member.user.id) {
            const unableToKickYourself = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`Vous ne pouvez pas vous expulser vous même`);

            return interaction.reply({ embeds: [unableToKickYourself] });
        }

        if (target.roles.highest.position >= member.roles.highest.position) {
            const unableToKickMemberEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`Vous ne pouvez pas expulser ${target}`);

            return interaction.reply({ embeds: [unableToKickMemberEmbed] });
        }

        if (!target.kickable) {
            const unableToKickMemberEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`${target} ne peut pas être expulser`);

            return interaction.reply({ embeds: [unableToKickMemberEmbed] });
        }

        await kickManager.kick(target, member, reason);

        const targetKickedConfirmationEmbed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(`${target} a été expulsé pour ${reason}`);

        return interaction.reply({ embeds: [targetKickedConfirmationEmbed] });
    }
}