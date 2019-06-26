exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`
exports.description = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} sends a support ticket to staff members`
exports.usage = `**{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}** **(short description [8-255 characters])**`
exports.clearance = `USER`
exports.nsfw = false

exports.run = (client, message) => {
    message.command(false,async () => {
        //checking if user is banned from sending tickets, simple
        if (client.database.supportBanned.includes(message.author.id)) throw "You have been banned from sending support tickets!"
        if (client.database.ticketCooldown.includes(message.author.id)) throw "You are sending support tickets too quickly!\nTry again later."
        //simple declarations
        var cooldown = 1800000;
        var prefix = client.config.prefix //prefix
        var cName = __filename.split(/[\\/]/).pop().slice(0,-3) //command name
        var tDesc = message.content.slice(prefix.length+cName.length+1) //ticket description
        //I tried using switch(tDesc.length) {case:}, but I didn't succeed
        if (tDesc.length < 8) throw `Your description is too short!`
        if (tDesc.length > 255) throw `Your description is too long!`
        //ticket embed being sent to client.config.ticketChannel
        var Tembed = {
            color: parseInt("0xff6b00"),
            author: {
                name:`Support Ticket Request!`,
                icon_url:message.author.avatarURL
            },
            title: `${message.author.tag} has sent a request!`,
            description:`${tDesc}`,
            timestamp:message.createdTimestamp,
            footer: {
                icon_url:message.author.avatarURL,
                text:message.author.id
            }
        }
        //used await here, so that confirmation won't be sent before this executes
        await client.channels.get(client.config.ticketChannel).send({embed:Tembed})
        .then(async msg => {
            await msg.react("⭕")
            await msg.react("🅰")
            await msg.react("🅱")
            await msg.react("❌")
            await msg.react("✅")
        })
        client.database.ticketCooldown.push(message.author.id)
        // TO DO: Finish this line here
        // client.database.activeTickets.push(/*the 'ID' of newly created ticket*/)
        client.update();
        //optimize this thing here if you know how to >.<
        setTimeout(function(){
            var index = client.database.ticketCooldown.indexOf(message.author.id);
            if (index > -1) {
                client.database.ticketCooldown.splice(index, 1);
            }
            client.update();
            console.log(`Removed cooldown of ${message.author.id}`)
        },cooldown);
        //confirmation message for user, which tells that their ticket was sent successfully
        var Iembed = {
            color: parseInt("0x99ff66"),
            author: {
                name:`${client.user.tag} ${client.version}`,
                icon_url:client.user.avatarURL
            }, 
            description:`${message.author}, I've sent your support ticket to staff channel!`,
            footer: {
                icon_url:message.author.avatarURL,
                text:message.author.tag
            },
            timestamp:message.createdTimestamp
        }
        //no message delete here on purpose (staff would see, who spammed tickets if that's the case)
        message.channel.send({embed:Iembed})
    })
}