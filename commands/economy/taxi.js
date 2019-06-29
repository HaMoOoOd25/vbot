const Discord = require("discord.js");
const virtoSchema = require("../../utils/schemas/virtoSchema");
const errors = require("../../utils/errors");
const db = require("quick.db");
const ms = require("parse-ms");

module.exports.run = async (bot, message, args, messageArray) => {

    //Cooldown
    const cooldown = 600000;
    let lastDaily = await db.fetch(`lastTaxi_${message.author.id}`);
    if(lastDaily !== null && cooldown - (Date.now() - lastDaily) > 0){
        let timeObj = ms(cooldown - (Date.now() - lastDaily));
        const coolDownEmbed = new Discord.RichEmbed()
            .setAuthor(message.author.tag, message.author.avatarURL)
            .setColor("FF0000")
            .setDescription(`You have to wait **${timeObj.minutes}m ${timeObj.seconds}s** before working as a taxi again.`);
        return message.channel.send(coolDownEmbed);
    }
    db.set(`lastTaxi_${message.author.id}`, Date.now());

    //You drove a <something> and earend <virtos> Virtos
    const taxiJobs = ["kid to the school", "labor to his job", "programmer to his office", "businessman to his company",
        "teacher to the school", "doctor to the hospital", "celebrity to the stage", "random person to the restaurant",
        "scientist to the lab", "family to the park", "teenagers to the funfair", "veterinarian to his clinic", "youtuber to an event",
        "cashier to the grocery store"];

    //Get a random job
    const randomTaxiJob = Math.floor(Math.random() * taxiJobs.length);

    //The earning range 250-750
    const min = Math.ceil(100);
    const max = Math.floor(300 + 1);
    const toEarn = Math.floor(Math.random() * (max - min) + min);

    //Preparing the embed
    const jobEmbed = new Discord.RichEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setColor(bot.settings.embedColor)
        .setDescription(`You drove a **${taxiJobs[randomTaxiJob]}** and earned **${toEarn}** Virtos.`);

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
    name: "taxi",
    aliases: [],
    permission: [],
    enabled: true
};