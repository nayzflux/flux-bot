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
                        .setRequired(true)))
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`remove`)
                .setDescription(`Retirer un rôle réaction`)
                .addStringOption(
                    new SlashCommandStringOption()
                        .setName(`id`)
                        .setDescription(`ID du rôle réaction`)
                        .setRequired(true)))
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(`list`)
                .setDescription(`Afficher les rôles réactions`))
    ),
    run: async (client, interaction) => {
        const subcommand = interaction.options.getSubcommand();
        const { guild, member } = interaction;

        if (!member.permissions.has(PermissionFlagsBits.Administrator) && !member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            const embed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`Vous n'avez pas l'autorisation d'effectuer cette action`)

            return interaction.reply({ embeds: [embed] });
        }

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
                .setDescription(`Rôle réaction ${role} pour ${emoji} créer avec succès`);

            return interaction.reply({ embeds: [embed] });
        }

        if (subcommand === `remove`) {
            const reactionRoleId = interaction.options.getString(`id`);
            const reactionRole = await reactionRoleManager.getReactionRoleById(reactionRoleId);

            if (!reactionRole) {
                const embed = new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setDescription(`Aucun rôle réaction n'existe avec l'ID ${reactionRoleId}`);

                return interaction.reply({ embeds: [embed] });
            }

            await reactionRoleManager.removeReactionRole(reactionRoleId);

            const embed = new EmbedBuilder()
                .setColor(Colors.Green)
                .setDescription(`Rôle réaction <@&${reactionRole.roleId}> pour ${reactionRole.emoji} supprimer avec succès`);

            return interaction.reply({ embeds: [embed] });
        }

        if (subcommand === `list`) {
            const reactionRoles = await reactionRoleManager.getReactionRoles(guild);

            if (!reactionRoles) {
                const embed = new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setDescription(`Il n'y aucun rôle réaction`);

                return interaction.reply({ embeds: [embed] });
            }

            const embed = new EmbedBuilder()
                .setColor(Colors.Green)
                .setAuthor({iconURL: guild.iconURL(), name: `• Liste des rôles réactions`});

            let str = ``;

            for (const reactionRole of reactionRoles) {
                str = str + `\`${reactionRole._id}\` | <#${reactionRole.channelId}> <@&${reactionRole.roleId}> ${reactionRole.emoji}\n \n`
            }

            embed.setDescription(str);

            return interaction.reply({ embeds: [embed] });
        }
    }
}