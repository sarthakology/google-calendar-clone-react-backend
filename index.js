const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = 8083
const db = require('./db');
const User = require('./models/user.js');

const routes = require('./routes/routes.js')
const mastersRoutes = require('./routes/mastersRoutes.js')
const adminRoutes = require('./routes/adminRoutes.js')

const cors = require('cors');
const cookieParser = require('cookie-parser')


app.use(cookieParser()) 
app.use(cors({
  credentials:true,
  origin: 'http://localhost:3000'
}));
app.use(express.json())
app.use('/auth', routes);
app.use('/masters',mastersRoutes);
app.use('/admin',adminRoutes);

app.delete('/event/delete/:id', (req, res) => {});
app.delete('/task/delete/:id', (req, res) => {});

app.get('/search/:email', async (req, res) => {
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










app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})

