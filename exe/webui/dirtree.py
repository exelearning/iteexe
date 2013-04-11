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
from exe import globals as G
from urllib import unquote
import json
import mimetypes
import os

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

    def __init__(self, parent, package=None, config=None):
        RenderableResource.__init__(self, parent, package, config)

    def getChild(self, path, request):
        if path == "":
            return self
        return Resource.getChild(self, path, request)

    def render(self, request):
        if "sendWhat" in request.args:
            if request.args['sendWhat'][0] == 'dirs':
                pathdir = Path(request.args['node'][0])
                l = []
                if pathdir == '/' and sys.platform[:3] == "win":
                    for d in get_drives():
                        try:
                            if d.access(os.R_OK):
                                icon = None
                            else:
                                icon = '../jsui/extjs/resources/themes/images/gray/grid/hmenu-lock.gif'
                            l.append({"text": d, "id": d + '\\', "icon": icon})
                        except:
                            pass
                else:
                    for d in pathdir.dirs():
                        try:
                            if not d.name.startswith('.') or sys.platform[:3] == "win":
                                if d.access(os.R_OK):
                                    icon = None
                                else:
                                    icon = '../jsui/extjs/resources/themes/images/gray/grid/hmenu-lock.gif'
                                l.append({"text": d.name, "id": d.abspath(), "icon": icon})
                        except:
                            pass
            elif request.args['sendWhat'][0] == 'both':
                pathdir = Path(unquote(request.args['dir'][0].decode('utf-8')))
                items = []
                if pathdir == '/' and sys.platform[:3] == "win":
                    for d in get_drives():
                        items.append({"name": d, "realname": d + '\\', "size": 0, "type": 'directory', "modified": 0})
                else:
                    parent = pathdir.parent
                    if (parent == pathdir):
                        realname = '/'
                    else:
                        realname = parent.abspath()
                    items.append({"name": '.', "realname": pathdir.abspath(), "size": pathdir.size, "type": "directory", "modified": int(pathdir.mtime),
                                  "is_readable": pathdir.access(os.R_OK),
                                  "is_writable": pathdir.access(os.W_OK)})
                    items.append({"name": '..', "realname": realname, "size": parent.size, "type": "directory", "modified": int(parent.mtime),
                                  "is_readable": parent.access(os.R_OK),
                                  "is_writable": parent.access(os.W_OK)})
                    for d in pathdir.listdir():
                        try:
                            if not d.name.startswith('.') or sys.platform[:3] == "win":
                                if d.isdir():
                                    pathtype = "directory"
                                elif d.isfile():
                                    if d.access(os.R_OK):
                                        pathtype = repr(mimetypes.guess_type(d.name, False)[0])
                                    else:
                                        pathtype = "file"
                                elif d.islink():
                                    pathtype = "link"
                                else:
                                    pathtype = "None"
                                items.append({"name": d.name, "realname": d.abspath(), "size": d.size, "type": pathtype, "modified": int(d.mtime),
                                  "is_readable": d.access(os.R_OK),
                                  "is_writable": d.access(os.W_OK)})
                        except:
                            pass
                    G.application.config.lastDir = pathdir
                l = {"totalCount": len(items), 'results': len(items), 'items': items}
            return json.dumps(l).encode('utf-8')
        elif "query" in request.args:
            query = request.args['query'][0]
            pathdir = Path(unquote(request.args['dir'][0].decode('utf-8')))
            items = []
            if pathdir == '/' and sys.platform[:3] == "win":
                for d in get_drives():
                    items.append({"name": d, "realname": d + '\\', "size": 0, "type": 'directory', "modified": 0})
            else:
                parent = pathdir.parent
                if (parent == pathdir):
                    realname = '/'
                else:
                    realname = parent.abspath()
                for d in pathdir.listdir():
                    try:
                        if d.isdir():
                            pathtype = "directory"
                        elif d.isfile():
                            if d.access(os.R_OK):
                                pathtype = repr(mimetypes.guess_type(d.name, False)[0])
                            else:
                                pathtype = "file"
                        elif d.islink():
                            pathtype = "link"
                        else:
                            pathtype = "None"
                        if d.name.startswith(query):
                            items.append({"name": d.name, "realname": d.abspath(), "size": d.size, "type": pathtype, "modified": int(d.mtime),
                                          "is_readable": d.access(os.R_OK),
                                          "is_writable": d.access(os.W_OK)})
                    except:
                        pass

            l = {"totalCount": len(items), 'results': len(items), 'items': items}
            return json.dumps(l).encode('utf-8')
        return ""
