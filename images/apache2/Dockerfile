FROM ubuntu:14.04

RUN apt-get update && apt-get -yq install apache2

RUN a2enmod proxy_http

RUN a2enmod ssl

RUN a2enmod headers

ADD run.sh /run.sh

RUN chmod 755 /*.sh

CMD /run.sh