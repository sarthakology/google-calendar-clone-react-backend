const mongoose = require('mongoose');
// const mongoURL = 'mongodb+srv://chauhansarthakchauhan:admin@cluster0.quct4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/CdacCalendar';
const mongoURL = 'mongodb://localhost:27017/GoogleCalendar';

mongoose.connect(mongoURL)
    .then(() => console.log("Connected to MongoDB server"))
    .catch(err => console.error('MongoDB connection error:', err));

const db = mongoose.connection;

db.on('disconnected', () => {
    console.log("MongoDB server disconnected");
});

module.exports = db;     