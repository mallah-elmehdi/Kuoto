const seConnecterController = require("../controllers/seConnecterController");
const errorController = require("../controllers/errorController");
const authController = require("../controllers/authController");
const express = require("express");
const router = express.Router();

router
  .route("/")
  .get(
    seConnecterController.get,
    errorController.redirectIndex,
    errorController.globalErrorHandler
    )
  .post(
    seConnecterController.post,
    errorController.redirectIndex,
    errorController.globalErrorHandler
  );

module.exports = router;
