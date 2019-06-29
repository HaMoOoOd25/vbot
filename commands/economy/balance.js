const Discord = require("discord.js");
const virtoSchema = require("../../utils/schemas/virtoSchema");
const errors = require("../../utils/errors");

module.exports.run = (bot, message, args, messageArray) => {

    const member = message.mentions.members.first() || message.mentions.users.first() || message.member;

    virtoSchema.findOne({
        guildID: message.guild.id,
        userID: member.user.id
    }, (err, res) => {
        if (err) {
            errors.databaseError(message);
            console.log(err);
        }

        if (!res || res.virtos === 0){
            const noMessagesEmbed = new Discord.RichEmbed()
                .setAuthor(message.author.username, message.author.avatarURL)
                .setColor(bot.settings.embedColor)
                .setDescription(`${member} has 0 coins`);
            message.channel.send(noMessagesEmbed);
        }else{
            const resultsEmbed = new Discord.RichEmbed()
                .setAuthor(message.author.username, message.author.avatarURL)
                .setColor(bot.settings.embedColor)
                .setDescription(`${member} has ${res.virtos} coins`);
            message.channel.send(resultsEmbed);
        }
    })
};

module.exports.config = {
    name: "balance",
    aliases: ["bal", "virtos"],
    permission: [],
    enabled: true
};