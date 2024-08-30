const mongoose = require('mongoose');


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
});


const user = mongoose.model('users',userDataSchema);
module.exports = user;