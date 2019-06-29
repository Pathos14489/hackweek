exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`
exports.description = `Marks ticket as resolved.\nUse it only when record is stuck in database without interactive reaction menu working!`
exports.usage = `**{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}** ***[ticket ID]***`
exports.clearance = `CREATOR`
exports.nsfw = false

exports.run = (client, message) => {
    message.command(2,async () => {
        if (!client.database.activeTickets[message.args[1]]) throw "This ticket does not exist in database!"
        let toBeDeleted = message.guild.channels.get(client.database.activeTickets[message.args[1]].channel);
        if (toBeDeleted) toBeDeleted.delete();
        delete client.database.activeTickets[message.args[1]]
        client.update();
        //TODO: make it edit ticket message in ticketChannel
        // message.guild.channels.get(client.config.ticketChannel)
        var embed = {
            color: parseInt("0x99ff66"),
            author: {
                name:`${client.user.tag} ${client.version}`,
                icon_url:client.user.avatarURL
            }, 
            description:`Ticket \`${message.args[1]}\` is now resolved!`,
        }
        message.channel.send({embed:embed}).then(msg => msg.delete(10000))
    })
}