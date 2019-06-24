module.exports = (client, message) => {
    if (message.author.bot) return;
    // let low = message.content.toLowerCase();
    if (!message.content.startsWith(client.config.prefix)) return;
    const args = message.content.slice(client.config.prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    // command.toLowerCase();
    let cmd = client.commands.get(command)
    if (!cmd) return;
    cmd.run(client, message, args);
}