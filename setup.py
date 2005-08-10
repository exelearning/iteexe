#!/usr/bin/python

# setup.py
import glob
import os.path
from distutils.command.install import install
from distutils.core            import setup
from exe.engine import version

g_files = { '/usr/share/exe': ["README","doc/eXe-tutorial.elp",
                               "exe/webui/mr_x.gif"]}
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
           "exe/webui/docs",
           "exe/webui/images",
           "exe/webui/scripts",
           "exe/webui/templates",
           "exe/webui/linux-profile",
           "exe/webui/firefox",
           "exe/webui/mr_x.gif"])
opts = {
 "bdist_rpm": {
   "requires": ["gnome-python2-gtkmozembed", "python-imaging"]
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
      url          = "http://exe.cfdl.auckland.ac.nz",
      author       = "University of Auckland",
      author_email = "exe@auckland.ac.nz",
      license      = "GPL",
      scripts      = ["exe/exe", "exe/run-exe.sh"],
      packages     = ["exe", "exe.webui", "exe.engine", "exe.export"],
      data_files   = g_files.items(),
      options      = opts
     )
