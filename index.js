const Discord = require('discord.js');
const fs = require('fs');
const enmap = require('enmap');
const schedule = require('node-schedule');
const branch = require("git-branch")
require('npm-package-to-env').config()
require("./extensions/message")

const client = new Discord.Client();
const database = require(`./src/json/database.json`);
const config = require(`./src/json/config.json`);
const tokens = require(`./src/json/tokens.json`);
client.config = config;
client.version = process.env.npm_package_version
client.database = database;
client.commands = new enmap();

client.saveConfig = async function(){
    return new Promise((resolve,reject) => {
        fs.writeFile(__dirname+"/src/json/config.json", JSON.stringify(client.config), function(err) {
            resolve("Saved!")
            if(err) {
                reject(err)
            }
        })
    })
}

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

client.login(branch.sync() === "master"?tokens.master:tokens.dev)