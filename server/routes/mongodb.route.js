const router = require('express').Router();
const mongodbController = require('../controllers/mongodb.controller');


router.get('/mongodb', mongodbController.listDockerImages, mongodbController.listAllRunningContainers, mongodbController.filterRunningContainerByImageId, mongodbController.getStartedAtFromContainer, mongodbController.status);
router.post('/mongodb', mongodbController.listDockerImages, mongodbController.listDockerRunningContainer, mongodbController.restartDocker);

module.exports = router;