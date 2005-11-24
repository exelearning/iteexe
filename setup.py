#!/usr/bin/python

# setup.py
import glob
import os.path
from distutils.command.install import install
from distutils.core            import setup
from exe.engine                import version
from exe.engine.path           import Path

files = { '/usr/share/exe': ["README", 
                             "COPYING", 
                             "NEWS", 
                             "ChangeLog",
                             "doc/eXe-tutorial.elp",
                             "exe/webui/mr_x.gif"]}


def dataFiles(baseSourceDir, baseDestDir, sourceDirs):
    """Recursively get all the files in these directories"""
    baseSourceDir = Path(baseSourceDir)
    baseDestDir = Path(baseDestDir)
    sourceDirs = map(Path, sourceDirs)
    for sourceDir in sourceDirs:
        sourceDir = baseSourceDir/sourceDir
        for subDir in list(sourceDir.walkdirs()) + [sourceDir]:
            if '.svn' in subDir.splitall():
                continue
            newExtDir = baseSourceDir.relpathto(subDir)
            fileList = files.setdefault(baseDestDir/newExtDir, [])
            fileList += subDir.files()
              
    
# Add all the webui dirs
dataFiles('exe/webui', '/usr/share/exe', 
          ['style', 'css', 'docs', 'images', 'scripts',
           'linux-profile', 'firefox'])

# Add in the 
dataFiles('exe', '/usr/share/exe', ['locale'])

dataFiles('exe/xului', '/usr/share/exe', ['scripts', 'templates'])

opts = {
 "bdist_rpm": {
   "requires": ["python-imaging",]
 }
}

from pprint import pprint
pprint(files)

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
      scripts      = ["exe/exe", "exe/run-exe.sh"],
      packages     = ["exe", "exe.webui", "exe.xului", 
                      "exe.engine", "exe.export"],
      data_files   = files.items(),
      options      = opts
     )
