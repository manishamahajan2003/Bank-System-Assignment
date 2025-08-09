const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    accountNumber: String,
    date: { type: Date, default: Date.now },
    amount: Number,
    totalBalance: Number
});

module.exports = mongoose.model("Transaction", transactionSchema);
