const { User, validateUserCredentials, validateConfirmPassword, validateUser } = require('../models/user.model');

const express = require('express');
const { userDto } = require('../models/user.dto');
const router = express.Router();

router.post('/login', async (req, res) => {
  const {error} = validateUserCredentials(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({email: req.body.email});
  if (!user) return res.status(404).send('User not found');
  if (req.body.password !== user.password) return res.status(400).send('Wrong login data');

  const token = user.generateAuthToken();

  return res.header('authorization', token).send({
    user: userDto(user),
    token,
  });
});

router.post('/register', async (req, res) => {
  const { error } = validateUser(userDto(req.body));
  if (error) return res.status(400).send(error.details[0].message);

  const confirmErrorMsg = validateConfirmPassword({
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  if (confirmErrorMsg) return res.status(400).send(confirmErrorMsg);

  if (await User.findOne({ email: req.body.email })) return res.status(400).send('User already exists');

  const newUser = new User({ ...req.body });

  const jwtToken = newUser.generateAuthToken();
  newUser.save();

  res.send({
    token: jwtToken,
    user: userDto(newUser)
  });
});


module.exports = router;
