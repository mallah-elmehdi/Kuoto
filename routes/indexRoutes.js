const indexController = require('../controllers/indexController');
const errorController = require('../controllers/errorController');
const authController = require('../controllers/authController');
const express = require('express');

const router = express.Router();

router
    .route('/')
    .get(authController.userLoggedIn, indexController.getIndex, errorController.globalErrorHandler)
    .post(authController.userLoggedIn, indexController.searchCars, errorController.globalErrorHandler);

router.route('/cherche').post(authController.userLoggedIn, indexController.cherche, errorController.globalErrorHandler);

router.route('/trier').post(authController.userLoggedIn, indexController.trier, errorController.globalErrorHandler);

//   ============================= RESULTAT
router
    .route('/res')
    .get(authController.userLoggedIn, authController.recommd, indexController.searchPage, errorController.globalErrorHandler)
    .post(authController.userLoggedIn, indexController.filter, errorController.globalErrorHandler);

router
    .route('/res/:one/:two/:three/:four')
    .get(authController.userLoggedIn, authController.recommd, indexController.searchPage, errorController.globalErrorHandler);

router
    .route('/res/:one/:two/:three/:four/:five')
    .get(authController.userLoggedIn, authController.recommd, indexController.searchPage, errorController.globalErrorHandler);
router
    .route('/res/:one/:two/:three')
    .get(authController.userLoggedIn, authController.recommd, indexController.searchPage, errorController.globalErrorHandler);
router
    .route('/res/:one/:two')
    .get(authController.userLoggedIn, authController.recommd, indexController.searchPage, errorController.globalErrorHandler);
router
    .route('/res/:one')
    .get(authController.userLoggedIn, authController.recommd, indexController.searchPage, errorController.globalErrorHandler);

//   =============================
router.route('/voiture/:id').get(authController.userLoggedIn, indexController.carDetails, errorController.globalErrorHandler);

router.route('/deconnecter').get(indexController.logout, errorController.globalErrorHandler);

router.route('/envoyer-a-nouveau').get(indexController.resend, errorController.globalErrorHandler);

router.route('/privacy-policy').get(indexController.PrivacyPolicy);
router.route('/terms-and-conditions').get(indexController.termsandconditions);
router.route('/avertissement').get(indexController.Desclaimer);
router.route('/Comment-nous-fonctionnons').get(indexController.howitworks);
router.route('/a-propos-de-nous').get(indexController.aboutUs);

router.route('/Nous-contacter').get(indexController.contactUs).post(indexController.envEmail);

module.exports = router;
