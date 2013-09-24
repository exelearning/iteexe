#!/usr/bin/env python

import os
import subprocess

SRCDIR = os.path.abspath('../../..')
os.chdir(SRCDIR)
subprocess.check_call('fakeroot debian/rules binary', shell=True)
subprocess.check_call('fakeroot debian/rules clean', shell=True)
