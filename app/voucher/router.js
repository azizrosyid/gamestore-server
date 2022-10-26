const express = require("express");

const multerConfig = require("../../config/multer");

const router = express.Router();
const {
  index,
  viewCreate,
  actionCreate,
  viewUpdate,
  actionUpdate,
  actionDelete,
  actionStatus,
} = require("./controller");
const { isLoginAdmin } = require("../middleware/auth");

router.use(isLoginAdmin);
router.get("/", index);
router.get("/create", viewCreate);
router.post("/create", multerConfig.single("image"), actionCreate);
router.get("/edit/:id", viewUpdate);
router.put("/edit/:id", multerConfig.single("image"), actionUpdate);
router.delete("/delete/:id", actionDelete);
router.put("/status/:id", actionStatus);

module.exports = router;
