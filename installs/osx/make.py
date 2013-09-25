#!/usr/bin/env python

# a thinly disguised shell script written in Python
#

import sys
import os
import getopt
import shutil
import subprocess

os.chdir('../..')
WDIR = os.getcwd()
TEMPLATE = os.path.join(WDIR, 'installs/osx', 'exe.dmg')
VOL = '/Volumes/exe'
OUTPUT = os.path.join(WDIR, 'installs/osx')

do_upload = False
try:
    opts, args = getopt.getopt(sys.argv[1:], "p", ["package"])
except getopt.GetoptError:
    print "make {-p|--package}"
    sys.exit(2)
for o, a in opts:
    if o in ("-p", "--package"):
        do_make_image = True

# remove the build and dist directories
os.chdir(WDIR)
shutil.rmtree('build', True)
shutil.rmtree('dist', True)

# make the app
subprocess.check_call('python mac-setup.py py2app', shell=True, cwd=WDIR)

if not do_make_image:
    sys.exit()

sys.path.insert(0, WDIR)
from exe.engine import version
outpathn = os.path.join(OUTPUT, 'iteexe-%s.dmg' % version.release)

# attach the disk image template
subprocess.check_call('hdiutil attach %s' % TEMPLATE, shell=True)

# copy the app to the template
os.chdir(VOL)
shutil.rmtree('exe.app', True)
shutil.copytree(os.path.join(WDIR, 'dist', 'exe.app'),
        os.path.join(VOL, 'exe.app'))

# copy the README and NEWS files into the template
shutil.rmtree('README.txt', True)
shutil.copy(os.path.join(WDIR, 'README'), 'README.txt')
shutil.rmtree('NEWS.txt', True)
shutil.copy(os.path.join(WDIR, 'NEWS'), 'NEWS.txt')
shutil.rmtree('Changelog.txt', True)
shutil.copy(os.path.join(WDIR, 'debian/changelog'), 'Changelog.txt')
os.chmod('exe.app/Contents/Resources/exe/templates/mimetex-darwin.cgi', 0755)
open('exe.app/Contents/Resources/exe/version', 'w').write(version.version)
os.chdir(WDIR)

# detatch the disk image template
subprocess.check_call('hdiutil detach %s' % VOL, shell=True)

# build a compressed image
subprocess.check_call('hdiutil convert -ov -format UDZO -o %s %s' %
        (outpathn, TEMPLATE),
        shell=True)
