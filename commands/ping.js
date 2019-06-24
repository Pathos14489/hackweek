exports.run = async (client, message, args) => {
    function leadingZeroes(n){
        if (n<=9) return "0"+n;
        return n;
    }
    function uptime(n){
        if (n<=60000) return `${Math.floor(n/1000)}s`;
        if (n<=3600000) return `${Math.floor(n/60000)}m ${Math.floor(n/1000)-(Math.floor(n/60000)*60)}s`;
        if (n<=86400000) return `${Math.floor(n/3600000)}h ${Math.floor(n/60000)-(Math.floor(n/3600000)*60)}m`;
        return `${Math.floor(n/86400000)}d ${Math.floor(n/3600000)-(Math.floor(n/86400000)*24)}h`;
    }
    let date = client.readyAt;
    let uptimeDate = leadingZeroes(date.getDate())+"/"+leadingZeroes(date.getMonth()+1)+"/"+date.getFullYear()+", "+leadingZeroes(date.getHours())+":"+leadingZeroes(date.getMinutes())+":"+leadingZeroes(date.getSeconds());
    const m = await message.channel.send(`Pong?`);
    let ping = {
        color: 0x00ff00,
        // author: {
        //     name: message.author.tag,
        //     icon_url: message.author.avatarURL
        // },
        fields: [
            {
                name: `Ping`,
                value: `Latency: **${m.createdTimestamp - message.createdTimestamp}ms**\nAPI Latency: **${Math.round(client.ping)}ms**`,
                inline: false
            },
            {
                name: `Uptime`,
                value: `**${uptime(client.uptime)}** since \`${uptimeDate}\``,
                inline: false
            }
        ]
    }
    m.edit({embed:ping});
}