# ===========================================================================
# eXe 
# Copyright 2004-2005, University of Auckland
# $Id$
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
IdevicePane is responsible for creating the XHTML for iDevice links
"""

import logging
import gettext
from nevow.livepage import handler
from exe.webui import common
from exe.webui.renderable import Renderable
from nevow import stan

log = logging.getLogger(__name__)
_   = gettext.gettext

# ===========================================================================
class IdevicePane(Renderable):
    """
    IdevicePane is responsible for creating the XHTML for iDevice links
    """
    name = 'idevicePane'

    def __init__(self, parent):
        """ 
        Initialize
        """ 
        Renderable.__init__(self, parent)
        self.client = None
        log.debug("Load appropriate iDevices")
        self.prototypes = {}
        self.ideviceStore.register(self)
        for prototype in self.ideviceStore.getIdevices(self.package):
            log.debug("add "+prototype.title)
            self.prototypes[prototype.id] = prototype


    def process(self, request):
        """ 
        Process the request arguments to see if we're supposed to 
        add an iDevice
        """
        log.debug("Process" + repr(request.args))
        if ("action" in request.args and 
            request.args["action"][0] == "AddIdevice"):

            prototype = self.prototypes.get(request.args["object"][0])
            if prototype:
                self.package.currentNode.addIdevice(prototype.clone())

            
    def addIdevice(self, idevice):
        """
        Adds an iDevice to the pane
        """
        log.debug("addIdevice id="+idevice.id+", title="+idevice.title)
        self.prototypes[idevice.id] = idevice
        self.client.call('XHAddIdeviceListItem', idevice.id, idevice.title)

        
    def render(self, ctx, data):
        """
        Returns an XUL string for viewing this pane
        """
        # Create a scecial server side func that the 
        # Idevice editor js can call
        #addHandler = handler(self.handleAddIdevice,
        #                     identifier='outlinePane.handleAddIdevice')
        # The below call stores the handler so we can call it
        # as a server 
        #addHandler(ctx, data) 

        # Now do the rendering
        log.debug("Render")

        xul  = "<!-- IDevice Pane Start -->\n"
        xul += "<listbox id=\"ideviceList\" flex=\"1\" "
        xul += "style=\"background-color: #DFDFDF;\">\n"

        prototypes = self.prototypes.values()
        prototypes.sort(lambda x, y: cmp(x.title, y.title))
        for prototype in prototypes:
            xul += self.__renderPrototype(prototype)

        xul += "</listbox>\n"
        xul += "<!-- IDevice Pane End -->\n"
        return stan.xml(xul)


    def __renderPrototype(self, prototype):
        """
        Add the listitem for an iDevice prototype in the iDevice pane
        """
        log.debug("Render "+prototype.title)
        xul  = "  <listitem label=\"" + prototype.title + "\" "
        xul += "onclick=\"submitLink('AddIdevice', "
        xul += "'" + prototype.id + "', 1)\"/>"""
        return xul
        
    
# ===========================================================================
