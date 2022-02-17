const viewBoutiqueController = require("../controllers/viewBoutiqueController");
const errorController = require("../controllers/errorController");
const authController = require("../controllers/authController");
const express = require("express");

const router = express.Router();

router
  .route("/:id")
  .get(
    authController.userLoggedIn,
    authController.recommd,
    viewBoutiqueController.agence,
    errorController.globalErrorHandler
  );

router
  .route("/:id/offres")
  .get(
    authController.userLoggedIn,
    authController.recommd,
    viewBoutiqueController.offres,
    errorController.globalErrorHandler
  )

module.exports = router;
