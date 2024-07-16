const router = require('express').Router();
const serviceStatusController = require('../controllers/servicestatus.controller');
const credentialsController = require('../controllers/credentials.controller');
const credentialsValidator = require('../validators/credentials.validator');

router.get('/status', credentialsValidator.validationHeaderRules, credentialsValidator.checkRules, credentialsController.decodeb64, credentialsController.verifyCredentialsInDjango, serviceStatusController.status);

module.exports = router;
