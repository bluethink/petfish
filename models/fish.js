const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fishSchema = new Schema({
    species: String,
    finscount: Number,
    colorID: String,
    status: { type: Boolean, default: true },
    "created_at": { type: Date, default: Date.now },
    "updated_at": { type: Date, default: Date.now },
});

module.exports = mongoose.model('Fish', fishSchema);