const Discord = require("discord.js");
const carSchema = require("../../utils/schemas/carSchema");
const virtoSchema = require("../../utils/schemas/virtoSchema");
const errors = require("../../utils/errors");

module.exports.run = (bot, message, args, messageArray) => {

    const perDamageCost = 3;

    carSchema.findOne({
        guildID: message.guild.id,
        userID: message.author.id
    }, (err, res) => {
        if (err) {
            console.log(err);
            errors.databaseError(message);
        }

        //If user doesn't have a car
        if (!res){
            const noCarEmbed = new Discord.RichEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL)
                .setColor("FF0000")
                .setDescription("You don't have a car to repair!");
            message.channel.send(noCarEmbed);

        }else if (res.health === 100) {// if user's car's health is 100 already.
            const fullHealthEmbed = new Discord.RichEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL)
                .setColor(bot.settings.embedColor)
                .setDescription("Your car is already repaired!");
            message.channel.send(fullHealthEmbed);
        }else{

            //Calculating damage and cost
            const takenDamage = 100 - res.health;
            let toFix = parseInt(args[0]) || takenDamage;
            if (toFix > takenDamage){
                toFix = takenDamage;
            }
            const fixCost = toFix * perDamageCost;

            virtoSchema.findOne({
                guildID: message.guild.id,
                userID: message.author.id
            }, (err, Vres) => {
                if (err) {
                    console.log(err);
                    errors.databaseError(message);
                }

                //if user doesn't have enough money
                if (!Vres || Vres.virtos < fixCost){
                    const remainingVirtos = fixCost - Vres.virtos;
                    const notEnough = new Discord.RichEmbed()
                        .setAuthor(message.author.tag, message.author.avatarURL)
                        .setColor("FF0000")
                        .setDescription(`You need ${remainingVirtos} more Virtos to repair ${toFix} of you car's health`);
                    message.channel.send(notEnough);
                }else{
                    //Applying everything
                    res.health += toFix;
                    Vres.virtos -= fixCost;

                    res.save().catch(err => {
                        console.log(err);
                        errors.databaseError(message);
                    });
                    Vres.save().catch(err => {
                        console.log(err);
                        errors.databaseError(message);
                    });

                    const repairedEmbed = new Discord.RichEmbed()
                        .setAuthor(message.author.tag, message.author.avatarURL)
                        .setColor(bot.settings.embedColor)
                        .setDescription(`We repaired ${toFix} of your car's health for ${fixCost} Virtos.`);
                    message.channel.send(repairedEmbed);
                }
            });
        }
    });
};

module.exports.config = {
    name: "repair",
    aliases: ["fix"],
    permission: [],
    enabled: true
};