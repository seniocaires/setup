const express = require('express');
const basicAuth = require('express-basic-auth');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const sync = require('child_process').spawnSync;
const configuracoes = JSON.parse(fs.readFileSync(path.join(__dirname + '/cfg/configuracoes.json'), 'utf-8'));

dotenv.config();

String.prototype.replaceAll =
  String.prototype.replaceAll ||
  function (needle, replacement) {
    return this.split(needle).join(replacement);
  };

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function getUnauthorizedResponse(req) {
  return req.auth ? 'Usuário ou senha inválidos.' : 'Informe o usuário e senha.';
}

if (process.env.USUARIO && process.env.SENHA) {
  let user = {};
  user[`${process.env.USUARIO}`] = process.env.SENHA;
  app.use(
    basicAuth({
      users: user,
      challenge: true,
      realm: 'Imb4T3st4pp',
      unauthorizedResponse: getUnauthorizedResponse,
    })
  );
}

app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname + '/public/index.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/configuracoes', function (request, response) {
  let arquivoConfiguracoes = JSON.parse(fs.readFileSync(path.join(__dirname + '/cfg/configuracoes.json'), 'utf-8'));

  for (let configuracao of arquivoConfiguracoes) {
    if (configuracao.gruposParametros) {
      for (let grupoParametro of configuracao.gruposParametros) {
        if (grupoParametro.parametros) {
          for (let parametro of grupoParametro.parametros) {
            if (parametro.valorOculto === true) {
              parametro.valorPadrao = '***********';
            }
          }
        }
      }
    }
  }

  response.send(arquivoConfiguracoes);
});

app.post('/run', function (request, response) {
  let modulos = [];
  let codigoConfiguracao;

  if (request.body.modulos === undefined) {
    console.log('Erro: Módulos não selecionados. Selecione os módulos.');
    return;
  }

  if (request.body.configuracao === undefined) {
    console.log('Erro: Configuração não selecionada. Selecione a configuração.');
    return;
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

  if (!configuracao) {
    console.log('Erro: Configuração selecionada inválida.');
    return;
  }

  if (configuracao.gruposParametros) {
    for (let grupoParametro of configuracao.gruposParametros) {
      for (let parametro of grupoParametro.parametros) {
        for (let codigoParametro of Object.keys(request.body)) {
          if (codigoParametro == parametro.codigo && parametro.obrigatorio && !request.body[codigoParametro]) {
            console.log('Erro: Preencha o campo obrigatório: ' + parametro.descricao);
            return;
          }
        }
      }
    }
  }

  let ocorreuErro = false;
  try {
    for (let modulo of modulos) {
      for (let comando of configuracao.comandos) {
        if (comando.codigo == modulo) {
          console.info('Executando ::: ' + comando.descricao);
          let comandoExec = comando.exec;
          if (configuracao.gruposParametros !== undefined) {
            for (let grupoParametro of configuracao.gruposParametros) {
              for (let parametro of grupoParametro.parametros) {
                for (let codigoParametro of Object.keys(request.body)) {
                  if (codigoParametro == parametro.codigo) {
                    if (parametro.valorOculto === true) {
                      comandoExec = comandoExec.replaceAll(parametro.keystring, parametro.valorPadrao);
                    } else {
                      comandoExec = comandoExec.replaceAll(parametro.keystring, request.body[codigoParametro]);
                    }
                  }
                }
              }
            }
          }

          let arrayComandos = comandoExec.split(' ');
          let programa = arrayComandos[0];
          arrayComandos.shift();
          let parametros = [];
          parametros.push.apply(parametros, arrayComandos);
          const child = sync(programa, parametros, {
            shell: true,
          });

          let out = child.stdout.toString('utf8');
          let error = child.stderr.toString('utf8');
          if (out) {
            console.log(out);
          }
          if (error && child.status !== 0) {
            throw Error('Ocorreu um erro ao executar o comando. > ' + error);
          }
        }
      }
    }
  } catch (error) {
    ocorreuErro = true;
    console.log(error);
  }

  if (ocorreuErro) {
    console.info('Ocorreu um erro.');
  } else {
    console.info('Concluído');
  }
  response.end();
});

app.listen(3000, function () {
  console.info('Servidor iniciado na porta 3000');
});
