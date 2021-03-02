const { array } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: String, required: true },
    notes: String,
    totalMeasurement: Number,
    productUrl:String,
    entries:Array,
    created: { type: Date, default: Date.now },
    updated: Date
});



module.exports = mongoose.model('WardenInventory', schema);