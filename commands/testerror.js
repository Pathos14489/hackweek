exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`
exports.description = `Sends false error to test error handling.`
exports.usage = `**{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} [type]**`
exports.clearance = `CREATOR`
exports.nsfw = false

exports.run = (client, message) => {
    message.command(2,async () => {
        switch (message.args[1].toLowerCase()) {
            case "promise":
                throw new Promise((resolve, reject) => {reject("Rejected!")})
                break;
            case "throw":
                throw "Thrown!"
                break;
            case "error":
                throw new Error("Error!")
                break;
            default:
                throw "Default Thrown!"
                break;
        }
    })
}