# ===========================================================================
# eXe
# Copyright 2004-2005, University of Auckland
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
The LoadPage is responsible for loading an existing package
"""

import logging
import gettext
import os
from exe.webui import common
from nevow import loaders, inevow
from nevow.livepage import handler, LivePage, js
from exe.engine.packagestore import g_packageStore
from exe.webui.webinterface import g_webInterface
from exe.webui.menupane import MenuPane


log = logging.getLogger(__name__)
_   = gettext.gettext


class LoadPage(LivePage):
    """
    The LoadPage is responsible for loading an existing package
    """

    def __init__(self, parent):
        """
        Initialize
        'parent' is a MainPage instance
        """
        self.docFactory = loaders.xmlfile(os.path.join(g_webInterface.config.exeDir, 'loadpage.xul'))
        LivePage.__init__(self)
        self.parent   = parent
        self.package  = parent.package
        self.error    = False
        self.message  = ""
        
    def goingLive(self, ctx, client):
        inevow.IRequest(ctx).setHeader('content-type',
                                       'application/vnd.mozilla.xul+xml')

    def render_submitButton(self, ctx, data):
        """Hooks up the submit button to the server"""
        tmp = 'document.getElementById("%s").getAttribute("%s")'
        return ctx.tag(oncommand=handler(self.handleSubmit,
                       js(tmp % ('save', 'checked')),
                       js(tmp % ('file', 'value'))))
        
    def handleSubmit(self, client, save, filename):
        """Handles the submit button click event"""
        if save: self.package.save()
        try:  
            log.debug("filename and path" + filename)
            package = g_packageStore.loadPackage(filename)
            from exe.webui.mainpage import MainPage
            mainPage = MainPage(package)
            g_webInterface.rootPage.putChild(package.name, mainPage)
            client.sendScript('top.location = "/%s"' % package.name)
        except:
            client.sendScript('alert("Sorry, wrong file format")')
            self.error = True
            return
