require('dotenv').config();
const mongoose = require('mongoose');
const mongoURL = process.env.MONGO_URI;


mongoose.connect(mongoURL)
    .then(() => console.log("Connected to MongoDB server"))
    .catch(err => console.error('MongoDB connection error:', err));

const db = mongoose.connection; 

db.on('disconnected', () => {
    console.log("MongoDB server disconnected");
});

module.exports = db;      