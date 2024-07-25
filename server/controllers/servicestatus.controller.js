const { exec } = require('child_process');

exports.status = (req, res) => {
    const appnamestr = req.query && req.query.appname ? req.query.appname : process.env.APP_NAME
    exec(`supervisorctl status ${appnamestr}`, (err, stdout, stderr) => {
        if (err) {
            console.log(err);
            res.status(500).json({ errors: [{ msg: 'Houve um erro ao executar rotina', param: null }] });
            return;
        }
        const outputarr = stdout.split(',');
        if (outputarr.length > 0 && outputarr[0].includes('RUNNING') && outputarr[0].includes(process.env.APP_NAME)) {
            const saida = outputarr[1].split(' ');
            const outputstr = saida[saida.length - 1].replace('\n', '');

            if (saida.length === 3) {
                res.status(200).json({ "dias": "0", "duracao": outputstr });
            } else if (saida.length >= 4) {
                res.status(200).json({ "dias": saida[2], "duracao": outputstr });
            } else {
                res.status(422).json({ errors: [{ msg: 'Não foi possível parsear resultado', param: null }] });
            }
        } else {
            res.status(412).json({ errors: [{ msg: 'Não foi possível fazer leitura', param: null }] });
        }
    });
};

exports.restartservice = (req, res) => {
    const appnamestr = req.query && req.query.appname ? req.query.appname : process.env.APP_NAME
    exec(`supervisorctl restart ${appnamestr}`, (err, stdout, stderr) => {
        if (err) {
            console.log(err);
            res.status(500).json({ errors: [{ msg: 'Houve um erro ao executar rotina', param: null }] });
            return;
        }
        res.status(200).json({ msg: "OK", detalhe: stdout });
    });
};
