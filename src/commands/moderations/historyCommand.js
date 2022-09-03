const { CommandInteraction, Client, Colors, EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder, PermissionFlagsBits, SlashCommandStringOption, SlashCommandUserOption, SlashCommandBuilder } = require("discord.js");
const banManager = require(`../../managers/banManager`);
const tempbanManager = require(`../../managers/tempbanManager`);
const kickManager = require(`../../managers/kickManager`);
const muteManager = require(`../../managers/muteManager`);
const warnManager = require(`../../managers/warnManager`);
const ms = require(`ms`);
const moment = require(`moment`);

module.exports = {
    data: (new SlashCommandBuilder()
        .setName(`history`)
        .setDescription(`Voir l'historique de modération d'un membre`)
        .addUserOption(new SlashCommandUserOption()
            .setName(`membre`)
            .setDescription(`Membre`)
            .setRequired(true))
    ),
    run: async (client, interaction) => {
        const { member } = interaction;
        const target = interaction.options.getMember(`membre`);

        if (!member.permissions.has(PermissionFlagsBits.Administrator) && !member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            const permissionMissingEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`Vous n'avez pas l'autorisation d'effectuer cette action`)

            return interaction.reply({ embeds: [permissionMissingEmbed] });
        }

        // Récupérer toutes les sanctions
        const bans = await banManager.getMemberBans(target);
        const tempbans = await tempbanManager.getMemberTempbans(target);
        const kicks = await kickManager.getMemberKicks(target);
        const mutes = await muteManager.getMemberMutes(target);
        const warns = await warnManager.getMemberWarnings(target);

        // Récupérer toutes les infos
        for (const i in bans) {
            const ban = bans[i];

            try {
                const mod = await member.guild.members.fetch(ban.moderatorId) || null;

                ban.name = `🔨 Ban | Cas: ${ban._id}`;
                ban.value = `
                            **Modérateur:** ${mod}
                            **Raison:** ${ban.reason}
                            **Le:** ${moment(ban.createdAt).format(`DD/MM/YY`)}
                `;
            } catch (err) {
                ban.name = `🔨 Ban | Cas: ${ban._id}`;
                ban.value = `
                            **Modérateur:** Inconnu
                            **Raison:** ${ban.reason}
                            **Le:** ${moment(ban.createdAt).format(`DD/MM/YY`)}
                `;
            }
        }

        for (const i in tempbans) {
            const tempban = tempbans[i];

            try {
                const mod = await member.guild.members.fetch(tempban.moderatorId) || null;

                tempban.name = `🔨 Ban (temporaire) | Cas: ${tempban._id}`;
                tempban.value = `
                            **Modérateur:** ${mod}
                            **Raison:** ${tempban.reason}
                            **Le:** ${moment(tempban.createdAt).format(`DD/MM/YY`)}
                            **Jusqu'au:** ${moment(tempban.expiresAt).format(`DD/MM/YY`)}
                `;
            } catch (err) {
                tempban.name = `🔨 Ban (temporaire) | Cas: ${tempban._id}`;
                tempban.value = `
                            **Modérateur:** Inconnu
                            **Raison:** ${tempban.reason}
                            **Le:** ${moment(tempban.createdAt).format(`DD/MM/YY`)}
                            **Jusqu'au:** ${moment(tempban.expiresAt).format(`DD/MM/YY`)}
                `;
            }
        }

        for (const i in kicks) {
            const kick = kicks[i];

            try {
                const mod = await member.guild.members.fetch(kick.moderatorId) || null;

                kick.name = `💨 Kick | Cas: ${kick._id}`;
                kick.value = `
                            **Modérateur:** ${mod}
                            **Raison:** ${kick.reason}
                            **Le:** ${moment(kick.createdAt).format(`DD/MM/YY`)}
                        `;
            } catch (err) {
                kick.name = `💨 Kick | Cas: ${kick._id}`;
                kick.value = `
                            **Modérateur:** Inconnu
                            **Raison:** ${kick.reason}
                            **Le:** ${moment(kick.createdAt).format(`DD/MM/YY`)}
                        `;
            }
        }

        for (i in mutes) {
            const mute = mutes[i];

            try {
                const mod = await member.guild.members.fetch(mute.moderatorId)

                mute.name = `🔇 Mute | Cas: ${mute._id}`;
                mute.value = `
                            **Modérateur:** ${mod}
                            **Raison:** ${mute.reason}
                            **Le:** ${moment(mute.createdAt).format(`DD/MM/YY`)}
                            **Jusqu'au:** ${mute.expiresAt === -1 ? `À vie` : moment(mute.expiresAt).format(`DD/MM/YY`)}
                        `;
            } catch (err) {
                mute.name = `🔇 Mute | Cas: ${mute._id}`;
                mute.value = `
                            **Modérateur:** Inconnu
                            **Raison:** ${mute.reason}
                            **Le:** ${moment(mute.createdAt).format(`DD/MM/YY`)}
                            **Jusqu'au:** ${mute.expiresAt === -1 ? `À vie` : moment(mute.expiresAt).format(`DD/MM/YY`)}
                        `;
            }
        }

        for (i in warns) {
            const warn = warns[i];

            try {
                const mod = await member.guild.members.fetch(warn.moderatorId);

                warn.name = `⚠️ Warn | Cas: ${warn._id}`;
                warn.value = `
                            **Modérateur:** ${mod}
                            **Raison:** ${warn.reason}
                            **Le:** ${moment(warn.createdAt).format(`DD/MM/YY`)}
                        `;
            } catch (err) {
                warn.name = `⚠️ Warn | Cas: ${warn._id}`;
                warn.value = `
                            **Modérateur:** Inconnu
                            **Raison:** ${warn.reason}
                            **Le:** ${moment(warn.createdAt).format(`DD/MM/YY`)}
                        `;
            }
        }


        // Trier toutes les sanctions dans l'ordre chronologique
        const sanctions = []
            .concat(bans)
            .concat(tempbans)
            .concat(kicks)
            .concat(mutes)
            .concat(warns)
            .sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt)
            });

        if (sanctions.length === 0) {
            const noSanction = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`${target} ne possède pas de sanctions`)

            return interaction.reply({ embeds: [noSanction] });
        }

        const historyEmbed = new EmbedBuilder()
            .setColor(Colors.DarkButNotBlack)
            .setAuthor({ name: `📄 Historique de modération de ${target.user.tag}`, iconURL: target.avatarURL() })

        for (const i in sanctions) {
            if (i <= 10) {
                const sanction = sanctions[i];
                historyEmbed.addFields({ name: sanction.name, value: sanction.value });
            }
        }

        interaction.reply({ embeds: [historyEmbed] })
    }
}