const express = require('express');
const router = express.Router();
const models = require('../models');
const db = require('../data');
const auth = require('../config/auth');


router.post('/:login/add', auth.auth.required, (req, res) => {

        let {tittle, task} = req.body;
        let login = req.params.login;

        models.Task.create({
            tittle: tittle,
            task: task,
            whoPosted: login
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

});

router.get('/:login/getAll', auth.auth.required, (req, res) => {

    let login = req.params.login;
    let query = models.Task.find({whoPosted: login});

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

router.put('/:id', auth.auth.required, (req, res) =>{

        let taskId = req.params.id;
        let {tittle, task} = req.body;

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
});

router.delete('/:id', auth.auth.required, (req, res) => {

        let taskId = req.params.id;

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
});

module.exports = router;