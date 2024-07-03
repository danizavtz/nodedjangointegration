const { exec } = require('child_process');

const availableApps = (_=> {try { return JSON.parse(process.env.AVAILABLE_APPS); } catch(err) { return []; }})();
availableApps.push(process.env.APP_NAME);

exports.status = (req, res) => {
    exec(`supervisorctl status ${availableApps[availableApps.length - 1]}`, (err, stdout, stderr) => {
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
