const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
    picture: String,
    text: String
});

module.exports = mongoose.model("Page", pageSchema);