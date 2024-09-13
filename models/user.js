const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    label: {
        type: String,
        default: ""
    },
    day: {
        type: Number,
        required: true
    },
    id: {
        type: Number,
        required: true,
        unique: true
    }
});

const userDataSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        default: ""
    },
    phno: {
        type: Number,
        default: 0
    },
    profilePicture: {
        type: String,
        default: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
    },
    savedEvents: {
        type: [eventSchema],
        default: []
    }
});

const user = mongoose.model('users', userDataSchema);

module.exports = user;
