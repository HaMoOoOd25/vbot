const Discord = require("discord.js");
const errors = require("../errors");
const virtoSchema = require("../schemas/virtoSchema");
const invenSchema = require("../schemas/invenSchema");
const carSchema = require("../schemas/carSchema.js");
const falconSchema = require("../schemas/falconSchema.js");
const settings = require("../../settings");

//For buying items to INVENTORY ONLY!!
module.exports.buy = (message, item, cost) => {
    //Getting Virtos Schema
    virtoSchema.findOne({
        userID: message.author.id,
        guildID: message.guild.id
    }, (err, virto) => {

        if (err) console.log(err);
        //If user don't have a balance or don't have enough virtos

        if (!virto || virto.virtos < cost) {
            const remainingVirtos = virto.virtos - cost || 0;
            let notEnough = new Discord.RichEmbed()
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTitle("City Shop")
                .setDescription(`You need ${remainingVirtos} more Virtos to buy ${item}`)
                .setColor("#FF0000");
            message.channel.send(notEnough);

        } else { //if he does
            invenSchema.findOne({
                userID: message.author.id,
                guildID: message.guild.id,
                item: item
            }, (err, res) => {
                if (err) console.log(err);
                if (!res) {
                    let newItem = new invenSchema({
                        userID: message.author.id,
                        guildID: message.guild.id,
                        item: item,
                        amount: 1
                    });
                    newItem.save().catch(err => {
                        console.log(err);
                        errors.databaseError(message);
                    });
                } else {
                    res.amount = res.amount + 1;
                    res.save().catch(err => {
                        console.log(err);
                        errors.databaseError(message);
                    });
                }
                virto.virtos = virto.virtos - cost;
                virto.save().catch(err => {
                    console.log(err);
                    errors.databaseError(message);
                });
                let purchased = new Discord.RichEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL)
                    .setTitle("City Shop")
                    .setDescription(`You purchased a ${item} for ${cost} Virtos`)
                    .setTimestamp(message.createdAT)
                    .setColor(settings.embedColor);
                message.channel.send(purchased);
            })
        }
    })
};


//Buy car
module.exports.buyCar = (message) => {

    virtoSchema.findOne({
        userID: message.author.id,
        guildID: message.guild.id
    }, (err, virto) => {
        if (err) {
            console.log(err);
            errors.databaseError(message);
        }

        if (!virto || virto.virtos < 1400) {
            const remainingVirtos = 1400 - virto.virtos || 1400;
            let notEnough = new Discord.RichEmbed()
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTitle("City Shop")
                .setDescription(`You need ${remainingVirtos} more Virtos to buy the car.`)
                .setColor("#FF0000");
            message.channel.send(notEnough);
        } else {
            carSchema.findOne({
                userID: message.author.id,
                guildID: message.guild.id
            }, (err, car) => {
                if (err) {
                    console.log(err);
                    errors.databaseError(message);
                }

                if (car) {
                    let carExistEmbed = new Discord.RichEmbed()
                        .setAuthor(message.author.username, message.author.avatarURL)
                        .setTitle("City Shop")
                        .setDescription(`You already have a nice car!`)
                        .setColor("#FF0000");
                    message.channel.send(carExistEmbed);
                } else {
                    let newCar = new carSchema({
                        guildID: message.guild.id,
                        userID: message.author.id,
                        health: 100,
                        level: 1
                    });
                    newCar.save().catch(err => {
                        console.log(err);
                        errors.databaseError(message);
                    });

                    virto.virtos = virto.virtos - 1400;
                    virto.save().catch(err => {
                        console.log(err);
                        errors.databaseError(message);
                    });
                    let purchased = new Discord.RichEmbed()
                        .setAuthor(message.author.username, message.author.avatarURL)
                        .setTitle("City Shop")
                        .setDescription(`You purchased a car for 1400 Virtos!`)
                        .setColor(settings.embedColor);
                    message.channel.send(purchased);
                }
            })
        }
    })
};

module.exports.buyFalcon = (message) => {

    virtoSchema.findOne({
        userID: message.author.id,
        guildID: message.guild.id
    }, (err, virto) => {
        if (err) {
            console.log(err);
            errors.databaseError(message);
        }

        if (!virto || virto.virtos < 700) {
            const remainingVirtos = 700 - virto.virtos || 700;
            let notEnough = new Discord.RichEmbed()
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTitle("City Shop")
                .setDescription(`You need ${remainingVirtos} more Virtos to buy the falcon.`)
                .setColor("#FF0000");
            message.channel.send(notEnough);
        } else {

            falconSchema.findOne({
                userID: message.author.id,
                guildID: message.guild.id
            }, (err, falcon) => {

                if (err) console.log(err);

                if (falcon) {
                    let carExistEmbed = new Discord.RichEmbed()
                        .setAuthor(message.author.username, message.author.avatarURL)
                        .setTitle("City Shop")
                        .setDescription(`You already have friendly falcon!`)
                        .setColor("#FF0000");
                    message.channel.send(carExistEmbed);
                } else {
                    let newFalcon = new falconSchema({
                        userID: message.author.id,
                        guildID: message.guild.id,
                        health: 100,
                        level: 1,
                        hunger: 10
                    });

                    newFalcon.save().catch(err => {
                        console.log(err);
                        errors.databaseError(message);
                    });

                    virto.virtos = virto.virtos - 700;
                    virto.save().catch(err => {
                        console.log(err);
                        errors.databaseError(message);
                    });
                    let purchased = new Discord.RichEmbed()
                        .setAuthor(message.author.username, message.author.avatarURL)
                        .setTitle("City Shop")
                        .setDescription(`You purchased a falcon for 700 Virtos`)
                        .setColor(settings.embedColor);
                    message.channel.send(purchased);
                }
            })
        }
    })
};

module.exports.nickName = (message, args) => {
    //-buy 8 nickname is hello

    let nickname = args.slice(1).join(" ");
    let cost = 800;

    //Check if nickname character is more than 32
    if (nickname.length > 32) {
        let characterEmbed = new Discord.RichEmbed()
            .setColor("FF0000")
            .setAuthor(message.author.username, message.author.avatarURL)
            .setDescription("You nickname must be less than 32 character");
        message.channel.send(characterEmbed).then(msg => {
            msg.delete(5000);
        });
        return;
    }

    if (!nickname) {
        let wrongSyntax = new Discord.RichEmbed()
            .setColor("FF0000")
            .setAuthor(message.author.username, message.author.avatarURL)
            .setDescription("Please specify a nickname\n``buy 8 my nickname``");
        message.channel.send(wrongSyntax).then(msg => {
            msg.delete(5000);
        });
        return;
    }

    virtoSchema.findOne({
        userID: message.author.id,
        guildID: message.guild.id
    }, (err, virto) => {
        if (err) {
            console.log(err);
            errors.databaseError(message);
        }

        const remainingVirtos = cost - virto.virtos || cost;
        if (!virto || virto.virtos < cost) {
            let notEnough = new Discord.RichEmbed()
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTitle("City Shop")
                .setDescription(`You need ${remainingVirtos} more Virtos to buy a nickname.`)
                .setColor("#FF0000");
            message.channel.send(notEnough);
        } else {
            message.member.setNickname(nickname);
            let nicknamePurchased = new Discord.RichEmbed()
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTitle("City Shop")
                .setDescription(`Your nickname has successfully been set to **${nickname}** for ${cost} Virtos`)
                .setColor(settings.embedColor);
            message.channel.send(nicknamePurchased);

            virto.virtos = virto.virtos - cost;
            virto.save().catch(err => {
                console.log(err);
                errors.databaseError(message);
            });
        }
    })
};

module.exports.buyRole = (message, roleIndex) => {

    const class3Role = {
        name: "Class III Citizen",
        cost: 500
    };
    const class2Role = {
        name: "Class II Citizen",
        cost: 200
    };
    const class1Role = {
        name:  "Class I Citizen",
        cost: 3500
    };

    const roles = [class3Role, class2Role, class1Role];

    const roleToBuy = roles[roleIndex];

    const role = message.guild.roles.find(r => r.name === roleToBuy.name);

    virtoSchema.findOne({
        guildID: message.guild.id,
        userID: message.author.id
    }, async (err, res) => {
        if (err) {
            console.log(err);
            errors.databaseError(message);
        }

        if (!res || res.virtos < roleToBuy.cost) {
            const remainingVirtos = roleToBuy.cost - virto.virtos || cost;
            let notEnough = new Discord.RichEmbed()
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTitle("City Shop")
                .setDescription(`You need ${remainingVirtos} more Virtos to buy a ${roleToBuy.name}`)
                .setColor("#FF0000");
            message.channel.send(notEnough);
        }else{
            let purchased = new Discord.RichEmbed()
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTitle("City Shop")
                .setDescription(`You have successfully purchased ${roleToBuy.name} role for ${roleToBuy.cost}`)
                .setColor(settings.embedColor);
            message.channel.send(purchased);

            await (message.member.addRole(role.id));
            res.virtos = res.virtos - roleToBuy.cost;
            res.save().catch(err => {
                console.log(err);
                errors.databaseError(message);
            });
        }
    })
};