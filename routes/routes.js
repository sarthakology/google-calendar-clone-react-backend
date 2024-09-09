const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// JWT secret keys from environment variables
const JWT_SECRET = process.env.JWT_SECRET; // Secret key for access tokens
const REFRESH_SECRET = process.env.REFRESH_SECRET; // Secret key for refresh tokens

// In-memory storage for refresh tokens (can be replaced by a database)
const refreshTokens = [];

// Function to generate an access token with a short expiration time 5sec
const generateAccessToken = (user) => {
    return jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '5s' });
};

// Function to generate a refresh token with a expiration time 7 days
const generateRefreshToken = (user) => {
    const refreshToken = jwt.sign({ _id: user._id }, REFRESH_SECRET, { expiresIn: '7d' });

    refreshTokens.push(refreshToken); // Store the refresh token in memory (can be stored in a database)
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

        res.send({ message: 'registeration successfull'});
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
    // Extract the refresh token from the request body
    const refreshToken = req.body.refreshToken;

    // If no refresh token is provided, return a 401 error (unauthenticated)
    if (!refreshToken) {
        return res.status(401).send({ message: 'unauthenticated' });
    }

    // If the provided refresh token is not valid (not in the stored list), return a 403 error (forbidden)
    if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).send({ message: 'invalid refresh token' });
    }

    // Verify the validity of the refresh token
    jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
        if (err) {
            // If the token is invalid, return a 403 error
            return res.status(403).send({ message: 'invalid refresh token' });
        }

        // If valid, generate a new access token
        const accessToken = generateAccessToken(user);
        // Send the new access token as a response
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

router.put('/update/user', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        const { name, gender, phno, email, profilePicture } = req.body;

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
        await user.save();

        res.send({ message: 'Profile updated successfully' });
    } catch (e) {
        console.error('Error:', e);
        return res.status(401).send({ message: 'unauthenticated' });
    }
});
router.get('/', (req, res) => {
    res.send('Hello World!')
  })

module.exports = router;
