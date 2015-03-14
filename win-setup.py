#!/usr/bin/python

# setup.py
import glob
import os
try:
    # py2exe 0.6.4 introduced a replacement modulefinder.
    # This means we have to add package paths there, not to the built-in
    # one.  If this new modulefinder gets integrated into Python, then
    # we might be able to revert this some day.
    # if this doesn't work, try import modulefinder
    try:
         import py2exe.mf as modulefinder
    except ImportError:
        import modulefinder
    import win32com, sys
    for p in win32com.__path__[1:]:
        modulefinder.AddPackagePath("win32com", p)
    for extra in ["win32com.shell"]: #,"win32com.mapi"
        __import__(extra)
        m = sys.modules[extra]
        for p in m.__path__[1:]:
            modulefinder.AddPackagePath(extra, p)
except ImportError:
    # no build path setup, no worries.
    pass
from distutils.core import setup
import py2exe
from exe.engine import version

g_files = {'.': ["README",
                  "COPYING",
                  "NEWS",
                  "ChangeLog",
                  "exe/webui/images/eXe_icon.ico",
                  "exe/webui/mr_x.gif",
                  "installs/windows/exeLicense.txt",
                  ]}
g_oldBase = "exe/webui"
g_newBase = "."


def dataFiles(dirs, excludes=[]):
    """Recursively get all the files in these directories"""
    for file in dirs:
        if not os.path.basename(file[0]).startswith("."):
            if os.path.isfile(file):
                path = file[len(g_oldBase) + 1:]
                dir = os.path.join(g_newBase, os.path.dirname(path))
                if os.path.basename(path) not in excludes:
                    if dir in g_files:
                        g_files[dir].append(file)
                    else:
                        g_files[dir] = [file]

            elif os.path.isdir(file) and file not in excludes:
                dataFiles(glob.glob(file + "/*"), excludes)

dataFiles(["exe/webui/style",
           "exe/webui/css",
           "exe/webui/images",
           "exe/webui/docs",
           "exe/webui/scripts",
           "exe/webui/schemas",
           "exe/webui/templates"],
           excludes = ['mimetex-darwin.cgi'])

g_oldBase = "exe"
g_newBase = "."
dataFiles(["exe/locale", "exe/mediaprofiles"])

g_oldBase = "exe/jsui"
g_newBase = "."
dataFiles(["exe/jsui/templates",
           "exe/jsui/scripts"])

opts = {
 "py2exe": {
   "packages": ["encodings", "nevow", "nevow.flat", "cProfile", "functools", "csv", "libxml2", "robotparser", "chardet", "lxml", "feedparser", "BeautifulSoup"],
   "includes": ["PngImagePlugin", "JpegImagePlugin", "GifImagePlugin",
                "IcoImagePlugin", "BmpImagePlugin"],

 }
}

setup(windows=["exe/exe"],
      console=["exe/exe_do"],
      name=version.project,
      version=version.version,
      packages=["exe", "exe.engine", "exe.webui", "exe.export", "exe.importers", "exe.jsui", "exe.engine.lom"],
      description="The EXtremely Easy to use eLearning authoring tool",
      url="http://exelearning.net",
      author="INTEF-eXe Project",
      author_email="admin@exelearning.net",
      license="GPL",
      scripts=["exe/exe"],
      options=opts,
      data_files=g_files.items(),
)
