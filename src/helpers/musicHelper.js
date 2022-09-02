const ytSearch = require(`yt-search`);
const ytdl = require(`ytdl-core`);
const fs = require(`fs`);
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require(`@discordjs/voice`);
const axios = require(`axios`)
const queue = new Map();

const DOWLOAD_PATH = `./temp/musics/`;

const clearText = (text) => {
    return text
        .replaceAll(`"`, ``)
        .replaceAll(`'`, ``)
        .replaceAll("`", ``)
        .replaceAll(`/`, ``)
        .replaceAll(`\\`, ``)
        .replaceAll(`|`, ``)
        .replaceAll(`[`, ``)
        .replaceAll(`]`, ``)
        .replaceAll(`{`, ``)
        .replaceAll(`}`, ``)
        .replaceAll(`$`, ``)
        .replaceAll(`*`, ``)
        .replaceAll(`%`, ``)
        .replaceAll(`@`, ``)
        .replaceAll(`¨`, ``)
        .replaceAll(`~`, ``)
        .replaceAll(`¤`, ``)
        .replaceAll(`£`, ``)
        .replaceAll(`€`, ``)
        .replaceAll(`:`, ``)
        .replaceAll(`§`, ``)
        .replaceAll(`<`, ``)
        .replaceAll(`>`, ``)
        .replaceAll(`²`, ``)
}

const isUrl = (text) => {
    if (text.split(` `).length === 1) {
        if (text.startsWith(`https://`) || text.startsWith(`http://`)) {
            return true;
        }
    }

    return false;
}

const isSpotifyUrl = (text) => {
    if (text.startsWith(`https://open.spotify.com`) || text.startsWith(`http://open.spotify.com`)) {
        return true;
    }

    return false;
}

const isYoutubeUrl = (text) => {
    if (text.startsWith(`https://www.youtube.com`) || text.startsWith(`http://www.youtube.com`) || text.startsWith(`https://youtu.be`) || text.startsWith(`http://youtu.be`)) {
        return true;
    }

    return false;
}

const search = async (query) => {
    const result = await ytSearch(query);
    const video = result.videos[0];

    console.log(`[MUSIC] 🔎 Searching ${query}...`);

    if (video) {
        const song = { title: clearText(video.title), publisher: clearText(video.author.name), url: video.url, duration: video.duration, thumbnail: video.thumbnail }
        return song;
    }

    return null;
}

const download = (song) => {
    if (!fs.existsSync(`./temp`)) fs.mkdirSync(`./temp`);
    if (!fs.existsSync(`./temp/musics`)) fs.mkdirSync(`./temp/musics`);

    if (fs.existsSync(`${DOWLOAD_PATH}${song.title}-${song.publisher}.mp3`)) {
        console.log(`🆗 ${song.title} trouvée dans le cache`);
        return;
    }

    try {
        const stream = ytdl(song.url, { filter: `audioonly`, quality: `highestaudio` });

        console.log(`⏬ Téléchargement de ${song.title} démarré...`);

        // download music
        stream.pipe(fs.createWriteStream(`${DOWLOAD_PATH}${song.title}-${song.publisher}.mp3`));

        console.log(`⏬ Téléchargement de ${song.title} terminé...`);

        return;
    } catch (err) {
        console.log(`❌ Erreur lors du téléchargement de ${song.title}`);
        return;
    }
}

const addSong = (guildId, song) => {
    const serverQueue = queue.get(guildId);

    if (!serverQueue) {
        const queueContructor = {
            connection: null,
            audioPlayer: null,
            songs: [],
            isPaused: false
        }

        queue.set(guildId, queueContructor);
        console.log(`[MUSIC] 🔁 ${guildId}'s queue created`);

        queueContructor.songs.push(song);
        console.log(`[MUSIC] 👌 Song ${song.title} added to queue`);
    }

    if (serverQueue) {
        serverQueue.songs.push(song);
        console.log(`[MUSIC] 👌 Song ${song.title} added to queue`);
    }
}

const play = (guildId, voiceChannel) => {
    const serverQueue = queue.get(guildId);

    if (!serverQueue) return;

    if (!serverQueue.connection) {
        // initialiaze connection and audio player
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: guildId,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });

        console.log(`[MUSIC] 👌 Connection ethablished`);

        const audioPlayer = createAudioPlayer();
        const subscription = connection.subscribe(audioPlayer);

        console.log(`[MUSIC] 👌 Audio player created and attached to connection`);

        serverQueue.connection = connection;
        serverQueue.audioPlayer = audioPlayer;

        const song = serverQueue.songs[0];

        // play first song
        const audioRessource = createAudioResource(`${DOWLOAD_PATH}${song.title}-${song.publisher}.mp3`);
        serverQueue.audioPlayer.play(audioRessource);

        console.log(`[MUSIC] 🎵 Playing ${song.title}`);

        // when a song finished play next 
        serverQueue.audioPlayer.on(AudioPlayerStatus.Idle, () => {
            console.log(`idle`);

            // remove old song
            serverQueue.songs.shift();
            console.log(`[MUSIC] ➖ Previous song removed`);

            // there are no next song
            if (serverQueue.songs.length === 0) {
                serverQueue.audioPlayer.stop();
                serverQueue.connection.disconnect()
                serverQueue.connection.destroy();

                serverQueue.connection = null;
                serverQueue.audioPlayer = null;

                console.log(`[MUSIC] 🤖 No next song`);
            }

            // play next song
            if (serverQueue.songs.length > 0) {
                const newSong = serverQueue.songs[0];

                const newAudioRessource = createAudioResource(`${DOWLOAD_PATH}${newSong.title}-${newSong.publisher}.mp3`);
                serverQueue.audioPlayer.play(newAudioRessource);

                console.log(`[MUSIC] 🎵 Playing ${newSong.title}`);
            }
        });

        return true;
    } else {
        return false;
    }
}

const clearQueue = (guildId) => {
    const serverQueue = queue.get(guildId);

    if (!serverQueue) return null;
    if (!serverQueue.connection) return null;
    if (!serverQueue.audioPlayer) return null;
    if (!serverQueue.songs[0]) return null;

    serverQueue.songs = [serverQueue.songs[0]];

    return true;
}

const togglePause = (guildId) => {
    const serverQueue = queue.get(guildId);

    if (!serverQueue) return null;
    if (!serverQueue.connection) return null;
    if (!serverQueue.audioPlayer) return null;
    if (!serverQueue.songs[0]) return null;

    if (serverQueue.isPaused) {
        serverQueue.audioPlayer.unpause();

        serverQueue.isPaused = false;

        console.log(`[MUSIC] 🤖 Audio player unpaused`);

        return false;
    } else {
        serverQueue.audioPlayer.pause();

        serverQueue.isPaused = true;

        console.log(`[MUSIC] 🤖 Audio player paused`);

        return true;
    }
}

const skip = (guildId) => {
    const serverQueue = queue.get(guildId);

    if (!serverQueue) return null;
    if (!serverQueue.connection) return null;
    if (!serverQueue.audioPlayer) return null;
    if (!serverQueue.songs[0]) return null;

    console.log(`[MUSIC] ⏭️ Skipping...`);

    // remove old song
    serverQueue.songs.shift();
    console.log(`[MUSIC] ➖ Previous song removed`);

    // there are no next song
    if (serverQueue.songs.length === 0) {
        serverQueue.audioPlayer.stop();
        serverQueue.connection.disconnect()
        serverQueue.connection.destroy();

        serverQueue.connection = null;
        serverQueue.audioPlayer = null;

        console.log(`[MUSIC] 🤖 No next song`);

        return null;
    }

    // play next song
    if (serverQueue.songs.length > 0) {
        const newSong = serverQueue.songs[0];

        const newAudioRessource = createAudioResource(`${DOWLOAD_PATH}${newSong.title}-${newSong.publisher}.mp3`);
        serverQueue.audioPlayer.play(newAudioRessource);

        console.log(`[MUSIC] 🎵 Playing ${newSong.title}`);

        return newSong;
    }
}

const stop = (guildId) => {
    const serverQueue = queue.get(guildId);

    if (!serverQueue) return null;
    if (!serverQueue.connection) return null;
    if (!serverQueue.audioPlayer) return null;
    if (!serverQueue.songs[0]) return null;

    // disconnect
    serverQueue.audioPlayer.stop();
    serverQueue.connection.disconnect()
    serverQueue.connection.destroy();

    // clear server queue
    serverQueue.connection = null;
    serverQueue.audioPlayer = null;
    serverQueue.songs = [];

    console.log(`[MUSIC] ⛔ Playing stopped`);

    return true;
}

const getServerQueue = (guildId) => {
    const serverQueue = queue.get(guildId);

    if (!serverQueue) return;
    if (!serverQueue.connection) return;
    if (!serverQueue.audioPlayer) return;

    return;
}

const getToken = async () => {
    const response = await axios.request(
        {
            url: `https://accounts.spotify.com/api/token?grant_type=client_credentials`,
            method: `POST`,
            headers: {
                Authorization: `Basic ` + (new Buffer(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')),
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
    );

    const data = await response.data;

    return data.access_token;
}

const getSongFromTrack = async (link) => {
    const trackId = await getTrackIdFromLink(link);
    const token = await getToken();

    try {
        const response = await axios.request(
            {
                url: `https://api.spotify.com/v1/tracks?ids=${trackId}&market=FR`,
                method: `GET`,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.data;

        for (const track of data.tracks) {
            const artists = track.artists;
            let str = track.name;

            for (i in artists) {
                str = `${str} ${artists[i].name}`
            }

            console.log(`🔥 Importing ${str} from Spotify...`);

            // get song
            const song = await search(str);
            return song;
        }
    } catch (err) {
        return null;
    }
}

const getSongsFromPlaylist = async (link) => {
    const playlistId = await getPlaylistIdFromLink(link);
    const token = await getToken();

    try {
        const response = await axios.request(
            {
                method: `GET`,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.data;

        console.log(`[PLAYLIST] » Loading playlist ${data.name} by ${data.owner.display_name} with ${data.tracks.total} track(s)...`);

        const songs = [];

        for (const item of data.tracks.items) {
            const track = item.track;
            let artists = ``;
            const name = track.name;

            for (const artist of track.artists) {
                artists = `${artist.name} `;
            }

            console.log(`[PLAYLIST] » Track ${name} by ${artists}fetched!`);

            // get song
            const song = await search(`${name} ${artists}`);
            songs.push(song);
            // await search(`${name} ${artists}`, (err, song) => {
            //     songs.push(song);

            //     console.log(`[PLAYLIST] » Song ${song.title} by ${song.publisher} found!`);
            // });
        }

        return songs;
    } catch (err) {
        return null;
    }
}

/**
 * Transform
 * https://open.spotify.com/track/4mmJ9f97Yr1E7YuEu92ir2?si=b95a9a73395147e2
 * to
 * 4mmJ9f97Yr1E7YuEu92ir2
 */
const getTrackIdFromLink = async (link) => {
    if (link.split(`/`).length >= 4 && link.split(`/`)[4].split(`?`).length >= 1) {
        if (link.split(`/`).length >= 4) {
            const trackId = link.split(`/`)[4].split(`?`)[0];
            return trackId;
        }
    }
    return null;
}

const getPlaylistIdFromLink = async (link) => {
    if (link.split(`/`).length >= 4 && link.split(`/`)[4].split(`?`).length >= 1) {
        if (link.split(`/`).length >= 4) {
            const trackId = link.split(`/`)[4].split(`?`)[0];
            return trackId;
        }
    }
    return null;
}

const isValidTrackUrl = async (link) => {
    if (!link.startsWith(`https://open.spotify.com/track/`)) return false;
    if (await getTrackIdFromLink(link) === null) return false;
    else return true;
}

const isValidPlaylistUrl = async (link) => {
    if (!link.startsWith(`https://open.spotify.com/playlist/`)) return false;
    if (await getPlaylistIdFromLink(link) === null) return false;
    else return true;
}

const getFromYouTubeLink = async (link) => {
    if (ytdl.validateURL(link)) {
        let info = await ytdl.getInfo(link);
        return { title: clearText(info.videoDetails.title), url: info.videoDetails.video_url, publisher: clearText(info.videoDetails.ownerChannelName) };
    }

    return null;
}


module.exports = {
    isUrl,
    isSpotifyUrl,
    isYoutubeUrl,
    search,
    download,
    addSong,
    play,
    togglePause,
    skip,
    stop,
    getServerQueue,
    isValidTrackUrl,
    getSongFromTrack,
    getFromYouTubeLink,
    isValidPlaylistUrl,
    getSongsFromPlaylist,
    clearQueue
}