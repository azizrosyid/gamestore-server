var express = require("express");
const { isLoginPlayer } = require("../middleware/auth");
const multerConfig = require("../../config/multer");
const {
  landingPage,
  detailPage,
  category,
  checkout,
  history,
  detailHistory,
  dashboard,
  getPlayer,
  editPlayer,
} = require("./controller");
var router = express.Router();

router.get("/landingpage", landingPage);
router.get("/:id/detail", detailPage);
router.get("/category", category);
router.post("/checkout", isLoginPlayer, checkout);
router.get("/history", isLoginPlayer, history);
router.get("/history/:id", isLoginPlayer, detailHistory);
router.get("/dashboard", isLoginPlayer, dashboard);
router.get("/profile", isLoginPlayer, getPlayer);
router.put("/profile", isLoginPlayer, multerConfig.single("image"), editPlayer);

module.exports = router;
