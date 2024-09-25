const mongoose = require('mongoose');

const LanguageSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    language: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Language', LanguageSchema);
