#!/usr/bin/env python

# a thinly disguised shell script written in Python
#

import sys
import os
import getopt
import shutil
import time
import subprocess
import tempfile

EXEDIR = '../../..'
WDIR = os.getcwd()
changelog = 'debian/changelog'

# get the version/revision
sys.path.insert(0, EXEDIR)
from exe.engine import version

# update a copy of the changelog with current revision
cl = open(changelog, 'wt')
cl.write("python-exe (%s-ubuntu1) unstable; urgency=low\n" % version.version)
news = open(os.path.join(EXEDIR,'NEWS'))
while True:
    nl = news.readline()
    if nl.strip() == "":
        break
    elif nl.startswith("Version"):
        pass
    else:
        cl.write('    ' + nl)
news.close()

cl.write("\n")
cl.write(" -- eXe Project <exe@exelearning.org>  %s\n" %
        time.strftime("%a, %d %b %Y %H:%M:%S +1200"))
cl.write("\n")
cl.write(open(changelog+".in", 'rt').read())
cl.close()

# make the dpkg
newDir = os.path.join(EXEDIR, 'debian')
if os.path.islink(newDir):
    os.remove(newDir)
elif os.path.exists(newDir):
    raise Exception('exe/debian directory/file already exists, aborting...')
src = os.path.abspath('debian')
os.chdir(EXEDIR)
os.symlink(src, 'debian')
subprocess.check_call('fakeroot debian/rules binary', shell = True)

