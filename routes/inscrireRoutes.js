const inscrireController = require("../controllers/inscrireController");
const errorController = require("../controllers/errorController");
const authController = require("../controllers/authController");
const express = require("express");

const router = express.Router();

router
  .route("/")
  .get(
    inscrireController.get,
    errorController.globalErrorHandler
  )
  .post(
    inscrireController.creatUser,
    inscrireController.validation,
    errorController.globalErrorHandler
  );

router
  .route("/:token")
  .get(
    inscrireController.userEmailVaidatore,
    errorController.tokenErrorHandler,
    errorController.globalErrorHandler
  );

module.exports = router;
