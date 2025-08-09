const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    accountNumber: { type: Number, required: true, unique: true },
    accountName: { type: String, required: true },
    balance: { type: Number, required: true, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Account', accountSchema);
