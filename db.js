const mongoose = require('mongoose');

const mongoURL = 'mongodb+srv://thesarthakchauhan:XIyoZe8VpbtF2czU@cluster0.cxpgt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURL)
    .then(() => console.log("Connected to MongoDB server"))
    .catch(err => console.error('MongoDB connection error:', err));

const db = mongoose.connection;

db.on('disconnected', () => {
    console.log("MongoDB server disconnected");
});

module.exports = db;
  