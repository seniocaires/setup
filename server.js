var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
const { execSync } = require('child_process');
var sync = require('child_process').spawnSync;
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

                let arrayComandos = comandoExec.split(" ");
                let programa = arrayComandos[0];
                arrayComandos.shift();
                let parametros = [];
                parametros.push.apply(parametros, arrayComandos);
                const child = sync(programa, parametros);

                let out = child.stdout.toString('utf8');
                let error = child.stderr.toString('utf8')
                if (out) {
                    console.log(out);
                }
                if (error) {
                    console.log("Ocorreu um erro ao executar o comando. > " + error);
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

