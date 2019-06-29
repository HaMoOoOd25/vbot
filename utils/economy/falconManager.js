const Discord = require("discord.js");
const mongoDb = require("mongoose");
const falconSchema = require("../schemas/falconSchema");
const invenSchema = require("../schemas/invenSchema");
const colors = require("../../colors");


mongoDb.connect('mongodb+srv://admin:31045@robot-xi9jt.gcp.mongodb.net/eco?retryWrites=true', {
    useNewUrlParser: true
});

module.exports.falconDamage = (message, damage) => {
    falconSchema.findOne({
        userID: message.author.id,
        guildID: message.guild.id,
    }, (err, falcon) => {
        if (err) console.log(err);
        if (!falcon) return;

        falcon.health = falcon.health - damage;
        falcon.hunger = falcon.hunger - 1;
        falcon.save().catch(err => console.log(err));
    })
}

module.exports.falconHunt = (message, amount) => {
    invenSchema.findOne({
        userID: message.author.id,
        guildID: message.guild.id,
        item: "food"
    }, (err, food) => {
        if (err) console.log(err);
        if (!food) {
            newFood = new invenSchema({
                userID: message.author.id,
                guildID: message.guild.id,
                item: "food",
                amount: amount
            })
            newFood.save().catch(err => console.log(err));
        } else {
            food.amount = food.amount + amount;
            food.save().catch(err => console.log(err));
        }
    })
}

module.exports.huntHunger = (message) => {
    falconSchema.findOne({
        userID: message.author.id,
        guildID: message.guild.id,
    }, (err, falcon) => {
        if (err) console.log(err);
        if (!falcon) return;

        falcon.hunger = falcon.hunger - 1;
        falcon.save().catch(err => console.log(err));
    })
}

module.exports.feedFalcon = (message, foodAMT) => {

    falconSchema.findOne({
        userID: message.author.id,
        guildID: message.guild.id
    }, (err, falcon) => {
        if (err) console.log(err);
        if (!falcon) return;

        invenSchema.findOne({
            userID: message.author.id,
            guildID: message.guild.id,
            item: "food"
        }, (err, food) => {
            if (err) return;
            if (!food || food.amount < foodAMT) {
                let noFoodEmbed = new Discord.RichEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL)
                    .setColor("FF0000")
                    .setTitle("City Falconary")
                    .setDescription("You don't have enough food!")
                    .setTimestamp(message.createdAT)
                message.channel.send(noFoodEmbed);
                return;
            }
            food.amount = food.amount - foodAMT;
            falcon.hunger = falcon.hunger + foodAMT;
            food.save().catch(err => console.log(err));
            falcon.save().catch(err => console.log(err));

            let falconFeeded = new Discord.RichEmbed()
                .setAuthor(message.author.username, message.author.avatarURL)
                .setColor(colors.falcon)
                .setTitle("City Falconary")
                .setDescription(`You fed your falcon ${foodAMT} of your food! Have fun hunting!`)
                .setTimestamp(message.createdAT)
            message.channel.send(falconFeeded);
        })
    })
}


module.exports.healFalcon = (message, foodAMT) => {

    falconSchema.findOne({
        userID: message.author.id,
        guildID: message.guild.id
    }, (err, falcon) => {
        if (err) console.log(err);
        if (!falcon) return;

        invenSchema.findOne({
            userID: message.author.id,
            guildID: message.guild.id,
            item: "needles"
        }, (err, needles) => {
            if (err) return;
            if (!needles || needles.amount < 1) {
                let noNeedlesEmbed = new Discord.RichEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL)
                    .setColor("FF0000")
                    .setTitle("City Falconary")
                    .setDescription("You don't have needles.")
                    .setTimestamp(message.createdAT)
                message.channel.send(noNeedlesEmbed);
                return;
            }
            needles.amount = needles.amount - 1;
            falcon.health = 100;
            needles.save().catch(err => console.log(err));
            falcon.save().catch(err => console.log(err));

            let falconHealed = new Discord.RichEmbed()
                .setAuthor(message.author.username, message.author.avatarURL)
                .setColor(colors.falcon)
                .setTitle("City Falconary")
                .setDescription(`Your falcon is now happy and healthy!`)
                .setTimestamp(message.createdAT)
            message.channel.send(falconHealed);
        })
    })
}