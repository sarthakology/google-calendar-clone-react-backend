const mongoose = require('mongoose');

const TimeZoneSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    timezone: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('TimeZone', TimeZoneSchema);
