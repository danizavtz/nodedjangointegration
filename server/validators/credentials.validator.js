const { body, validationResult } = require('express-validator');

exports.validationQueryRules = [    
    body('username', 'username is required').exists(),
    body('username', 'username is required').isAlphanumeric().notEmpty(),
    body('password', 'password is required').exists(),
    body('password', 'password is required').isAlphanumeric().notEmpty(),
];


exports.checkRules = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
