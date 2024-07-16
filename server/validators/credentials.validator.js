const { body, header, validationResult } = require('express-validator');

exports.validationQueryRules = [    
    body('username', 'username is required').exists(),
    body('username', 'username is required').isAlphanumeric().notEmpty(),
    body('password', 'password is required').exists(),
    body('password', 'password is required').isAlphanumeric().notEmpty(),
];

exports.validationHeaderRules = [
    header('authorization', 'authorization is required').exists(),
    header('authorization', 'authorization is required and should be Basic authentication').notEmpty().contains('Basic'),
    header('authorization').custom((value, { req }) => {
        const existingWhiteSpaceIndex = value.indexOf(' ');
        if (existingWhiteSpaceIndex === -1) {
            throw new Error('Must contain a whitespace between Basic and the base64 string');
        }
        req.headers.b64encodedstr = value.substring(existingWhiteSpaceIndex + 1);
        return true;
    }),
    header('b64encodedstr', 'Must be a base64 encoded string').isBase64()
];


exports.checkRules = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
