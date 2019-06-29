const mongoDb = require("mongoose");

const virtoSchema = mongoDb.Schema({
    userID: String,
    guildID: String,
    virtos: Number
});

module.exports = mongoDb.model("virtos", virtoSchema);