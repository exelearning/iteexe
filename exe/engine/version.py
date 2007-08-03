#!/usr/bin/python
# ===========================================================================
# eXe
# Copyright 2004-2006 University of Auckland
# Copyright 2006-2007 eXe Project, New Zealand Tertiary Education Commission
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
import re

project        = "exe"
release        = "0.98.0"
revision       = "$Revision$"[11:-2]
# if it is available, get the SVN revision
try:
    from version_svn import revision
except ImportError:
    pass

# avoid using ':' in pathnames built from revision
revision = revision.replace(':', '-')

version        = release + "." + revision

# use the first numeric part of revision to make the build number
# major.minor.local.revison
mo = re.match('(\d+)\D+', revision)
if mo:
    build = release + '.' + mo.group(1)
else:
    build = version

if __name__ == '__main__':
    print project, version, build
