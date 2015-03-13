#!/usr/bin/python
# -*- coding: utf-8 -*-

# setup.py
# Only used for Debian packaging

from setuptools import setup
from exe.engine import version

g_files = {'/usr/share/exe': ["README",
                              "COPYING",
                              "NEWS",
                              "ChangeLog",
                              "exe/webui/mr_x.gif"],
           '/usr/share/applications': ["exe.desktop"],
           '/usr/share/icons/hicolor/48x48/apps': ["exe.png"],
           '/usr/share/pixmaps': ["exe.xpm"]
           }

g_oldBase = "exe/webui"
g_newBase = "/usr/share/exe"


def dataFiles(dirs, excludes=[]):
    """
    Recursively get all the files in these 'dirs' directories
    except those listed in 'excludes'
    """
    import os.path
    import glob

    global dataFiles, g_oldBase, g_newBase, g_files
    for file in dirs:
        if not os.path.basename(file[0]).startswith("."):
            if os.path.isfile(file) and file not in excludes:
                if len(g_oldBase) >= 1:
                    path = file[len(g_oldBase) + 1:]
                else:
                    path = file
                dir = g_newBase + "/" + os.path.dirname(path)
                if dir in g_files:
                    g_files[dir].append(file)
                else:
                    g_files[dir] = [file]
            elif os.path.isdir(file) and file not in excludes:
                dataFiles(glob.glob(file + "/*"), excludes)

dataFiles(["exe/webui/style",
           "exe/webui/css",
           "exe/webui/docs",
           "exe/webui/images",
           "exe/webui/schemas",
           "exe/webui/scripts",
           "exe/webui/templates"],
          excludes=["exe/webui/templates/mimetex-darwin.cgi",
                    "exe/webui/templates/mimetex.exe"])

g_oldBase = "exe"
g_newBase = "/usr/share/exe"
dataFiles(["exe/mediaprofiles"])

# jrf - to comply with the FHS
# g_oldBase = "exe"
# g_newBase = "/usr/share/exe"
g_oldBase = "exe/locale"
g_newBase = "/usr/share/locale"
# jrf - Experimental
# .../*/*... no funciona, pero no da error - se puede dejar
dataFiles(["exe/locale"],
          excludes=["exe/locale/*/LC_MESSAGES/*.po", "exe/locale/messages.pot"])
# dataFiles(["exe/locale"])

g_oldBase = ""
g_newBase = "/usr/share/exe"
dataFiles(["twisted", "nevow", "formless"])

g_oldBase = "exe/jsui"
g_newBase = "/usr/share/exe"
dataFiles(["exe/jsui/scripts",
           "exe/jsui/templates"])

setup(name=version.project,
      version=version.version,
      description="The EXtremely Easy to use eLearning authoring tool",
      long_description="""\
The eXe project is an authoring environment to enable teachers
to publish web content without the need to become proficient in
HTML or XML markup.  Content generated using eXe can be used by
any Learning Management System.
""",
      url="http://exelearning.net",
      author="INTEF-eXe Project",
      author_email="admin@exelearning.net",
      license="GPL",
      scripts=["exe/exe", "exe/exe_do"],
      packages=["exe", "exe.webui", "exe.jsui",
                "exe.engine", "exe.export",
                "exe.importers", "exe.engine.lom"],
      data_files=g_files.items()
      )
