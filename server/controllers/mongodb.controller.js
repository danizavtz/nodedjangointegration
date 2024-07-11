const { exec } = require('child_process');

const extrairContainerNumber = (stdoutput_string, imageID) => {
    const matriz = stdoutput_string.split('\n')
    for (let i = 0; i < matriz.length; i++) {
        if(matriz[i].includes(imageID)) {
            const containerArrNum = matriz[i].split(':');
            return containerArrNum[0];
        }
    }
    return null;
};

const extrairContainerData = (stdoutput_string, imageId) => {
    const matriz = stdoutput_string.split('\n')
    for (let i = 0; i < matriz.length; i++) {
        if(matriz[i].includes(imageId)) {
            return containerArrNum = matriz[i].split(':');
        }
    }
    return null;
}

const extrairImageId = (stdoutput_string) => {
    const linha = stdoutput_string.split('\n');
    for (let i = 0; i < linha.length; i++) {
        const parsedoutput = linha[i].split(':');
        for(let j = 0; j < parsedoutput.length; j++) {
            if (parsedoutput[parsedoutput.length-1].includes('mongo')) {
                return parsedoutput[0];
            }
        }
    }
    return null;
};

exports.status = (req, res) => {
    exec('docker ps --format "{{.ID}}:{{.Image}}:{{.Status}}:{{.State}}"', (err, stdout, stderr) => {
        if (err) {
            console.log(err);
            res.status(500).json({ errors: [{ msg: 'Houve um erro ao executar rotina', param: null }] });
            return;
        }
        const containerData = extrairContainerData(stdout, req.dockerImageId);
        if (containerData === null || containerData < 3) {
            res.status(500).json({ errors: [{ msg: 'Não foi possível localizar uma instância docker em execução, consulte o suporte', param: null }] });
            return;
        }
        res.status(200).json({ status: containerData[3], msg: "OK", detalhe: containerData[2] });
    });
};

exports.listDockerImages = (req, res, next) => {
    exec('docker images --format "{{.ID}}:{{.Tag}}:{{.Repository}}"', (err, stdout, stderr) => {
        if (err) {
            res.status(500).json({ errors: [{ msg: 'Houve um erro ao executar rotina', param: null }] });
            return;
        }
        req.dockerImageId = extrairImageId(stdout);
        next();
    });
};

exports.listDockerRunningContainer = (req, res, next) => {
    exec('docker ps --format "{{.ID}}:{{.Image}}:{{.Status}}:{{.State}}"', (err, stdout, stderr) => {
        if (err) {
            res.status(500).json({ errors: [{ msg: 'Houve um erro ao executar rotina', param: null }] });
            return;
        }
        const containerId = extrairContainerNumber(stdout, req.dockerImageId);
        if (containerId === null) {
            res.status(500).json({ errors: [{ msg: 'Não foi possível localizar uma instância docker em execução, consulte o suporte', param: null }] });
            return;
        }
        req.containerId = containerId;
        next();
    });
}

exports.restartDocker = (req, res) => {
    exec(`docker restart ${req.containerId}`, (err, stdout, stderr) => {
        if (err) {
            res.status(500).json({ errors: [{ msg: 'Houve um erro ao executar rotina de reiniciar container', param: null }] });
            return;
        }
        const formatedOutput = stdout.replace('\n', '');
        res.status(200).json({ status: "online", msg: "OK", detalhe: formatedOutput });
    });
};
