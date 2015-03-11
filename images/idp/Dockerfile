FROM ubuntu:14.04

RUN apt-get update && apt-get -yq install simplesamlphp subversion

RUN a2enconf simplesamlphp

RUN php5enmod mcrypt

RUN cd /usr/share/simplesamlphp/modules && svn export https://github.com/sylvainmed/simplesamlphp/trunk/modules/authgoogle

RUN touch /usr/share/simplesamlphp/modules/openid/enable

ENTRYPOINT ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]