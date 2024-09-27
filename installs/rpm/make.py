#!/usr/bin/env python

import sys
import os
import subprocess

# Navigate to "exe" dir
os.chdir('../..')

# Add the folder to python path
sys.path.insert(0, '.')

# Import eXe modules
from exe.engine     import version

# Current release
clrelease = 1

# Print current version
print("Making version: %s release: %s" % (version.version, clrelease))

# Write the current version to "version" file on the root of eXe
open('version', 'w').write(version.version)

# Create the source tarball on the folder above eXe
os.chdir('..')
# Compose tarball name
tarballName = 'intef-exe-' + version.release + '-source.tgz'

tarballCommand = 'tar -czf %s -h --wildcards-match-slash --exclude=".git" --exclude="*.svn*" --exclude "*.pyc" --exclude="*.tmp" --exclude="*~" --exclude="dist/*" --exclude="build/*" --exclude="pyxpcom/*" exe' % tarballName

try:
    # Make the tarball
    ret = subprocess.call(tarballCommand, shell = True)
    
    # If there was an error
    if ret < 0:
        # Write it to "stderr" and exit
        print("Unable to make tarball signal ", -ret, file=sys.stderr)
        sys.exit(ret)
except OSError as e:
    print("Execution of tar failed: ", e, file=sys.stderr)

try:
    # Make the RPM
    ret = subprocess.call('rpmbuild -tb --define="clversion %s" --define="clrelease %s" %s' % (version.release, clrelease, tarballName), shell = True)
    
    # If there was an error
    if ret < 0:
        # Write it to "stderr" and exit
        print("Unable to run rpmbuild, signal ", -ret, file=sys.stderr)
        sys.exit(ret)
except OSError as e:
    print("Execution of rpmbuild failed: ", e, file=sys.stderr)
    
# Move the created RPM to this folder
subprocess.check_call('mv %s $HOME/rpmbuild/RPMS/i686/intef-exe-%s-%s.*.rpm exe/installs/rpm' % (tarballName, version.release, clrelease), shell = True)