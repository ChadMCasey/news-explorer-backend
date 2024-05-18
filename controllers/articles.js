const Article = require("../models/Article");
const BadRequestError = require("../utils/errors/BadRequestError");
const ForbiddenError = require("../utils/errors/ForbiddenError");
const NotFoundError = require("../utils/errors/NotFoundError");
const {
  CAST_ERROR,
  VALIDATION_ERROR,
  DOCUMENT_NOT_FOUND_ERROR,
  BAD_REQUEST_ERROR_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
  FORBIDDEN_ERROR_MESSAGE,
  DOCUMENT_NOT_FOUND_ERROR_MESSAGE,
} = require("../utils/constants");

const getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => res.send(articles))
    .catch((err) => {
      next(err);
    });
};

const postArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;

  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: req.user._id,
  })
    .then((article) => res.send(article)) // return created article
    .catch((err) => {
      if (err.name === VALIDATION_ERROR) {
        next(new BadRequestError(VALIDATION_ERROR_MESSAGE));
      } else {
        next(err);
      }
    });
};

const deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId)
    .select("+owner")
    .orFail()
    .then((article) => {
      if (article.owner.toString() !== req.user._id) {
        return next(new ForbiddenError(FORBIDDEN_ERROR_MESSAGE));
      }
      return Article.deleteOne({ _id: req.params.articleId }).then(() =>
        res.send({
          message: `Article ID: ${req.params.articleId} successfully deleted`,
        }),
      );
    })
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

module.exports = {
  getArticles,
  postArticle,
  deleteArticle,
};
