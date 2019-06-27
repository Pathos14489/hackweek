module.exports = function(message, tDesc) {
    const buttons = [
        {
            emoji: '⭕',
            run: (user, message) => {
                //Opens the Ticket Channel in the Tickets Category
                
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
return {
    embed: embed,
    buttons: buttons,
}
}