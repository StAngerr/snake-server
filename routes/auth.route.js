const { User, validateUserCredentials } = require('../models/user.model');

const bcrypt = require("bcrypt");
const express = require('express');
const { userDto } = require('../models/user.dto');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { error } = validateUserCredentials(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send("User not found");

    const correctPassword = await bcrypt.compare(req.body.password, user.password);
    if (!correctPassword) return res.status(400).send("Wrong login data");

    const token = user.generateAuthToken();

    return res.header('authorization', token).send({
        user: userDto(user),
        token
    });
});


module.exports = router;
