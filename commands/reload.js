exports.run = (client, message, args) => {
    if (!client.config.superUsers.includes(message.author.id)) return message.reply(`only superUser may be able to perform this action!`);
    if (!args.length) return message.reply(`you must provide a valid command!`);
    let name = args[0];
    if (!client.commands.has(name)) return message.reply(` \`${name}\` is not a valid command!`);
    delete require.cache[require.resolve(`./${name}.js`)];
    client.commands.delete(name);
    const props = require(`./${name}.js`);
    client.commands.set(name, props);
    message.channel.send(`Successfully reloaded command \`${name}\` 🎉`);
    console.log(`(reload) Successfully reloaded command \`${name}\``);
}