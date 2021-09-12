const inscrireController = require("../controllers/inscrireController")
const express = require("express");

const router = express.Router();

router
    .route("/")
    .get(inscrireController.getInscrire)
    .post(inscrireController.creatUser, inscrireController.userErrorHandler);

module.exports = router;