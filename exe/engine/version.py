#!/usr/bin/python
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

project = "exe"
pkg_version = None
try:
    line = open('debian/changelog').readline()
    release = line.split(':')[1].split(')')[0]
except:
    try:
        import pkg_resources
        pkg_version = pkg_resources.require(project)[0].version
        release = pkg_version[0:-42]
    except:
        import sys
        if sys.platform[:3] == "win":
            pkg_version = open(sys.prefix + '/version').readline()
            release = pkg_version[0:-42]
        else:
            pkg_version = open('../Resources/exe/version').readline()
            release = pkg_version[0:-42]

revision = pkg_version[-40:] if pkg_version else ''
version = release + "-r" + revision if revision else release

if __name__ == '__main__':
    print project, version
