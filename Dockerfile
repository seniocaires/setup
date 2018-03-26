FROM java:8

RUN apt update && \
    apt install -y apt-transport-https ca-certificates gnupg2 && \
    echo 'deb https://apt.dockerproject.org/repo debian-jessie main' > /etc/apt/sources.list.d/docker.list && \
    apt-key adv --keyserver hkp://pgp.mit.edu:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D && \
    apt update && \
    apt install -y docker-engine

WORKDIR /app

ADD pom.xml /app/pom.xml
ADD src /app/src

RUN apt-get update && apt-get install -y maven \
    && mvn dependency:resolve verify package

EXPOSE 4567
CMD ["/usr/lib/jvm/java-8-openjdk-amd64/bin/java", "-jar", "target/setup-jar-with-dependencies.jar"]