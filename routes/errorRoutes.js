const errorController = require("../controllers/errorController");
const appError = require("../utils/appErrors");
const express = require("express");

const router = express.Router();

router.route("/").all((req, res, next) => {
  next(new appError("Impossible de trouver ce lien sur ce serveur!", 404));
}, errorController.globalErrorHandler);

module.exports = router;
