const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fishSchema = new Schema({
    species: String,
    finscount: Number,
    colorID: String,
});

module.exports = mongoose.model('Fish', fishSchema);