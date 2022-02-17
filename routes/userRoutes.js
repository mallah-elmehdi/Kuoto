const express = require("express");
const userController = require("../controllers/userController");
const maBoutiqueController = require("../controllers/maBoutiqueController");
const errorController = require("../controllers/errorController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/:id")
  .get(
    authController.userLoggedIn,
    authController.recommd,
    userController.profile,
    errorController.globalErrorHandler
  );
router
.route("/:id/changer-le-mot-de-passe")
  .get(
    authController.userLoggedIn,
    authController.recommd,
    userController.changePassword,
    errorController.globalErrorHandler
  )
  .post(
    authController.userLoggedIn,
    userController.newPassword,
    errorController.globalErrorHandler
  )
  router
  .route("/:id/favoris")
  .get(
    authController.userLoggedIn,
    authController.recommd,
    userController.favorits,
    errorController.globalErrorHandler
  )
router
  .route("/favoris")
  .post(
    authController.userLoggedIn,
    userController.addFarorite,
    errorController.globalErrorHandler
  );
  router
  .route("/favoris/:id")
  .get(
    authController.userLoggedIn,
    userController.removeFarorite,
    errorController.globalErrorHandler
  );

  router
  .route("/:id/ajouter-un-commentaire")
  .get(
    authController.userLoggedIn,
    authController.recommd,
    userController.addComment,
    errorController.globalErrorHandler
  )
  .post(
    authController.userLoggedIn,
    userController.addCommentPost,
    errorController.globalErrorHandler
  )

router
  .route("/:id/commentaires")
  .get(
    authController.userLoggedIn,
    authController.recommd,
    userController.getUserProfileComm,
    errorController.globalErrorHandler
  );


module.exports = router;
