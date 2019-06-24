const Discord = require('discord.js');
const fs = require('fs');
const enmap = require('enmap');
const schedule = require('node-schedule');
const branch = require("git-branch")

const client = new Discord.Client();
const database = require(`./src/json/database.json`);
const config = require(`./src/json/config.json`);
const tokens = require(`./src/json/tokens.json`);
client.config = config;
client.database = database;
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

var token
branch.sync() === "master"?token = tokens.master:token = tokens.dev
client.login(token);