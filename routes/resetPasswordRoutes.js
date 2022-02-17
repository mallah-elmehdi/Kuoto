const seConnecterController = require("../controllers/seConnecterController");
const errorController = require("../controllers/errorController");
const express = require("express");
const router = express.Router();

router
  .route("/")
  .get(
    seConnecterController.forgetPassword, 
    errorController.globalErrorHandler
    )
  .post(
    seConnecterController.forgotPasswordSendEmail,
    errorController.globalErrorHandler
  );
router
  .route("/:token")
  .get(
    seConnecterController.resetPassword,
    errorController.tokenErrorHandler,
    errorController.globalErrorHandler
  )
  .post(
    seConnecterController.newPassword,
    errorController.tokenErrorHandler,
    errorController.globalErrorHandler
  );

module.exports = router;
