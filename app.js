const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const app = express();
const db = require('./data');
const bcrypt = require('bcrypt-nodejs');
const models = require('./models');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));


app.use(
    session({
        secret: 'GxjTWP4Mth25rQyB',
        resave: true,
        saveUninitialized: false,
        unset: 'destroy',
        cookie: {
            secure: true,
            maxAge: 6 * 60 * 60 * 1000
        },
        store: new MongoStore({mongooseConnection: mongoose.connection})
    })
);


app.use((err, req, res, next) => {
    res.status(err.status).json({

        error: {
            message: err.message
        }
    });
});

app.set('view engine', 'ejs');


db.connect();

app.listen(3000, () => {
    console.log('Listening on port 3000 started');
});


app.get('/', (res, req) => {

    req.render('main');
});

    app.get('/enter', (res, req) => {
        req.render('register');
    });

//registration
    app.post('/enter', (req, res) => {
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


//log in

    app.post('/enter/login', (req, res) => {

        let login = req.body.login;
        let password = req.body.password;

        if (!login || !password) {
            res.json({
                ok: false,
                error: 'All fields must be fulled',
                fields: ['login', 'password']
            });
        } else {
            models.User.findOne({
                login
            }).then(user => {
                if (!user) {
                    res.json({
                        ok: false,
                        error: 'User with this login or password don`t exist',
                        fields: ['login', 'password']
                    });
                } else {
                    bcrypt.compare(password, user.password, (err, result) => {
                        if (!result) {
                            res.json({
                                ok: false,
                                error: 'Incorrect password',
                                fields: ['login', 'password']
                            });
                        } else {
                            req.session.userId = user.id;
                            req.session.userLogin = user.login;
                            res.json({
                                ok: true
                            });

                        }
                    });
                }
            }).catch(err => {
                res.json({
                    ok: false,
                    error: 'An error occurred'
                });
            });
        }
    });


    app.get('/getAll', (res, req) => {
       models.Task.find({}).exec((err, documents) => {
            if (err) {
                console.log(err);
                req.json(err);
            }
            else {
                req.json(documents);
            }
        });
    });


    app.put('/:id', (req, res) => {
        const taskId = req.params.id;
        const{tittle , task} = req.body;


             models.Task.findOneAndUpdate({_id: db.getPrimaryKey(taskId)},
                    {$set: {title: tittle, task: task}}, {returnOriginal: false},
                    (err, result) => {
                        if (err)
                            console.log(err);
                        else {
                            res.json(result);
                        }
                    });

    });

    app.post('/', (req, res) => {
        const{tittle , task} = req.body;

     models.Task.create({
       tittle: tittle,
       task: task
   }).then(task => console.log(task));
        res.json({
            ok: true
        });
    });


    app.delete('/:id', (req, res) => {

        const taskID = req.params.id;
      models.Task.findOneAndDelete({_id: db.getPrimaryKey(taskID)}, (err, result) => {
            if (err)
                console.log(err);
            else {
                res.json(result);
            }
        });
    });





