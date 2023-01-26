import requests

import os, ssl

import certifi


print(certifi.where())
if (not os.environ.get('PYTHONHTTPSVERIFY', '') and
    getattr(ssl, '_create_unverified_context', None)):
  ssl._create_default_https_context = ssl._create_unverified_context

url = 'https://github.com/exelearning/classification_sources/raw/master/classification_sources.zip'

r = requests.get(url, stream=True, verify=False)