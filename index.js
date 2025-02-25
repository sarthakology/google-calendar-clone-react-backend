const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = 8083
const db = require('./db');
const cors = require('cors');
const cookieParser = require('cookie-parser')

const routes = require('./routes/routes.js')
const mastersRoutes = require('./routes/mastersRoutes.js')
const adminRoutes = require('./routes/adminRoutes.js')
const searchRoute = require('./routes/searchRoute.js')

app.use(cookieParser()) 
app.use(cors({
  credentials:true,
  origin: 'http://localhost:3000'
}));
app.use(express.json())
app.use('/auth', routes);
app.use('/masters',mastersRoutes);
app.use('/auth/admin',adminRoutes);
app.use('/auth/search',searchRoute);


app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})

