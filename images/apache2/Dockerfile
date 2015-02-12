FROM ubuntu:14.04

RUN apt-get update && apt-get -yq install apache2

RUN a2enmod proxy_http

ENTRYPOINT ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]