#!/usr/bin/env python

# another thinly disguised shell script written in Python

import sys
import os
import glob
import subprocess

# TOPDIR root of RPM build tree typically /usr/src/redhat or /home/xxx/.rpm
TOPDIR = os.path.join(os.environ['HOME'], '.rpm')

# this is done in a way consistent with the other builds...
#   even though we have the info without doing the import
os.chdir('../..')

sys.path.insert(0, '.')
from exe.engine import version

clrelease = 1
print "Making version: %s release: %s" % (version.version, clrelease)

# create the source tarball
os.chdir('..')
tarball = os.path.join(TOPDIR, 'SOURCES', 'exe-' + version.release + '-source.tgz')
try:
    ret = subprocess.call('tar -czf %s -h --wildcards-match-slash --exclude=".git" --exclude="*.svn*" --exclude "*.pyc" --exclude="*.tmp" --exclude="*~" --exclude="dist/*" --exclude="build/*" --exclude="pyxpcom/*" exe' % tarball, shell=True)
    if ret < 0:
        print >>sys.stderr, "Unable to make tarball signal", -ret
        sys.exit(ret)
except OSError, e:
    print >>sys.stderr, "Execution of tar failed:", e

try:
    ret = subprocess.call('rpmbuild -tb --define="clversion %s" --define="clrelease %s" %s' %
                          (version.release, clrelease, tarball), shell=True)
    if ret < 0:
        print >>sys.stderr, "Unable to run rpmbuild, signal", -ret
        sys.exit(ret)
except OSError, e:
    print >>sys.stderr, "Execution of rpmbuild failed:", e
