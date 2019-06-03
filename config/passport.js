const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const models = require('../models/index');
const bcrypt = require('bcrypt-nodejs');


passport.use(new LocalStrategy(
    {
        usernameField: 'login',
        passwordField: 'password'
    },

    (login, password, done) => {
        console.log('Inside local strategy callback');

        models.User.findOne({
            login
        }).then(user => {
            if (!user) {
                return done(null, false, {error: 'User dont exist'});
            }
            else {
                bcrypt.compare(password, user.password, (err, result) => {
                    if (!result) {
                        return done(null, false, {error: 'Incorrect password'});
                    }
                });
                console.log('Local strategy returned true');
                return done(null, user)
            }

        });
    }
));

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

module.exports = passport;