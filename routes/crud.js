const express = require('express');
const router = express.Router();
const models = require('../models');
const db = require('../data');

router.post('/add' , (req , res)=> {
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

router.put('/:id' ,(req, res) => {
    if(req.isAuthenticated()) {

        const taskId = req.params.id;
        const {tittle, task} = req.body;
        models.Task.findOneAndUpdate({_id: db.getPrimaryKey(taskId)},
            {$set: {title: tittle, task: task}}, {returnOriginal: false},
            (err, result) => {
                if (err)
                    res.json({
                        ok:  false,
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

router.delete('/:id', (req, res) => {
    if(req.isAuthenticated()) {
        const taskId = req.params.id;
        models.Task.findOneAndDelete({_id: db.getPrimaryKey(taskId)}, (err, result) => {
            if (err)
                res.json({
                    ok:  false,
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