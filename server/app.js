const mongoose = require('mongoose')

//mongoose.connect('mongodb://localhost/NEEDTOGOTOENV', { useNewUrlParser: true, useUnifiedTopology: true })

const express = require('express')
const session = require('express-session')


const database = require('./database.js');

const app = express()
const port = 3000

database();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: 'NEEDTOGOTOENV',
    resave: false,
    saveUninitialized: true
}))

app.use('/api', require('./routes/api'))

app.listen(port)

module.exports = app;
