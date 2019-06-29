const Discord = require("discord.js");
const errors = require("../../utils/errors");
const moderation = require("../../utils/moderation");

module.exports.run = async (bot, message, args, messageArray) => {
    //!unmute @user
    let robot = message.guild.members.get(bot.user.id);
    let tMute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    let mRoles = tMute.roles.find(role => role.name === 'Muted');

    //Check bot permission
    if (!robot.hasPermission("MANAGE_ROLES")) return errors.botNoPermission(message);

    //Check user
    if (!tMute) return errors.noUserError(message);

    //Check if person is muted or not
    if (!mRoles) return message.channel.send(`${tMute} is not muted`);

    await (tMute.removeRole(mRoles.id));
    message.channel.send(`${tMute} is now unmuted`);
    moderation.logEmbed(message, tMute, "-", "Unmuted")
};

module.exports.config = {
    name: "unmute",
    aliases: [],
    permission: ["KICK_MEMBERS"],
    enabled: true
};