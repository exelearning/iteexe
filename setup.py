#!/usr/bin/python

# setup.py
import glob
from distutils.core import setup
import py2exe
      
setup(console=["exe/webui/server.py"],
      version="0.1.132",
      packages=["exe", "exe.engine", "exe.webui", "exe.export"],
      data_files=[('.', ["exe.conf",]),
                  ('css', glob.glob('exe/webui/css/*')),
		  ('images', glob.glob('exe/webui/images/*'))],
     )

