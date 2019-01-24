var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
const { execSync } = require('child_process');
var configuracoes = JSON.parse(fs.readFileSync(path.join(__dirname + '/cfg/configuracoes.json'), 'utf-8'));

String.prototype.replaceAll = String.prototype.replaceAll || function (needle, replacement) {
    return this.split(needle).join(replacement);
};

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname + '/public/index.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/configuracoes', function (request, response) {
    response.sendFile(path.join(__dirname + '/cfg/configuracoes.json'));
});

app.post('/run', function (request, response) {
    var modulos = [];
    var codigoConfiguracao;

    if (request.body.modulos === undefined) {
        console.log("Módulos não selecionados. Selecione os módulos.")
        response.status(402).send("Selecione os módulos.");
    }

    if (request.body.configuracao === undefined) {
        console.log("Configuração não selecionada. Selecione a configuração.")
        response.status(402).send("Selecione a configuração.");
    }

    codigoConfiguracao = request.body.configuracao;
    if (typeof request.body.modulos === typeof String()) {
        modulos.push(request.body.modulos);
    } else {
        modulos = request.body.modulos;
    }
    let parametros = [];
    let configuracao;
    for (let configuracaoIndex of configuracoes) {
        if (configuracaoIndex.codigo == codigoConfiguracao) {
            configuracao = configuracaoIndex;
            break;
        }
    }

    for (let modulo of modulos) {
        for (let comando of configuracao.comandos) {
            if (comando.codigo == modulo) {
                console.info("Executando ::: " + comando.descricao);
                let comandoExec = comando.exec;
                if (configuracao.gruposParametros !== undefined) {
                    for (let grupoParametro of configuracao.gruposParametros) {
                        for (let parametro of grupoParametro.parametros) {
                            for (let codigoParametro of Object.keys(request.body)) {
                                if (codigoParametro == parametro.codigo) {
                                    comandoExec = comandoExec.replaceAll(parametro.keystring, request.body[codigoParametro]);
                                }
                            }
                        }
                    }
                }
                try {
                    
                    console.log(execSync(comandoExec).toString());

                } catch (err) {
                    console.log(String.fromCharCode.apply(null, new Uint8Array(err.stderr)));
                    console.log(String.fromCharCode.apply(null, new Uint8Array(err.stdout)));
                    response.end();
                }

            }
        }
    }
    console.info("Concluído");
    response.end();

});

app.listen(3000, function () {
    console.info('Servidor iniciado na porta 3000');
});

