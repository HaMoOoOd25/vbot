const Discord = require("discord.js");
const errors = require("../../utils/errors");
const moderation = require("../../utils/moderation");

module.exports.run = async (bot, message, args, messageArray) => {
    //warn @user reason

    let toWarn = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    let reason = args.slice(1).join(" ") || "None";

    //check command usage
    if (messageArray.length < 3 || message.mentions.users.size < 1) return errors.wrongCommandUsage(message, "warn <@user> reason");

    //Check If User Exist
    if(!toWarn) return errors.noUserError(message);

    moderation.logEmbed(message, toWarn, reason, "Warned");
    message.reply(`${toWarn} have been warned!`).then(async msg => {
        await (msg.delete(5000));
    });
    try{
        await toWarn.send(`${toWarn}, you have been warned by ${message.author} for ${reason}`);
    }catch{ }
};

module.exports.config = {
    name: "warn",
    aliases: [],
    permission: ["KICK_MEMBERS"],
    enabled: true
};