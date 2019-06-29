const Discord = require("discord.js");
const virtoSchema = require("../../utils/schemas/virtoSchema");
const errors = require("../../utils/errors");
const db = require("quick.db");
const ms = require("parse-ms");

module.exports.run = async (bot, message, args, messageArray) => {

    //Cooldown
    const cooldown = 300000;
    let lastDaily = await db.fetch(`lastWork_${message.author.id}`);
    if(lastDaily !== null && cooldown - (Date.now() - lastDaily) > 0){
        let timeObj = ms(cooldown - (Date.now() - lastDaily));
        const coolDownEmbed = new Discord.RichEmbed()
            .setAuthor(message.author.tag, message.author.avatarURL)
            .setColor("FF0000")
            .setDescription(`You have to wait **${timeObj.minutes}m ${timeObj.seconds}s** before working again.`);
        return message.channel.send(coolDownEmbed);
    }
    db.set(`lastWork_${message.author.id}`, Date.now());

    //Get some jobs
    const jobs = ["developer", "designer", "pizza delivery guy", "streamer", "teacher", "cop", "programmer", "doctor",
        "scientist", "researcher", "sales man", "cashier", "bodyguard", "veterinarian", "youtuber", "cashier", "reporter"];

    //Get a random job
    const randomJob = Math.floor(Math.random() * jobs.length);

    //The earning range 250-750
    const min = Math.ceil(50);
    const max = Math.floor(150 + 1);
    const toEarn = Math.floor(Math.random() * (max - min) + min);

    //Preparing the embed
    const jobEmbed = new Discord.RichEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setColor(bot.settings.embedColor)
        .setDescription(`You worked as a **${jobs[randomJob]}** and earned **${toEarn}** Virtos.`);

    virtoSchema.findOne({
        guildID: message.guild.id,
        userID: message.author.id
    }, (err, res) => {
        if (err) {
            console.log(err);
            errors.databaseError(message);
        }

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
        message.channel.send(jobEmbed);
    });
};

module.exports.config = {
    name: "work",
    aliases: [],
    permission: [],
    enabled: true
};