const Discord = require("discord.js");
const errors = require("../../utils/errors");
const moderation = require("../../utils/moderation");

module.exports.run = async (bot, message, args, messageArray) => {

    //!kick @user this is reason
    let robot = message.guild.members.get(bot.user.id);

    let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

    let kReason = args.slice(1).join(" ") || "None";

    //check bot permission
    if (!robot.hasPermission("KICK_MEMBERS")) return errors.botNoPermission(message);

    //check command usage
    if (messageArray.length < 2 || message.mentions.users.size < 1) return errors.wrongCommandUsage(message, "kick <@user> reason");

    //check user
    if (!kUser) return errors.noUserError(message);

    //check if user is admin
    if (kUser.hasPermission("ADMINISTRATOR") || kUser.hasPermission("KICK_MEMBERS")) return errors.userAdmin(message);

    //kicking, announce ban, send log

    await (message.guild.member(kUser).kick(kReason));
    moderation.actionTaken(message, "kicked", kUser);
    moderation.logEmbed(message, kUser, kReason, "Kicked");
    try {
        await kUser.send(`You were kicked from VirtuoNet.\nReason: ${bReason}`);
    } catch (err) {}
};

module.exports.config = {
    name: "kick",
    aliases: [],
    permission: ["KICK_MEMBERS"],
    enabled: true
};