exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`
exports.description = `Loads command from commands folder if it is unloaded, or newly installed.`
exports.usage = `**{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}** ***(command)***`
exports.clearance = `CREATOR`
exports.nsfw = false

exports.run = (client, message) => {
    message.command(2, async () => {
        const commandName = message.args[1].toLowerCase()
        
        if (client.commands.has(commandName)) {throw "Command found, try **{reload** instead!"}
        
        const props = require(`./${commandName}.js`);
        client.commands.set(commandName, props);

        var embed = {
            color: parseInt("0x99ff66"),
            author: {
                name:`${client.bot.name} ${client.bot.version}`,
                icon_url: client.user.avatarURL
            }, 
            description:`Command **${message.gus.guild.prefix}${commandName}** has been loaded! Description:
            ${client.commands.get(commandName).description.replace(/{PREFIX}/g, message.gus.guild.prefix)}`,
            fields:[
                {
                    name:`**${message.gus.guild.prefix}${commandName}**`,
                    value:`${client.commands.get(commandName).usage.replace(/{PREFIX}/g, message.gus.guild.prefix)}`
                },
            ]
        }

        message.channel.send({embed:embed})
            .then(msg => msg.delete(5000))
    })
}