#!/usr/bin/python

# setup.py
# Create a RPM package

import os.path
import glob
from distutils.core import setup
from exe.engine     import version

# Basic files
g_files = {
    '/usr/share/exe': [
        "COPYING",
        "NEWS",
        "ChangeLog"
    ],
    '/usr/share/doc/intef-exe': ["README"],
    '/usr/share/icons/hicolor/48x48/apps': ["exe.png"],
    '/usr/share/pixmaps': ["exe.xpm"]
}

def dataFiles(dirs, excludes = []):
    """
    Recursively get all the files in these 'dirs' directories
    except those listed in 'excludes'
    """
    global dataFiles, g_oldBase, g_newBase, g_files
    
    # Iterate over "dirs" list
    for file in dirs:
        # Check if it is not a hidden file
        if not os.path.basename(file[0]).startswith("."):
            # Check if it is a file and is not exluded
            if os.path.isfile(file) and file not in excludes:
                # Get full path
                path = file[len(g_oldBase) + 1:]
                # Get new path
                dir = g_newBase + "/" + os.path.dirname(path)
                
                # Add the file to the list if it has a "dir" element already
                if dir in g_files:
                    g_files[dir].append(file)
                # Or add a new item to it if it hasn't
                else:
                    g_files[dir] = [file]
                    
            # Check if it is a folder and is not excluded 
            elif os.path.isdir(file) and file not in excludes:
                # Iterate over the folder files
                dataFiles(glob.glob(file + "/*"), excludes)


# WebUI
g_oldBase = "exe/webui"
g_newBase = "/usr/share/exe"

dataFiles([
        "exe/webui/style",
        "exe/webui/content_template",
        "exe/webui/css",
        # "exe/webui/docs", # task 1080, the manual is no longer included
        "exe/webui/images",
        "exe/webui/schemas",
        "exe/webui/scripts",
        "exe/webui/templates",
        "exe/webui/tools"
    ], excludes = [
        "exe/webui/templates/mimetex-darwin.cgi", 
        "exe/webui/templates/mimetex.exe"
    ]
)

# Locales
g_oldBase = "exe/locale"
g_newBase = "/usr/share/locale"

# Exclusions
excludes = []
excludes = glob.glob(g_oldBase + "/*/LC_MESSAGES/*.po")
excludes.append(g_oldBase + "/ja/exe_jp.xlf")
excludes.append(g_oldBase + "/ja/exe_ja.xlf")
excludes.append(g_oldBase + "/messages.pot")
excludes.sort()

dataFiles(["exe/locale"], excludes)

# JSUI
g_oldBase = "exe/jsui"
g_newBase = "/usr/share/exe"

dataFiles(["exe/jsui/scripts", "exe/jsui/templates"])

# Do setup
setup(
    name = version.project,
    version = version.version,
    description = "The EXtremely Easy to use eLearning authoring tool",
    long_description = """\
The eXe project is an authoring environment to enable teachers
to publish web content without the need to become proficient in
HTML or XML markup.  Content generated using eXe can be used by
any Learning Management System.
""",
    url = "http://exelearning.net",
    author = "INTEF-eXe Project",
    author_email = "admin@exelearning.net",
    license = "GPL",
    scripts = ["exe/exe", "exe/exe_do"],
    packages = ["exe", "exe.webui", "exe.jsui", "exe.engine", "exe.export", "exe.importers", "exe.engine.lom"],
    data_files = g_files.items()
)