#!/usr/bin/env python

# another thinly disguised shell script written in Python

import sys
import os
import subprocess

# TOPDIR root of RPM build tree typically /usr/src/redhat or /home/xxx/.rpm
#TOPDIR = '/usr/src/redhat'
TOPDIR = os.path.join(os.environ['HOME'], '.rpm')

# where the SVN exe source directory is
SRCDIR = '/usr/local/src'

sys.path.insert(0, os.path.join(SRCDIR, 'exe'))
from exe.engine import version

# create the source tarball
tarball = os.path.join(TOPDIR, 'SOURCES', 'exe-' + version.version + '-source.tgz')
os.chdir(SRCDIR)
try:
    ret = subprocess.call('tar -czf %s --wildcards-match-slash --exclude="*.svn*" --exclude "*.pyc" --exclude="*.tmp" --exclude="*~" --exclude="dist/*" --exclude="build/*" --exclude="pyxpcom/*" exe' %
                              tarball, shell = True)
    if ret < 0:
	print >>sys.stderr, "Unable to make tarball signal", -ret
	sys.exit(ret)
except OSError, e:
    print >>sys.stderr, "Execution of tar failed:", e

# get the distribution
pipe = subprocess.Popen('uname -r', shell = True, stdout = subprocess.PIPE).stdout
dist = pipe.read().strip()
dist = dist[dist.rfind('.')+1:]

try:
    ret = subprocess.call('rpmbuild -tb --define="dist %s" --define="revision %s" %s' % 
                          (dist, version.revision, tarball), shell = True)
    if ret < 0:
        print >>sys.stderr, "Unable to run rpmbuild, signal", -ret
        sys.exit(ret)
except OSError, e:
    print >>sys.stderr, "Execution of rpmbuild failed:", e

