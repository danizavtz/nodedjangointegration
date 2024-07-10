const router = require('express').Router();
const mongodbController = require('../controllers/mongodb.controller');


router.get('/mongodb', mongodbController.status);
router.post('/mongodb', mongodbController.restartDocker);

module.exports = router;