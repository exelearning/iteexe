FROM ubuntu:14.04

RUN apt-get update && apt-get -yq install python-setuptools python-zope.interface python-imaging python-chardet python-lxml python-feedparser mimetex python-git

RUN apt-get update && apt-get -yq install python-pip python-dev libxml2-dev libxmlsec1-dev swig

RUN pip install python-saml

RUN mkdir /var/run/exe
