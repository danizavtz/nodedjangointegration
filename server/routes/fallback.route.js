const router = require('express').Router();
const fallbackController = require('../controllers/fallback.controller');

router.get('*', fallbackController.fallback);

module.exports = router;