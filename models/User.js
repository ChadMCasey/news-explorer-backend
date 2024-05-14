const mongoose = require("mongoose");
const validator = require("validator");

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

module.exports = mongoose.model("user", User);
