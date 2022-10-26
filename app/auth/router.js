var express = require("express");
const { signup, signin } = require("./controller");
const multerConfig = require("../../config/multer");
var router = express.Router();

router.post("/signup", multerConfig.single("image"), signup);
router.post("/signin", signin);

module.exports = router;
