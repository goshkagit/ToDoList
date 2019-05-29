const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const joi = require('joi');
const app = express();
const path = require('path');
const db = require('./data');
const collection = "todo";
const bcrypt = require('bcrypt-nodejs');
const models = require('./models');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.use((err, req, res, next) => {
    res.status(err.status).json({

        error: {
            message: err.message
        }
    });
});

app.set('view engine', 'ejs');


const schema = joi.object().keys({
    todo: joi.string().required()
});


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
        } else if (login.length < 3 || login.length > 16) {
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


    app.get('/getAll', (res, req) => {
        db.getDB().collection(collection).find({}).toArray((err, documents) => {
            if (err) {
                console.log(err);
                req.json(err);
            }
            else {
                req.json(documents);
            }
        })
    });


    app.put('/:id', (req, res, next) => {
        const taskId = req.params.id;
        const userInput = req.body;

        joi.validate(userInput, schema, (err, result) => {
            if (err) {
                const error = new Error("Invalid Input");
                error.status = 400;
                next(error);
            }
            else {
                db.getDB().collection(collection).findOneAndUpdate({_id: db.getPrimaryKey(taskId)},
                    {$set: {todo: userInput.todo}}, {returnOriginal: false},
                    (err, result) => {
                        if (err)
                            console.log(err);
                        else {
                            res.json(result);
                        }
                    });
            }
        });
    });

    app.post('/', (req, res, next) => {

        const userInput = req.body;

        joi.validate(userInput, schema, (err, result) => {
            if (err) {
                const error = new Error("Invalid Input");
                error.status = 400;
                next(error);
            }
            else {

                db.getDB().collection(collection).insertOne(userInput, (err, result) => {
                    if (err) {
                        const error = new Error("Failed to save");
                        error.status = 400;
                        next(error);
                    }
                    else
                        res.json({result: result, document: result.ops[0], msg: "Successfully inserted!", error: null});
                });
            }
        });


    });

    app.delete('/:id', (req, res) => {

        const taskID = req.params.id;

        db.getDB().collection(collection).findOneAndDelete({_id: db.getPrimaryKey(taskID)}, (err, result) => {
            if (err)
                console.log(err);
            else {
                res.json(result);
            }
        });

    });




