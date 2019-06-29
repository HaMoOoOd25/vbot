const mongoDb = require("mongoose");

const falconSchema = mongoDb.Schema({
    userID: String,
    guildID: String,
    health: Number,
    level: Number,
    hunger: Number
});

module.exports = mongoDb.model("falcons", falconSchema);