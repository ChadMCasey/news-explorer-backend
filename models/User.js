const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");
const BadRequestError = require("../utils/errors/BadRequestError");

const User = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "Invalid email format, enter valid email",
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // user password wont be returned by default
  },
});

User.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new UnauthorizedError("Incorrect email or password"),
        );
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError("Incorrect email or password"),
          );
        }
        return user;
      });
    })
    .catch((err) => {
      if (!email || !password) {
        return Promise.reject(
          new BadRequestError("The email and/or password fields are missing."),
        );
      }
      return Promise.reject(err);
    });
};

module.exports = mongoose.model("user", User);
