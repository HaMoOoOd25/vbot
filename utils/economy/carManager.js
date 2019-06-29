const Discord = require("discord.js");
const carSchema = require("../schemas/carSchema");
const virtoSchema = require("../schemas/virtoSchema");
const settings = require("../../settings");


module.exports.Cardamage = (message, damage) => {
    carSchema.findOne({
        userID: message.author.id,
        guildID: message.guild.id
    }, (err, car) => {
        if (err) console.log(err);
        if (!car) return;
        car.health = car.health - damage;
        car.save().catch(err => console.log(err));
    })
};

module.exports.repairCar = (message, cost) => {

    carSchema.findOne({
        userID: message.author.id,
        guildID: message.guild.id,
    }, (err, car) => {
        if (err) console.log(err);
        if (!car) {
            let fail1Embed = new Discord.RichEmbed()
                .setAuthor(message.author.username, message.author.avatarURL)
                .setColor("FF0000")
                .setTitle("Repair Shop")
                .setDescription("You don't have a car!");
            message.channel.send(fail1Embed);
            return;
        } else {

            virtoSchema.findOne({
                userID: message.author.id,
                guildID: message.guild.id,
            }, (err, virto) => {
                if (err) console.log(err);

                if (!virto || virto.virtos < cost) {
                    let notEnough = new Discord.RichEmbed()
                        .setAuthor(message.author.username, message.author.avatarURL)
                        .setTitle("City Shop")
                        .setDescription(`You don't have enough Virto to repair your car\n **Repair cost:** ${cost}`)
                        .setTimestamp(message.createdAT)
                        .setColor("#FF0000")
                    message.channel.send(notEnough)
                    return;
                } else {
                    let repaired = new Discord.RichEmbed()
                        .setAuthor(message.author.username, message.author.avatarURL)
                        .setTitle("City Shop")
                        .setDescription(`You repaired your car for ${cost}`)
                        .setTimestamp(message.createdAT)
                        .setColor(colors.taxi)
                    message.channel.send(repaired);

                    car.health = 100;
                    virto.virtos = virto.virtos - cost;
                    car.save().catch(err => console.log(err));
                    virto.save().catch(err => console.log(err));
                }
            })
        }
    })
};