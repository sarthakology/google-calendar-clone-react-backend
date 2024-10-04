const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = 8083
const db = require('./db');

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




app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})

