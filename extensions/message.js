const Discord = require("discord.js")
Discord.Message.prototype.command = async function (num, func) {
    try {
        var args = this.content.split(' ')
        if(num !== false){
            if(num+1 <= args.length){
                throw "Too many arguments!"
            }else if(num-1 >= args.length){
                throw "Too few arguments!"  
            }
        }
        func().catch(err=>{
            console.trace("Command Error: "+err)
            if(typeof err !== "string"){
                err = err.stack
            }
            var embed = {
                embed:{
                    color: parseInt("0xff5050"),
                    author: {
                        name:this.channel.guild.name+" — \""+this.channel.name+"\"",
                        icon_url: this.author.avatarURL
                    },
                    description: "**"+this.author.username+"#"+this.author.discriminator+":"+this.author.id+"** failed to call: ***"+this.content+"***",
                    fields:[
                        {
                            name: "Reason:",
                            value: err.substring(0,1023),
                        }
                    ],
                    timestamp: new Date()
                }
            }
            this.channel.send(embed).then(msg=>{
                msg.delete(5000)
            })
        })
    } catch (error) {
        console.trace("Command Error: "+error)
        var embed = {
            embed:{
                color: parseInt("0xff5050"),
                author: {
                    name:this.channel.guild.name+" — \""+this.channel.name+"\"",
                    icon_url: this.author.avatarURL
                },
                description: "**"+this.author.username+"#"+this.author.discriminator+":"+this.author.id+"** failed to call: ***"+this.content+"***",
                fields:[
                    {
                        name: "Reason:",
                        value: error.substring(0,1023),
                    }
                ],
                timestamp: new Date()
            }
        }
        this.channel.send(embed).then(msg=>{
            msg.delete(5000)
        })
    }
    this.delete(0)
}