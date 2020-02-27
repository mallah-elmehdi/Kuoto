const boutiqueController = require("../controllers/boutiqueController");
const express = require("express");

const router = express.Router();

router
    .route("/")
    .get(boutiqueController.getFormBoutique)
    .post(boutiqueController.creerBoutique)

module.exports = router;