const router = require('express').Router();
const serviceStatusController = require('../controllers/servicestatus.controller');

router.get('/status', serviceStatusController.status);

module.exports = router;