const mongoose = require('mongoose');

// Task Schema
const taskSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true,
        enum: ["all-day", "timed"] // Only allow specified values
    },
    description: {
        type: String,
        default: ""
    },
    reminder: {
        type: String,
        default: "No"
    },
    completed: {
        type: Boolean,
        default: false
    }
});

// Event Schema
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

// User Data Schema
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
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
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
    },
    savedTasks: {
        type: [taskSchema],
        default: []
    },
    accountStatus: {
        type: String,
        default: "Public",
        enum: ["Private", "Public"]
    }
});

// User Model
const User = mongoose.model('users', userDataSchema);

module.exports = User;
