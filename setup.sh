#!/bin/bash

sudo docker container rm -f setup

sudo docker build -t setup .

sudo docker run -i -d --name setup -v $(pwd)/cfg:/app/cfg -v /var/run/docker.sock:/var/run/docker.sock -u root -p 4567:4567 setup

echo "=============================================================="
echo "              Acesse http://localhost:4567"
echo "=============================================================="