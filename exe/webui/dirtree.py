# -- coding: utf-8 --
# ===========================================================================
# eXe
# Copyright 2012, Pedro Peña Pérez, Open Phoenix IT
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

import sys
import logging
from exe.webui.renderable import RenderableResource
from twisted.web.resource import Resource
from exe.engine.path import Path
import os.path
from urllib import unquote
import json
import mimetypes
import time

DIR_TPL = '{"text": "%(text)s", "id": "%(id)s"},'
FILE_TPL = '{"name": "%(name)s"},'
SEP = '_RRR_'
log = logging.getLogger(__name__)

def get_drives():
    import string
    from ctypes import windll

    drives = []
    bitmask = windll.kernel32.GetLogicalDrives()
    for letter in string.uppercase:
        if bitmask & 1:
            drives.append(letter + ":")
        bitmask >>= 1

    return drives

class DirTreePage(RenderableResource):
    name = "dirtree"
    
    def getChild(self, path, request):
        if path == "":
            return self
        return Resource.getChild(self, path, request)
    
    def render(self, request):
        if "sendWhat" in request.args:
            if request.args['sendWhat'][0] == 'dirs':
                if request.args['node'][0] == "root":
                    dir = Path('/')
                else:
                    dir = Path(request.args['node'][0].replace(SEP, os.path.sep))
                l = []
                try:
                    if sys.platform[:3] == "win":
                        if dir == '/':
                            for d in get_drives():
                                l.append({ "text": d, "id": d + SEP})
                        else:
                            for d in dir.dirs():
                                l.append({ "text": d.name, "id": d.abspath().replace(os.path.sep, SEP ) })
                    else:
                        for d in dir.dirs():
                            if not d.name.startswith('.'):
                                l.append({ "text": d.name, "id": d.abspath().replace(os.path.sep, SEP ) })
                except:
                    pass
            elif request.args['sendWhat'][0] == 'both':
                dir = Path(unquote(request.args['dir'][0]))
                items = []
                if sys.platform[:3] == "win":
                    if dir == '/':
                        for d in get_drives():
                            items.append({ "name": d, "size": 0, "type": 'directory', "modified": 0})
                    else:
                        try:
                            for d in dir.listdir():
                                if d.isdir():
                                    type = "directory"
                                elif d.isfile():
                                    type = repr(mimetypes.guess_type(d.name, False)[0])
                                elif d.islink():
                                    type = "link"
                                else:
                                    type = "None"
                                if not d.name.startswith('.'):
                                    items.append({ "name": d.name, "size": d.size, "type": type, "modified": int(d.mtime), "perms": d.lstat().st_mode })
                        except:
                            pass
                else:
                    try:
                        for d in dir.listdir():
                            if d.isdir():
                                type = "directory"
                            elif d.isfile():
                                type = repr(mimetypes.guess_type(d.name, False)[0])
                            elif d.islink():
                                type = "link"
                            else:
                                type = "None"
                            if not d.name.startswith('.'):
                                items.append({ "name": d.name, "size": d.size, "type": type, "modified": int(d.mtime), "perms": d.lstat().st_mode })
                    except:
                        pass
                l = {"totalCount": len(items), 'results': len(items), 'items': items}
            return json.dumps(l).encode('utf-8')
        return ""