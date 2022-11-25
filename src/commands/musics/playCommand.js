const { SlashCommandBuilder, ActionRowBuilder, SlashCommandSubcommandBuilder, SlashCommandChannelOption, ChannelType, SlashCommandStringOption, EmbedBuilder, Colors } = require("discord.js");
const musicHelper = require(`../../helpers/musicHelper`);

module.exports = {
    category: {
        name: `Musique`,
        emoji: `🎧`
    },
    data: (new SlashCommandBuilder()
        .setName(`play`)
        .setDescription(`Jouer de la musique`)
        .addStringOption(new SlashCommandStringOption()
            .setName(`musique`)
            .setDescription(`URL ou titre de la musique`)
            .setRequired(true))
    ),
    run: async (client, interaction) => {
        const { guild, member } = interaction;
        const voiceChannel = member.voice.channel;
        const query = interaction.options.getString(`musique`);

        await interaction.deferReply();

        if (!voiceChannel) {
            const channelErrorEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`Vous devez être dans un salon vocal pour utilisé les fonctionnalitées de musique`)

            return interaction.editReply({ embeds: [channelErrorEmbed] });
        }

        if (musicHelper.isUrl(query)) {
            if (musicHelper.isSpotifyUrl(query)) {
                if (await musicHelper.isValidPlaylistUrl(query)) {
                    const songs = await musicHelper.getSongsFromPlaylist(query);

                    for (const song of songs) {
                        const stream = musicHelper.download(song);

                        stream.on(`finish`, () => {
                            musicHelper.addSong(guild.id, song);
                            const isPlaying = musicHelper.play(guild.id, voiceChannel);

                            if (isPlaying) {
                                const songPlayingNowEmbed = new EmbedBuilder()
                                    .setColor(Colors.Aqua)
                                    .setAuthor({ name: `En cours de lecture... 🎵` })
                                    .setDescription(`[${song.title}](${song.url})`)
                                    .setThumbnail(song.thumbnail)
                                    .addFields({ name: `Par`, value: `${song.publisher}`, inline: true }, { name: `Durée`, value: `\`${song.duration}\``, inline: true })

                                return interaction.editReply({ embeds: [songPlayingNowEmbed] });
                            } else {
                                const songPlayingNowEmbed = new EmbedBuilder()
                                    .setColor(Colors.Aqua)
                                    .setAuthor({ name: `Ajoutée dans la file de lecture 🎵` })
                                    .setDescription(`[${song.title}](${song.url})`)
                                    .setThumbnail(song.thumbnail)
                                    .addFields({ name: `Par`, value: `${song.publisher}`, inline: true }, { name: `Durée`, value: `\`${song.duration}\``, inline: true })

                                return interaction.editReply({ embeds: [songPlayingNowEmbed] });
                            }
                        });
                    }

                    return;
                }

                if (await musicHelper.isValidTrackUrl(query)) {
                    const song = await musicHelper.getSongFromTrack(query);

                    if (!song) return interaction.editReply(`❌ Musique introuvable`);

                    const stream = musicHelper.download(song);

                    stream.on(`finish`, () => {
                        musicHelper.addSong(guild.id, song);
                        const isPlaying = musicHelper.play(guild.id, voiceChannel);

                        if (isPlaying) {
                            const songPlayingNowEmbed = new EmbedBuilder()
                                .setColor(Colors.Aqua)
                                .setAuthor({ name: `En cours de lecture... 🎵` })
                                .setDescription(`[${song.title}](${song.url})`)
                                .setThumbnail(song.thumbnail)
                                .addFields({ name: `Par`, value: `${song.publisher}`, inline: true }, { name: `Durée`, value: `\`${song.duration}\``, inline: true })

                            return interaction.editReply({ embeds: [songPlayingNowEmbed] });
                        } else {
                            const songPlayingNowEmbed = new EmbedBuilder()
                                .setColor(Colors.Aqua)
                                .setAuthor({ name: `Ajoutée dans la file de lecture 🎵` })
                                .setDescription(`[${song.title}](${song.url})`)
                                .setThumbnail(song.thumbnail)
                                .addFields({ name: `Par`, value: `${song.publisher}`, inline: true }, { name: `Durée`, value: `\`${song.duration}\``, inline: true })

                            return interaction.editReply({ embeds: [songPlayingNowEmbed] });
                        }
                    });

                    return;
                }
            }

            if (musicHelper.isYoutubeUrl(query)) {
                console.log("youtube");

                const song = await musicHelper.search(query);

                console.log(song, query);

                if (!song) return interaction.editReply(`❌ Musique introuvable`);

                const stream = musicHelper.download(song);

                console.log("stream");

                stream.on(`finish`, () => {
                    musicHelper.addSong(guild.id, song);
                    const isPlaying = musicHelper.play(guild.id, voiceChannel);

                    if (isPlaying) {
                        const songPlayingNowEmbed = new EmbedBuilder()
                            .setColor(Colors.Aqua)
                            .setAuthor({ name: `En cours de lecture... 🎵` })
                            .setDescription(`[${song.title}](${song.url})`)
                            .setThumbnail(song.thumbnail)
                            .addFields({ name: `Par`, value: `${song.publisher}`, inline: true }, { name: `Durée`, value: `\`${song.duration}\``, inline: true })

                        return interaction.editReply({ embeds: [songPlayingNowEmbed] });
                    } else {
                        const songPlayingNowEmbed = new EmbedBuilder()
                            .setColor(Colors.Aqua)
                            .setAuthor({ name: `Ajoutée dans la file de lecture 🎵` })
                            .setDescription(`[${song.title}](${song.url})`)
                            .setThumbnail(song.thumbnail)
                            .addFields({ name: `Par`, value: `${song.publisher}`, inline: true }, { name: `Durée`, value: `\`${song.duration}\``, inline: true })

                        return interaction.editReply({ embeds: [songPlayingNowEmbed] });
                    }
                });
                
                return;
            }
        } else {
            const song = await musicHelper.search(query);

            if (!song) return interaction.editReply(`❌ Musique introuvable`);

            const stream = musicHelper.download(song);

            stream.on(`finish`, () => {
                musicHelper.addSong(guild.id, song);
                const isPlaying = musicHelper.play(guild.id, voiceChannel);

                if (isPlaying) {
                    const songPlayingNowEmbed = new EmbedBuilder()
                        .setColor(Colors.Aqua)
                        .setAuthor({ name: `En cours de lecture... 🎵` })
                        .setDescription(`[${song.title}](${song.url})`)
                        .setThumbnail(song.thumbnail)
                        .addFields({ name: `Par`, value: `${song.publisher}`, inline: true }, { name: `Durée`, value: `\`${song.duration}\``, inline: true })

                    return interaction.editReply({ embeds: [songPlayingNowEmbed] });
                } else {
                    const songPlayingNowEmbed = new EmbedBuilder()
                        .setColor(Colors.Aqua)
                        .setAuthor({ name: `Ajoutée dans la file de lecture 🎵` })
                        .setDescription(`[${song.title}](${song.url})`)
                        .setThumbnail(song.thumbnail)
                        .addFields({ name: `Par`, value: `${song.publisher}`, inline: true }, { name: `Durée`, value: `\`${song.duration}\``, inline: true })

                    return interaction.editReply({ embeds: [songPlayingNowEmbed] });
                }
            });

            return;
        }

        const urlNotSupported = new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(`L'URL n'est pas supportée`)

        return interaction.editReply({ embeds: [urlNotSupported] });
    }
}
