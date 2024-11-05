const express = require('express');
const router = express.Router();
const User = require('../models/user.js');


router.get('/:email', async (req, res) => {
    const email = req.params.email; 
  
    try {
      const user = await User.findOne({ email: email });
      if (user) {
        if (user.accountStatus === 'Private') {
          const privateUserData = {
            name: user.name,
            gender: user.gender,
            email: user.email,
            phno: 'xxxxxxxxxx',
            role: user.role,
            profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',
            savedEvents:[],
            savedTasks:[]
          };
          console.log("run")
          res.status(200).json(privateUserData);
        } else {
          res.status(200).json(user);
        }
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Error searching for user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


module.exports = router;