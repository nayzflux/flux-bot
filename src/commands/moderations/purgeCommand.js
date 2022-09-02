const { SlashCommandBuilder, ActionRowBuilder, SlashCommandSubcommandBuilder, SlashCommandChannelOption, ChannelType, SlashCommandStringOption, EmbedBuilder, Colors, SlashCommandIntegerOption, PermissionFlagsBits } = require("discord.js");
const { logs } = require("../../helpers/logsHelper");
const musicHelper = require(`../../helpers/musicHelper`);

module.exports = {
    data: (new SlashCommandBuilder()
        .setName(`purge`)
        .setDescription(`Supprimer un certain nombre de messages`)
        .addIntegerOption(new SlashCommandIntegerOption()
            .setName(`messages`)
            .setDescription(`Nombre de messages à supprimer`)
            .setRequired(true))
    ),
    run: async (client, interaction) => {
        const { guild, member, channel } = interaction;
        const amount = interaction.options.getInteger(`messages`) > 100 ? 100 : interaction.options.getInteger(`messages`);

        if (!member.permissions.has(PermissionFlagsBits.Administrator) && !member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            const permissionMissingEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`Vous n'avez pas l'autorisation d'effectuer cette action`)

            return interaction.reply({ embeds: [permissionMissingEmbed] });
        }

        const messages = await channel.bulkDelete(amount, true);

        const purgedEmbed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setDescription(`${messages.size} ont été supprimé`);

        logs(guild, `${member.user.tag} a supprimé ${messages.size} messages dans ${interaction.channel}`, Colors.Yellow);

        interaction.reply({ embeds: [purgedEmbed] });

        setTimeout(() => {
            interaction.deleteReply().catch(err => console.log(`❌ Impossible de supprimer le message`))
        }, 3 * 1000)
    }
}