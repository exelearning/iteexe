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
from urllib.parse import unquote
import json
import mimetypes
import os

log = logging.getLogger(__name__)

if sys.platform[:3] == "win":
    FILE_ATTRIBUTE_DIRECTORY = 16
    FILE_ATTRIBUTE_REPARSE_POINT = 1024
    REPARSE_FOLDER = (FILE_ATTRIBUTE_DIRECTORY | FILE_ATTRIBUTE_REPARSE_POINT)
    import string
    from win32api import SetErrorMode
    SetErrorMode(1)
    from win32file import GetFileAttributes, GetLogicalDrives, GetDriveType


def iswinlink(fpath):
    if sys.platform[:3] == "win":
        if GetFileAttributes(fpath) & REPARSE_FOLDER == REPARSE_FOLDER:
            return True

    return False


def get_drives():
    drives = []
    bitmask = GetLogicalDrives()
    for letter in string.uppercase:
        if bitmask & 1:
            drives.append(letter + ":")
        bitmask >>= 1

    return drives


def getname(d):
    if sys.platform[:3] == "win" and d.isdir():
        from win32com.shell.shell import SHGetFileInfo

        return Path(SHGetFileInfo(d.abspath(), 0, 0x200)[1][3])
    return d.name


def is_readable(d):
    if sys.platform[:3] == "win" and d.isdir():
        try:
            d.listdir()
        except:
            return False
        return True
    return d.access(os.R_OK)


def is_writable(d):
    if sys.platform[:3] == "win" and d.isdir():
        import tempfile
        try:
            tempfile.TemporaryFile(dir=d.abspath())
        except:
            return False
        return True
    return d.access(os.W_OK)


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
                pathdir = Path(unquote(request.args['node'][0].decode('utf-8')))
                l = []
                if pathdir == '/' and sys.platform[:3] == "win":
                    for d in get_drives():
                        try:
                            if is_readable(Path(d)):
                                icon = None
                            else:
                                icon = '../jsui/extjs/resources/themes/images/gray/grid/hmenu-lock.gif'
                            l.append({"realtext": d, "text": d, "id": d + '\\', "icon": icon})
                        except:
                            pass
                else:
                    for d in pathdir.dirs():
                        try:
                            if not d.name.startswith('.') or sys.platform[:3] == "win":
                                if not iswinlink(d.abspath()):
                                    if is_readable(d):
                                        icon = None
                                    else:
                                        icon = '../jsui/extjs/resources/themes/images/gray/grid/hmenu-lock.gif'
                                    l.append({"realtext": d.name, "text": getname(d), "id": d.abspath(), "icon": icon})
                        except:
                            pass
            elif request.args['sendWhat'][0] == 'both':
                pathdir = Path(unquote(request.args['dir'][0].decode('utf-8')))
                items = []
                if pathdir == '/' and sys.platform[:3] == "win":
                    for drive in get_drives():
                        d = Path(drive + '\\')
                        items.append({"name": drive, "realname": drive + '\\', "size": 0, "type": 'directory', "modified": 0,
                                      "is_readable": is_readable(d),
                                      "is_writable": is_writable(d)})
                else:
                    parent = pathdir.parent
                    if (parent == pathdir):
                        realname = '/'
                    else:
                        realname = parent.abspath()
                    items.append({"name": '.', "realname": pathdir.abspath(), "size": pathdir.size, "type": "directory", "modified": int(pathdir.mtime),
                                  "is_readable": is_readable(pathdir),
                                  "is_writable": is_writable(pathdir)})
                    items.append({"name": '..', "realname": realname, "size": parent.size, "type": "directory", "modified": int(parent.mtime),
                                  "is_readable": is_readable(parent),
                                  "is_writable": is_writable(parent)})
                    try:
                        for d in pathdir.listdir():
                            try:
                                if not d.name.startswith('.') or sys.platform[:3] == "win":
                                    if not iswinlink(d.abspath()):
                                        if d.isdir():
                                            pathtype = "directory"
                                        elif d.isfile():
                                            if is_readable(d):
                                                pathtype = repr(mimetypes.guess_type(d.name, False)[0])
                                            else:
                                                pathtype = "file"
                                        elif d.islink():
                                            pathtype = "link"
                                        else:
                                            pathtype = "None"
                                        items.append({"name": getname(d), "realname": d.abspath(), "size": d.size, "type": pathtype, "modified": int(d.mtime),
                                          "is_readable": is_readable(d),
                                          "is_writable": is_writable(d)})
                            except:
                                pass
                        G.application.config.lastDir = pathdir
                    except:
                        pass
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
                            if is_readable(d):
                                pathtype = repr(mimetypes.guess_type(d.name, False)[0])
                            else:
                                pathtype = "file"
                        elif d.islink():
                            pathtype = "link"
                        else:
                            pathtype = "None"
                        if d.name.startswith(query):
                            items.append({"name": getname(d), "realname": d.abspath(), "size": d.size, "type": pathtype, "modified": int(d.mtime),
                                          "is_readable": is_readable(d),
                                          "is_writable": is_writable(d)})
                    except:
                        pass

            l = {"totalCount": len(items), 'results': len(items), 'items': items}
            return json.dumps(l).encode('utf-8')
        return ""
