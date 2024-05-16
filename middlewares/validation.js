const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateUserRegister = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": "The minimum length of the 'name' field is 2",
      "string.max": "The maximum length of the 'name' field is 30",
      "string.empty": "The 'name' field must be filled in",
    }),
    email: Joi.string().required().email().messages({
      "string.empty": "The 'email' field must be filled",
    }),
    password: Joi.string().required().messages({
      "string.empty": "the 'password' field must be filled in",
    }),
  }),
});

const validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": "Please enter a valid email address",
    }),
    password: Joi.string().required(),
  }),
});

const validateArticleBody = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required().min(2).max(30).messages({
      "string.empty": "The 'keyword' field must be filled in",
    }),
    title: Joi.string().required().messages({
      "string.empty": "The 'title' field must be filled in",
    }),
    text: Joi.string().required().messages({
      "string.empty": "The 'text' field must be filled in",
    }),
    date: Joi.string().required().messages({
      "string.empty": "The 'date' field must be filled in",
    }),
    source: Joi.string().required().messages({
      "string.empty": "The 'source' field must be filled in",
    }),
    link: Joi.string().required().custom(validateURL).messages({
      "string.empty": "the 'link' field must be filled in",
      "string.uri": "the 'link' field must be a valid url",
    }),
    image: Joi.string().required().custom(validateURL).messages({
      "string.empty": "the 'image' field must be filled in",
      "string.uri": "the 'image' field must be a valid url",
    }),
    owner: Joi.string().alphanum().length(24).messages({
      "string.empty":
        "the 'owner' field must be filled in with a valid owner id",
    }),
  }),
});

const validateArticleID = celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().alphanum().length(24),
  }),
});

module.exports = {
  validateUserLogin,
  validateUserRegister,
  validateArticleBody,
  validateArticleID,
};
