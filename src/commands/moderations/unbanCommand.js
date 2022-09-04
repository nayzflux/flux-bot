const { CommandInteraction, Client, Colors, EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder, PermissionFlagsBits, SlashCommandStringOption, SlashCommandUserOption, SlashCommandBuilder } = require("discord.js");
const banManager = require(`../../managers/banManager`);
const tempbanManager = require(`../../managers/tempbanManager`);
const ms = require(`ms`);
const moment = require(`moment`);

module.exports = {
    category: {
        name: `Modération`,
        emoji: `⛔`
    },
    data: (new SlashCommandBuilder()
        .setName(`unban`)
        .setDescription(`Débannir un utilisateur`)
        .addStringOption(new SlashCommandStringOption()
            .setName(`utilisateur`)
            .setDescription(`ID ou Tag de l'utilisateur`)
            .setRequired(true))
    ),
    run: async (client, interaction) => {
        const { member, guild } = interaction;
        const targetUsernameOrId = interaction.options.getString(`utilisateur`);

        if (!member.permissions.has(PermissionFlagsBits.Administrator) && !member.permissions.has(PermissionFlagsBits.BanMembers)) {
            const permissionMissingEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`Vous n'avez pas l'autorisation d'effectuer cette action`)

            return interaction.reply({ embeds: [permissionMissingEmbed] });
        }

        const bans = await guild.bans.fetch();
        const ban = bans.find(b => b.user.id === targetUsernameOrId || b.user.tag === targetUsernameOrId);

        if (!ban) {
            const banNotFound = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`${targetUsernameOrId} n'est pas banni`)

            return interaction.reply({ embeds: [banNotFound] });
        }

        if (!ban.reason.includes(`Expires le`)) {
            // Bannissement définitif
            await banManager.unban(guild, ban.user, `Manuel`);
        } else {
            // Bannissement temporaire
            await tempbanManager.unban(guild, ban.user, `Manuel`);
        }

        const targetUnbannedConfirmationEmbed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setDescription(`${targetUsernameOrId} a été débanni`);

        return interaction.reply({ embeds: [targetUnbannedConfirmationEmbed] });
    }
}