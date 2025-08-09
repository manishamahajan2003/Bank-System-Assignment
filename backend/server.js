const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Transaction = require('./models/Transaction');


const accountRoutes = require('./routes/accountRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/accounts', accountRoutes);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(process.env.PORT, () => {
        console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
    });
}).catch(err => {
    console.error('❌ MongoDB connection error:', err);
});



