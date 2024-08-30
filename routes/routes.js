// Import required modules
const router = require('express').Router(); // Creates a new router object to handle routes
const bcrypt = require('bcryptjs'); // Library for hashing and comparing passwords
const User = require('../models/user.js'); // User model for interacting with MongoDB
const jwt = require('jsonwebtoken'); // Library for generating and verifying JSON Web Tokens (JWT)
require('dotenv').config(); // Load environment variables from the .env file

const JWT_SECRET = process.env.JWT_SECRET; // Access the JWT secret from environment variables

// Route to register a new user
router.post('/register', async (req, res) => {
    try {
        // Generate a salt for hashing the password
        const salt = await bcrypt.genSalt(10);
        // Hash the user's password using the generated salt
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create a new user instance with the hashed password
        const newUser = new User({
            email: req.body.email,
            password: hashedPassword // Save hashed password
        });

        // Save the new user to the database
        const response = await newUser.save();
        // Exclude the password field from the response
        const { password, ...data } = await response.toJSON();
        // Send the user data as a response
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: 'Error registering user', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    // Find the user by email
    const user = await User.findOne({ email: req.body.email });

    // If the user is not found, return a 404 error
    if (!user) {
        return res.status(404).send({
            message: 'user not found'
        });
    }

    // Compare the provided password with the stored hashed password
    if (!await bcrypt.compare(req.body.password, user.password)) {
        return res.status(400).send({
            message: 'invalid credentials'
        });
    }

    // Generate a JWT token with the user's ID
    const token = jwt.sign({ _id: user._id }, JWT_SECRET);

    // Send the token in the response
    res.send({
        message: 'success',
        token: token
    });
});

router.get('/user', async (req, res) => {
    try {
        // Retrieve the JWT token from the Authorization header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'

        if (!token) {
            return res.status(401).send({
                message: 'unauthenticated'
            });
        }

        // Verify the JWT token and extract the claims (user ID)
        const claims = jwt.verify(token, JWT_SECRET);

        // If the token is invalid, return a 401 error
        if (!claims) {
            return res.status(401).send({
                message: 'unauthenticated'
            });
        }

        // Find the user by ID (extracted from the token claims)
        const user = await User.findOne({ _id: claims._id });
        if (!user) {
            return res.status(404).send({
                message: 'user not found'
            });
        }

        // Exclude the password field from the response
        const { password, ...data } = await user.toJSON();

        // Send the user data as a response
        res.send(data);
    } catch (e) {
        console.error('Error:', e);
        // If any error occurs (e.g., invalid token), return a 401 error
        return res.status(401).send({
            message: 'unauthenticated'
        });
    }
});

module.exports = router;
