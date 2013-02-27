# -- coding: utf-8 --
# ===========================================================================
# eXe
# Copyright 2013, Pedro Peña Pérez, Open Phoenix IT
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
import os
from exe.engine.path import Path


def MapDir(code):
    if sys.platform[:3] == "win":
        try:
            from ctypes import WinDLL, create_unicode_buffer
            dll = WinDLL('shell32')
            result = create_unicode_buffer(260)
            resource = dll.SHGetFolderPathW(None, code, None, 0, result)
            if resource != 0:
                raise Exception
            else:
                path = result.value
        except:
            if code == 0:
                path = os.environ['HOMEPATH']
            else:
                raise
    elif sys.platform[:6] == "darwin":
        try:
            from Carbon import Folder, Folders
            folderref = Folder.FSFindFolder(Folders.kUserDomain,
                getattr(Folders, code), False)
            path = folderref.as_pathname()
        except:
            if code == 'kCurrentUserFolderType':
                path = os.environ['HOME']
            else:
                raise
    else:
        try:
            XDG_USER_DIR_CMD = 'xdg-user-dir'
            import subprocess
            p = subprocess.Popen([XDG_USER_DIR_CMD, code],
                                 stdout=subprocess.PIPE)
            path, _ = p.communicate()
            path = path.rstrip('\n')
        except:
            if code == 'HOME':
                path = os.environ['HOME']
            else:
                raise
    return Path(path).abspath()


def LocationButtons(names_map):
    buttons = []
    for key, value in names_map.items():
        try:
            button = {'xtype': 'button', 'text': value,
                      'location': MapDir(key)}
            buttons.append(button)
        except:
            pass
    return buttons

if sys.platform[:3] == "win":
    names_map = {0: _('Desktop'),
                 5: _('My Documents'),
                 40: _('Home Folder')}
elif sys.platform[:6] == "darwin":
    names_map = {'kDesktopFolderType': _('Desktop'),
                 'kDocumentsFolderType': _('Documents'),
                 'kCurrentUserFolderType': _('Home Folder')}
else:
    names_map = {'DESKTOP': _('Desktop'),
                 'DOCUMENTS': _('Documents'),
                 'HOME': _('Home Folder')}

LOCATION_BUTTONS = LocationButtons(names_map)
