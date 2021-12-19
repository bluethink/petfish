const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const aquariumSchema = new Schema({
    glasstype: String,
    size: Number,
    sizeunit: String,
    shape: String,
    fishes:[
        { type: String }
    ],
    status: { type: Boolean, default: true },
    "created_at": { type: Date, default: Date.now },
    "updated_at": { type: Date, default: Date.now },
});

module.exports = mongoose.model('Aquarium', aquariumSchema);