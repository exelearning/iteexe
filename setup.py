#!/usr/bin/python

# setup.py
import glob
from distutils.core import setup
import py2exe
      
setup(console=["exe/webui/server.py"],
      version="1.0",
#      py_modules=["exe"],
      packages=["exe"],
#      data_files=[('web', glob.glob("web/*")), ('.', [README,])],
     )

