const router = require('express').Router();

router.use(require('./routes/servicestatus.route'));
router.use(require('./routes/credentials.route'));
router.use(require('./routes/fallback.route')); //esta rota deve ser sempre a última

module.exports = router;