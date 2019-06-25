const Discord = require('discord.js');
const fs = require('fs');
const enmap = require('enmap');
const schedule = require('node-schedule');
const branch = require("git-branch")
require('npm-package-to-env').config()
require("./extensions/message")

//Requires and objectifies client extras
const client = new Discord.Client();
const database = require(`./src/json/database.json`);
const config = require(`./src/json/config.json`);
const tokens = require(`./src/json/tokens.json`);
client.config = config;
client.version = process.env.npm_package_version
client.database = database;
client.commands = new enmap();

//Defines Variables
var update = 5 //How many minues between each time the update function is ran.

//For Manually saving the config file
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
//For manually saving the DB
client.saveDB = async function(){
    return new Promise((resolve,reject) => {
        fs.writeFile(__dirname+"/src/json/database.json", JSON.stringify(client.database), function(err) {
            resolve("Saved!")
            if(err) {
                reject(err)
            }
        })
    })
}

//For Manually running the update function.
client.update = async function(){
    client.saveConfig()
    client.saveDB()
}

//Runs update every ${update} minutes
schedule.scheduleJob(`*/${update} * * * *`, () => {
    client.update()
})

//Loads the events
fs.readdir('./events', (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        let event = require(`./events/${file}`);
        let name = file.split(".")[0];
        client.on(name, event.bind(null, client));
        delete require.cache[require.resolve(`./events/${file}`)];
    });
});
//Loads all commands currently in the ./commands directory.
fs.readdir(`./commands`, (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        let name = file.split(".")[0];
        client.commands.set(name, props);
    });
});

//Logs token into Discord API based on which branch is the working branch at the moment
client.login(branch.sync() === "master"?tokens.master:tokens.dev)