#!/usr/bin/python

# rpm-setup.py
# Create a RPM package

import os.path
import glob
from distutils.core import setup
from exe.engine     import version

# Files that are going to be copied (We add these ones manually)
g_files = {
    '/usr/share/exe': [
        # Although this is a copy of debian/changelog.gz
        "ChangeLog",
        # Removed, this is the GPL - to copyright
        #"COPYING",
        # No longer used, after bug 2284 was fixed
        #"NEWS"
    ],
    # ReadMe file
    '/usr/share/doc/intef-exe': ["README"],
    # eXe main icon
    '/usr/share/icons/hicolor/48x48/apps': ["exe.png"],
    # eXe XPM icon
    '/usr/share/pixmaps': ["exe.xpm"]
}

def dataFiles(dirs, excludes = []):
    """
    Recursively get all the files in these 'dirs' directories
    except those listed in 'excludes'
    """
    # Get global variables
    global dataFiles, g_oldBase, g_newBase, g_files

    # Go throught all files
    for file in dirs:
        # This will prevent it from copying hidden or excluded files
        if not os.path.basename(file[0]).startswith("."):
             #  If it is a file
            if os.path.isfile(file) and file not in excludes:
                # We get only the part after that from the file path
                path = file[len(g_oldBase) + 1:]

                # Get the full new path
                dir = g_newBase + "/" + os.path.dirname(path)

                # If the path is already in the array
                if dir in g_files:
                    # Append the file
                    g_files[dir].append(file)
                # If it is not
                else:
                    # Create a new array with the file
                    g_files[dir] = [file]

            # If is is a directory
            elif os.path.isdir(file) and file not in excludes:
                # Call this function with the subdirectory
                dataFiles(glob.glob(file + "/*"), excludes)

# Source dir
g_oldBase = "exe/webui"
# Destination dir
g_newBase = "/usr/share/exe"

# Process WebUI files
dataFiles(
    [
        "exe/webui/style",
        "exe/webui/content_template",
        "exe/webui/css",
        # jrf - task 1080, the manual is no longer included
        # "exe/webui/docs",
        "exe/webui/images",
        "exe/webui/schemas",
        "exe/webui/scripts",
        "exe/webui/templates",
        "exe/webui/tools"
    ],
    excludes = [
        "exe/webui/templates/mimetex-darwin.cgi",
        "exe/webui/templates/mimetex.exe"
    ]
)

# Process metadata validation rules
g_oldBase = "exe/webui"
g_newBase = "/usr/share/exe"
dataFiles(['exe/webui/exportvalidation.json'])

# Process locales folder
# jrf - bug 2402, to comply with the FHS
g_oldBase = "exe/locale"
g_newBase = "/usr/share/locale"

#  We exclude PO files, the POT file and japanese XLF files
excludes = glob.glob(g_oldBase + "/*/LC_MESSAGES/*.po")
excludes.append(g_oldBase + "/ja/exe_jp.xlf")
excludes.append(g_oldBase + "/ja/exe_ja.xlf")
excludes.append(g_oldBase + "/messages.pot")
excludes.sort()
dataFiles(["exe/locale"], excludes)

# Process JSUI files
g_oldBase = "exe/jsui"
g_newBase = "/usr/share/exe"
dataFiles(["exe/jsui/scripts", "exe/jsui/templates"])

# Run the setup
setup(
    # Project name
    name = version.project,
    # Project version
    version = version.version,
    # Project description
    description = "The EXtremely Easy to use eLearning authoring tool",
    # Project long description
    long_description = """\
The eXe project is an authoring environment to enable teachers
to publish web content without the need to become proficient in
HTML or XML markup.  Content generated using eXe can be used by
any Learning Management System.
""",
    # Project homepage
    url = "http://exelearning.net",
    # Project author
    author = "INTEF-eXe Project",
    # Author email
    author_email = "admin@exelearning.net",
    # Project license
    license = "GPL",
    # Executable files
    scripts = ["exe/exe", "exe/exe_do"],
    # Project packages
    packages=[
        "exe",
        "exe.webui",
        "exe.jsui",
        "exe.engine",
        "exe.export",
        "exe.importers",
        "exe.engine.lom",
        "exe.engine.exceptions"
    ],
    # Files list
    data_files = g_files.items()
)