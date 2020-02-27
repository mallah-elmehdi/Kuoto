const indexController = require("../controllers/indexController")
const express = require("express");

const router = express.Router();

router
    .route("/")
    .get(indexController.getIndex);

module.exports = router;