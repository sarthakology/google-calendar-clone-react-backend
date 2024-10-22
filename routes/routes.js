const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

const refreshTokens = [];

const generateAccessToken = (user) => {
    return jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '50m' });
};

const generateRefreshToken = (user) => {
    const refreshToken = jwt.sign({ _id: user._id }, REFRESH_SECRET, { expiresIn: '7d' });
    refreshTokens.push(refreshToken);
    return refreshToken;
};

router.post('/register', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            email: req.body.email,
            password: hashedPassword
        });
        await newUser.save();

        res.send({ message: 'registration successful' });
    } catch (error) {
        res.status(500).send({ message: 'Error registering user', error: error.message });
    }
});

router.post('/token', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(404).send({ message: 'user not found' });
    }

    if (!await bcrypt.compare(req.body.password, user.password)) {
        return res.status(400).send({ message: 'invalid credentials' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.send({
        accessToken: accessToken,
        refreshToken: refreshToken
    });
});

router.post('/refreshToken', (req, res) => {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
        return res.status(401).send({ message: 'unauthenticated' });
    }

    if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).send({ message: 'invalid refresh token' });
    }

    jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send({ message: 'invalid refresh token' });
        }

        const accessToken = generateAccessToken(user);
        res.send({ accessToken });
    });
});

router.get('/get/user', async (req, res) => {
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

router.get('/event', async (req, res) => {
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
        res.send(data.savedEvents);
    } catch (e) {
        console.error('Error:', e);
        return res.status(401).send({ message: 'unauthenticated' });
    }
  });
router.get('/task', async (req, res) => {
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
        res.send(data.savedTasks);
    } catch (e) {
        console.error('Error:', e);
        return res.status(401).send({ message: 'unauthenticated' });
    }
  });

  router.put('/update/user', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        const { name, gender, phno, email, profilePicture, accountStatus } = req.body;

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
        user.profilePicture = profilePicture;
        user.accountStatus = accountStatus;

        await user.save();

        res.send({ message: 'Profile updated successfully' });
    } catch (e) {
        console.error('Error:', e);
        return res.status(500).send({ message: 'Error updating profile' });
    }
});


router.put('/save-event', async (req, res) => {
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

        const newEvents = req.body;
        if (!Array.isArray(newEvents)) {
            return res.status(400).send({ message: 'Invalid event data. Expected an array of events.' });
        }

        user.savedEvents = newEvents;
        await user.save();

        res.send({ message: 'Events saved successfully' });
    } catch (e) {
        console.error('Error saving events:', e);
        return res.status(500).send({ message: 'Internal server error' });
    }
});
router.put('/save-task', async (req, res) => {
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

        const newTasks = req.body; // Expecting an array of tasks
        if (!Array.isArray(newTasks)) {
            return res.status(400).send({ message: 'Invalid task data. Expected an array of tasks.' });
        }

        user.savedTasks = newTasks; // Update the user's saved tasks
        await user.save();

        res.send({ message: 'Tasks saved successfully' });
    } catch (e) {
        console.error('Error saving tasks:', e);
        return res.status(500).send({ message: 'Internal server error' });
    }
});


  

module.exports = router;
