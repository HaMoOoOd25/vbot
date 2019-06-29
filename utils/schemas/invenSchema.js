const mongoDb = require("mongoose");

const invenShema = mongoDb.Schema({
    userID: String,
    guildID: String,
    item: String,
    amount: Number
});

module.exports = mongoDb.model("inventory", invenShema);