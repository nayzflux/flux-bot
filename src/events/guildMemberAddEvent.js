const configManager = require(`../managers/configManager`);
const Canvas = require(`canvas`);
const { EmbedBuilder, Colors } = require('discord.js');
const { logs } = require('../helpers/logsHelper');

module.exports = {
    name: `guildMemberAdd`,
    run: async (client, member) => {
        const { guild } = member;

        const config = await configManager.getConfig(guild);

        // ======= CAPTCHA =========
        if (config?.captcha?.enabled && config?.captcha?.roleId && config?.captcha?.channelId) {
            const role = await guild.roles.fetch(config.captcha.roleId);
            const channel = await guild.channels.fetch(config.captcha.channelId);

            if (role && channel) {
                const { Captcha } = require('captcha-canvas');
                const { writeFileSync } = require('fs');
                const captcha = new Captcha(); //create a captcha canvas of 100x300.
                captcha.async = false //Sync
                captcha.addDecoy(); //Add decoy text on captcha canvas.
                captcha.drawTrace(); //draw trace lines on captcha canvas.
                captcha.drawCaptcha(); //draw captcha text on captcha canvas.
                const code = captcha.text;
                writeFileSync(`./temp/captcha/${code}.png`, captcha.png); //create 'captcha.png' file in your directory.   

                const embed = new EmbedBuilder()
                    .setColor(Colors.Yellow)
                    .setDescription(`Entrer le code présent sur l'image pour accèder au reste du serveur\nSi cela ne fonctionne pas contacter un membre du staff`);

                const filter = async (m) => {
                    if (m.author.bot) return false;
                    if (m.author.id !== member.user.id) return false;
                    return true;
                }

                const m1 = await channel.send({ content: `${member}`, embeds: [embed], files: [{ attachment: `./temp/captcha/${code}.png`, name: `captcha.png` }] });

                const response = await channel.awaitMessages({ filter: filter, max: 1, time: 60 * 1000, errors: [] });

                if (response.first() && response.first().content === code) {
                    response.first().delete().catch(err => console.log(`❌ Impossible de supprimer le message`));
                    m1.delete().catch(err => console.log(`❌ Impossible de supprimer le message`));
                    member.roles.add(role).catch(err => console.log(`❌ Impossible de donner le rôle`));

                    logs(guild, `${member.user.tag} (${member.user.id}) a réussi la verification anti-robot`, Colors.Green);
                } else {
                    if (response.first()) response.first().delete().catch(err => console.log(`❌ Impossible de supprimer le message`));
                    m1.delete().catch(err => console.log(`❌ Impossible de supprimer le message`));
                    const kicked = new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(`La verification anti-robot à échoué, vous avez été expulsé`);
                    await member.send({ embeds: [kicked] }).catch(err => console.log(`❌ Impossible de d'envoyer le message`));
                    member.kick(`La verification anti-robot à échoué`).catch(err => console.log(`❌ Impossible d'expulser le membre`));
                    logs(guild, `${member.user.tag} (${member.user.id}) a échoué la verification anti-robot`, Colors.Red);
                    // INTERROMPRE
                    return;
                }
            }
        }

        // ======= AUTOROLE ========
        if (config?.autorole?.enabled && config?.autorole?.roleId) {
            const role = await guild.roles.fetch(config.autorole.roleId);

            if (role) {
                member.roles.add(role).catch(err => console.log(`❌ Impossible de donner le rôle`));
                logs(guild, `${member.user.tag} (${member.user.id}) a reçu le role automatique ${role}`, Colors.Green);
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
                        canvas.context.fillText(member.user.tag.toUpperCase(), 512, 410);
                        canvas.context.font = '32px Arial';
                        canvas.context.fillText(`Vous êtes le membre #${member.guild.memberCount}`, 512, 455);
                        canvas.context.beginPath()
                        canvas.context.arc(512, 166, 119, 0, Math.PI * 2, true);
                        canvas.context.closePath();
                        canvas.context.clip();
                        Canvas.loadImage(member.user.displayAvatarURL({ extension: "jpeg" }))
                            .then(img2 => {
                                canvas.context.drawImage(img2, 393, 47, 238, 238);
                                channel.send({ content: content.replaceAll(`{SERVER_NAME}`, guild.name).replaceAll(`{USER_NAME}`, member), files: [canvas.toBuffer()] })
                            });
                    });
            }
        }
    }
}