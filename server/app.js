const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// [Configure App to Use bodyParser]
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// [Define Model]
var User = require('./models/User');

// [Configure Router]
const userRouter = require('./routes/users')(app, User);

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // Connected to MongoDB Server
    console.log("Connected to MongoDB Server");
})

mongoose.connect('mongodb://localhost/mongodb_tutorial');

app.get('/', (req, res, next) => {
	res.send('hello world!');
});

app.listen(port, () => {
	console.log(`Server is running at ${port}`);
});
