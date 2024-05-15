const Article = require("../models/Article");
const BadRequestError = require("../utils/errors/BadRequestError");
const ForbiddenError = require("../utils/errors/ForbiddenError");
const NotFoundError = require("../utils/errors/NotFoundError");

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
      if (err.name === "ValidationError") {
        next(
          new BadRequestError("The request body data could not be validated"),
        );
      } else {
        next(err);
      }
    });
};

const deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId)
    .orFail()
    .then((article) => {
      if (article.owner.toString() !== req.user._id) {
        return next(
          new ForbiddenError("User unauthorized to delete this item."),
        );
      }
      return Article.deleteOne({ _id: req.params.articleId }).then(() =>
        res.send({
          message: `Article ID: ${req.params.articleId} successfully deleted`,
        }),
      );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Data format is invalid."));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Requested resource not found"));
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
