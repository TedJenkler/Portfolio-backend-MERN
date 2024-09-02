const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.LINKSHARE_MONGO_URI;
if (!mongoUri) {
    throw new Error('MongoDB URI not defined in environment variables');
}

mongoose.connect(mongoUri);

const mongoDb = mongoose.connection;

mongoDb.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

mongoDb.once('open', () => {
    console.log('Connected to MongoDB');
});

module.exports = { mongoDb };