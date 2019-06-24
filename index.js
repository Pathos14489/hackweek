const discord = require('discord.js');
const fs = require('fs');
const enmap = require('enmap');
const schedule = require('node-schedule');
const client = new discord.Client();
const {embed} = new discord.RichEmbed();
const config = require(`./config.json`);
client.config = config;
const database = require(`./database.json`);
client.database = database;
client.fs = fs;
client.commands = new enmap();
fs.readdir('./events', (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        let event = require(`./events/${file}`);
        let name = file.split(".")[0];
        client.on(name, event.bind(null, client));
        delete require.cache[require.resolve(`./events/${file}`)];
    });
});
fs.readdir(`./commands`, (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        let name = file.split(".")[0];
        client.commands.set(name, props);
    });
});
const {token} = require('./auth.json');
client.login(token);