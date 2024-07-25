const router = require('express').Router();
const serviceStatusController = require('../controllers/servicestatus.controller');
const credentialsController = require('../controllers/credentials.controller');
const credentialsValidator = require('../validators/credentials.validator');
const serviceStatusValidator = require('../validators/servicestatus.validator');

router.get('/status', credentialsValidator.validationHeaderAuthorization, credentialsValidator.checkRules, credentialsValidator.validationHeaderAuthorizationContentChecker, credentialsValidator.checkRules, credentialsController.decodeb64, credentialsController.verifyCredentialsInDjango,serviceStatusValidator.validationQueryRules, serviceStatusValidator.checkRules, serviceStatusController.status);
router.post('/status', credentialsValidator.validationHeaderAuthorization, credentialsValidator.checkRules, credentialsValidator.validationHeaderAuthorizationContentChecker, credentialsValidator.checkRules, credentialsController.decodeb64, credentialsController.verifyCredentialsInDjango, serviceStatusValidator.validationQueryRules, serviceStatusValidator.checkRules, serviceStatusController.restartservice);

module.exports = router;
