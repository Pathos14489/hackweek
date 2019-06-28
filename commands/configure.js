exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`
exports.description = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} allows you to configure bot channels`
exports.usage = `**{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} [r (request) | t (ticket) | c (category)] [channel ID | channel #mention]**`
exports.clearance = `CREATOR`
exports.nsfw = false

exports.run = (client, message) => {
    message.command(3,async () => {
        let taggedChannel = message.mentions.channels.first()
        if (!taggedChannel) {
            //declares a GuildChannel object to check if that channel exist and if it's in our guild (2 in 1)
            let validGuildChannel = message.guild.channels.get(message.args[2])
            if (!validGuildChannel) throw "The ID of the channel is invalid!"
            //declares a regular Channel object variable
            let vChannel = client.channels.get(message.args[2])
            channelChecker(vChannel);
            
        }
        else {
            //checks if mentioned channel is in our guild (sometimes it may be not)
            let validGuildChannel = message.guild.channels.get(taggedChannel.id)
            if (!validGuildChannel) throw "The mentioned channels is not in this guild!"
            //declares a regular Channel object variable
            let vChannel = client.channels.get(taggedChannel.id)
            channelChecker(vChannel);
        }
        //a function that checks for message.args[1] options and assign values to config
        function channelChecker(vChannel){
            switch(message.args[1]) {
                case "request":
                case "r":
                    client.config.requestChannel = vChannel.id
                    client.update();
                    var embed = {
                        color: parseInt("0x99ff66"),
                        author: {
                            name:`${client.user.tag} ${client.version}`,
                            icon_url:client.user.avatarURL
                        }, 
                        description:`Successfully updated Request Channel to ${vChannel}`,
                    }
                    message.channel.send({embed:embed}).then(msg => msg.delete(10000))
                    break;
                case "ticket":
                case "t":
                    client.config.ticketChannel = vChannel.id
                    client.update();
                    var embed = {
                        color: parseInt("0x99ff66"),
                        author: {
                            name:`${client.user.tag} ${client.version}`,
                            icon_url:client.user.avatarURL
                        }, 
                        description:`Successfully updated Ticket Channel to ${vChannel}`,
                    }
                    message.channel.send({embed:embed}).then(msg => msg.delete(10000))
                    break;
                case "category":
                case "c":
                    if (vChannel.type !== 'category') throw "Provided channel is not a **category**!"
                    client.config.category = vChannel.id
                    client.update();
                    var embed = {
                        color: parseInt("0x99ff66"),
                        author: {
                            name:`${client.user.tag} ${client.version}`,
                            icon_url:client.user.avatarURL
                        }, 
                        description:`Successfully updated category to \`${vChannel.name}\``,
                    }
                    message.channel.send({embed:embed}).then(msg => msg.delete(10000))
                    break;
                default:
                    throw `You didn't specify your choice, see **${client.config.prefix}help ${__filename.split(/[\\/]/).pop().slice(0,-3)}**`
            }
        }
    })
}