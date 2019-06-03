const express = require('express');
const logRouter = express.Router();
const models = require('../models');
const auth = require('../config/auth');
const bcrypt = require('bcrypt-nodejs');
const passport = require('passport');


//Registration
logRouter.post('/reg',auth.auth.optional, (req, res) => {
    console.log(req.body);
    let login = req.body.login;
    let password = req.body.password;
    let passwordConfirm = req.body.passwordConfirm;

    if (!login || !password || !passwordConfirm) {
        res.json({
            ok: false,
            error: 'All fields must be fulled',
            fields: ['login', 'password', 'passwordConfirm']
        });
    } else if (!/^[a-zA-Z0-9]+$/.test(login)) {
        res.json({
            ok: false,
            error: 'Only latin letters and numbers',
            fields: ['login']
        });
    }
    else if (login.length < 3 || login.length > 16) {
        res.json({
            ok: false,
            error: 'Login must be > than 3  and < than 16',
            fields: ['login']
        });
    } else if (password !== passwordConfirm) {
        res.json({
            ok: false,
            error: 'Passwords are not the same',
            fields: ['password', 'passwordConfirm']
        });
    } else {
        models.User.findOne({
            login
        }).then(user => {
            if (!user) {
                bcrypt.hash(password, null, null, (err, hash) => {
                    models.User.create({
                        login,
                        password: hash
                    }).then(user => {
                        res.send('Registration compete successfully');
                        res.json({
                            ok: true
                        });
                    }).catch(err => {
                        res.json({
                            ok: false,
                            error: 'An error occurred'
                        });

                    });
                });
            } else {
                res.json({
                    ok: false,
                    error: 'This login is already used',
                    fields: ['login']
                });
            }
        }).catch(err => {
            res.json({
                ok: false,
                error: 'An error occurred',
            });
        });
    }
});

//Log in
logRouter.post('/login', auth.auth.optional, (req, res, next) => {
    const user = req.body;

    if (!user.login) {
        res.json({
            ok: false,
            error: 'Login is required'
        })

    }

    if (!user.password) {
        res.json({
            ok: false,
            error: 'Password is required'
        })
    }

    return passport.authenticate('local', {session: false}, (err, passportUser, info) => {
        if (err) {
            return next(err);
        }

        if (passportUser) {
            return res.json({
                login: passportUser.login,
                token: 'Token' + auth.generate(passportUser)
            });
        }

        return status(400).info;
    })(req, res, next);

});
module.exports = logRouter;