const express = require('express');
const Account = require('../models/Account');
const router = express.Router();

// Create new account
router.post('/create', async (req, res) => {
    try {
        const { accountNumber, accountName, balance } = req.body;

        if (!accountNumber || !accountName || balance == null) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existing = await Account.findOne({ accountNumber });
        if (existing) {
            return res.status(400).json({ message: 'Account already exists' });
        }

        const account = new Account({ accountNumber, accountName, balance });
        await account.save();

        res.status(201).json({ message: 'Account created successfully', account });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Deposit
router.put('/deposit', async (req, res) => {
    try {
        const { accountNumber, amount } = req.body;
        if (!accountNumber || amount == null) {
            return res.status(400).json({ message: 'Account number and amount required' });
        }

        const account = await Account.findOne({ accountNumber });
        if (!account) return res.status(404).json({ message: 'Account not found' });

        account.balance += Number(amount);
        await account.save();

        res.json({ message: 'Deposit successful', balance: account.balance });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Withdraw
router.put('/withdraw', async (req, res) => {
    try {
        const { accountNumber, amount } = req.body;

        const account = await Account.findOne({ accountNumber });
        if (!account) return res.status(404).json({ message: 'Account not found' });

        if (account.balance < amount) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        account.balance -= Number(amount);
        await account.save();

        res.json({ message: 'Withdrawal successful', balance: account.balance });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Transfer
router.put('/transfer', async (req, res) => {
    try {
        const { fromAccount, toAccount, amount } = req.body;

        const sender = await Account.findOne({ accountNumber: fromAccount });
        const receiver = await Account.findOne({ accountNumber: toAccount });

        if (!sender || !receiver) {
            return res.status(404).json({ message: 'Account not found' });
        }

        if (sender.balance < amount) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        sender.balance -= Number(amount);
        receiver.balance += Number(amount);

        await sender.save();
        await receiver.save();

        res.json({ message: 'Transfer successful' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get balance
router.get('/balance/:accountNumber', async (req, res) => {
    try {
        const account = await Account.findOne({ accountNumber: req.params.accountNumber });
        if (!account) return res.status(404).json({ message: 'Account not found' });

        res.json({ balance: account.balance });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
