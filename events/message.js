module.exports = (client, message) => {
    if (message.author.bot) return;
    try {
        //Defining Message extras
        message.args = message.content.split(' ')
    
        //Message Parsing
        if (message.content.startsWith(client.config.prefix)) {
            //Command Handling
            let cmd = client.commands.get(message.args[0].substr(1).toLowerCase())
            if (!cmd) throw "That's not a command!" //If command doesn't exit
    
            //Permissions Handler
            switch (cmd.clearance) {
                case "USER":
                    console.log("USER command called")
                    break;
                case "ADMINISTRATOR":
                    if(!message.member.hasPermission("ADMINISTRATOR")) throw "You are not an Administrator!"
                    console.log("ADMINISTRATOR command called")
                    break;
                case "CREATOR":
                    if(!client.config.creators.includes(message.author.id)) throw "That's not a command!"
                    console.log("CREATOR command called")
                    break;
                default:
                    throw `Command ${cmd.name.substr(8)} missing export.clearance definition or has non-standard/unusual clearnace definition. Check Permissions Handler SwitchCase for available permissions or add a new one if needed. Consult with others before hand.`
            }
    
            //Runs code associated with the command
            cmd.run(client, message);
        }else{
            //Message Handling
        }
    } catch (err) {
        //Converts err OBJs to string for simplification purposes.
        if(typeof err !== "string"){
            err = err.stack
        }
        console.log(err)
        var embed = {
            embed:{
                color: parseInt("0xff5050"),
                author: {
                    name:message.channel.guild.name+" — \""+message.channel.name+"\"",
                    icon_url: message.author.avatarURL
                },
                description: `There was an error in the message event:`,
                fields:[
                    {
                        name: "Reason:",
                        value: err.substring(0,1023),
                    }
                ],
                timestamp: new Date()
            }
        }
        message.channel.send(embed).then(msg=>{
            msg.delete(5000)
        })
    }
}