#!/usr/bin/python

# setup.py
import glob
from distutils.core import setup
import py2exe
      
setup(console=["exe/webui/server.py"],
      version="0.1",
      packages=["exe", "exe.util", "exe.engine", "exe.webui", "exe.export"],
      data_files=[('.', ["exe.conf",])],
     )

