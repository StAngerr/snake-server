const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const config = require('config');
const { passwordMin, passwordMax, emailMin, emailMax, nameMin, nameMax, addressMin, addressMax,
  phoneMin, phoneMax } = require('../constants/user.constants');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: nameMin,
    maxlength: nameMax,
  },
  email: {
    type: String,
    required: true,
    minlength: emailMin,
    maxlength: emailMax,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: passwordMin,
    maxlength: passwordMax,
  },
  address: {
    type: String,
    minlength: addressMin,
    maxlength: addressMax,
  },
  phone: {
    type: String,
    minlength: phoneMin,
    maxlength: phoneMax
  },
  isAdmin: Boolean,
});

UserSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin},
      config.get('privateKey'));
  return token;
};

const validateUser = (user) => {
  return Joi.validate(user, {
    name: Joi.string().min(nameMin).max(nameMax).required(),
    address: Joi.string().min(addressMin).max(addressMax),
    phone: Joi.string().min(phoneMin).max(phoneMax),
    email: Joi.string().min(emailMin).max(emailMax).required().email(),
    password: Joi.string().min(passwordMin).max(passwordMax).required(),
  });
};

const validateUserCredentials = (loginData) => {
  return Joi.validate(loginData, {
    email: Joi.string().min(emailMin).max(emailMax).required().email(),
    password: Joi.string().min(passwordMin).max(passwordMax).required(),
  });
};

const validateConfirmPassword = (passwords) => {
  const { error } = Joi.validate(passwords, {
    password: Joi.string().min(passwordMin).max(passwordMax).required(),
    passwordConfirm: Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' } } })
  });
  return error ? error.details[0].message : '';
}

const User = mongoose.model('User', UserSchema);

exports.User = User;

exports.validateUser = validateUser;
exports.validateUserCredentials = validateUserCredentials;
exports.validateConfirmPassword = validateConfirmPassword;

