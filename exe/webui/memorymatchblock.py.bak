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
from exe.export.xmlpage import XMLPage

"""
ExampleBlock can render and process ExampleIdevices as XHTML
"""

import logging
from exe.webui.block            import Block
from exe.webui.element          import TextAreaElement
from exe.webui.element          import Element
from exe.engine.extendedfieldengine        import *

log = logging.getLogger(__name__)


# ===========================================================================
class MemoryMatchBlockInc(Block):
    """
    ExampleBlock can render and process ExampleIdevices as XHTML
    GenericBlock will replace it..... one day
    """
    def __init__(self, parent, idevice):
        Block.__init__(self, parent, idevice)
        self.mainElements = idevice.mainFieldSet.makeElementDict()
        self.memoryMatchElements = []
        for memoryMatchField in idevice.matchPairFields:
            memoryMatchElement = MemoryMatchPairElement(memoryMatchField)
            self.memoryMatchElements.append(memoryMatchElement)

    def process(self, request):
        """
        Process the request arguments from the web server to see if any
        apply to this block
        """
        self.idevice.message = ""
        Block.process(self, request)
        
        self.idevice.uploadNeededScripts()
        
        if field_engine_is_delete_request(request):
            return
        
        field_engine_process_all_elements(self.mainElements, request)
        
        self.idevice.title = self.mainElements['title'].renderView()
        
        for memoryMatchElement in self.memoryMatchElements:
            memoryMatchElement.process(request)
        
        if "calcPairs" + unicode(self.id) in request.args:
            self.idevice.setNumMatchingPairs()
            self.idevice.edit = True
            self.idevice.undo = False
            
        field_engine_check_fields_are_ints(self.mainElements,\
                        ['cellwidth', 'cellheight', 'rows', 'cols'], None, thisIdevice=self.idevice)
        
        try: 
            numRows = int(self.idevice.mainFieldSet.fields['rows'].content)
            numCols = int(self.idevice.mainFieldSet.fields['cols'].content)
            numCells = numRows * numCols
            if numCells % 2 == 1:
                self.idevice.edit = True
                self.idevice.message += _("Number of rows x Number of cols must be an even number<br/>")
            
            numPairsExisting = len(self.idevice.matchPairFields)
            if numPairsExisting != (numCells / 2):
                self.idevice.edit = True
                self.idevice.message += _("After you set the number of rows/cols please click Create/Trim pairs button at the bottom and enter in the matching pairs for the game")
        except:
            #only here in case there is an invalid integer, in which case would be caught beforehand
            pass

    
    def renderXML(self, style):
        xml = ""
        previewMode = False
        mainDict = self.idevice.mainFieldSet.getRenderDictionary(self.mainElements, "", previewMode)
        xml += self.idevice.mainFieldSet.applyFileTemplateToDict(mainDict, \
            "memmatch_template_head.xml", previewMode)
        
        mediaConverter = ExportMediaConverter.getInstance()
        if mediaConverter is not None:
            mainDict['feedbackpositive'] = mediaConverter.reprocessHTML(mainDict['feedbackpositive'])
            mainDict['feedbackpositive'] = ExportMediaConverter.trimHTMLWhiteSpace(mainDict['feedbackpositive'])
            
            mainDict['feedbacknegative'] = mediaConverter.reprocessHTML(mainDict['feedbacknegative'])
            mainDict['feedbacknegative'] = ExportMediaConverter.trimHTMLWhiteSpace(mainDict['feedbackpositive'])
            
            mediaConverter.resizeImg(XMLPage.currentOutputDir/mainDict['cellbackImg_imgsrc'], 50, 50, {}, {"resizemethod" : "stretch"})
            mediaConverter.resizeImg(XMLPage.currentOutputDir/mainDict['coverImg_imgsrc'], 50, 50, {}, {"resizemethod" : "stretch"})
            
            
        
        for memoryMatchElement in self.memoryMatchElements:
            thisObjDict = memoryMatchElement.field.mainFields.getRenderDictionary(\
                memoryMatchElement.elements, "obj", previewMode)
            thisObjDict.update(mainDict)
            objElementFrag = memoryMatchElement.field.mainFields.applyFileTemplateToDict(\
                thisObjDict, "memmatch_template_pairitems.xml", previewMode)
            xml += objElementFrag
        
        xml += self.idevice.mainFieldSet.applyFileTemplateToDict(mainDict, \
            "memmatch_template_footer.xml", previewMode)
        
        return xml


    def _renderGame(self, style, previewMode):
        html = ""
        viewModeName = "view"
        if previewMode is True:
            viewModeName = "preview"
            
        html += common.ideviceHeader(self, style, viewModeName)
        
        mainDict = self.idevice.mainFieldSet.getRenderDictionary(self.mainElements, "", previewMode)
        if int(mainDict["coverImg_imgwidth"]) > 0:
            mainDict['cellwidth'] = mainDict["coverImg_imgwidth"]
        else:
            mainDict['cellwidth'] = "100"
             
        if int(mainDict["coverImg_imgheight"]) > 0:
            mainDict['cellheight'] = mainDict['coverImg_imgheight']
        else:
            mainDict['cellheight'] = "100"    
         
        firstFrag = self.idevice.mainFieldSet.applyFileTemplateToDict(mainDict, \
            "memmatch_template_head.html", previewMode)
        html += firstFrag
        for memoryMatchElement in self.memoryMatchElements:
            thisObjDict = memoryMatchElement.field.mainFields.getRenderDictionary(\
                memoryMatchElement.elements, "obj", previewMode)
            thisObjDict.update(mainDict)
            objElementFrag = memoryMatchElement.field.mainFields.applyFileTemplateToDict(\
                thisObjDict, "memmatch_template_pairitems.html", previewMode)
            html += objElementFrag
            
        html += "</div>\n"
        
        html += "<script type='text/javascript'>\n"
        #now the script that will add these as parts of the game
        for memoryMatchElement in self.memoryMatchElements:
            html += memoryMatchElement.makeJSLine()
        
        html += "</script>\n"
        
        footerFrag = self.idevice.mainFieldSet.applyFileTemplateToDict(mainDict, \
            "memmatch_template_footer.html", previewMode)
        html += footerFrag
        html += common.ideviceFooter(self, style, viewModeName)
        
        return html
        
        


    def renderEdit(self, style):
        """
        Returns an XHTML string with the form element for editing this block
        """
        html  = u"<div>\n"
        html += common.ideviceShowEditMessage(self)
        html += self.idevice.mainFieldSet.renderEditInOrder(self.mainElements)
        for memoryMatchElement in self.memoryMatchElements:
            html += memoryMatchElement.renderEdit()
        
        html += _("""<p>Click the button below to create the matching pairs or 
                trim in case you reduced the number of rows / columns</p>\n""")
        html += common.submitButton("calcPairs"+unicode(self.id), _("Create / Trim Pairs"))
        html += "<br/>"
        html += self.renderEditButtons()
        
        
        
        html += u"</div>\n"
        return html


    def renderPreview(self, style):
        """
        Returns an XHTML string for previewing this block
        """
        html  = u"<div class=\"iDevice "
        html += u"emphasis"+unicode(self.idevice.emphasis)+"\" "
        html += u"ondblclick=\"submitLink('edit',"+self.id+", 0);\">\n"
        html += self._renderGame(style, True)
        html += "</div>\n"
        return html


    def renderView(self, style):
        """
        Returns an XHTML string for viewing this block
        """
        html  = u"<div class=\"iDevice "
        html += u"emphasis"+unicode(self.idevice.emphasis)+"\">\n"
        html += self._renderGame(style, False)
        html += u"</div>\n"
        return html
    
class MemoryMatchPairElement(Element): 
    
    persistenceVersion = 3
    
    def __init__(self, field):
        Element.__init__(self, field)
        self.elements = field.mainFields.makeElementDict()
        
    def process(self, request):
        field_engine_process_all_elements(self.elements, request)
    
    def renderEdit(self):
        html = ""
        #to make sure people see what is a pair..
        html += "<div style='border: 2px solid green; margin: 5px; padding: 5px'>\n"
        html += self.field.mainFields.renderEditInOrder(self.elements)
        html += "</div>"
        return html
        
    #makes the line of Javascript for adding this to the game
    def makeJSLine(self):
        html = ""
        html += "memMatchGame%(ideviceid)s.addPairToMatch('%(pair1id)s', '%(pair2id)s');\n" \
                    % { 'ideviceid' : str(self.field.idevice.id), 'pair1id' : self.elements['match1'].id, \
                    'pair2id' : self.elements['match2'].id}
        return html

# ===========================================================================
"""Register this block with the BlockFactory"""
from exe.engine.memorymatchidevice import MemoryMatchIdeviceInc
from exe.webui.blockfactory     import g_blockFactory
g_blockFactory.registerBlockType(MemoryMatchBlockInc, MemoryMatchIdeviceInc)    

# ===========================================================================
