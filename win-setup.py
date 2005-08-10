#!/usr/bin/python

# setup.py
import glob
import os.path
from distutils.core import setup
import py2exe
from exe.engine import version

g_files = { '.': ["README", 
                  "eXe_icon.ico", 
                  "exe/webui/mr_x.gif",
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
           "exe/webui/templates",
           "exe/webui/images",
           "exe/webui/docs",
           "exe/webui/win-profile",
           "exe/webui/scripts"])

opts = {
 "py2exe": {
   "packages": ["encodings", "nevow"],
   "includes": ["pango", "atk", "gobject",
                "PngImagePlugin", "JpegImagePlugin", "GifImagePlugin",
                "IcoImagePlugin", "BmpImagePlugin"],
   "dll_excludes": ["iconv.dll", "intl.dll", 
                    "libatk-1.0-0.dll", "libgdk-win32-2.0-0.dll", 
                    "libgdk_pixbuf-2.0-0.dll", "libglib-2.0-0.dll", 
                    "libgmodule-2.0-0.dll", "libgobject-2.0-0.dll", 
                    "libgthread-2.0-0.dll", "libgtk-win32-2.0-0.dll", 
                    "libpango-1.0-0.dll", "libpangowin32-1.0-0.dll", 
                    "nspr4.dll", "plc4.dll", "plds4.dll", "xpcom.dll" ]
 }
}
setup(windows=["exe/exe"],
      version=version.release,
      packages=["exe", "exe.engine", "exe.webui", "exe.export"],
      description  = "eLearning XHTML editor",
      url          = "http://exelearning.org",
      author       = "University of Auckland",
      author_email = "exe@auckland.ac.nz",
      license      = "GPL",
      scripts      = ["exe/exe",],
      options      = opts,
      data_files   = g_files.items(),
     )
