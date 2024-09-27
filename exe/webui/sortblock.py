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
from exe.export.exportmediaconverter import ExportMediaConverter
"""
ExampleBlock can render and process ExampleIdevices as XHTML
"""

import logging
from exe.webui.block            import Block
from exe.webui.element          import TextAreaElement
from exe.engine.extendedfieldengine import *
from exe.webui import common
log = logging.getLogger(__name__)


# ===========================================================================
class SortBlockInc(Block):
    """
    ExampleBlock can render and process ExampleIdevices as XHTML
    GenericBlock will replace it..... one day
    """
    def __init__(self, parent, idevice):
        Block.__init__(self, parent, idevice)
        self.mainElements = idevice.mainFieldSet.makeElementDict()
                    
        self.sortableItemElements = []
        for sortableField in idevice.itemsToSort:
            newSortableElement = TextAreaElement(sortableField)
            self.sortableItemElements.append(newSortableElement)

    def process(self, request):
        """
        Process the request arguments from the web server to see if any
        apply to this block
        """
        self.idevice.message = ""
        Block.process(self, request)
        for sortableElement in self.sortableItemElements:
            sortableElement.process(request)
            #check and see about deleting from the list
            field_engine_check_delete(sortableElement, request, self.idevice.itemsToSort)
                
        self.idevice.uploadNeededScripts()
        
        errorMsg = ""
        
        if "addSortableItem" + str(self.id) in request.args: 
            self.idevice.addItemToSort()
            self.idevice.edit = True
            self.idevice.undo = False
        
            
        
        field_engine_process_all_elements(self.mainElements, request)
        
        self.idevice.title = self.mainElements['title'].renderView()
        
        field_engine_check_fields_are_ints(self.mainElements, ['itemwidth', 'itemheight'], thisIdevice = self.idevice)
        



    def renderEdit(self, style):
        """
        Returns an XHTML string with the form element for editing this block
        """
        html  = "<div>\n"
        html += common.ideviceShowEditMessage(self)
        
        html += self.idevice.mainFieldSet.renderEditInOrder(self.mainElements)
        for sortableElement in self.sortableItemElements:
            html += sortableElement.renderEdit()
            html += field_engine_make_delete_button(sortableElement)
            html += "<br/>"
            
        html += common.submitButton("addSortableItem"+str(self.id), _("Add Another Item to be Sorted"))
        html += "<br/>"
        html += self.renderEditButtons()
        html += "</div>\n"
        return html


    def renderPreview(self, style):
        """
        Returns an XHTML string for previewing this block
        """
        #html  = u"<div class=\"iDevice "
        #html += u"emphasis"+unicode(self.idevice.emphasis)+"\" "
        #html += u"ondblclick=\"submitLink('edit',"+self.id+", 0);\">\n"
        html = common.ideviceHeader(self, style, "preview")
        html += self._renderGame(True)
        #html += self.renderViewButtons()
        #html += "</div>\n"
        html += common.ideviceFooter(self, style, "preview")
        return html

    def renderXML(self, style, previewMode = False):
        xml = ""
        mainDict = self.idevice.mainFieldSet.getRenderDictionary(self.mainElements, "", previewMode)
        
        #trim the feedback items from html space junk
        
        mainDict['correctoverlay'] = ExportMediaConverter.trimHTMLWhiteSpace(mainDict['correctoverlay'])
        mainDict['wrongoverlay'] = ExportMediaConverter.trimHTMLWhiteSpace(mainDict['wrongoverlay'])
        
        headFragment = self.idevice.mainFieldSet.applyFileTemplateToDict(mainDict, "sort_head_template.xml", previewMode)
        xml += headFragment

        for sortableElement in self.sortableItemElements:
            sortableItemId = "sortmeitem" + sortableElement.id
        
            xml += "<item id='" + sortableItemId + "'>\n<![CDATA["
            xml += sortableElement.renderPreview()
            xml += "]]></item>"
            
        footerFragment = self.idevice.mainFieldSet.applyFileTemplateToDict(mainDict, "sort_foot_template.xml", previewMode)
        xml += footerFragment
        return xml 
        
        
    def _renderGame(self, previewMode):
        html = ""
        mainDict = self.idevice.mainFieldSet.getRenderDictionary(self.mainElements, "", previewMode)
        
        #check the directions - if the direction is right to left or left to right - 
        #then add a float to the css if it's not already there
        if mainDict['sortorder'] == 'ltr':
            import re
            if re.match("float(\s*):(\s*)left", mainDict['sortableitemstyle'], flags=re.IGNORECASE) is None:
                mainDict['sortableitemstyle'] = "float: left; " + mainDict['sortableitemstyle']
        elif mainDict['sortorder'] == 'rtl':
            import re
            if re.match("float(\s*):(\s*)right", mainDict['sortableitemstyle'], flags=re.IGNORECASE) is None:
                mainDict['sortableitemstyle'] = "float: right; " + mainDict['sortableitemstyle']
              
            
        
        headFragment = self.idevice.mainFieldSet.applyFileTemplateToDict(mainDict, "sort_head_template.html", previewMode)
        html += headFragment
        perItemScript = ""
        perItemFragment = ""
        sortArrayVarName = "sortmeItemIds" + self.idevice.id

        for sortableElement in self.sortableItemElements:
            sortableItemId = "sortmeitem" + sortableElement.id
        
            perItemScript += "%(sortvarname)s[%(sortvarname)s.length] = \"%(sortitemid)s\";\n" \
                                        % {"sortvarname" : sortArrayVarName, "sortitemid" : sortableItemId}
            perItemFragment += "<div id='" + sortableItemId + "'>"
            if previewMode == True:
                perItemFragment += sortableElement.renderPreview()
            else:
                perItemFragment += sortableElement.renderView()
            
            perItemFragment += "</div>"

        html += perItemFragment
        html += "</div>\n"

        #script fragments
        html += "<script type='text/javascript'>" + perItemScript + "</script>"
        footerFragment = self.idevice.mainFieldSet.applyFileTemplateToDict(mainDict, "sort_foot_template.html", previewMode)
        html += footerFragment
        return html

    def renderView(self, style):
        """
        Returns an XHTML string for viewing this block
        """
        #html  = u"<div class=\"iDevice "
        #html += u"emphasis"+unicode(self.idevice.emphasis)+"\">\n"
        html = common.ideviceHeader(self, style, "view")
        html += self._renderGame(False)
        html += common.ideviceFooter(self, style, "view")
        return html
    

# ===========================================================================
"""Register this block with the BlockFactory"""
from exe.engine.sortidevice import SortIdeviceInc
from exe.webui.blockfactory     import g_blockFactory
g_blockFactory.registerBlockType(SortBlockInc, SortIdeviceInc)    

# ===========================================================================
