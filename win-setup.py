#!/usr/bin/python

# win-setup.py

import glob
import os
import py2exe
import httplib2
from distutils.core import setup
from exe.engine import version
try:
    # py2exe 0.6.4 introduced a replacement modulefinder.
    # This means we have to add package paths there, not to the built-in
    # one. If this new modulefinder gets integrated into Python, then
    # we might be able to revert this some day.
    # If this doesn't work, try import modulefinder
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
    # No build path setup, no worries.
    pass

# Files that are going to be copied (We add these ones manually)
g_files = {
    '.': [
        # Although this is a copy of debian/changelog
        "ChangeLog",
        # Removed, this is the GPL - to copyright
        #"COPYING",
        # No longer used, after bug 2284 was fixed
        #"NEWS",
        # ReadMe file
        "README",
        # eXe main icon
        "exe/webui/images/eXe_icon.ico",
        #"exe/webui/mr_x.gif",
        # License file
        "installs/windows/exeLicense.txt",
        # Root certificates
        os.path.join(os.path.dirname(httplib2.__file__), 'cacerts.txt')
    ]
}

def dataFiles(dirs, excludes=[]):
    """
    Recursively get all the files in these 'dirs' directories
    except those listed in 'excludes'
    """
    # Get global variables
    global dataFiles, g_oldBase, g_newBase, g_files

    # Go throught all files
    for file in dirs:
        # This will prevent it from copying hidden or excluded files
        if not os.path.basename(file[0]).startswith(".") and file not in excludes:
            #  If it is a file
            if os.path.isfile(file):
                # If there is source dir
                if len(g_oldBase) >= 1:
                    # We get only the part after that from the file path
                    path = file[len(g_oldBase) + 1:]
                # If there isn't
                else:
                    # We get all of the path
                    path = file

                # Get the full new path
                dir = os.path.join(g_newBase, os.path.dirname(path))

                # If the path is already in the array
                if dir in g_files:
                    # Append the file
                    g_files[dir].append(file)
                # If it is not
                else:
                    # Create a new array with the file
                    g_files[dir] = [file]
            # If is is a directory
            elif os.path.isdir(file):
                # Call this function with the subdirectory
                dataFiles(glob.glob(file + "/*"), excludes)

# Source dir
g_oldBase = "exe/webui"
# Destination dir
g_newBase = "."

# Process WebUI files
dataFiles(
    [
        "exe/webui/style",
        "exe/webui/content_template",
        "exe/webui/css",
        "exe/webui/images",
        # jrf - task 1080, the manual is no longer included
        # "exe/webui/docs",
        "exe/webui/scripts",
        "exe/webui/schemas",
        "exe/webui/templates",
        "exe/webui/tools"
    ],
    # We exlude mimetext executables for other OS
    excludes = ['mimetex-darwin.cgi']
)

# Process metadata validation rules
g_oldBase = "exe/webui"
g_newBase = "."
dataFiles(['exe/webui/exportvalidation.json'])

# Process Mobile Profiles
g_oldBase = "exe"
g_newBase = "."
dataFiles(["exe/mediaprofiles"])

# Process locales folder
g_oldBase = "exe"
g_newBase = "."

#  We exclude PO files, the POT file and japanese XLF files
excludes = glob.glob(g_oldBase + "/*/LC_MESSAGES/*.po")
excludes.append(g_oldBase + "/ja/exe_jp.xlf")
excludes.append(g_oldBase + "/ja/exe_ja.xlf")
excludes.append(g_oldBase + "/messages.pot")
excludes.sort()
dataFiles(["exe/locale"], excludes=excludes)

# Process JSUI files
g_oldBase = "exe/jsui"
g_newBase = "."
dataFiles(["exe/jsui/scripts", "exe/jsui/templates"])

# py2exe options
opts = {
    "py2exe": {
        "packages": [
            "encodings",
            "nevow",
            "nevow.flat",
            "cProfile",
            "functools",
            "csv",
            "libxml2",
            "robotparser",
            "chardet",
            "lxml",
            "feedparser",
            "BeautifulSoup",
            "BaseHTTPServer",
            "oauthlib",
            "webassets",
            "cssmin"
        ],
        "includes": [
            "PngImagePlugin",
            "JpegImagePlugin",
            "GifImagePlugin",
            "IcoImagePlugin",
            "BmpImagePlugin"
        ]
    }
}

# Run the setup
setup(
    # Project name
    name=version.project,
    # Project version
    version=version.version,
    # Project author
    author="INTEF-eXe Project",
    # Author email
    author_email="admin@exelearning.net",
    # Project description
    description="The EXtremely Easy to use eLearning authoring tool",
    # Project long description
    long_description="""\
The eXe project is an authoring environment to enable teachers
to publish web content without the need to become proficient in
HTML or XML markup.  Content generated using eXe can be used by
any Learning Management System.
""",
    # Project homepage
    url="http://exelearning.net",
    # Project license
    license="GPL",
    # Executable files
    scripts=["exe/exe", "exe/exe_do"],
    # Graphic Interface application
    windows=["exe/exe"],
    # Console application
    console=["exe/exe_do"],
    # Project packages
    packages=[
        "exe",
        "exe.engine",
        "exe.webui",
        "exe.export",
        "exe.importers",
        "exe.jsui",
        "exe.engine.lom",
        "exe.engine.exceptions"
    ],
    # Files list
    data_files=g_files.items(),
    # Custom options
    options=opts
)
