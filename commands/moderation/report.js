const Discord = require("discord.js");
const errors = require("../../utils/errors");
const moderation = require("../../utils/moderation");

module.exports.run = async (bot, message, args, messageArray) => {

    //!report @user this is reason
    let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    let reason = args.slice(1).join(" ") || "None";

    //Check command usage
    if (messageArray.length < 2) return errors.wrongCommandUsage(message, "report <@user> reason");

    //Checking user
    if (!rUser) return errors.noUserError(message);


    //Check user type (if bot, don't allow)
    if (rUser.user.bot) return message.channel.send("You can't report my friends!").then(msg => {
        msg.delete(3000);
    });

	//Deleting Report
	message.delete();
	
    //Sending report
    moderation.report(message, rUser, reason);

    //Notify
    try {
        await message.author.send("Your report was sent. Please wait for it to get reviewed by our staff.")
    } catch (err) {

    }

};

module.exports.config = {
    name: "report",
    aliases: [],
    permission: [],
    enabled: true
};