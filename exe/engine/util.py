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

import os
import os.path
import time

# ===========================================================================
"""Useful Python functions from LinuxSoftware.co.nz"""

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
# Stevens, pg 202
def detach(prog, *args):
    pid = os.fork()
    if pid < 0:
        return pid

    elif pid == 0:
        pid = os.fork()
        if pid < 0:
            os._exit(pid)
        elif pid > 0:
            # child exits
            os._exit(0)

        # grandchild (adopted by init) runs program
        time.sleep(1)
        os.execl(prog, *args)

    else:
        # no zombies!
        pid, status = os.waitpid(pid, 0)
        return status

    # should never get here
    return -1

#----------------------------------------------------------------------------
# http://www.nedbatchelder.com/blog/200410.html
def functionId(nFramesUp=1):
    """ Create a string naming the function n frames up on the stack.
    """
    co = sys._getframe(nFramesUp+1).f_code
    return "%s (%s @ %d)" % (co.co_name, co.co_filename, co.co_firstlineno)


# ===========================================================================
