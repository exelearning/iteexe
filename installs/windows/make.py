#!C:\Python27\python

import sys
import os
import shutil
import subprocess
import urllib
# We try to import from PIL
try:
    from PIL import Image, ImageFont, ImageDraw
except:
    import Image
    import ImageFont
    import ImageDraw

# Get program files location
# In 32 bit systems both variables have the same value
PROGRAM_FILES = os.environ["ProgramFiles"]
PROGRAM_FILES_32 = os.environ["ProgramFiles(x86)"]

# Name used for temporary file that contains branded splash screen
BRANDED_JPG = 'splashb.jpg'

# Microsoft Visual C++ Redistibutable download URL
VCREDIST = 'http://download.microsoft.com/download/5/D/8/5D8C65CB-C849-4025-8E95-C3966CAFD8AE/vcredist_x86.exe'

# Specify any options necessary when building installers
nsis_options = ''
# If makensis.exe is not in your PATH, specify explicit pathname here
nsis = PROGRAM_FILES + '\NSIS\makensis.exe'
if not os.path.exists(nsis):
    nsis = PROGRAM_FILES_32 + '\NSIS\makensis.exe'

# Save current dir
CUR_DIR = os.path.abspath('.')
# Get source dir path
SRC_DIR = os.path.abspath('../..')

# We need this for the version detection to work
os.chdir(SRC_DIR)

# Clean out the build and dist dirs
shutil.rmtree(os.path.join(SRC_DIR, 'build'), True)
shutil.rmtree(os.path.join(SRC_DIR, 'dist'), True)

# Build the executable
subprocess.check_call('C:\Python27\python win-setup.py py2exe', shell=True, cwd=SRC_DIR)

# Append the source path to Python path so we can import eXe modules
sys.path.append(SRC_DIR)

# Get the version
from exe.engine import version

# Compose version parameters string
versions = "/DEXE_VERSION=%s /DEXE_REVISION=%s /DEXE_BUILD=%s /DEXE_SPLASH=%s" \
        % (version.release, version.revision, version.version, BRANDED_JPG)

# Write version file to dist folder
open('dist/version', 'w').write(version.version)

# Because some versions of Python Imaging library come
# without support for libfreetype.
font = None
fontcolor = '#808080'
candrawfont = False
try:
	font = ImageFont.truetype("arial.ttf", 12)
	(font_width, font_height) = font.getsize("Version:")
	candrawfont = True
except ImportError:
	print "Could not add version number to image", sys.exc_info()[0]

# Open the image
im = Image.open(os.path.join(CUR_DIR, "splash1.jpg"))
draw = ImageDraw.Draw(im)

# Brand the splash screen (if we can)
if candrawfont:
	draw.text((150, 102), "Version: " + version.release, font=font, fill=fontcolor)
	draw.text((150, 105 + font_height), "Revision: " + version.revision, font=font, fill=fontcolor)

# Remove the image from memory
del draw
# Save the branded image with the temp name
im.save(os.path.join(CUR_DIR, BRANDED_JPG))

# Download the Visual C++ Redistibutable installer
urllib.urlretrieve(VCREDIST, os.path.join(CUR_DIR, 'vcredist2008_x86.exe'))

# Make the installers
for installer in ('exe.nsi', 'exe.standalone.nsi'):
    # We try without path first in case it is on the system path var
    try:
        pnsis = subprocess.Popen('%s %s %s %s' % ('makensis', nsis_options, versions, os.path.join(CUR_DIR, installer)))
    except OSError:
        try:
            pnsis = subprocess.Popen('%s %s %s %s' % (nsis, nsis_options, versions, os.path.join(CUR_DIR, installer)))
        except OSError:
            print '*** unable to run makensis, check PATH or explicit pathname'
            print '    in make.py'
    pnsis.wait()

# Remove branded splash screen
os.remove(os.path.join(CUR_DIR, BRANDED_JPG))
