const buyItems = require("../../utils/economy/buyitems");
const Discord = require("discord.js");

module.exports.run = (bot, message, args, messageArray) => {

    //const item = `${args[0]}`.toLocaleLowerCase();
    const item = args[0];

    if (item === "1") {
        buyItems.buy(message, "food", 30);
        return;
    }
    if (item === "2") {
        buyItems.buy(message, "needles", 100);
        return;
    }

    if (item === "3") {
        buyItems.buyFalcon(message);
        return;
    }

    if (item === "4") {
        buyItems.buyCar(message);
        return;
    }

    if(item === "5"){
        buyItems.buyRole(message, 0);
        return;
    }

    if(item === "6"){
        buyItems.buyRole(message, 1);
        return;
    }

    if(item === "7"){
        buyItems.buyRole(message, 2);
        return;
    }

    if (item === "8") {
        buyItems.nickName(message, args);
        return;
    }

    if (item === "9") {
        buyItems.buy(message, "yacht", 5000);
        return;
    }

    if (args.length < 1){
        let incorrectEmbed = new Discord.RichEmbed()
            .setAuthor(message.author.username, message.author.avatarURL)
            .setColor("FF0000")
            .setTitle("City Shop")
            .setDescription("Use this\n``-buy <item ID>``")
            .setTimestamp(message.createdAT)
            .setFooter(bot.user.username, bot.user.avatarURL);
        message.channel.send(incorrectEmbed);
        return;
    }
    let failEmbed = new Discord.RichEmbed()
        .setAuthor(message.author.username, message.author.avatarURL)
        .setColor("FF0000")
        .setTitle("City Shop")
        .setDescription(`Sorry but we don't have an item with this ID **${item}** in our shop.`)
        .setTimestamp(message.createdAT)
        .setFooter(bot.user.username, bot.user.avatarURL);
    message.channel.send(failEmbed);
};

module.exports.config = {
    name: "buy",
    permission: [],
    aliases: [],
    enabled: true
};