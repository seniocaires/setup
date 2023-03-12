### Como testar?

```
docker run -it --rm --name setup \
           -e USUARIO=admin \
           -e SENHA=admin \
           -v /var/run/docker.sock:/var/run/docker.sock \
           -p 3000:3000 -p 3001:3001 seniocaires/setup

```
Acesse: http://localhost:3000

Observação: USUARIO e SENHA são opcionais. São variáveis para autenticar na aplicação.


### Como usar minhas próprias configurações?

Crie um arquivo de configurações seguindo o exemplo: https://github.com/seniocaires/setup/blob/master/cfg/configuracoes.json

Inicie o container com um volume no path do arquivo de configurações "-v {PATH_ARQUIVO_CONFIGURACORES}:/usr/bin/setup/cfg"

```
docker run -it --rm --name setup \
           -e USUARIO=admin \
           -e SENHA=admin \
           -v {PATH_ARQUIVO_CONFIGURACORES}:/usr/bin/setup/cfg \
           -v /var/run/docker.sock:/var/run/docker.sock \
           -p 3000:3000 -p 3001:3001 seniocaires/setup

```