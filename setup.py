#!/usr/bin/python

# setup.py
import glob
import os.path
from distutils.command.install import install
from distutils.core            import setup
from exe.engine import version


g_files = { '/usr/share/exe': ["exe/exe.conf", "README",]}
g_oldBase = "exe/webui"
g_newBase = "/usr/share/exe"

def dataFiles(dirs):
    """Recursively get all the files in these directories"""
    for file in dirs:
        if not os.path.basename(file[0]).startswith("."):
            if os.path.isfile(file):
                path = file[len(g_oldBase)+1:]
                dir  = g_newBase + "/" + os.path.dirname(path)
                if dir in g_files:
                    g_files[dir].append(file)
                else:
                    g_files[dir] = [file]

            elif os.path.isdir(file):
                dataFiles(glob.glob(file+"/*"))

dataFiles(["exe/webui/style",
           "exe/webui/css",
           "exe/webui/images",
           "exe/webui/scripts"])

setup(name         = version.project,
      version      = version.release,
      description  = "eLearning XHTML editor",
      url          = "http://exe.cfdl.auckland.ac.nz",
      author       = "University of Auckland",
      author_email = "exe@auckland.ac.nz",
      license      = "GPL",
      scripts      = ["exe/exe",],
      packages     = ["exe", "exe.webui", "exe.engine", "exe.export"],
      data_files   = g_files.items()
     )
