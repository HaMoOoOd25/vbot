const Discord = require("discord.js");
const mongoDb = require("mongoose");
const virtoSchema = require("../../utils/schemas/virtoSchema.js");

module.exports.run = async (bot, message, args, messageArray) => {
    mongoDb.connect('mongodb+srv://admin:31045@robot-xi9jt.gcp.mongodb.net/eco?retryWrites=true', {
        useNewUrlParser: true
    });

    virtoSchema.find({
        guildID: message.guild.id
    }).sort([
        ['virtos', 'descending']
    ]).exec((err, res) => {
        if (err) console.log(err);

        let leaderboardEmbed = new Discord.RichEmbed()
            .setTitle("Virtos Leaderboard");

        //If No Results Were Found
        if (res.length === 0){
            leaderboardEmbed.setColor('#FF0000');
            leaderboardEmbed.setDescription('No results were found!')
        }
        //If there was less than 10 members
        else if (res.length < 10){
            const leaderboard = [];
            for(i = 0; i < res.length; i++){
                let member = message.guild.members.get(res[i].userID) || 'User Left';

                if (member === "User Left"){
                    leaderboard.push(`${i + 1}. **${member} | Virtos:** ${res[i].virtos}\n`);
                }else{
                    leaderboard.push(`${i + 1}. **${member.user.username} | Virtos:** ${res[i].virtos}\n`);
                }
            }
            leaderboardEmbed.setColor(bot.settings.embedColor);
            leaderboardEmbed.setDescription(leaderboard);
        }
        //If more than 10 members
        else{
            const leaderboard = [];
            for(i = 0; i < 10; i++){
                let member = message.guild.members.get(res[i].userID) || 'User Left';
                if (member === "User Left"){
                    leaderboard.push(`${i + 1}. **${member} | Virtos:** ${res[i].virtos}\n`);
                }else{
                    leaderboard.push(`${i + 1}. **${member.user.username} | Virtos:** ${res[i].virtos}\n`);
                }
            }
            leaderboardEmbed.setColor(bot.settings.embedColor);
            leaderboardEmbed.setDescription(leaderboard);
        }
        message.channel.send(leaderboardEmbed);
    });
};

module.exports.config = {
    name: "leaderboard",
    permission: [],
    aliases: ["baltop", "lb", "topbal", "topbalance"],
    enabled: true
};