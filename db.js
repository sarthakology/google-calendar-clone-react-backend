const mongoose = require('mongoose');

const mongoURL = 'mongodb://localhost:27017/GoogleCalendar';

mongoose.connect(mongoURL)
    .then(() => console.log("Connected to MongoDB server"))
    .catch(err => console.error('MongoDB connection error:', err));

const db = mongoose.connection;

db.on('disconnected', () => {
    console.log("MongoDB server disconnected");
});

module.exports = db;
