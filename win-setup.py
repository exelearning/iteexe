#!/usr/bin/python

# setup.py
import glob
import os.path
from distutils.core import setup
import py2exe
from exe.engine import version

g_files = { '.': ["README", 
                  "COPYING", 
                  "NEWS", 
                  "ChangeLog",
                  "eXe_icon.ico",
                  "Planets-HighQuality.flv",
                  "exe/webui/mr_x.gif",
                  "exe/msvcr71.dll",
                  "doc/eXe-tutorial.elp", 
                  "installs/windows/exeLicense.txt"]}
g_oldBase = "exe/webui"
g_newBase = "."
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
           "exe/webui/docs",
           "exe/webui/linux-profile",
           "exe/webui/scripts",
           "exe/webui/templates"])

g_oldBase = "exe"
g_newBase = "."
dataFiles(["exe/locale"])

g_oldBase = "exe/xului"
g_newBase = "."
dataFiles(["exe/xului/templates",
           "exe/xului/scripts"])

opts = {
 "py2exe": {
   "packages": ["encodings", "nevow", "nevow.flat"],
   "includes": ["PngImagePlugin", "JpegImagePlugin", "GifImagePlugin",
                "IcoImagePlugin", "BmpImagePlugin"],

 }
}

setup(console=["exe/exe"],
      version=version.release,
      packages=["exe", "exe.engine", "exe.webui", "exe.export", "exe.xului"],
      description  = "eLearning XHTML editor",
      url          = "http://exelearning.org",
      author       = "EXE Team",
      author_email = "exe@exelearning.org",
      license      = "GPL",
      scripts      = ["exe/exe",],
      options      = opts,
      data_files   = g_files.items(),
)
