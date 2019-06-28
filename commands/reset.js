exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`
exports.description = `Deletes __ALL__ active tickets and all ticket cooldowns for members.`
exports.usage = `**{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}**`
exports.clearance = `CREATOR`
exports.nsfw = false

exports.run = (client, message) => {
    message.command(false,async () => {
        if (!client.config.category) throw "Staff haven't set **category**, so you can't delete any support tickets there!"
        client.database.activeTickets = [];
        client.database.ticketCooldown = [];
        client.database.ticketCount = {};
        message.guild.channels.get(client.config.category).children.forEach(children => children.delete())
        client.update();
        var embed = {
            color: parseInt("0x99ff66"),
            author: {
                name:`${client.user.tag} ${client.version}`,
                icon_url:client.user.avatarURL
            }, 
            description:`Successfully deleted all requests and cleared database!`,
        }
        message.channel.send({embed:embed}).then(msg => msg.delete(10000))
    })
}