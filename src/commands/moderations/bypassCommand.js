const { CommandInteraction, Client, Colors, EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder, PermissionFlagsBits, SlashCommandStringOption, SlashCommandUserOption, SlashCommandBuilder } = require("discord.js");
const { logs } = require("../../helpers/logsHelper");
const configManager = require(`../../managers/configManager`);
const Canvas = require(`canvas`);

module.exports = {
    category: {
        name: `Modération`,
        emoji: `⛔`
    },
    data: (new SlashCommandBuilder()
        .setName(`bypass`)
        .setDescription(`Bypass la verification captcha`)
        .addUserOption(new SlashCommandUserOption()
            .setName(`membre`)
            .setDescription(`Membre`)
            .setRequired(true))
    ),
    run: async (client, interaction) => {
        const { member, guild } = interaction;
        const target = interaction.options.getMember(`membre`);

        if (!member.permissions.has(PermissionFlagsBits.Administrator) && !member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            const permissionMissingEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`Vous n'avez pas l'autorisation d'effectuer cette action`)

            return interaction.reply({ embeds: [permissionMissingEmbed] });
        }

        const config = await configManager.getConfig(guild);

        if (!config?.captcha?.enabled) {
            const permissionMissingEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`Le captcha n'est pas activé`)

            return interaction.reply({ embeds: [permissionMissingEmbed] });
        }

        if (!config?.captcha?.roleId) {
            const permissionMissingEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`Le rôle de captcha n'est pas définie`)

            return interaction.reply({ embeds: [permissionMissingEmbed] });
        }

        if (!config?.captcha?.channelId) {
            const permissionMissingEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`Le salon de captcha n'est pas définie`)

            return interaction.reply({ embeds: [permissionMissingEmbed] });
        }

        const role = await guild.roles.fetch(config.captcha.roleId);
        const channel = await guild.channels.fetch(config.captcha.channelId);

        if (!role) {
            const permissionMissingEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`Le rôle de captcha n'existe plus`)

            return interaction.reply({ embeds: [permissionMissingEmbed] });
        }

        if (!channel) {
            const permissionMissingEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`Le salon de captcha n'existe plus`)

            return interaction.reply({ embeds: [permissionMissingEmbed] });
        }

        // CAPTCHA
        client.bypass.set(target);
        target.roles.add(role).catch(err => console.log(`❌ Impossible de donner le rôle`));
        logs(guild, `${member.user.tag} (${member.user.id}) a bypass la verification anti-robot pour ${target.user.tag} (${target.user.id})`, Colors.Yellow);

        // ======= AUTOROLE ========
        if (config?.autorole?.enabled && config?.autorole?.roleId) {
            const role = await guild.roles.fetch(config.autorole.roleId);

            if (role) {
                target.roles.add(role).catch(err => console.log(`❌ Impossible de donner le rôle`));
                logs(guild, `${target.user.tag} (${target.user.id}) a reçu le role automatique ${role}`, Colors.Green);
            }
        }

        // ======= MESSAGE ========
        if (config?.messages?.join?.enabled && config?.messages?.join?.channelId) {
            const channel = await guild.channels.fetch(config.messages.join.channelId);

            if (channel) {
                const content = config.messages.join.content || `👋 Bienvenue {USER_NAME} passe de bon moment sur {SERVER_NAME}`;

                const canvas = Canvas.createCanvas(1024, 500);
                canvas.context = canvas.getContext(`2d`)
                canvas.context.font = `72px Arial`;
                canvas.context.fillStyle = `#ffffff`;

                Canvas.loadImage(`https://i.ytimg.com/vi/PMJiHJoE0L8/maxresdefault.jpg`)
                    .then(img => {
                        console.log(img);
                        canvas.context.drawImage(img, 0, 0, 1024, 500);
                        canvas.context.fillText(`Bienvenue`, 360, 360);
                        canvas.context.beginPath();
                        canvas.context.arc(512, 166, 128, 0, Math.PI * 2, true);
                        canvas.context.stroke();
                        canvas.context.fill();
                        canvas.context.font = '42px Arial';
                        canvas.context.textAlign = 'center';
                        canvas.context.fillText(target.user.tag.toUpperCase(), 512, 410);
                        canvas.context.font = '32px Arial';
                        canvas.context.fillText(`Vous êtes le membre #${target.guild.memberCount}`, 512, 455);
                        canvas.context.beginPath()
                        canvas.context.arc(512, 166, 119, 0, Math.PI * 2, true);
                        canvas.context.closePath();
                        canvas.context.clip();
                        Canvas.loadImage(target.user.displayAvatarURL({ extension: "jpeg" }))
                            .then(img2 => {
                                canvas.context.drawImage(img2, 393, 47, 238, 238);
                                channel.send({ content: content.replaceAll(`{SERVER_NAME}`, guild.name).replaceAll(`{USER_NAME}`, target), files: [canvas.toBuffer()] })
                            });
                    });
            }
        }

        const targetBannedConfirmationEmbed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setDescription(`Bypass du captcha pour ${target}`);

        return interaction.reply({ embeds: [targetBannedConfirmationEmbed] });
    }
}