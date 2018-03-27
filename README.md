### Como testar?

```
sudo docker run -d --name setup -v /var/run/docker.sock:/var/run/docker.sock -p 4567:4567 seniocaires/setup

```
Acesse: http://localhost:4567


### Como usar minhas próprias configurações?

Crie um arquivo de configurações seguindo o exemplo: https://github.com/seniocaires/setup/blob/master/cfg/configuracoes.json

Inicie o container com um volume no path do arquivo de configurações "-v {PATH_ARQUIVO_CONFIGURACORES}:/app/cfg"

```
sudo docker run -d --name setup -v {PATH_ARQUIVO_CONFIGURACORES}:/app/cfg -v /var/run/docker.sock:/var/run/docker.sock -p 4567:4567 seniocaires/setup

```