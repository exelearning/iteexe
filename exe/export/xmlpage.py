# ===========================================================================
# eXe 
# Copyright 2004-2005, University of Auckland
# Copyright 2004-2007 eXe Project, New Zealand Tertiary Education Commission
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
This class transforms an eXe node into an XML page
"""

import logging
import re
from cgi                      import escape
from urllib                   import quote
from exe.webui.blockfactory   import g_blockFactory
from exe.engine.error         import Error
from exe.engine.path          import Path
from exe.export.pages         import Page, uniquifyNames
from exe.webui                import common 
log = logging.getLogger(__name__)


# ===========================================================================
class XMLPage(Page):
    
    #tracking the ideviceids as they dont remain constant - make sure links work
    lastIdeviceID = ""
    
    currentOutputDir = ""
    
    def __init__(self, name, depth, node):
        
        Page.__init__(self, name, depth, node)
        
        #array of generated idevice ids for this page
        self.ideviceIds = []
        
        #list of titles that go with those ids
        self.ideviceTitles = {}
        
    
    """
    This class transforms an eXe node into a page on a self-contained website
    
    Return the number of functioning idevices written.
    
    This will allow the export feature to skip out those that
    dont have working idevices
    
    nonDevices - list object of those that dont really have an export
    function
    
    """

    def save(self, outputDir, prevPage, nextPage, pages, nonDevices):
        
        XMLPage.currentOutputDir = outputDir
        
        xml = u'<?xml version="1.0" encoding="UTF-8"?>\n'
        xml += u"<exepage title='%s' " % escape(self.node.titleLong)
        
        numRealDevices = 0
        
        """
        Remove all this stuff so that we don't show blank pages
        This is calculated by reading exetoc.xml
        
        if nextPage is not None:
            xml += u"nextpage='%s' " % nextPage.name
        if prevPage is not None:
            xml += u"prevpage='%s' " % prevPage.name
        """
        xml += u">"
        
        style = self.node.package.style
        
        for idevice in self.node.idevices:
            block = g_blockFactory.createBlock(None, idevice)
            
            if not block:
                log.critical("Unable to render iDevice.")
                raise Error("Unable to render iDevice.")
                
            if hasattr(block, "renderXML"):
                deviceId = ""
                if hasattr(block.renderXML, "__call__"):
                    #This block has support for renderXML
                    xml += block.renderXML(style)
                    numRealDevices = numRealDevices + 1
                else:
                    thisIdevice = block.idevice
                    ideviceClassName = thisIdevice.__class__.__name__
                    deviceId = thisIdevice.id
                    nonDevices.append(thisIdevice.__class__.__name__)
                    xml += "<idevice type='html' id='%s'>\n" % thisIdevice.id
                    xml += '<![CDATA[<div class="block" style="display:block">' \
                        + "<p>Idevice %s renderXML unsupported</p></div>]]>" % ideviceClassName
                    xml += "</idevice>"
                    
                
        xml += u"</exepage>"
            
        outfile = open(outputDir / self.name+".xml", "w")
        outfile.write(xml.encode("UTF-8"))
        outfile.close()
        
        return numRealDevices
