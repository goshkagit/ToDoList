const express = require('express');
const logRouter = express.Router();
const models = require('../models');
const db = require('../data');
const bcrypt = require('bcrypt-nodejs');



logRouter.use('/home' , (req , res)=>{
    res.json({
        msg: 'This is home page'
    })
});

//Registration
logRouter.post('/reg' , (req, res) => {
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
                        res.json({
                            ok: true
                        });
                    }).catch(err => {
                        res.json({
                            ok: false,
                            error: 'An error occurred'
                        });
                    })
                });
            } else {
                res.json({
                    ok: false,
                    error: 'This login is already used',
                    fields: ['login']
                });
            }
        });
    }
});


module.exports = logRouter;