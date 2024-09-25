const mongoose = require('mongoose');

const CountrySchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    country: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Country', CountrySchema);
