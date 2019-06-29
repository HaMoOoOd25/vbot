const Discord = require("discord.js");
const errors = require("../../utils/errors");
const moderation = require("../../utils/moderation");

module.exports.run = async (bot, message, args, messageArray) => {

    //!ban @user this is reason
    let robot = message.guild.members.get(bot.user.id);

    let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

    let bReason = args.slice(1).join(" ") || "None";

    //check bot permission
    if (!robot.hasPermission("BAN_MEMBERS")) return errors.botNoPermission(message);

    //check command usage
    if (messageArray.length < 2 || message.mentions.users.size < 1) return errors.wrongCommandUsage(message, "ban <@user> reason");

    //check user
    if (!bUser) return errors.noUserError(message);

    //check if user is admin
    if (bUser.hasPermission("ADMINISTRATOR") || bUser.hasPermission("KICK_MEMBERS")) return errors.userAdmin(message);

    //Banning, announce ban, send log, notify ban

    await (message.guild.member(bUser).ban(bReason));
    moderation.actionTaken(message, "Banned", bUser);
    moderation.logEmbed(message, bUser, bReason, "Ban");
    try {
        await bUser.send(`You were banned from VirtuoNet.\nReason: ${bReason}`);
    } catch (err) {
    }
};

module.exports.config = {
    name: "ban",
    aliases: [],
    permission: ["ADMINISTRATOR"],
    enabled: true
};