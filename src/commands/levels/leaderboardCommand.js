const { SlashCommandBuilder, ActionRowBuilder, SlashCommandSubcommandBuilder, SlashCommandUserOption, SlashCommandIntegerOption, EmbedBuilder, Colors, PermissionFlagsBits } = require("discord.js");
const levelManager = require(`../../managers/levelManager`);

module.exports = {
    category: {
        name: `Niveau & XP`,
        emoji: `📊`
    },
    data: (new SlashCommandBuilder()
        .setName(`leaderboard`)
        .setDescription(`Voir le classement du serveur`)
    ),
    run: async (client, interaction) => {
        const leaderboards = await levelManager.getLeaderboard(interaction.guild);

        if (!leaderboards) {
            const noLeaderboard = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`Le classement est vide`);

            return interaction.reply({ embeds: [noLeaderboard] });
        }

        const leaderboard = new EmbedBuilder()
            .setColor(Colors.Fuchsia)
            .setAuthor({ name: `Classement:`, iconURL: interaction.guild.iconURL() });

        let i = 0;
        let str = ``;

        for (level of leaderboards) {
            try {
                const member = await interaction.guild.members.fetch(level.userId);

                if (member) {
                    i++;

                    if (i === 1) {
                        str = str + `🥇 - ${member} ${level.level} (${level.xp} XP)\n`
                    }

                    if (i === 2) {
                        str = str + `🥈 - ${member} ${level.level} (${level.xp} XP)\n`
                    }

                    if (i === 3) {
                        str = str + `🥉 - ${member} ${level.level} (${level.xp} XP)\n`
                    }


                    if (i === 4) {
                        str = str + `4️⃣ - ${member} ${level.level} (${level.xp} XP)\n`
                    }

                    if (i === 5) {
                        str = str + `5️⃣ - ${member} ${level.level} (${level.xp} XP)\n`
                    }

                    if (i !== 1 && i !== 2 && i !== 3 && i !== 4 && i !== 5) {
                        str = str + `${i} - ${member} ${level.level} (${level.xp} XP)\n`
                    }
                }
            } catch (err) {
                console.log(`❌ Membre introuvable`);
            }
        }

        leaderboard.setDescription(str);

        return interaction.reply({ embeds: [leaderboard] });
    }
}