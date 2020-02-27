const express = require("express");
const maBoutiqueController = require("../controllers/maBoutiqueController");
const router = express.Router();

router
    .route("/")
    .get(maBoutiqueController.getMaBoutique);
router
    .route("/:id")
    .get(maBoutiqueController.getCar)
    .post(maBoutiqueController.addCar)
    .patch(maBoutiqueController.updateCar)
    .delete(maBoutiqueController.deleteCar);

module.exports = router;