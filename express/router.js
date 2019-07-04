'use strict';
const express    = require('express');        
const router = express.Router();     

const Bear     = require('./bear');

router.get('/', (req, res) => {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.post('/bears', (req, res) => {
        var bear = new Bear();      
        bear.name = req.body.name;  
        bear.sex = req.body.sex;
        bear.age = req.body.age;
        bear.save(  err => {
            if (err) {
                res.status(501).send(err);
            };
            res.status(200).json({ message: 'Bear created!' });
        });
        
    });

router.get('/bears', (req, res) => {
        Bear.find((err, bears) => {
            if (err) {
                res.status(500).send(err);
            }
            res.status(200).json(bears);
        });
    });

router.get('/bears/:bear_id', (req, res) => {
        Bear.findById(req.params.bear_id, (err, bear) => {
            if (err) {
                res.send(err);
            }
            res.json(bear);
        });
    });

router.put('/bears/:bear_id', (req, res) => {
        Bear.findById(req.params.bear_id, (err, bear) => {

            if (err) {
                res.send(err);
            }
            bear.name = req.body.name;
            bear.sex = req.body.sex;
            bear.age = req.body.age;
            bear.save(err =>  {
                if (err) {
                    res.send(err);
                }
                res.json({ message: 'Bear updated!' });
            });

        });
    });

router.delete('/bears/:bear_id', (req, res) => {
        Bear.remove({
            _id: req.params.bear_id
        }, (err, bear) => {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Successfully deleted' });
        });
    });

module.exports = router;


