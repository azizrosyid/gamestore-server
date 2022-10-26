var express = require("express");
var router = express.Router();
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
router.put("/status/:id", actionStatus);
// router.get("/create", viewCreate);
// router.post("/create", actionCreate);
// router.get("/edit/:id", viewUpdate);
// router.put("/edit/:id", actionUpdate);
// router.delete("/delete/:id", actionDelete);

module.exports = router;
