const mongoose = require("mongoose");
const validator = require("validator");

const Article = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(url) {
        return validator.isURL(url);
      },
      message: "you must enter a valid link URL",
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(url) {
        return validator.isURL(url);
      },
      message: "you must enter a valid image URL",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    select: false,
    required: true,
    ref: "user",
  },
});

module.exports = mongoose.model("article", Article);
