const router = require("mongoose").Router();
const { getCurrentUser } = require("../controllers/users");

router.get("/me", getCurrentUser);

module.exports = router;
