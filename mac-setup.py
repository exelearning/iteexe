#!/usr/bin/python

# setup.py
import glob
from distutils.core import setup
import py2app

setup(app=["exe/webui/server.py"],
      name="eXe",
      version="0.1.203",
      packages=["exe", "exe.engine", "exe.webui", "exe.export"],
      data_files=[(".", ["exe/exe.conf",]),
                  (".", ["README",]),
                  ("",  ["exe/webui/css",]),
                  ("",  ["exe/webui/images",]),
                  ("",  ["exe/webui/scripts",]),
                  ("",  ["exe/webui/style",]),
                  ],
      
     )

