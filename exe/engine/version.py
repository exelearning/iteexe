#!/usr/bin/env python
# ===========================================================================
# eXe
# Copyright 2004-2006 University of Auckland
# Copyright 2004-2008 eXe Project, http://eXeLearning.org/
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
# ===========================================================================

"""
Version Information
"""

import os
from .path import Path

# Result initialization
project = "eXeLearning"
pkg_version = None

# Try to read the version from the version file
try:
    pkg_version = open('version').readline()
    release = pkg_version[0:].strip()
except:
    # If it doesn't exist, we try to get it from debian/changelog
    try:
        line = open('debian/changelog').readline()
        release = line.split(':')[1].split(')')[0]
    except:
        # If the changelog doesn't exist either, we try to use pkg_resources to get the version
        try:
            import pkg_resources
            pkg_version = pkg_resources.require(project)[0].version
            release = pkg_version[0:].strip()
        except:
            # If everything else fails, it may be Windows fault
            import sys
            if sys.platform[:3] == "win":
                pkg_version = open(sys.prefix + '/version').readline()
                release = pkg_version[0:].strip()
            else:
                # Or we try to get it from Resources
                try:
                    pkg_version = open('../Resources/exe/version').readline()
                    release = pkg_version[0:].strip()
                except:
                    release = "unknown"

# We try to get the revision from the version file (if it exists)
revision = pkg_version[-40:] if pkg_version else ''

# Compose version string
version = release + "-r" + revision if revision else release

# SNAP version and release
snap_environ = os.environ.get('SNAP')
if snap_environ:
    try:
        snap_base_path = Path(snap_environ)
        changelog_path = snap_base_path / 'lib'/ 'python2.7' / 'site-packages' / 'usr' / 'share' / 'exe' / 'ChangeLog'
        line = open(changelog_path).readline()
        release = line.split(':')[1].split(')')[0]
        version = release
        revision = release
    except:
        pass

# If this file is executed directly, we print the project and version info
if __name__ == '__main__':
    print((project, version))