const Discord = require("discord.js");
const virtoSchema = require("../../utils/schemas/virtoSchema");
const errors = require("../../utils/errors");
const db = require("quick.db");
const ms = require("parse-ms");

module.exports.run = async (bot, message, args, messageArray) => {

    //Cooldown
    const cooldown = 600000;
    let lastDaily = await db.fetch(`lastRob_${message.author.id}`);
    if(lastDaily !== null && cooldown - (Date.now() - lastDaily) > 0){
        let timeObj = ms(cooldown - (Date.now() - lastDaily));
        const coolDownEmbed = new Discord.RichEmbed()
            .setAuthor(message.author.tag, message.author.avatarURL)
            .setColor("FF0000")
            .setDescription(`You have to wait **${timeObj.minutes}m ${timeObj.seconds}s** before robbing again.`);
        return message.channel.send(coolDownEmbed);
    }
    db.set(`lastRob_${message.author.id}`, Date.now());

    //Get some jobs
    const crimes = ["bank", "car", "jewelery", "computer", "bank", "stranger", "valuable cup", "old lady's bag"];

    //Success of fail
    const randomPercentage = Math.floor(Math.random() * 100);
    let detector;
    switch (true) {
        case randomPercentage >= 70:
            detector = "success";
        break;
        case randomPercentage < 70:
            detector = "fail";
    }
    //Get a random job
    const randomCrime = Math.floor(Math.random() * crimes.length);

    //The earning range 250-750
    const min = Math.ceil(50);
    const max = Math.floor(200 + 1);
    const toEarn = Math.floor(Math.random() * (max - min) + min);

    //Preparing the embed
    const robEmbed = new Discord.RichEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setColor(bot.settings.embedColor)
        .setDescription(`You robbed a **${crimes[randomCrime]}** and earned **${toEarn}** Virtos.`);

    virtoSchema.findOne({
        guildID: message.guild.id,
        userID: message.author.id
    }, (err, res) => {
        if (err) {
            console.log(err);
            errors.databaseError(message);
        }

        if (detector === "fail"){
            let fine = 0;
            if (!res){
                fine = 0;
            }else{
                fine = Math.floor((res.virtos) * 0.25);
                res.coins = res.virtos - fine;
                res.save().catch(err => {
                    errors.databaseError(message);
                    console.log(err);
                });
            }
            const robFailEmbed = new Discord.RichEmbed()
                .setAuthor(message.author.username, message.author.avatarURL)
                .setColor("FF0000")
                .setDescription(`You got busted and fined ${fine} virtos.`);
            message.channel.send(robFailEmbed);
        }else{
            if (!res) {
                const newData = new virtoSchema({
                    guildID: message.guild.id,
                    userID: message.author.id,
                    virtos: toEarn
                });
                newData.save().catch(err => {
                    console.log(err);
                    errors.databaseError(message);
                });
            }else{
                res.virtos += toEarn;
                res.save().catch(err => {
                    console.log(err);
                    errors.databaseError(message);
                });
            }
            message.channel.send(robEmbed);
        }
    });
};

module.exports.config = {
    name: "rob",
    aliases: [],
    permission: [],
    enabled: true
};