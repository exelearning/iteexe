# ===========================================================================
# eXe
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

import logging
import os
import os.path
import sys

log = logging.getLogger(__name__)

# ===========================================================================
"""Useful Python functions"""

#----------------------------------------------------------------------------
# if I had Python 2.3 with os.walk I wouldn't need this
# dare you to run deltree("/") !!! :-P
def deltree(path):
    if os.path.isdir(path):
        children = os.listdir(path)
        for child in children:
            deltree(os.path.join(path, child))
        os.rmdir(path)

    elif os.path.isfile(path):
        os.remove(path)
    # if it's not a directory or a file, we just leave it alone

#----------------------------------------------------------------------------
# http://www.nedbatchelder.com/blog/200410.html
def functionId(nFramesUp=1):
    """ Create a string naming the function n frames up on the stack.
    """
    co = sys._getframe(nFramesUp+1).f_code
    return "%s (%s @ %d)" % (co.co_name, co.co_filename, co.co_firstlineno)


#----------------------------------------------------------------------------
def get_all_files(path):
    if path[-1] == ':':
        path = path + '\\'
    #if true:
    try:
        for i in os.listdir(path):
            j = os.path.join(path, i)
            if os.path.isdir(j):
                for ii in get_all_files(j):
                    yield ii
            else:
                yield j
    except:
        pass
      
# ===========================================================================
