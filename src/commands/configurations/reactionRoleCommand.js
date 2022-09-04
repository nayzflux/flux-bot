const { SlashCommandBuilder, ActionRowBuilder, SlashCommandSubcommandBuilder, SlashCommandChannelOption, ChannelType, PermissionFlagsBits, Colors, Embed, EmbedBuilder, SlashCommandStringOption, SlashCommandRoleOption } = require("discord.js");
const { logs } = require("../../helpers/logsHelper");
const reactionRoleManager = require(`../../managers/reactionRoleManager`);

module.exports = {
    category: {
        name: `Configuration`,
        emoji: `⚙️`
    },
    // /reaction-role add [channel] [message] [emoji] [role]
    data: (new SlashCommandBuilder()
        .setName(`reaction-role`)
        .setDescription(`Configurer le système de rôle réaction`)
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`add`)
                .setDescription(`Ajouter un rôle réaction`)
                .addChannelOption(
                    new SlashCommandChannelOption()
                        .setName(`salon`)
                        .setDescription(`Salon où se trouve le message`)
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true))
                .addStringOption(
                    new SlashCommandStringOption()
                        .setName(`message`)
                        .setDescription(`ID du message`)
                        .setRequired(true))
                .addStringOption(
                    new SlashCommandStringOption()
                        .setName(`emoji`)
                        .setDescription(`Emoji`)
                        .setRequired(true))
                .addRoleOption(
                    new SlashCommandRoleOption()
                        .setName(`role`)
                        .setDescription(`Rôle à ajouter`)
                        .setRequired(true))
        )
    ),
    run: async (client, interaction) => {
        const subcommand = interaction.options.getSubcommand();
        const { guild, member } = interaction;

        if (subcommand === `add`) {
            const channel = interaction.options.getChannel(`salon`);
            const messageId = interaction.options.getString(`message`);
            const emoji = interaction.options.getString(`emoji`);
            const role = interaction.options.getRole(`role`);

            const message = await channel.messages.fetch(messageId);

            message.react(emoji);

            await reactionRoleManager.addReactionRole(message, emoji, role);

            const embed = new EmbedBuilder()
                .setColor(Colors.Green)
                .setDescription(`Rôle réaction ${role} créer avec succès`);

            interaction.reply({ embeds: [embed] });
        }
    }
}