// [Load Packages]
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const fileStore = require('session-file-store')(session);
const app = express();
const port = 3000;

// [Configure Session]
app.use(session({
    secret: 'my key',
    resave: false,
    saveUninitialized: true,
    store: new fileStore(),
}));

// [Configure App to Use bodyParser]
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// [Define Model]
var User = require('./models/user');
var UserFriend = require('./models/userFriend');
var Schedule = require('./models/schedule');
var ScheduleUser = require('./models/scheduleUser');

// [Configure Router]
const indexRouter = require('./routes/index')(app, User, UserFriend, Schedule,ScheduleUser);
const userRouter = require('./routes/users')(app, User);
const userFriendRouter = require('./routes/userFriends')(app, User, UserFriend);
const scheduleRouter = require('./routes/schedules')(app, User, Schedule, ScheduleUser);
const shceduleUserRouter = require('./routes/scheduleUsers')(app, ScheduleUser, User, Schedule);

// [Configure View Path]
app.set('views', __dirname + '/views');

// [Configure View Engine to ejs]
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// [Configure Path to /public (for using static file)]
app.use(express.static('public'));

// [Configure mongoose]
var db = mongoose.connection; // Connect to MongoDB Server 
db.on('error', console.error);
db.once('open', function(){
    // Connected to MongoDB Server
    console.log("Connected to MongoDB Server");
})

mongoose.connect('mongodb://localhost/mongodb_tutorial');

// [Run Server]
var server = app.listen(port, function() {
    console.log(`Example app listening at http://localhost:${port}`);
})
