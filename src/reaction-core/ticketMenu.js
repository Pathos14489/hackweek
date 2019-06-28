module.exports = function(client, ocMessage) {
    const buttons = [
        {
            emoji: '⭕',
            run: (user, message) => {
                //Opens the Ticket Channel in the Tickets Category
                function leadingZeroes(n){
                    if (n<=9) return "0"+n;
                    return n;
                }
                var now = new Date();
                let dateShort = leadingZeroes(now.getDate())+leadingZeroes(now.getMonth()+1)+now.getFullYear()
                let random1 = (Math.round(Math.random()*9))
                let random2 = (Math.round(Math.random()*9))
                let random3 = (Math.round(Math.random()*9))
                let ticketID = user.username.toLowerCase().slice(0, 3)+ocMessage.author.username.toLowerCase().slice(0, 3)+user.id.slice(0, 3)+ocMessage.author.id.slice(0, 3)+dateShort+random1+random2+random3
                client.database.activeTickets.push(ticketID)
                client.update();
                ocMessage.guild.createChannel(ticketID, {
                    type: 'text',
                    topic: `Consumer's problem: \`\`\`${ocMessage.tDesc}\`\`\``,
                    parent: client.config.category
                })
            }
        },
        {
            emoji: '🅰',
            run: (user, message) => {
                //Calls A Class Staff Member
            }
        },
        {
            emoji: '🅱',
            run: (user, message) => {
                //Calls B Class Staff Member(Support Ticket first responders intended to be C Class)
            }
        },
        {
            emoji: '❌',
            run: (user, message) => {
                //Rejects Ticket. Rejected Ticket will start MessageListener for Reason, if no reason is given within 120 seconds, Ticket Rejection overruled.
                //Rejected Tickets sent to different Channel with Rejection Reason for B Class and higher Staff members to inspect on occasion.
            }
        },
        {
            emoji: '✅',
            run: (user, message) => {
                //Marks ticket as Resolved. Sends Ticket and Channel history to it's own channel, as well as a copy of the resolution log to the requestee
            }
        }
    ]
    const embed = {
        color: parseInt("0xff6b00"),
        author: {
            name:`Support Ticket Request!`,
            icon_url:ocMessage.author.avatarURL
        },
        title: `${ocMessage.author.tag} has sent a request!`,
        description:`${ocMessage.tDesc}`,
        timestamp:ocMessage.createdTimestamp,
        footer: {
            icon_url:ocMessage.author.avatarURL,
            text:ocMessage.author.id
        }
    }
return {
    embed: embed,
    buttons: buttons,
}
}