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
};

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

const extractDuracao = (stdoutput_string) => {
    const now = new Date();
    const ano = parseInt(stdoutput_string.substring(0, 4));
    const mes = parseInt(stdoutput_string.substring(5, 7));
    const dia = parseInt(stdoutput_string.substring(8, 10));
    const hora = parseInt(stdoutput_string.substring(11, 13));
    const minuto = parseInt(stdoutput_string.substring(14, 16));
    const segundo = parseInt(stdoutput_string.substring(17, 19));
    const tzoffset = now.getTimezoneOffset();
    const tzoffsetHours = (tzoffset / 60);
    const startDate = new Date(ano, mes - 1, dia, hora - tzoffsetHours, minuto, segundo);
    const output = (now.getTime() - startDate.getTime());
    const duracaosegundos = output / 1000;
    const duracaominutos = output / 60_000;
    const duracaohoras = output / 3_600_000;
    const duracaodias = output / 86_400_000;
    return { dias: parseInt(duracaodias), horas: parseInt(duracaohoras % 24), minutos: parseInt(duracaominutos % 60), segundos: parseInt(duracaosegundos % 60) };
};

exports.filterRunningContainerByImageId = (req, res, next) => {
    const containerData = extrairContainerData(req.allRunningContainers, req.dockerImageId);
    if (containerData === null || containerData < 3) {
        res.status(500).json({ errors: [{ msg: 'Não foi possível localizar uma instância docker em execução, consulte o suporte', param: null }] });
        return;
    }
    req.cdata = containerData;
    next();
};

exports.getStartedAtFromContainer = (req, res, next) => {
    exec(`docker inspect -f "{{ .State.StartedAt }}" ${req.cdata[0]}`, (err, stdout, stderr) => {
        if (err) {
            console.log(err);
            res.status(500).json({ errors: [{ msg: 'Houve um erro ao executar rotina', param: null }] });
            return;
        }
        req.duracao = stdout.replace('\n', '');
        next();
    });
};


exports.status = (req, res) => {
    const tempo = extractDuracao(req.duracao);
    res.status(200).json({ status: req.cdata[3], msg: "OK", dias: tempo.dias, duracao: `${tempo.horas < 10 ? '0' + tempo.horas : tempo.horas}:${tempo.minutos < 10 ? '0' + tempo.minutos : tempo.minutos}:${tempo.segundos < 10 ? '0' + tempo.segundos : tempo.segundos}`, detalhe: req.cdata[2] });
};

exports.showDuration = (req, res, next) => {
    exec(`docker inspect -f "{{ .State.StartedAt }}" ${containerData[0]}`, (err, stdout, stderr) => {
        if (err) {
            console.log(err);
            res.status(500).json({ errors: [{ msg: 'Houve um erro ao executar rotina', param: null }] });
            return;
        }
        req.duracao = stdout.replace('\n', '');
        next();
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

exports.listAllRunningContainers = (req, res, next)  => {
    exec('docker ps --format "{{.ID}}:{{.Image}}:{{.Status}}:{{.State}}"', (err, stdout, stderr) => {
        if (err) {
            console.log(err);
            res.status(500).json({ errors: [{ msg: 'Houve um erro ao executar rotina', param: null }] });
            return;
        }
        req.allRunningContainers = stdout;
        next()
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
