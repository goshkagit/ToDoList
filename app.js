const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const app = express();
const db = require('./data');
const router = require('./routes/crud');
const logRouter = require('./routes/reg');
const uuid = require('uuid/v4');
const passport = require('passport');
const bcrypt = require('bcrypt-nodejs');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const models = require('./models');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);


app.use(express.static('public'));
app.use(router , logRouter);

db.connect();

app.listen(3000, () => {
    console.log('Listening on port 3000 started');
});

passport.use(new LocalStrategy(
    { usernameField: 'login' },
    (login, password, done) => {
        console.log('Inside local strategy callback');

        models.User.findOne({
            login
        }).then(user => {
                if (!user) {
                    console.log('User with this login or password don`t exist');
                    process.exit(1);
                } else {
                    bcrypt.compare(password, user.password, (err, result) => {
                        if (!result) {
                            console.log('Incorrect password');
                            process.exit(1);
                        }
                     else {
                            console.log('Local strategy returned true');
                            return done(null, user)
                        }
                    });
                }
            }
        )
    }));

passport.serializeUser((user, done) => {
    console.log(' serializeUser callback. User id is save to the session file store here');
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    console.log(' deserializeUser callback');
    console.log(` user id passport saved in the session file store is: ${id}`);
    const user = models.User.findById(id);
    done(null, user);
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
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



app.post('/login', (req, res, next) => {
    console.log('POST /login callback');
    passport.authenticate('local', (err, user, info) => {
        console.log('passport.authenticate() callback');
        console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`);
        console.log(`req.user: ${JSON.stringify(req.user)}`);
        req.login(user, (err) => {
            console.log('req.login() callback');
            console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`);
            console.log(`req.user: ${JSON.stringify(req.user)}`);
            return res.send('You were authenticated & logged in!');
        });
        console.log(`User authenticated? ${req.isAuthenticated()}`);
    })(req, res, next);
});

router.get('/getAll' , (req , res)=>{
    console.log(`User authenticated? ${req.isAuthenticated()}`);
    if(req.isAuthenticated()) {

        let query = models.Task.find({});

        query.exec((err, documents) => {
            if (err) {
                res.json({
                    ok: false
                })
            } else {
                res.json({
                    documents: documents
                })
            }
        });
    } else {
        res.json({
            ok: false,
            error: 'You are not logged in!'
        });
    }
});











