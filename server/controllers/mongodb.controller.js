const { exec } = require('child_process');

const extrairContainerNumber = (stdoutput_string) => {
    const matriz = stdoutput_string.split('\n')
    for (let i = 0; i < matriz.length; i++) {
        const linha = matriz[i].split(new RegExp('\s'))
        if (String(linha[0]).includes('mongo')) {
            return linha[0].split(' ')[0];
        }
    }
    return null;
};

exports.status = (req, res) => {
    exec('docker ps', (err, stdout, stderr) => {
        if (err) {
            res.status(500).json({ errors: [{ msg: 'Houve um erro ao executar rotina', param: null }] });
            return;
        }
        res.status(200).json({ msg: "OK", detalhe: stdout });
    });
};

exports.restartDocker = (req, res) => {
    exec('docker ps', (err, stdout, stderr) => {
        if (err) {
            console.log(err);
            res.status(500).json({ errors: [{ msg: 'Houve um erro ao executar rotina', param: null }] });
            return;
        }
        const containerId = extrairContainerNumber(stdout);
        if (containerId === null) {
            res.status(500).json({ errors: [{ msg: 'Não foi possível localizar uma instância docker em execução, consulte o suporte', param: null }] });
            return;
        }
        exec(`docker restart ${containerId}`, (err, stdout, stderr) => {
            if (err) {
                console.log(err);
                res.status(500).json({ errors: [{ msg: 'Houve um erro ao executar rotina de reiniciar container', param: null }] });
                return;
            }
            res.status(200).json({ msg: "OK", detalhe: stdout });
        });
    });
};
