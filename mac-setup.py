#!/usr/bin/python

# setup.py
import glob
from distutils.core import setup
import py2app
from exe.engine import version

setup(app=["exe/webui/server.py"],
      name=version.project,
      version=version.release,
      packages=["exe", "exe.engine", "exe.webui", "exe.export"],
      data_files=[(".", ["exe/exe.conf",]),
                  (".", ["README",]),
                  ("",  ["exe/webui/css",]),
                  ("",  ["exe/webui/images",]),
                  ("",  ["exe/webui/scripts",]),
                  ("",  ["exe/webui/style",]),
                  ],
      
     )

