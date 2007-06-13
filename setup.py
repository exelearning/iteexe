#!/usr/bin/python

# setup.py
import os
import subprocess
from setuptools                 import setup
#from distutils.core            import setup

#from distutils.command.install import install
from exe.engine                import version
from exe.engine.path           import Path

# update the svn revision number
REVISION_FILE = 'exe/engine/version_svn.py'

try:
    os.unlink(REVISION_FILE)
except OSError:
    pass

try:
    psvn = subprocess.Popen('svnversion', stdout=subprocess.PIPE)
    psvn.wait()
    revision = psvn.stdout.read().strip()
except OSError:
    revision = None

if revision:
    open(REVISION_FILE, 'wt').write('revision = "%s"\n' % revision)

# Before we install, make sure all the mimetex binaries are executable
Path('exe/webui/templates/mimetex.cgi').chmod(0755)
Path('exe/webui/templates/mimetex.64.cgi').chmod(0755)

files = { '/usr/share/exe': ["README", 
                             "COPYING", 
                             "NEWS", 
                             "ChangeLog",
                             "doc/eXe-tutorial.elp",
                             "exe/webui/mr_x.gif"],
          '/usr/share/applications': ["exe.desktop"],
          '/usr/share/icons/hicolor/48x48/apps': ["exe.png"],
        }

def dataFiles(baseSourceDir, baseDestDir, sourceDirs):
    """Recursively get all the files in these directories"""
    global files
    from exe.engine.path import Path
    baseSourceDir = Path(baseSourceDir)
    baseDestDir = Path(baseDestDir)
    sourceDirs = map(Path, sourceDirs)
    for sourceDir in sourceDirs:
        sourceDir = baseSourceDir/sourceDir
        for subDir in list(sourceDir.walkdirs()) + [sourceDir]:
            if set(('CVS', '.svn')) & set(subDir.splitall()):
                continue
            newExtDir = baseSourceDir.relpathto(subDir)
            fileList = files.setdefault(baseDestDir/newExtDir, [])
            fileList += subDir.files()
              
    
# Add all the webui dirs
dataFiles('exe/webui', '/usr/share/exe', 
          ['style', 'css', 'docs', 'images', 'schemas', 'scripts',
           'linux-profile', 'templates'])

# Add in the locale directory
dataFiles('exe', '/usr/share/exe', ['locale'])

# Add our 3rd party library copies
dataFiles('.', '/usr/share/exe', ['twisted', 'nevow', 'formless'])

# Add in the xului directory
dataFiles('exe/xului', '/usr/share/exe', ['scripts', 'templates'])

opts = {
 "bdist_rpm": {
   "requires": ["python-imaging",]
 }
}

setup(name         = version.project,
      version      = version.release,
      description  = "eLearning XHTML editor",
      long_description = """\
The eXe project is an authoring environment to enable teachers
to publish web content without the need to become proficient in
HTML or XML markup.  Content generated using eXe can be used by
any Learning Management System.  
""",
      url          = "http://exelearning.org",
      author       = "eXe Project",
      author_email = "exe@exelearning.org",
      license      = "GPL",
      scripts      = ["exe/exe", "exe/run-exe.sh"],
      packages     = ["exe", "exe.webui", "exe.xului", 
                      "exe.engine", "exe.export"],
      data_files   = files.items(),
      doc_files    = ["NEWS", "Changelog", "COPYING", "README"],
      options      = opts
     )
