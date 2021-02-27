const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: String, required: true },
    expires: { type: Boolean, required: true },
    acceptTerms: Boolean,
    created: { type: Date, default: Date.now },
    updated: Date
});



module.exports = mongoose.model('WardenInventory', schema);