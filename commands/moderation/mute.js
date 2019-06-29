const Discord = require("discord.js");
const ms = require("ms");
const moderation = require("../../utils/moderation");
const errors = require("../../utils/errors");

module.exports.run = async (bot, message, args, messageArray) => {

    //!mute @user 1s/h/d
    let robot = message.guild.members.get(bot.user.id);
    let tMute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    let muteTime = args[1];
    let mReason = args.slice(2).join(" ") || "None";
    let muteRole = message.guild.roles.find(role => role.name === 'Muted');

    //Check bot permission
    if (!robot.hasPermission("MANAGE_ROLES")) return errors.botNoPermission(message);

    //check command usage
    if (messageArray.length < 3 || message.mentions.users.size < 1) return errors.wrongCommandUsage(message, "mute <@user> <1m/h/d> reason");

    //Check user
    if (!tMute) return errors.noUserError(message);

    //check if user is muted already
    if (tMute.roles.find(role => role.name === 'Muted')) return message.channel.send(`${tMute} is already muted!`);

    //check if user is admin
    if (tMute.hasPermission("ADMINISTRATOR") || tMute.hasPermission("KICK_MEMBERS")) return errors.userAdmin(message);

    //Check if time is specefied
    if (!muteTime) return message.reply(" you did not specify a time!");
    try {
        if (!ms(ms(muteTime))) return message.reply("You did not specify a time!");
    } catch (error) {
        return message.reply("You did not specify a time!");
    }

    //Check if there is a mute role. If not, create one
    if (!muteRole) {
        try {
            muteRole = await message.guild.createRole({
                name: "Muted",
                color: "#000000",
                permissions: []
            });
            message.guild.channels.forEach(async (channel) => {
                await channel.overwritePermissions(muteRole, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false,
                });
            });
        } catch (e) {
            console.log(e.stack);
        }
    }

    //Mute
    await (tMute.addRole(muteRole.id));
    message.channel.send(`The hammer is used! <@${tMute.id}> has been muted for ${ms(ms(muteTime))}`);
    moderation.logEmbed(message, tMute, mReason, "Muted", ms(ms(muteTime)));

    try {
        await tMute.send(`You were muted for ${ms(ms(muteTime))} in Virtuonet.\nReason: ${mReason}`);
    } catch (err) {}

    //unMute after time
    setTimeout(async function () {
        if (!tMute.roles.find(role => role.name === 'Muted')) return;
        await (tMute.removeRole(muteRole.id));
        message.channel.send(`<@${tMute.id}> has been unmuted`);
    }, ms(muteTime));
};

module.exports.config = {
    name: "mute",
    aliases: [],
    permission: ["KICK_MEMBERS"],
    enabled: true
};