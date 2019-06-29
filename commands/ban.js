const fs = require('fs');
exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`
exports.description = `Bans a member from using support tickets.`
exports.usage = `**{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}** *[user_ID or @mention]*`
exports.clearance = `CREATOR`
exports.nsfw = false

exports.run = (client, message) => {
    message.command(2,async () => {
        let taggedUser = message.mentions.users.first();
        if (!taggedUser) {
            let validUser = message.guild.members.get(message.args[1]);
            if (!validUser) throw "The UID of the user is invalid!"
            if (client.database.supportBanned.includes(validUser.id)) throw "This user is already banned!"
            client.database.supportBanned.push(validUser.id)
            client.update();
            var embed = {
                color: parseInt("0x99ff66"),
                author: {
                    name:`${client.user.tag} ${client.version}`,
                    icon_url:client.user.avatarURL
                }, 
                description:`User **${validUser}** is now banned from sending support tickets!`,
            }
            message.channel.send({embed:embed}).then(msg => msg.delete(10000))
        }
        else {
            if (client.database.supportBanned.includes(taggedUser.id)) throw "This user is already banned!"
            client.database.supportBanned.push(taggedUser.id)
            client.update();
            var embed = {
                color: parseInt("0x99ff66"),
                author: {
                    name:`${client.user.tag} ${client.version}`,
                    icon_url:client.user.avatarURL
                }, 
                description:`User **${taggedUser}** is now banned from sending support tickets!`,
            }
            message.channel.send({embed:embed}).then(msg => msg.delete(10000))
        }
    })
}