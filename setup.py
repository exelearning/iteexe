#!/usr/bin/python

# setup.py
import glob
from distutils.core import setup
import py2exe

setup(console=["exe/webui/server.py"],
      version="0.1.203",
      packages=["exe", "exe.engine", "exe.webui", "exe.export"],
      data_files=[('.', ["exe/exe.conf",]),
                  ('.', ["README",]),
                  ('css', glob.glob('exe/webui/css/*')),
                  ('images', glob.glob('exe/webui/images/*')),
                  ('scripts', glob.glob('exe/webui/scripts/*')),
                  ('scripts/editor', glob.glob('exe/webui/scripts/editor/*')),
                  ('scripts/editor', glob.glob('exe/webui/scripts/editor/*')),
                  ('scripts/editor/css', glob.glob('exe/webui/scripts/editor/css/*')),
                  ('scripts/editor/dialog', glob.glob('exe/webui/scripts/editor/dialog/*')),
                  ('scripts/editor/dialog/css', glob.glob('exe/webui/scripts/editor/dialog/css/*')),
                  ('scripts/editor/dialog/images', 
                       glob.glob('exe/webui/scripts/editor/dialog/images/*')),
                  ('scripts/editor/dialog/js', glob.glob('exe/webui/scripts/editor/dialog/js/*')),
                  ('scripts/editor/images', glob.glob('exe/webui/scripts/editor/images/*')),
                  ('scripts/editor/js', glob.glob('exe/webui/scripts/editor/js/*')),
                  ('scripts/editor/lang', glob.glob('exe/webui/scripts/editor/lang/*')),
                  ('scripts/editor/skins', glob.glob('exe/webui/scripts/editor/skins/*')),
                  ('scripts/editor/skins/default', 
                       glob.glob('exe/webui/scripts/editor/skins/default/*')),
                  ('scripts/editor/skins/default/images', 
                       glob.glob('exe/webui/scripts/editor/skins/default/images/*')),
                  ('scripts/editor/skins/default/toolbar', 
                       glob.glob('exe/webui/scripts/editor/skins/default/toolbar/*')),
                  ],
      
     )

