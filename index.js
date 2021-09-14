const { Client, Intents, Collection, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILD_MEMBERS] });
const fetch = require('node-fetch');
const { Player } = require('discord-player');
const player = new Player(client, {
    ytdlDownloadOptions: { filter: "audioonly"},
    leaveOnEndCooldown: 1240000,
});

client.commands = new Collection();
client.aliases = new Collection();
client.categories = new Collection()


require('fs').readdirSync('./handlers/').forEach(handler =>{
    require(`./handlers/${handler}`)(client);

});

client.player = player;
client.on("ready", () => {
    console.log(`[C] ${client.user.username} now on the mic🎤`)

    client.user.setPresence({
        activity: {
            name: "=help",
            type: 'LISTENING'
        },
            status: 'idle'
    })
});

client.player.on('trackStart', (message, track) => {
    const embed = new MessageEmbed()
        .setColor('WHITE')
        .setTitle('👨‍🚀🎶 Đang phát')
        .addFields(
        { name: 'Tên bài hát', value: `**\`${track.title}\`**` },
        { name: 'Đăng tải', value: `**\`${track.author}\`**`, inline: true },
        { name: 'Thời lượng', value: `**\`${track.duration}\`**`, inline: true },
    )
        .setFooter('𝙃𝙖𝙧𝙢𝙤𝙣𝙞𝙚 on your way!')
    message.channel.send(embed)
});
client.player.on('trackAdd', (message, queue, track) => {
    const embed = new MessageEmbed()
        .setColor('WHITE')
        .setTitle('👨‍🚀📃 Đã thêm vào hàng chờ')
        .addFields(
        { name: 'Tên bài hát', value: `**\`${track.title}\`**` },
        { name: 'Đăng tải', value: `**\`${track.author}\`**`, inline: true },
        { name: 'Thời lượng', value: `**\`${track.duration}\`**`, inline: true },
    )
        .setFooter('𝙃𝙖𝙧𝙢𝙤𝙣𝙞𝙚 on your way!')
    message.channel.send(embed)
});
client.player.on('playlistAdd', (message, queue, playlist) => {
    const embed = new MessageEmbed()
        .setColor('WHITE')
        .setTitle('👨‍🚀📩 Đã thêm playlist vào hàng chờ')
        .setDescription(`Số lượng bài: **\`${playlist.tracks.length}\`**\nĐăng bởi: **\`${track.author}\`**`)
        .setFooter('𝙃𝙖𝙧𝙢𝙤𝙣𝙞𝙚 on your way!')
    message.channel.send(embed)
});

client.on("message", async message => {
    if (message.author.bot) return;
    const prefix = '='
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0) return;
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if (command) {
        if (command.category === 'music' && !message.member.voice.channel) return message.channel.send('👨‍🚀❗ Bạn phải tham gia kênh thoại để sử dụng lệnh!');
        command.run(client, message, args);
    }
})
