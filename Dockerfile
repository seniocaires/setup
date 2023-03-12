FROM node:16

ENV TZ=America/Sao_Paulo DEBIAN_FRONTEND=noninteractive

WORKDIR /usr/bin/setup

ADD . .
COPY supervisord.conf /etc/supervisor/supervisord.conf

RUN apt update && \
    apt install -y apt-transport-https ca-certificates gnupg2 python-pip python-setuptools tzdata --no-install-recommends && \
    curl https://get.docker.com | sh && \
    apt-get clean && \
    apt-get autoclean && \
    apt-get autoremove -y && \
    rm -rf /tmp/* /var/tmp/* && \
    rm -rf /var/lib/apt/lists/* && \
    rm -f /etc/dpkg/dpkg.cfg.d/02apt-speedup && \
    pip install supervisor && \
    npm i

EXPOSE 3000 3001

CMD supervisord -c /etc/supervisor/supervisord.conf
ENTRYPOINT []