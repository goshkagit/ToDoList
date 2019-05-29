const express = require('express');

const dotenv = require('dotenv');

const bodyParser = require('body-parser');

const joi = require('joi');

const app = express();

app.use(bodyParser.json());

app.use((err, req, res, next) => {
    res.status(err.status).json({

        error: {
            message: err.message
        }
    });
});

app.set('view engine', 'ejs');

const path = require('path');

const db = require('./data');

const collection = "todo";


const schema = joi.object().keys({
    todo: joi.string().required()
});


db.connect((err) => {
    if (err) {
        console.log('Unable to connect to database. Connection error occurred');
        process.exit(1);
    }
    else {
        app.listen(3000, () => {
            console.log('Listening on port 3000 started');
            console.log('Connected to database');
        })
    }
});


app.get('/', (res, req) => {

    req.render('main')
});

app.get('/getAll', (res, req) => {
    db.getDB().collection(collection).find({}).toArray((err, documents) => {
        if (err)
            console.log(err);
        else {
            console.log(documents);
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




