const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            email: req.body.email,
            password: hashedPassword
        });
        const response = await newUser.save();
        const { password, ...data } = await response.toJSON();
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: 'Error registering user', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(404).send({ message: 'user not found' });
    }

    if (!await bcrypt.compare(req.body.password, user.password)) {
        return res.status(400).send({ message: 'invalid credentials' });
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET);
    res.send({ message: 'success', accessToken: token });
});

router.get('/user', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).send({ message: 'unauthenticated' });
        }

        const claims = jwt.verify(token, JWT_SECRET);

        if (!claims) {
            return res.status(401).send({ message: 'unauthenticated' });
        }

        const user = await User.findOne({ _id: claims._id });
        if (!user) {
            return res.status(404).send({ message: 'user not found' });
        }

        const { password, ...data } = await user.toJSON();
        res.send(data);
    } catch (e) {
        console.error('Error:', e);
        return res.status(401).send({ message: 'unauthenticated' });
    }
});

router.put('/edit-profile', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        const { name, gender, phno, email } = req.body;

        if (!token) {
            return res.status(401).send({ message: 'unauthenticated' });
        }

        const claims = jwt.verify(token, JWT_SECRET);

        if (!claims) {
            return res.status(401).send({ message: 'unauthenticated' });
        }

        const user = await User.findOne({ _id: claims._id });
        if (!user) {
            return res.status(404).send({ message: 'user not found' });
        }

        user.name = name;
        user.gender = gender;
        user.phno = phno;
        user.email = email;
        await user.save();

        res.send({ message: 'Profile updated successfully' });
    } catch (e) {
        console.error('Error:', e);
        return res.status(401).send({ message: 'unauthenticated' });
    }
});

module.exports = router;
