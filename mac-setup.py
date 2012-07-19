#!/usr/bin/python

# setup.py
import os
import time
from distutils.core            import setup
from exe.engine.path           import Path
import py2app

# update the svn revision number
REVISION_FILE = 'exe/engine/version_svn.py'

try:
    os.unlink(REVISION_FILE)
except OSError:
    pass

from exe.engine import version
revision = None
try:
    line = open('debian/changelog').readline()
    build = line.split(':')[1].split(')')[0]
    revision = build.split(version.release + ".")[1]
    open(REVISION_FILE, 'wt').write('revision = "%s"\n' % revision)
except OSError:
    print "*** Warning: 'svnversion' tool not available to update revision number"
finally:
    if revision is None or revision == 'exported':
        revision = time.strftime('%Y%m%d%H%M')
    open(REVISION_FILE, 'wt').write('revision = "%s"\n' % revision)

from exe.engine                import version

# Make main.py if it doesn't exist
if not Path('exe/main.py').exists():
    lines = open('exe/exe').readlines()
    for i, line in enumerate(lines):
        if line.startswith('import'):
            lines.insert(i, 'import decimal\n')
            break
    output = open('exe/main.py', 'w')
    output.writelines(lines)
    output.close()

files = {'../Resources/exe': ["README",
                             "COPYING",
                             "NEWS",
                             "ChangeLog",
                             "exe/webui/mr_x.gif"],
          '../Resources': ["exe_elp.icns"],
        }


def dataFiles(baseSourceDir, baseDestDir, sourceDirs, excludes=[]):
    """Recursively get all the files in these directories"""
    baseSourceDir = Path(baseSourceDir)
    baseDestDir = Path(baseDestDir)
    sourceDirs = map(Path, sourceDirs)
    for sourceDir in sourceDirs:
        sourceDir = baseSourceDir / sourceDir
        for subDir in list(sourceDir.walkdirs()) + [sourceDir]:
            if '.svn' in subDir.splitall() or 'tinymce_3.5.4.1' in subDir.splitall():
                continue
            newExtDir = baseSourceDir.relpathto(subDir)
            fileList = files.setdefault(baseDestDir / newExtDir, [])
            for file in subDir.files():
                if file.name not in excludes:
                    fileList.append(file)

# Add all the webui dirs
dataFiles('exe/webui', '../Resources/exe',
        ['style', 'css', 'images', 'docs', 'linux-profile',
            'scripts', 'schemas', 'templates',
            'firefox'],
          excludes=['mimetex.cgi', 'mimetex.64.cgi', 'mimetex.exe'])

# Add in the
dataFiles('exe', '../Resources/exe', ['locale'])

dataFiles('exe/xului', '../Resources/exe', ['scripts', 'templates'])

import sys
print sys.path

plist = dict(
    CFBundleDocumentTypes=[
        dict(
            CFBundleTypeExtensions=['elp'],
            CFBundleTypeIconFile='exe_elp.icns',
            CFBundleTypeMIMETypes=['text/xml'],
            CFBundleTypeName='Binary',
            CFBundleTypeRole='Editor',
            LSTypeIsPackage=False,
            NSDocumentClass='MyDocument',
            NSPersistentStoreTypeKey='Binary',
        ),
    ],
)

py2appParams = {
  'includes': 'PngImagePlugin,JpegImagePlugin,GifImagePlugin,IcoImagePlugin,BmpImagePlugin',
  'packages': 'encodings,nevow',
  'argv_emulation': True,
  'plist': plist,
  'iconfile': 'exe.icns'}

setup(name=version.project,
      version=version.release,
      description="eLearning XHTML editor",
      long_description="""\
The eXe project is an authoring environment to enable teachers to publish
web content without the need to become proficient in HTML or XML markup.
Content generated using eXe can be used by any Learning Management System.
""",
      url="http://exelearning.org",
      author="eXe Project",
      author_email="exe@exelearning.org",
      license="GPL",
      packages=["exe", "exe.webui", "exe.xului",
                      "exe.engine", "exe.export", "exe.importers"],
      data_files=files.items(),
      app=["exe/main.py"],
      options={'py2app': py2appParams},
      setup_requires=["py2app"],
     )
