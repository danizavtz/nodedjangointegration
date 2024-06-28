const router = require('express').Router();
const credentialsValidator = require('../validators/credentials.validator');
const credentialsController = require('../controllers/credentials.controller');

router.post('/validate', credentialsValidator.validationQueryRules, credentialsValidator.checkRules, credentialsController.verifyCredentialsInDjango, credentialsController.validado);

module.exports = router;