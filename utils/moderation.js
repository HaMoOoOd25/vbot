const Discord = require("discord.js");
const settings = require("../settings");

module.exports.actionTaken = (message, action, target) => {
    message.channel.send(`The hammer is used! ${target} has been ${action}`);
};

module.exports.noChannel = (message, channel) => {
    message.channel.send(`Couldn't find ${channel} channel.`).then(msg => {
        msg.delete(3000)
    });
};

module.exports.noUser = (message) => {
    message.channel.send("Couldn't find user.").then(msg => {
        msg.delete(3000)
    });
};

module.exports.botNoPerm = (message) => {
    message.channel.send("I don't have permission to do that!").then(msg => {
        msg.delete(3000)
    });
};

module.exports.noPerm = (message) => {
    message.reply("You don't have permission to do that!").then(msg => {
        msg.delete(3000)
    });
};

module.exports.userAdmin = (message, user) => {
    return message.channel.send(`**${user} is admin/moderator**`).then(msg => {
        msg.delete(3000)
    });
};

module.exports.logEmbed = (message, user, reason, action, duration) => {
    const logChannel = message.guild.channels.get(settings.logChannel);
    const log = [];
    log.push(`👤 **Member:** ${user}\n`);
    log.push(`💳 **ID:** ${message.author.id}\n`);
    log.push(`🗒 **Reason:** ${reason}\n`);
    if (action === "Mute" || duration){
        log.push(`🕐 **Duration:** ${duration}\n`);
    }
    log.push(`🗨**Channel:** ${message.channel}`);

    let logEmbed = new Discord.RichEmbed()
        .setTitle(action)
        .setDescription(log)
        .setColor("ff0000")
        .setThumbnail(user.user.avatarURL)
        .setTimestamp(message.createdAt)
        .setFooter(message.author.username, message.author.avatarURL);
    if (logChannel) logChannel.send(logEmbed);
};

module.exports.report = (message, reported, reason) => {

    const report = [];

    report.push(`👤 **Member:** ${reported}\n`);
    report.push(`💳 **ID:** ${reported.id}\n`);
    report.push(`🗒 **Reason:** ${reason}\n`);
    report.push(`🗨**Channel:** ${message.channel}`);

    const reportChannel = message.guild.channels.get(settings.reportChannel);

    let reportembed = new Discord.RichEmbed()
        .setColor("#FF0000")
        .setTitle("Report")
        .setDescription(report)
        .setThumbnail(reported.avatarURL)
        .setTimestamp(message.createdAt)
        .setFooter(message.author.username, message.author.avatarURL);
    if (reportChannel) reportChannel.send(reportembed);
};