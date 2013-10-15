#!C:\Python27\python

# specify any options necessary when building installers
nsis_options = ''

# if makensis.exe is not in your PATH, specify explicit pathname here
nsis = 'c:\Program Files\NSIS\makensis.exe'

# name used for temporary file that contains branded splash screen
BRANDED_JPG = 'splashb.jpg'
VCREDIST = 'http://download.microsoft.com/download/5/D/8/5D8C65CB-C849-4025-8E95-C3966CAFD8AE/vcredist_x86.exe'

import sys
import os
import shutil
import subprocess
import Image
import ImageFont
import ImageDraw
import urllib

# clean out the build and dist dirs
os.chdir('../..')
WDIR = os.getcwd()
shutil.rmtree('build', True)
shutil.rmtree('dist', True)

shutil.copytree('exe/webui/mediaconverters', 'dist/mediaconverters')

# build the executable
subprocess.check_call('C:\Python27\python win-setup.py py2exe', shell=True, cwd=WDIR)

# get the version
sys.path.insert(0, WDIR)
from exe.engine import version
versions = "/DEXE_VERSION=%s /DEXE_REVISION=%s /DEXE_BUILD=%s /DEXE_SPLASH=%s" \
        % (version.release, version.revision, version.version, BRANDED_JPG)
open('dist/version', 'w').write(version.version)

# brand the splash screen
os.chdir(os.path.join(WDIR, 'installs/windows'))
font = ImageFont.truetype("arial.ttf", 12)
fontcolor = '#808080'
(w, h) = font.getsize("Version:")
im = Image.open("splash1.jpg")
draw = ImageDraw.Draw(im)
draw.text((150, 102), "Version: " + version.release, font=font,
        fill=fontcolor)
draw.text((150, 102 + h), "Revision: " + version.revision,
        font=font, fill=fontcolor)
del draw
im.save(BRANDED_JPG)

urllib.urlretrieve(VCREDIST, 'vcredist2008_x86.exe')

# make the installers
for installer in ('exe.nsi', 'exe.standalone.nsi'):
    try:
        pnsis = subprocess.Popen('%s %s %s %s' %
                                 ('makensis', nsis_options, versions, installer))
    except OSError:
        try:
            pnsis = subprocess.Popen('%s %s %s %s' %
                                     (nsis, nsis_options, versions, installer))
        except OSError:
            print '*** unable to run makensis, check PATH or explicit pathname'
            print '    in make.py'
    pnsis.wait()

# remove branded splash screen
os.remove(BRANDED_JPG)
