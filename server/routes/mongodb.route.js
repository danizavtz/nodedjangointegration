const router = require('express').Router();
const mongodbController = require('../controllers/mongodb.controller');
const credentialsController = require('../controllers/credentials.controller');
const credentialsValidator = require('../validators/credentials.validator');


router.get('/mongodb', credentialsValidator.validationHeaderRules, credentialsValidator.checkRules, credentialsController.decodeb64, credentialsController.verifyCredentialsInDjango, mongodbController.listDockerImages, mongodbController.listAllRunningContainers, mongodbController.filterRunningContainerByImageId, mongodbController.getStartedAtFromContainer, mongodbController.status);
router.post('/mongodb', credentialsValidator.validationHeaderRules, credentialsValidator.checkRules, credentialsController.decodeb64, credentialsController.verifyCredentialsInDjango, mongodbController.listDockerImages, mongodbController.listDockerRunningContainer, mongodbController.restartDocker);

module.exports = router;