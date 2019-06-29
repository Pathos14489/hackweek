exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`
exports.description = ` commandDescription`
exports.usage = `**{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}** *usage*`
exports.clearance = `CREATOR`
exports.nsfw = false

exports.run = (client, message) => {
    message.command(2,async () => {
        let taggedUser = message.mentions.users.first();
        if (!taggedUser) {
            let validUser = message.guild.members.get(message.args[1]);
            if (!validUser) throw "The UID of the user is invalid!"
            if (!client.database.ticketCooldown.includes(validUser.id)) throw "This user is not on cooldown!"
            var index = client.database.ticketCooldown.indexOf(validUser.id);
            if (index > -1) {
                client.database.ticketCooldown.splice(index, 1);
            }
            client.update();
            var embed = {
                color: parseInt("0x99ff66"),
                author: {
                    name:`${client.user.tag} ${client.version}`,
                    icon_url:client.user.avatarURL
                }, 
                description:`User **${validUser}** is not on cooldown anymore!`,
            }
            message.channel.send({embed:embed}).then(msg => msg.delete(10000))
        }
        else {
            if (!client.database.ticketCooldown.includes(taggedUser.id)) throw "This user is not on cooldown!"
            var index = client.database.ticketCooldown.indexOf(taggedUser.id);
            if (index > -1) {
                client.database.ticketCooldown.splice(index, 1);
            }
            client.update();
            var embed = {
                color: parseInt("0x99ff66"),
                author: {
                    name:`${client.user.tag} ${client.version}`,
                    icon_url:client.user.avatarURL
                }, 
                description:`User **${taggedUser}** is not on cooldown anymore!`,
            }
            message.channel.send({embed:embed}).then(msg => msg.delete(10000))
        }
    })
}