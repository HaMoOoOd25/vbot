const Discord = require("discord.js");
const errors = require("../../utils/errors");
module.exports.run = (bot, message, args, messageArray) => {

    if(!message.member.hasPermission("ADMINISTRATOR")) return errors.noPermissionError(message);

    if(!args[0]) return message.reply(" you need to specify amount of messages to clear").then(msg => msg.delete(3000));

    if(args[0] > 100) return message.reply(" numbers of messages must be less than 100").then(msg => msg.delete(3000));

    message.channel.bulkDelete(args[0]).then(() => {
        message.channel.send("Cleared!").then(msg => msg.delete(5000));
    })
};

module.exports.config = {
    name: "clear",
    aliases: [],
    permission: ["MANAGE_MESSAGES"],
    enabled: true
};