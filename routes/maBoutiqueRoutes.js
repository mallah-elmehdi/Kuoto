const express = require("express");
const maBoutiqueController = require("../controllers/maBoutiqueController");
const boutiqueController = require("../controllers/boutiqueController");
const errorController = require("../controllers/errorController");
const authController = require("../controllers/authController");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const createAccountLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: "Trop d'essais, veuillez réessayer après 5 minutes",
});

router
  .route("/:id")
  .get(
    authController.userLoggedIn,
    maBoutiqueController.get,
    errorController.globalErrorHandler
  );

router
  .route("/:id/parametres")
  .get(
    authController.userLoggedIn,
    maBoutiqueController.parametres,
    errorController.globalErrorHandler
  )
  .post(
    authController.userLoggedIn,
    boutiqueController.uploadStoreLogo,
    boutiqueController.resizeStoreLogo,
    maBoutiqueController.updateStore,
    maBoutiqueController.validation,
    errorController.globalErrorHandler
  );

router
  .route("/:id/ajouter")
  .get(
    authController.userLoggedIn,
    maBoutiqueController.ajouter,
    errorController.globalErrorHandler
  )
  .post(
    authController.userLoggedIn,
    maBoutiqueController.uploadCarPhotos,
    maBoutiqueController.resizeCarPhotos,
    maBoutiqueController.addCar,
    errorController.globalErrorHandler
  );

router
  .route("/:id/editer/:cid")
  .get(
    authController.userLoggedIn,
    maBoutiqueController.edit,
    errorController.globalErrorHandler
  )
  .post(
    authController.userLoggedIn,
    maBoutiqueController.uploadCarPhotos,
    maBoutiqueController.resizeCarPhotos,
    maBoutiqueController.updateCar,
    errorController.globalErrorHandler
  );

router
  .route("/:id/editer/:cid/supprimer")
  .get(
    authController.userLoggedIn,
    maBoutiqueController.supprimer,
    errorController.globalErrorHandler
  );

router
  .route("/:id/parametres/verifier-le-mot-de-passe")
  .get(
    authController.userLoggedIn,
    maBoutiqueController.passChange,
    errorController.globalErrorHandler
  )
  .post(
    authController.userLoggedIn,
    createAccountLimiter,
    maBoutiqueController.passCheck,
    errorController.globalErrorHandler
  );

router
  .route("/:id/parametres/changer-le-mot-de-passe/:token")
  .get(
    authController.userLoggedIn,
    maBoutiqueController.changePassword,
    errorController.globalErrorHandler
  )
  .post(
    authController.userLoggedIn,
    maBoutiqueController.newPassword,
    errorController.globalErrorHandler
  );

router
  .route("/:id/supprimer")
  .get(
    authController.userLoggedIn,
    maBoutiqueController.deleteStore,
    errorController.globalErrorHandler
  );

module.exports = router;
