const router = require("express").Router();
const usersRouter = require("./user");
const articlesRouter = require("./article");
const { signinUser, signupUser } = require("../controllers/users");
const { authorize } = require("../middlewares/auth");
const NotFoundError = require("../utils/errors/NotFoundError");
const {
  validateUserRegister,
  validateUserLogin,
} = require("../middlewares/validation");

router.post("/signup", validateUserRegister, signupUser);
router.post("/signin", validateUserLogin, signinUser);

router.use(authorize);

router.use("/users", usersRouter);
router.use("/articles", articlesRouter);

// no matching endpoints where found
router.use((req, res, next) => {
  next(new NotFoundError("The requested resource was not found"));
});

module.exports = router;
