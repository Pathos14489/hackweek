exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`
exports.description = `Reloads command with latest code.`
exports.usage = `**{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}** ***(command)***`
exports.clearance = `CREATOR`
exports.nsfw = false

exports.run = (client, message) => {
    message.command(2, async () => {
        const cmd = message.args[1].toLowerCase()
        
        if (!client.commands.has(cmd)) {throw "Command not found, try **load** instead!"}
        
        //Deletes Command from client.commands and removes the cached version from require
        client.commands.delete(cmd);
        delete require.cache[require.resolve(`./${cmd}.js`)];

        //Re-requires it
        const props = require(`./${cmd}.js`)

        //Re-sets it
        client.commands.set(cmd, props);
        var embed = {
            color: parseInt("0x99ff66"),
            author: {
                name:`${client.user.tag} ${client.version}`,
                icon_url:client.user.avatarURL
            }, 
            description:`Command **${client.config.prefix}${cmd}** has been reloaded! Description:
            ${client.commands.get(cmd).description.replace(/{PREFIX}/g, client.config.prefix)}`,
            fields:[
                {
                    name:`**${client.config.prefix}${cmd}**`,
                    value:`${client.commands.get(cmd).usage.replace(/{PREFIX}/g, client.config.prefix)}`
                },
            ]
        }
        message.channel.send({embed:embed}).then(msg => msg.delete(5000))
    })
}