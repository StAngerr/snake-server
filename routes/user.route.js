const express = require('express');
const { User, validateCreatedUser } = require('../models/user.model');
const router = express.Router();
const { userDto, createUserDto } = require('../models/user.dto');
const generator = require('generate-password');
const bcrypt = require('bcrypt');

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

router.post('/', async (req, res) => {
    const {error} = validateCreatedUser(createUserDto(req.body));
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send('User already exist.');
    const password = generator.generate({
        length: 5,
        numbers: true
    });
    user = new User({
        name: req.body.name,
        password,
        email: req.body.email,
        address: req.body.address,
        phone: req.body.phone
    });
    // user.password = await bcrypt.hash(user.password, 10);
    try {
        await user.save();

    } catch (e) {
        debugger
    }
    res.send(userDto(user));
});


module.exports = router;
