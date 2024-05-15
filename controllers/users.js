const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const BadRequestError = require("../utils/errors/BadRequestError");
const NotFoundError = require("../utils/errors/NotFoundError");
const ConflictError = require("../utils/errors/ConflictError");
const { JWT_SECRET } = require("../utils/config");

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid User ID Format"));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("User with specified ID not found."));
      } else {
        next(err);
      }
    });
};

const signupUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }))
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("The data entered is invalid"));
      } else if (err.name === "MongoServerError") {
        next(new ConflictError("An error occured on the server."));
      } else {
        next(err);
      }
    });
};

const signinUser = (req, res, next) => {
  User.findUserByCredentials(req.body.email, req.body.password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      const { name, email, _id } = user;
      res.send({ name, email, token, _id });
    })
    .catch((err) => {
      if (err.name === "InvalidData") {
        next(new BadRequestError("Invalid username or password."));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCurrentUser,
  signinUser,
  signupUser,
};
