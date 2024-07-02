const router = require('express').Router();
const serviceStatusValidator = require('../validators/servicestatus.validator');
const serviceStatusController = require('../controllers/servicestatus.controller');

router.get('/status', serviceStatusValidator.validationQueryRules, serviceStatusValidator.checkRules, serviceStatusController.status);

module.exports = router;