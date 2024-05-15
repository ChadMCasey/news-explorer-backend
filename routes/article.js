const router = require("express").Router();
const {
  getArticles,
  postArticle,
  deleteArticle,
} = require("../controllers/articles");
const {
  validateArticleID,
  validateArticleBody,
} = require("../middlewares/validation");

router.get("/", getArticles);
router.post("/", validateArticleBody, postArticle);
router.delete("/:articleId", validateArticleID, deleteArticle);

module.exports = router;
