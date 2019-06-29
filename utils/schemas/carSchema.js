const mongoDb = require("mongoose");

const carSchema = mongoDb.Schema({
    userID: String,
    guildID: String,
    health: Number,
    level: Number
});

module.exports = mongoDb.model("cars", carSchema);