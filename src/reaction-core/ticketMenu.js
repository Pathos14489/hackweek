module.exports = function(client, ocMessage) {
    function leadingZeroes(n){
        if (n<=9) return "0"+n;
        return n;
    }
    function timestampDate(date) {return leadingZeroes(date.getDate())+"/"+leadingZeroes(date.getMonth()+1)+"/"+date.getFullYear()+", "+leadingZeroes(date.getHours())+":"+leadingZeroes(date.getMinutes())+":"+leadingZeroes(date.getSeconds())}
    const colors = {
        red: 0xff0000,
        green: 0x00ff00,
        yellow: 0xeeff00,
        default: 0xff6b00
      }
    const buttons = [
        {
            emoji: '⭕',
            run: async (user, message) => {
                //declares how many support tickets may be opened at once
                if (client.database.activeTickets.length >= client.config.maxTickets) throw message.channel.send("There are too many active tickets at this moment!\nResolve some to make a room for new ones!").then(msg => msg.delete(10000))
                // pat 174 zne 288 (mod name, mod id, consumer name, consumer id)
                var shortID = user.username.toLowerCase().slice(0, 3)+user.id.slice(0, 3)+ocMessage.author.username.toLowerCase().slice(0, 3)+ocMessage.author.id.slice(0, 3)
                //short date in format: dd/mm/yy
                var now = new Date();
                var dateShort = leadingZeroes(now.getDate())+leadingZeroes(now.getMonth()+1)+now.getFullYear().toString().slice(2)

                //an iterated value stored in database, so that users can get help even 100 times a day
                if (!client.database.ticketCount[shortID]) client.database.ticketCount[shortID] = 0
                let ticketID = shortID+dateShort+leadingZeroes(client.database.ticketCount[shortID]);
                await message.guild.createChannel(ticketID, {
                    type: 'text',
                    topic: `Consumer's problem: \n${ocMessage.tDesc}`,
                    parent: client.config.category,
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            deny: 'VIEW_CHANNEL'
                        },
                        {
                            id: client.user.id,
                            allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'MANAGE_CHANNELS', 'MANAGE_MESSAGES']
                        },
                        {
                            id: user.id,
                            allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES'],
                            deny: ['MANAGE_CHANNELS', 'MANAGE_ROLES']
                        },
                        {
                            id: ocMessage.author.id,
                            allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES'],
                            deny: ['MANAGE_CHANNELS', 'MANAGE_ROLES']
                        }
                    ]
                }).then(async ch => {
                    ch.send(`${user} has opened this support ticket channel for ${ocMessage.author}\nLink to ticket in staff channel: ${message.url}\n\n${ocMessage.author}'s Problem:\n${ocMessage.tDesc}`)
                    .then(msg => msg.pin())
                    //adding ticket to database (now with channel ID value)
                    client.database.activeTickets[ticketID] = {}
                    client.database.activeTickets[ticketID].channel = ch.id
                    client.database.activeTickets[ticketID].message = message.id
                })
                //increasing iterated value
                client.database.ticketCount[shortID] = client.database.ticketCount[shortID]+1;
                client.update();
                //changing embed colors
                let newEmbed = embed
                embed.color = colors.yellow
                embed.fields.push({
                    name: `Status update`,
                    value: `**OPENED** (by \`${user.tag}\`)\n*at ${timestampDate(now)}*`
                })
                embed.timestamp = null;
                embed.footer.text = `Ticket ID: ${ticketID}`
                embed.footer.icon_url = user.avatarURL
                message.edit({embed: newEmbed})
                //unregistering button and removing reaction 
                client.RCHandler.menus[message.id].removeButtons('⭕')
                message.reactions.get('⭕').remove()
            }
        },
        {
            emoji: '❌',
            run: (user, message) => {
                //Rejects Ticket. Rejected Ticket will start MessageListener for Reason, if no reason is given within 120 seconds, Ticket Rejection overruled.
                //removes the menu
                client.RCHandler.removeMenu(message.id)                
                message.clearReactions()
                const filter = m => m.author.id === user.id
                message.channel.send(`Provide a reason of rejection (expires in 60 seconds)`).then(r => {
                    message.channel.awaitMessages(filter, {max: 1, time: 60000}).then(async collected => {
                        if (!collected.first()) {
                            await rejection("No reason specified!", r.createdAt);
                            r.delete();
                        }
                        else {
                            await rejection(collected.first().content, r.createdAt);
                            r.delete();
                            collected.first().delete()
                        }
                        
                    });
                });
                function rejection(reason, date){
                    let newEmbed = embed
                    embed.color = colors.red
                    embed.fields.push({
                        name: `Status update`,
                        value: `**REJECTED** (by \`${user.tag}\`)\n*at ${timestampDate(date)}*\n\nWith Reason:\n\`\`\`${reason}\`\`\``
                    })
                    embed.timestamp = null;
                    embed.footer.icon_url = user.avatarURL
                    message.edit({embed: newEmbed})
                }

            }
        },
        {
            emoji: '✅',
            run: (user, message) => {
                //Marks ticket as Resolved. Sends Ticket and Channel history to it's own channel, as well as a copy of the resolution log to the requestee

                let newEmbed = embed
                if (!client.database.activeTickets[embed.footer.text.slice(-20)]) return message.channel.send("You tried to resolve non-existent ticket!").then(msg => msg.delete(7500)) //throw message.channel.send("You tried to resolve ticket before it was opened!").then(msg => msg.delete(7500))
                //deletes channel
                let toBeDeleted = message.guild.channels.get(client.database.activeTickets[embed.footer.text.slice(-20)].channel);
                //In case the channel is already deleted before closing ticket, just don't do nothing and don't throw error, because it's not critical
                if (toBeDeleted) toBeDeleted.delete();
                //deletes object entry in activeTickets and reloads database
                delete client.database.activeTickets[embed.footer.text.slice(-20)]
                client.update();
                //embed edit thingy
                embed.color = colors.green
                embed.fields.push({
                    name: `Status update`,
                    value: `**RESOLVED** (by \`${user.tag}\`)\n*at ${timestampDate(message.editedAt)}*`
                })
                embed.timestamp = null;
                embed.footer.icon_url = user.avatarURL
                message.edit({embed: newEmbed})
                //removes the menu
                client.RCHandler.removeMenu(message.id)
                message.clearReactions()
            }
        }
    ]
    const embed = {
        color: colors.default,
        author: {
            name:`Support Ticket Request!`,
            icon_url:ocMessage.author.avatarURL
        },
        title: `${ocMessage.author.tag} has sent a request!`,
        description:`${ocMessage.tDesc}`,
        // timestamp:ocMessage.createdTimestamp,
        footer: {
            icon_url:ocMessage.author.avatarURL,
            text: `Requestee ID: ${ocMessage.author.id}`
        },
        fields: [
            {
                name: `Status`,
                value: `**AWAITING**\n*at ${timestampDate(ocMessage.createdAt)}*`
            }
        ]
    }
return {
    embed: embed,
    buttons: buttons,
    colors: colors
}
}