const router = require("express").Router();
const usersRouter = require("./user");
const articlesRouter = require("./article");

router.use("/users", usersRouter);
router.use("/articles", articlesRouter);

module.exports = router;
