//Imports
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = process.env.PORT || 5000;

//Middleware use
app.use(cors());
app.use(express.json());





app.get('/', (req, res) => {
    console.log('Hitting backend');
    res.send('Delivery Service Backend')
})

app.listen(port, () => {
    console.log('Listening to port ', port);
})