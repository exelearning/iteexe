#!/usr/bin/python

# setup.py
import glob
import os.path
from distutils.command.install import install
from distutils.core            import setup
from exe.engine import version

g_files = { '/usr/share/exe': ["README", 
                               "COPYING", 
                               "NEWS", 
                               "ChangeLog",
                               "doc/eXe-tutorial.elp",
                               "exe/webui/mr_x.gif"]}
g_oldBase = "exe/webui"
g_newBase = "/usr/share/exe"

def dataFiles(dirs, excludes=[]):
    """Recursively get all the files in these directories"""
    import os.path
    import glob
    global dataFiles, g_oldBase, g_newBase, g_files
    for file in dirs:
        if not os.path.basename(file[0]).startswith("."):
            if os.path.isfile(file) and file not in excludes:
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
           "exe/webui/docs",
           "exe/webui/images",
           "exe/webui/scripts",
           "exe/webui/templates",
           "exe/webui/linux-profile",
           "exe/webui/firefox"],
	  excludes = ["mimetex.64.cgi", "mimetex-darwin.cgi", "mimetex.exe"])

g_oldBase = "exe"
g_newBase = "/usr/share/exe"
dataFiles(["exe/locale"])

g_oldBase = "exe/xului"
g_newBase = "/usr/share/exe"
dataFiles(["exe/xului/scripts",
           "exe/xului/templates"])
opts = {
 "bdist_rpm": {
   "requires": ["python-imaging",]
 }
}
setup(name         = version.project,
      version      = version.release,
      description  = "eLearning XHTML editor",
      long_description = """\
The eXe project is an authoring environment to enable teachers to publish 
web content without the need to become proficient in HTML or XML markup.
Content generated using eXe can be used by any Learning Management System.  
""",
      url          = "http://exelearning.org",
      author       = "University of Auckland",
      author_email = "exe@exelearning.org",
      license      = "GPL",
      scripts      = ["exe/exe"],
      packages     = ["exe", "exe.webui", "exe.xului", 
                      "exe.engine", "exe.export"],
      data_files   = g_files.items(),
      options      = opts
     )
