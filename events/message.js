module.exports = (client, message) => {
    if (message.author.bot) return;

    
    message.args = message.content.split(' ')
    //message.args = message.content.slice(client.config.prefix.length).split(/ +/)

    if (message.content.startsWith(client.config.prefix)) {
        //Command Handling
        let cmd = client.commands.get(message.args[0].substr(1).toLowerCase())
        if (!cmd) return;
        cmd.run(client, message);
    }else{
        //Message Handling
    }
}