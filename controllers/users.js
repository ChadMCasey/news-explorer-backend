const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const BadRequestError = require("../utils/errors/BadRequestError");
const NotFoundError = require("../utils/errors/NotFoundError");
const ConflictError = require("../utils/errors/ConflictError");
const { JWT_SECRET } = require("../utils/config");
const {
  CAST_ERROR,
  VALIDATION_ERROR,
  DOCUMENT_NOT_FOUND_ERROR,
  BAD_REQUEST_ERROR_MESSAGE,
  DOCUMENT_NOT_FOUND_ERROR_MESSAGE,
  RESOURCE_SUCCESSFULLY_CREATED_STATUS,
  DUPLICATE_ERRROR_STATUS,
  DUPLICATE_EMAIL_ERROR,
  SERVER_ERROR_MESSAGE,
  INVALID_DATA_ERROR,
  MONGO_SERVER_ERROR,
} = require("../utils/constants");

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        next(new BadRequestError(BAD_REQUEST_ERROR_MESSAGE));
      } else if (err.name === DOCUMENT_NOT_FOUND_ERROR) {
        next(new NotFoundError(DOCUMENT_NOT_FOUND_ERROR_MESSAGE));
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
    .then((user) =>
      res.status(RESOURCE_SUCCESSFULLY_CREATED_STATUS).send({
        name: user.name,
        email: user.email,
        _id: user._id,
      }),
    )
    .catch((err) => {
      if (err.code && err.code === DUPLICATE_ERRROR_STATUS) {
        next(new ConflictError(DUPLICATE_EMAIL_ERROR));
      } else if (err.name === VALIDATION_ERROR) {
        next(new BadRequestError(BAD_REQUEST_ERROR_MESSAGE));
      } else if (err.name === MONGO_SERVER_ERROR) {
        next(new ConflictError(SERVER_ERROR_MESSAGE));
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
      if (err.name === INVALID_DATA_ERROR) {
        next(new BadRequestError(BAD_REQUEST_ERROR_MESSAGE));
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
