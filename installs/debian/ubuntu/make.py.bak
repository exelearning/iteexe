#!/usr/bin/env python

import os
import subprocess

# Save the current dir
CURRENT_DIR = os.path.abspath('.')
# Get eXe main source dir
SRC_DIR = os.path.abspath('../../..')
# Navigate to that dir
os.chdir(SRC_DIR)

# Build the package
subprocess.check_call('fakeroot debian/rules binary', shell=True)
# Clean the source
subprocess.check_call('fakeroot debian/rules clean', shell=True)

# Move the .deb file to the current dir
subprocess.check_call('mv ../*.deb ' + CURRENT_DIR, shell=True)
