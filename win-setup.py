#!/usr/bin/python

# setup.py
import glob
import os
from distutils.core import setup
import py2exe

# update the svn revision number
REVISION_FILE = 'exe/engine/version_svn.py'

try:
    os.unlink(REVISION_FILE)
except OSError:
    pass

from exe.engine import version

try:
    line = open('debian/changelog').readline()
    build = line.split(':')[1].split(')')[0]
    revision = build.split(version.release + ".")[1]
    open(REVISION_FILE, 'wt').write('revision = "%s"\n' % revision)
except OSError:
    print "*** Warning: 'svnversion' tool not available to update revision number"

g_files = { '.': ["README", 
                  "COPYING", 
                  "NEWS", 
                  "ChangeLog",
                  "exe/webui/images/eXe_icon.ico",
                  "exe/webui/mr_x.gif",
                  "exe/msvcr71.dll",
                  "installs/windows/exeLicense.txt",
                  ]}
g_oldBase = "exe/webui"
g_newBase = "."
def dataFiles(dirs, excludes=[]):
    """Recursively get all the files in these directories"""
    for file in dirs:
        if not os.path.basename(file[0]).startswith("."):
            if os.path.isfile(file):
                path = file[len(g_oldBase)+1:]
                dir = os.path.join(g_newBase, os.path.dirname(path))
                if os.path.basename(path) not in excludes:
                    if dir in g_files:
                        g_files[dir].append(file)
                    else:
                        g_files[dir] = [file]

            elif os.path.isdir(file):
                dataFiles(glob.glob(file+"/*"), excludes)
                
dataFiles(["exe/webui/style",
           "exe/webui/css",
           "exe/webui/images",
           "exe/webui/docs",
           "exe/webui/scripts",
           "exe/webui/schemas",
           "exe/webui/templates"],
           excludes = ['mimetex.cgi', 'mimetex.64.cgi', 'mimetex-darwin.cgi'])

g_oldBase = "exe"
g_newBase = "."
dataFiles(["exe/locale"])

g_oldBase = "exe/jsui"
g_newBase = "."
dataFiles(["exe/jsui/templates",
           "exe/jsui/scripts"])

opts = {
 "py2exe": {
   "packages": ["encodings", "nevow", "nevow.flat", "cProfile", "functools", "csv", "libxml2", "robotparser", "chardet"],
   "includes": ["PngImagePlugin", "JpegImagePlugin", "GifImagePlugin",
                "IcoImagePlugin", "BmpImagePlugin"],

 }
}

setup(windows=["exe/exe"],
      console=["exe/exe_do"],
      version=build,
      packages=["exe", "exe.engine", "exe.webui", "exe.export", "exe.importers", "exe.jsui"],
      description  = "eLearning XHTML editor",
      url          = "http://exelearning.org",
      author       = "eXe Project",
      author_email = "exe@exelearning.org",
      license      = "GPL",
      scripts      = ["exe/exe",],
      options      = opts,
      data_files   = g_files.items(),
)
