const Discord = require("discord.js");
const items = require("../../itemsDb/items");
const fs = require("fs");

module.exports.run = (bot, message, args, messageArray) => {

    let shop = [];
    shop.push("**1.Food | 30 Virto**");
    shop.push(":meat_on_bone: Feed you hungry falcon! :meat_on_bone: :meat_on_bone:\n");
    shop.push("**2.Needles | 100 Virto**");
    shop.push(":syringe: Heal your injured poor falcon.");
    shop.push("**3.Falcon | 700 Virto**");
    shop.push(":eagle: Your friend! Take care of it and it will hunt for you!\n");
    shop.push("**4.Car | 1400 Virto**");
    shop.push(":race_car: Work as a taxi for more Virto");
    shop.push("**5.Class 3 Citizen | 500 Virto**");
    shop.push(":small_blue_diamond: New color.\n");
    shop.push("**6.Class 2 Citizen | 2000 Virto**");
    shop.push(":large_blue_diamond: Free nickname changing and new color.\n");
    shop.push("**7.Class 1 Citizen | 3500 Virto**");
    shop.push(":diamond_shape_with_a_dot_inside: Attachments are allowed in most text channels. Have access to the audit logs. Use external Emotes.");
    shop.push("**8.Nickname | 800 Virto**");
    shop.push(":credit_card: Get yourself a nickname in our city!\n");
    shop.push("**9.Yacht | 5000 Virto**");
    shop.push(":cruise_ship: Show off with a cool yacht!");

    let shopEmbed = new Discord.RichEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setTitle("City Shop")
        .setColor(bot.settings.embedColor)
        .setDescription(shop)
        .setFooter(`You can buy stuff by using the command **${bot.config.prefix}buy <item ID>**`, bot.user.avatarURL);
    message.channel.send(shopEmbed);
};

module.exports.config = {
    name: "shop",
    permission: [],
    aliases: [],
    enabled: true
};