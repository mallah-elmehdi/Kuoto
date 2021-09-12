const seConnecterController = require("../controllers/seConnecterController")
const express = require("express");
const router = express.Router();

router
    .route("/")
    .get(seConnecterController.getseConnecter)
    .post(seConnecterController.seConnecter);

module.exports = router;