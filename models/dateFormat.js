const mongoose = require('mongoose');

const DateFormatSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    format: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('DateFormat', DateFormatSchema);
