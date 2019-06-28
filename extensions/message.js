const Discord = require("discord.js")
Discord.Message.prototype.command = async function (num, func) {
    try {
        var args = this.content.split(' ')
        /**
         * Arguments Handler -- If num is set to false, this handler will be bypassed for per command handling. 
         * Useful for commands with variable argument count. Otherwise, specify how many arguments a command will have. 
         * If none, put 1.
         */
        if(num !== false){
            if(num+1 <= args.length){
                throw "Too many arguments!"
            }else if(num-1 >= args.length){
                throw "Too few arguments!"  
            }
        }

        /**
         * After checking the Args Handler, the command callback code is run here. It's then checked for any thrown async errors in the code, and if any exist,
         * they are then handled by this error handler.
         */
        func().catch(async (err)=>{
            console.log(err)
            /**
             * FIXME: Fix Promise Rejections being unhandled. It errors at "err.substring(0,1023)", because the rejected promise is not a string and 
             * has no way to convert to one naturally because the err object of a rejected promise does not have accessible data. 
             * There are a few workarounds but it's... irritating.
             */
            console.trace("Async/Promise Command Error: "+err)
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
                if(client.config.deleteErrors === true){
                    msg.delete(10000)
                }
            })
        })

    } catch (error) {
        // Sync Error Handling
        console.trace("Sync Command Error: "+error)

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
            if(client.config.deleteErrors === true){
                msg.delete(10000)
            }
        })
    }
    this.delete(0)
}