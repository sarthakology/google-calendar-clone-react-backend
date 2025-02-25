const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

router.get('/:email', async (req, res) => {
    const email = req.params.email;

    try {
        const user = await User.findOne({ email: email });
        if (user) {
            let responseData = {
                credentials: {
                    name: user.name,
                    gender: user.gender,
                    email: user.email,
                    role: user.role,
                    profilePicture: user.profilePicture || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',
                },
                savedEvents: user.savedEvents || [],
                savedTasks: user.savedTasks || []
            };

            if (user.accountStatus === 'Private') {
                responseData.credentials.phno = 'xxxxxxxxxx';
                responseData.savedEvents = [];
                responseData.savedTasks = [];
            } else {
                responseData.credentials.phno = user.phno || 'Not provided';
            }

            res.status(200).json(responseData);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error searching for user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
