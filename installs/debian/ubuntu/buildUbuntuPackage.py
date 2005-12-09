#!/usr/bin/python
from exe.engine.path import Path
import os

exeDir = Path('../../..').abspath()
newDir = exeDir/'debian'
if newDir.islink():
    print 'Removing old link'
    newDir.remove()
elif newDir.exists():
    raise Exception('exe/debian directory/file already exists, aborting....')
Path('debian').abspath().symlink(newDir)
exeDir.chdir()
os.system('fakeroot debian/rules binary')
