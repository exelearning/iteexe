FROM ubuntu:14.04

RUN apt-get update && apt-get -yq install apache2

RUN a2enmod proxy_http

RUN a2enmod ssl

RUN a2enmod headers

ENTRYPOINT ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]