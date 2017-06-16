#!/usr/bin/python

# setup.py
from distutils.core import setup
from exe.engine.path import Path
from exe.engine import version
import os
import httplib2
import py2app

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
          '../Resources': ["exe_elp.icns", os.path.join(os.path.dirname(httplib2.__file__), 'cacerts.txt')],
        }


def dataFiles(baseSourceDir, baseDestDir, sourceDirs, excludes=[]):
    """Recursively get all the files in these directories"""
    baseSourceDir = Path(baseSourceDir)
    baseDestDir = Path(baseDestDir)
    sourceDirs = map(Path, sourceDirs)
    for sourceDir in sourceDirs:
        sourceDir = baseSourceDir / sourceDir
        for subDir in list(sourceDir.walkdirs()) + [sourceDir]:
            if '.svn' in subDir.splitall():
                continue
            newExtDir = baseSourceDir.relpathto(subDir)
            fileList = files.setdefault(baseDestDir / newExtDir, [])
            for file in subDir.files():
                if file.name not in excludes:
                    fileList.append(file)


# Add all the webui dirs
dataFiles('exe/webui', '../Resources/exe',
          [
              'style', 'content_template', 'css', 'images', 'docs',
              'scripts', 'schemas', 'templates',
              'tools'
          ],
          excludes=['mimetex.exe'])

# Add in the
dataFiles('exe', '../Resources/exe', ['locale'])

dataFiles('exe/jsui', '../Resources/exe', ['scripts', 'templates'])

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
    'includes': 'PngImagePlugin,JpegImagePlugin,GifImagePlugin,IcoImagePlugin,BmpImagePlugin,BaseHTTPServer',
    'packages': 'encodings,nevow,lxml',
    'argv_emulation': True,
    'semi_standalone': False,
    'plist': plist,
    'iconfile': 'exe.icns'
}

setup(name=version.project,
      version=version.version,
      description="The EXtremely Easy to use eLearning authoring tool",
      long_description="""\
The eXe project is an authoring environment to enable teachers to publish
web content without the need to become proficient in HTML or XML markup.
Content generated using eXe can be used by any Learning Management System.
""",
      url="http://exelearning.net",
      author="INTEF-eXe Project",
      author_email="admin@exelearning.net",
      license="GPL",
      packages=["exe", "exe.webui", "exe.jsui",
                "exe.engine", "exe.export", "exe.importers", "exe.engine.lom", "exe.engine.exceptions"],
      data_files=files.items(),
      app=["exe/main.py"],
      options={'py2app': py2appParams},
      setup_requires=["py2app"],
      )
