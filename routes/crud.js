const express = require('express');
const router = express.Router();
const models = require('../models');
const db = require('../data');
const auth = require('../config/auth');


router.post('/add', auth.auth.required, (req, res) => {
    if (req.isAuthenticated()) {


        const {tittle, task} = req.body;
        models.Task.create({
            tittle: tittle,
            task: task
        }).then(task => {

            console.log(task);
            if (!task) {
                res.json({
                    ok: false,
                    error: 'All fields required'
                });
            }
            else {
                res.json({
                    ok: true
                })
            }
        }).catch(err => {
            res.json({
                ok: false,
                error: 'Error'
            });
        });

    } else {
        res.json({
            ok: false,
            error: 'You are not logged in!'
        });
    }

});


router.get('/getAll', auth.auth.required, (req, res) => {

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
});

router.put('/:id', auth.auth.required, (req, res) => {
    if (req.isAuthenticated()) {

        const taskId = req.params.id;
        const {tittle, task} = req.body;
        models.Task.findOneAndUpdate({_id: db.getPrimaryKey(taskId)},
            {$set: {title: tittle, task: task}}, {returnOriginal: false},
            (err, result) => {
                if (err)
                    res.json({
                        ok: false,
                        error: 'An error occurred'
                    });
                else {
                    res.json({
                        ok: true
                    });
                }
            });
    } else {
        res.json({
            ok: false,
            error: 'You are not logged in!'
        });
    }
});

router.delete('/:id', auth.auth.required, (req, res) => {
    if (req.isAuthenticated()) {
        const taskId = req.params.id;
        models.Task.findOneAndDelete({_id: db.getPrimaryKey(taskId)}, (err, result) => {
            if (err)
                res.json({
                    ok: false,
                    error: 'An error occurred'
                });
            else {
                res.json({
                    ok: true
                });
            }
        });
    } else {
        res.json({
            ok: false,
            error: 'You are not logged in!'
        });
    }
});

module.exports = router;