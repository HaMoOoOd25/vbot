const mongoDb = require("mongoose");
const Discord = require("discord.js");

module.exports = (bot) => {

    console.log(`${bot.user.username} is online`);

    bot.user.setActivity("the city", {type: 'WATCHING'});

    mongoDb.connect(bot.settings.mongoDb, {
        useNewUrlParser: true
    });
};