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
"""
IdevicePane is responsible for creating the XHTML for iDevice links
"""

import logging
from exe.webui.renderable import Renderable
from twisted.web.resource import Resource
from exe.webui.livepage import allSessionClients
import locale
import json

log = logging.getLogger(__name__)

# ===========================================================================
class IdevicePane(Renderable, Resource):
    """
    IdevicePane is responsible for creating the XHTML for iDevice links
    """
    name = 'idevicePane'

    def __init__(self, parent):
        """ 
        Initialize
        """ 
        Renderable.__init__(self, parent)
        if parent:
            self.parent.putChild(self.name, self)
        Resource.__init__(self)
        self.client = None
        log.debug("Load appropriate iDevices")
        self.prototypes = {}
        self.translateOldHidingIdevicesMechanism()
        self.ideviceStore.register(self)
        for prototype in self.ideviceStore.getIdevices():
            log.debug("add " + prototype.title)
            if prototype.id in self.prototypes:
                raise Exception("duplicated device id %s" % prototype.id)
            self.prototypes[prototype.id] = prototype

    def translateOldHidingIdevicesMechanism(self):
        idevices = self.ideviceStore.getIdevices()
        factoryIdevices = self.ideviceStore.getFactoryIdevices()
        modified = False
        for idevice in factoryIdevices:
            if idevice not in idevices:
                modified = True
                lower_title = idevice._title.lower()
                self.config.hiddeniDevices.append(lower_title)
                self.config.configParser.set('idevices', lower_title, '0')
                self.ideviceStore.addIdevice(idevice)
        if modified:
            self.ideviceStore.save()

    def process(self, request):
        """ 
        Process the request arguments to see if we're supposed to 
        add an iDevice
        """
        log.debug("Process" + repr(request.args))
        if ("action" in request.args and 
            request.args["action"][0] == "AddIdevice"):

            self.package.isChanged = True
            prototype = self.prototypes.get(request.args["object"][0])
            if prototype:
                node = self.package.findNode(request.args["currentNode"][0])
                node.addIdevice(prototype.clone())

            
    def addIdevice(self, idevice):
        """
        Adds an iDevice to the pane
        """
        log.debug("addIdevice id="+idevice.id+", title="+idevice.title)
        if idevice.id in self.prototypes:
                raise Exception("duplicated device id %s" % idevice.id)
        self.prototypes[idevice.id] = idevice
        self.client.sendScript('eXe.app.getController("Idevice").reload()', filter_func=allSessionClients)

        
    def delIdevice(self, idevice):
        """
        Delete an iDevice from the pane
        """
        log.debug("delIdevice id="+idevice.id+", title="+idevice.title)
        self.prototypes.pop(idevice.id)
        self.client.sendScript('eXe.app.getController("Idevice").reload()', filter_func=allSessionClients)

    def render_GET(self, request=None):
        """
        Returns an xml string for load the client Idevices store
        """

        # Now do the rendering
        log.debug("Render")

        request.setHeader('content-type', 'application/xml')
        xml = u'<?xml version="1.0" encoding="UTF-8"?>'
        xml += u"<!-- IDevice Pane Start -->\n"
        xml += u"<idevices>\n"

        prototypes = self.prototypes.values()

        prototypesToRender = []
        for prototype in prototypes:
            lower_title = prototype._title.lower()
            visible = lower_title not in self.config.hiddeniDevices
            if lower_title not in self.config.deprecatediDevices:
                if lower_title in self.config.idevicesCategories:
                    for category in self.config.idevicesCategories[lower_title]:
                        prototypesToRender.append((prototype, category, visible))
                else:
                    prototypesToRender.append((prototype, _('My iDevices'), visible))

        def sortfunc(t1, t2):
            return locale.strcoll(t1[0].rawTitle, t2[0].rawTitle)

        def groupsortfunc(t1, t2):
            if t1[1] == t2[1]:
                return locale.strcoll(t1[0].rawTitle, t2[0].rawTitle)
            return locale.strcoll(t1[1], t2[1])

        locale.setlocale(locale.LC_ALL, "")
        if 'group' in request.args:
            prototypesToRender.sort(groupsortfunc)
            self.config.configParser.set('user', 'showIdevicesGrouped', '1')
        else:
            prototypesToRender.sort(sortfunc)
            self.config.configParser.set('user', 'showIdevicesGrouped', '0')
        for prototype, category, visible in prototypesToRender:
            xml += self.__renderPrototype(prototype, category, visible)
        xml += u"</idevices>\n"
        xml += u"<!-- IDevice Pane End -->\n"
        return xml.encode('utf8')

    def render_POST(self, request=None):
        idevices = json.loads(request.args['idevices'][0])
        if isinstance(idevices, dict):
            idevices = [idevices]
        for idevice in idevices:
            prototype = self.prototypes[idevice['id']]
            visible = idevice['visible']
            lower_title = prototype._title.lower()
            try:
                self.config.hiddeniDevices.remove(lower_title)
                self.config.configParser.delete('idevices', lower_title)
            except:
                pass
            if not visible:
                self.config.hiddeniDevices.append(lower_title)
                self.config.configParser.set('idevices', lower_title, '0')
        return json.dumps({'success': True})

    def __renderPrototype(self, prototype, category, visible):
        """
        Add the list item for an iDevice prototype in the iDevice pane
        """
        log.debug("Render "+prototype.title)
        log.debug("_title "+prototype._title)
        log.debug("of type "+repr(type(prototype.title)))
        log.debug(prototype._title.lower())
        xml  = u"  <idevice>\n"
        xml += u"   <label>" + prototype.rawTitle + "</label>\n"
        xml += u"   <id>" + prototype.id + "</id>\n"
        xml += u"   <category>" + _(category) + "</category>\n"
        xml += u"   <visible>" + str(visible).lower() + "</visible>\n"
        xml += u"  </idevice>\n"
        return xml
        
    
# ===========================================================================
