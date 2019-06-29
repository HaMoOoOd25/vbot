const Discord = require("discord.js");
const virtoSchema = require("../../utils/schemas/virtoSchema");
const errors = require("../../utils/errors");

module.exports.run = (bot, message, args, messageArray) => {

    //donate amount @someone
    if (args.length < 2 || message.mentions.members < 1) return errors.wrongCommandUsage(message, "donate <amount> @someone");

    const toDonate = message.mentions.members.first() || message.mentions.users.first();
    //If user not found
    if (!toDonate) return errors.noUserError(message);

    const toDonateAmt = parseInt(args[0]);
    if (!toDonateAmt) return errors.noAmountError(message);

    if (toDonate.id === message.author.id) return errors.yourselfError(message);

    virtoSchema.findOne({
        guildID: message.guild.id,
        userID: message.author.id
    }, (err, res) => {
        if (err) {
            errors.databaseError(message);
            console.log(err);
        }

        if (!res || res.virtos < toDonateAmt) {
            const noEnoughEmbed = new Discord.RichEmbed()
                .setAuthor(message.author.username, message.author.avatarURL)
                .setColor("#FF0000")
                .setDescription(`You don't have enough Virtos to donate to ${toDonate}`);
            message.channel.send(noEnoughEmbed);
            return;
        }

        res.virtos = res.virtos - toDonateAmt;
        res.save().catch(err => {
            errors.databaseError(message);
            console.log(err);
        });

        //Getting donated person info
        virtoSchema.findOne({
            guildID: message.guild.id,
            userID: toDonate.user.id
        }, (err, res) => {
            if (err) {
                errors.databaseError(message);
                console.log(err);
            }

            if (!res) {
                const newData = new virtoSchema({
                    guildID: message.guild.id,
                    userID: toDonate.user.id,
                    virtos: toDonateAmt
                });
                newData.save().catch(err => {
                    errors.databaseError(message);
                    console.log(err);
                });
            }else{
                res.virtos = res.virtos + toDonateAmt;
                res.save().catch(err => {   
                    errors.databaseError(message);
                    console.log(err);
                });
            }
            const donatedEmbed = new Discord.RichEmbed()
                .setAuthor(message.author.username, message.author.avatarURL)
                .setDescription(`${message.author}, you have donated ${toDonateAmt} Virtos to ${toDonate}.`)
                .setColor(bot.settings.embedColor);
            message.channel.send(donatedEmbed);
        });
    });
};

module.exports.config = {
    name: "donate",
    aliases: ["give"],
    permission: [],
    enabled: true
};