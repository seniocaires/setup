FROM node:10

WORKDIR /usr/bin/setup

ADD . .
COPY supervisord.conf /etc/supervisor/supervisord.conf

RUN apt update && \
    apt install -y apt-transport-https ca-certificates gnupg2 python-pip python-setuptools --no-install-recommends && \
    echo 'deb https://apt.dockerproject.org/repo debian-jessie main' > /etc/apt/sources.list.d/docker.list && \
    apt-key adv --no-tty --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D && \
    apt update && \
    apt install -y docker-engine && \
    echo "America/Sao_Paulo" > /etc/timezone && dpkg-reconfigure -f noninteractive tzdata && \
    sed -i 's/# \(.*multiverse$\)/\1/g' /etc/apt/sources.list && \
    apt-get update && \
    apt-get install -y locales locales-all && \
    dpkg-reconfigure --frontend=noninteractive locales && \
    locale-gen pt_BR && locale-gen pt_BR.UTF-8 && locale && \
    update-locale LANG=pt_BR.UTF-8 LC_CTYPE=pt_BR.UTF-8 LANGUAGE=pt_BR LC_ALL=pt_BR.UTF-8 && \
    apt-get clean && \
    apt-get autoclean && \
    apt-get autoremove -y && \
    rm -rf /tmp/* /var/tmp/* && \
    rm -rf /var/lib/apt/lists/* && \
    rm -f /etc/dpkg/dpkg.cfg.d/02apt-speedup && \
    pip install supervisor && \
    npm i

ENV TZ America/Sao_Paulo \
    LANG pt_BR.UTF-8 \
    LC_ALL pt_BR.UTF-8

EXPOSE 3000 3001

CMD supervisord -c /etc/supervisor/supervisord.conf
ENTRYPOINT []