const { query, validationResult } = require('express-validator');

const availableApps = (_=> {try { return JSON.parse(process.env.AVAILABLE_APPS); } catch(err) { return []; }})();

availableApps.push(process.env.APP_NAME);

exports.validationQueryRules = [    
    query('appname', 'appname is required').optional(),
    query('appname', 'appname is required and must be one of "backend, node-jobs, service-status"').optional().isIn(availableApps),
];


exports.checkRules = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
