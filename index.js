const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = 8083
const db = require('./db');
const User = require('./models/user.js');

const routes = require('./routes/routes.js')
const mastersRoutes = require('./routes/mastersRoutes.js')

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

app.delete('/event/delete/:id', (req, res) => {
  const eventId = req.params.id;
  
  console.log(`Delete request received for Event ID: ${eventId}`);
  console.log('Request body:', req.body);

  // Send a response back to acknowledge the delete request
  // res.status(200).json({ message: `Event ${eventId} deletion received` });
});

app.get('/search/:email', async (req, res) => {
  const email = req.params.email;

  try {
    const user = await User.findOne({ email: email });

    if (user) {
      // User found, send user data as response
      res.status(200).json(user);
    } else {
      // User not found
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

