const boutiqueController = require('../controllers/boutiqueController');
const errorController = require('../controllers/errorController');
const express = require('express');

const router = express.Router();

router
    .route('/')
    .get(boutiqueController.get, errorController.redirectIndex, errorController.globalErrorHandler)
    .post(
        boutiqueController.uploadStoreLogo,
        boutiqueController.resizeStoreLogo,
        boutiqueController.creatStore,
        boutiqueController.validation,
        errorController.globalErrorHandler
    );
router.route('/:token').get(boutiqueController.emailVaidatore, errorController.tokenErrorHandler, errorController.globalErrorHandler);

module.exports = router;
