const express = require('express');
const { User } = require('../models/user.model');
const router = express.Router();
const { userDto } = require('../models/user.dto');

router.get('/', (req, res) => {
    User.find({}, (err, users) => {
        if (err) {
            res.send(err);
        }
        res.json(users.map((user) => userDto(user)));
    });
});

router.get('/:id', (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err) {
            res.send('user not found');
        }
        res.send(JSON.stringify(userDto(user)));
    })
});

router.delete('/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id, (err) => {
        if (err) {
            res.send(err);
        }
        res.send('User with id' + req.params.id + ' was removed.');
    })
});

router.put('/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, { }, (err, user) => {
        if (err) {
            res.send(err);
        }
        res.send(user);
    })
});


module.exports = router;
