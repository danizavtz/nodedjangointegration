const path = require('path');
const { exec } = require('child_process');

exports.verifyCredentialsInDjango = (req, res, next) => {
    exec(`python3 ${path.resolve(__dirname, '..', '..', 'pyscripts/djangorunner.py')} ${req.body.username} ${req.body.password}`, (err, stdout, stderr) => {
        if (err) {
            console.log(err);
            res.status(500).json({ errors: [{ msg: 'Houve um erro ao executar rotina', param: null }] });
            return;
        }
        if (stdout === process.env.ADMINUSERALLOWED) {
            next();
            return;
        }
        res.status(403).json({ errors: [{ msg: "Você não possui permissão para executar esta ação", param: null }] });
    });
};


exports.validado = (req, res) => {
    res.status(200).json({msg: 'Validado'});
};