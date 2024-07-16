const path = require('path');
const { exec } = require('child_process');

exports.verifyCredentialsInDjango = (req, res, next) => {
    exec(`python3 ${path.resolve(__dirname, '..', '..', 'pyscripts/djangorunner.py')} ${req.body.username} ${req.body.password}`, (err, stdout, stderr) => {
        if (err) {
            console.log(err);
            res.status(500).json({ errors: [{ msg: 'Houve um erro ao executar rotina em Python', param: null }] });
            return;
        }
        if (stdout === process.env.ADMINUSERALLOWED) {
            next();
            return;
        }
        res.status(403).json({ errors: [{ msg: "Você não possui permissão para executar esta ação", param: null }] });
    });
};

exports.decodeb64 = (req, res, next) => {
    const [username, password] = Buffer.from(req.headers.b64encodedstr, 'base64').toString().split(':');
    if (!username || !password) {
        res.status(422).json({ errors: [{ msg: 'usuário ou senha não podem ser vazios', param: null }] })
        return;
    }
    req.body.username = username;
    req.body.password = password;
    next();
};



exports.validado = (req, res) => {
    res.status(200).json({msg: 'Validado', token: 'ok' });
};
