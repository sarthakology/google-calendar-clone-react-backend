const express = require('express');
const router = express.Router();
const User = require('../models/user.js');


 router.put('/change-role', async (req, res) => {
    try {
      const { email, role } = req.body;
   
      const user = await User.findOne({ email });
   
   
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
   
   
      user.role = role;
      await user.save();
   
      res.send({ message: 'Role updated successfully' });
    } catch (e) {
      console.error('Error:', e);
      return res.status(500).send({ message: 'Error updating user role' });
    }
  });

  router.get('/users', async (req, res) => {
    try {
      const users = await User.find({}, 'email role');
  
      if (!users || users.length === 0) {
        return res.status(404).json({ message: 'No users found' });
      }
  
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ message: 'Error fetching users' });
    }
  });

  router.delete('/delete/:email', async (req, res) => {
    try {
        const email = req.params.email;

        const user = await User.findOneAndDelete({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: `User with email ${email} deleted successfully` });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: 'Error deleting user' });
    }
});





module.exports = router;