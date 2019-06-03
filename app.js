const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const app = express();
const db = require('./data');
const router = require('./routes/crud');
const logRouter = require('./routes/reg');
const uuid = require('uuid/v4');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const passport = require('./config/passport.js');


db.connect();

app.listen(3000, () => {
    console.log('Listening on port 3000 started');
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(router, logRouter);


app.use(
    session({
        genid: (req) => {
            console.log(`sessionID from client: ${req.sessionID}`);
            return uuid()
        },
        secret: 'GxjTWP4Mth25rQyB',
        resave: true,
        saveUninitialized: true,
        unset: 'destroy',
        cookie: {
            secure: true,
            maxAge: 6 * 60 * 60 * 1000
        },
        store: new MongoStore({mongooseConnection: mongoose.connection})
    })
);

app.use(passport.initialize());
app.use(passport.session());
