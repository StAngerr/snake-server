const auth = require("../middleware/auth");
const express = require("express");
const bcrypt = require("bcrypt");
const { User, validateUser} = require('../models/user.model');
const router = express.Router();


router.get("/current", auth, async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    res.send(userDto(user));
});

router.post("/", async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered.");

    user = new User({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email
    });
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();

    const token = user.generateAuthToken();
    res.header("authorization", token).send(userDto(user));
});

module.exports = router;
