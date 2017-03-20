FROM ubuntu:14.04

RUN apt-get update && apt-get -yq install python-setuptools python-zope.interface python-imaging python-chardet python-lxml python-feedparser mimetex python-git

RUN apt-get update && apt-get -yq install python-pip python-dev libxml2-dev libxmlsec1-dev swig

RUN apt-get update && apt-get -yq install python-m2crypto python-isodate python-defusedxml

RUN apt-get update && apt-get -yq install python-beautifulsoup python-oauth2client python-googleapi

RUN apt-get update && apt-get -yq install python-passlib

RUN apt-get update && apt-get -yq install fuseext2

RUN apt-get update && apt-get -yq install python-suds python-requests-oauthlib python-dateutil

RUN pip install dm.xmlsec.binding==1.3.2

RUN apt-get update && apt-get -yq install cssmin python-webassets

RUN mkdir /var/run/exe
