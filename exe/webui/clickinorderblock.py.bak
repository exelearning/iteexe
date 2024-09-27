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
ClickInOrderBlock can render and process ExampleIdevices as XHTML
"""

import logging
from exe.webui.block            import Block
from exe.webui.element          import TextAreaElement
from exe.webui.element          import TextElement
from exe.webui.element          import Element
from exe.webui          	import common
from exe.engine.extendedfieldengine        import ChoiceElement,\
    field_engine_check_fields_are_ints

log = logging.getLogger(__name__)


# ===========================================================================
class ClickInOrderBlockInc(Block):
    """
    ClickInOrderBlock renders ClickInOrderIdevice
    """
    def __init__(self, parent, idevice):
        Block.__init__(self, parent, idevice)
        self.mainTextAreaElements = {}        
        self.mainTextElements = {}
        self.clickableAreaElements = []
        self.questionOrderChoiceElement = ChoiceElement(idevice.questionOrderChoiceField)
        self.timerChoiceElement = ChoiceElement(idevice.timerChoiceField)
        self.titleElement = TextElement(idevice.titleField)

        for textAreaFieldName, textAreaFieldVals in idevice.textAreaFieldNames.items():
            self.mainTextAreaElements[textAreaFieldName] = TextAreaElement(idevice.textAreaFields[textAreaFieldName])

        for textFieldName, textFieldVals in idevice.textFieldNames.items():
            self.mainTextElements[textFieldName] = TextElement(idevice.textFields[textFieldName])

        for clickableAreaField in idevice.clickableAreaFields:
            newClickableElement = ClickInOrderClickableAreaElement(clickableAreaField)
            self.clickableAreaElements.append(newClickableElement)


    def process(self, request):
        """
        Process the request arguments from the web server to see if any
        apply to this block
        """
        self.idevice.message = ""
        Block.process(self, request)
        
        self.titleElement.process(request)

        self.questionOrderChoiceElement.process(request)
        self.timerChoiceElement.process(request)

        self.idevice.uploadNeededScripts()

        if "addClickableArea" + str(self.id) in request.args:
            self.idevice.addClickableField()
            self.idevice.edit = True
            self.idevice.undo = False

        for textAreaFieldName, textAreaElement in self.mainTextAreaElements.items():
            textAreaElement.process(request)

        for textFieldName, textElement in self.mainTextElements.items():
            textElement.process(request)

        for clickableAreaElement in self.clickableAreaElements:
            clickableAreaElement.process(request)
            
            
        #validate integer fields are actually integers
        field_engine_check_fields_are_ints(self.mainTextElements, \
                            ["width", "height", "hintWidth", "hintHeight"], thisIdevice=self.idevice)
        

    def renderXML(self, style):
        previewMode = False
        
        xml = ""
        xml += "<idevice type=\"clickinorder\" id=\"%s\">\n" % self.idevice.id
        xml += "<clickinorderoptions "
        if self.questionOrderChoiceElement.renderView() == "1":
            xml += " randomizequestions=\"randomizequestions\" "
        
        """
        if self.timerChoiceElement.renderView() == "1":
            xml += " timermode = \"%(timerMode)s\" " % \
        
        xml += self.mainTextAreaElements['Instructions'].renderView()

        html += '<div id="clickableAreaGameCompleteFeedback' + self.id + '" style="position: absolute; z-index: 3">'
        html += self.mainTextAreaElements['CompleteFeedback'].renderPreview() if previewMode \
                else self.mainTextAreaElements['CompleteFeedback'].renderView()
        html += "</div>"

        html += '<div id="clickableAreaPositiveFeedback' + self.id +'" style="position: absolute; z-index: 1">'
        html += self.mainTextAreaElements['PositiveFeedback'].renderPreview() if previewMode \
                else self.mainTextAreaElements['PositiveFeedback'].renderView()
        html += "</div>"

        html += '<div id="clickableAreaNegativeFeedback' + self.id +'" style="position: absolute; z-index: 2">'
        html += self.mainTextAreaElements['NegativeFeedback'].renderPreview() if previewMode \
                else self.mainTextAreaElements['NegativeFeedback'].renderView()
        html += "</div>"
        """

    """
    Renders the code for the game...
    """
    def _renderGame(self, style, mode="view"):
        previewMode = False
        resourcePath = ""
        if mode == "preview":
            previewMode = True
            resourcePath = "resources/"

        html = common.ideviceHeader(self, style, mode)
        
        html += \
        """
        <script src="%(resourcePath)sjquery-ui-1.10.3.custom.min.js" type="text/javascript"> </script>
        <script src="%(resourcePath)sclickinorder.js" type="text/javascript"> </script>

        <script type="text/javascript">
        var clickInOrderGame%(gameId)s = new ClickInOrder('%(gameId)s');
        """ % { 'gameId' : str(self.id), 'resourcePath': resourcePath }
        
        if self.questionOrderChoiceElement.renderView() == "1":
            html += "clickInOrderGame%(gameId)s.randomizeQuestions = true;\n" % { 'gameId' : str(self.id) }
        
        if self.timerChoiceElement.renderView() == "1":
            html += "clickInOrderGame%(gameId)s.timerMode = %(timerMode)s;\n" % \
                {"gameId" : str(self.id), "timerMode" : self.timerChoiceElement.renderView() }

        for clickableAreaElement in self.clickableAreaElements:
            hideDelayStr = clickableAreaElement.textElements['hideDelay'].renderView()
            if len(hideDelayStr) < 1:
                hideDelayStr = "0"
                
            html += "clickInOrderGame%(gameId)s.addClickableArea(\"%(clickableId)s\", %(hideDelay)s, %(bounds)s);\n" \
              % {'gameId' : str(self.id), 'clickableId' : str(clickableAreaElement.id), \
              'hideDelay' : int(hideDelayStr),\
              'bounds' : "new Array(" + clickableAreaElement.textElements['left'].renderView() + "," \
                + clickableAreaElement.textElements['top'].renderView() + ","
                + clickableAreaElement.textElements['width'].renderView() + ","
                + clickableAreaElement.textElements['height'].renderView() +")"}
                
        
        html += "</script>\n"
        

        if previewMode == True:
            html += self.mainTextAreaElements['Instructions'].renderPreview()
        else:
            html += self.mainTextAreaElements['Instructions'].renderView()

        html += '<div id="clickableAreaGameCompleteFeedback' + self.id + '" style="position: absolute; z-index: 3">'
        
        if previewMode == True:
            html +=self.mainTextAreaElements['CompleteFeedback'].renderPreview()
        else:
            html += self.mainTextAreaElements['CompleteFeedback'].renderView()
        html += "</div>"

        html += '<div id="clickableAreaPositiveFeedback' + self.id +'" style="position: absolute; z-index: 1">'
        
        if previewMode == True:
            html += self.mainTextAreaElements['PositiveFeedback'].renderPreview()
        else:
            html += self.mainTextAreaElements['PositiveFeedback'].renderView()
        html += "</div>"

        html += '<div id="clickableAreaNegativeFeedback' + self.id +'" style="position: absolute; z-index: 2">'
        
        if previewMode == True:
            html += self.mainTextAreaElements['NegativeFeedback'].renderPreview()
        else:
            html += self.mainTextAreaElements['NegativeFeedback'].renderView()
        
        html += "</div>"


        
        if self.timerChoiceElement.renderView() == "1":        
            html += '<input id="clickinordertimer' + self.id + '" style="' + \
                self.mainTextElements['timerStyle'].renderView() + ' "/>\n'

        for clickableAreaElement in self.clickableAreaElements:
            posStyleTopLeft = "position: absolute; margin-left: %(left)spx; margin-top: %(top)spx; z-index: 2; " \
                % { 'left' : clickableAreaElement.textElements['left'].renderView(), \
                'top' : clickableAreaElement.textElements['top'].renderView() }

            posStyleWidthHeight = "height: %(height)spx; width: %(width)spx; " % \
                { 'width' : clickableAreaElement.textElements['width'].renderView(), \
                  'height' : clickableAreaElement.textElements['height'].renderView() }
                
            divDictArgs = { 'gameId' : str(self.id), \
                        'clickableAreaId' : str(clickableAreaElement.id), \
                        'posStyle' : posStyleTopLeft, \
                        'posStyleWH' : posStyleWidthHeight }
            html += """<div id="clickableArea_%(gameId)s_%(clickableAreaId)s" style="%(posStyle)s %(posStyleWH)s "  
                    onclick="clickInOrderGame%(gameId)s.checkClick(\'%(clickableAreaId)s\')"> </div>""" \
                        % divDictArgs
            html += '<div id="clickableAreaShowMe_%(gameId)s_%(clickableAreaId)s" style="%(posStyle)s">' \
                        % divDictArgs
            if previewMode == True:
                html += clickableAreaElement.textAreaElements['ShowMe'].renderPreview()
            else:
                html += clickableAreaElement.textAreaElements['ShowMe'].renderView()
            html += '</div>'
            

        #the click to start area
        gameSizeArgs = { 'gameId' : str(self.id), \
                'width' : self.mainTextElements['width'].renderView() ,\
                'height' : self.mainTextElements['height'].renderView()}

        html += """<div id=\"clickinordercontainer%(gameId)s\" style=\"width: %(width)spx; height: %(height)spx; overflow: hidden;\" 
                 >""" \
                % gameSizeArgs
        html += """<div id="clickinorderstartarea%(gameId)s\" onclick="clickInOrderGame%(gameId)s.startGame()"  
                style=\"width: %(width)spx; height: %(height)spx; position: absolute;\">""" \
                % gameSizeArgs
        if previewMode == True:
            html += self.mainTextAreaElements['ClickToStartArea'].renderPreview()
        else:
            html += self.mainTextAreaElements['ClickToStartArea'].renderView()
        html += "</div>"
        
        #the main area
        html += """<div id="clickinordermainarea%(gameId)s" onclick="clickInOrderGame%(gameId)s.validateClick" 
                style=\"width: %(width)spx; height: %(height)spx; position: absolute;\">""" \
                % gameSizeArgs

        if previewMode == True:
            html += self.mainTextAreaElements['MainArea'].renderPreview()
        else:
            html += self.mainTextAreaElements['MainArea'].renderView()
            
        html += "</div>"

        html += "</div>"
        #the hints
        html += "<div id=\"clickInOrderHints" + self.id + "\" style=\"" \
                + "width: " + self.mainTextElements['hintWidth'].renderView() + "px; " \
                + "height: " + self.mainTextElements['hintHeight'].renderView() + "px; " \
                + self.mainTextElements['hintAreaStyle'].renderView() + "\">\n"
        
        for clickableAreaElement in self.clickableAreaElements:
            html += "<div id=\"clickableAreaInstruction_%(gameId)s_%(clickableAreaId)s\" style=\"position: absolute\">" \
                        % { 'gameId' : str(self.id), 'clickableAreaId' : str(clickableAreaElement.id) }
            if previewMode == True:
                html += clickableAreaElement.textAreaElements['Hint'].renderPreview()
            else:
                html += clickableAreaElement.textAreaElements['Hint'].renderView()
                
            html += "</div>\n"

        html += "</div>"
        
        html += '<input id="clickinordercounter' + self.id + '" style="' + \
                self.mainTextElements['elementCounterStyle'].renderView() +' " value="1"/>\n'
        
        html += "<script type=\"text/javascript\">clickInOrderGame%(gameId)s.init();</script>\n" % { 'gameId': str(self.id) }
        
        html += common.ideviceFooter(self, style, mode)
        
        return html

    def renderEdit(self, style):
        """
        Returns an XHTML string with the form element for editing this block
        """
        html  = "<div>\n"
        html += common.ideviceShowEditMessage(self)
            
        html += \
        _("""
        <h2>Click The Elements in Order Game</h2>
        <p>
                This builds a Javascript game where the player has to click on a certain place on the main area according to the hint.  
                When they click correctly the positive feedback will come and the game will advance.  When they click the wrong
                area negative feedback will be shown.  When they click on the correct area an item can be revealed there.  A delay
                can be set to make the item disappear if desired after a delay.
        </p>

        """)
        html += self.titleElement.renderEdit()
        
        for textAreaFieldName, textAreaElement in self.mainTextAreaElements.items():
            html += textAreaElement.renderEdit()

        #for textFieldName, textElement in self.mainTextElements.iteritems():
        #    html += textElement.renderEdit()
        for textFieldName in self.idevice.textFieldsBasic:
            html += self.mainTextElements[textFieldName].renderEdit()
        
        divId = "fieldtype_advanced"  + self.id
        html += "<input name='showbox" + divId + "' type='checkbox' onchange='$(\"#" + divId + "\").toggle()'/>"
        
        html += _("Show advanced options") + "<br/>"
        html += "<div id='" + divId + "' style='display: none' "
        html += ">"
            
            
        for textFieldName in self.idevice.textFieldsAdvanced:
            html += self.mainTextElements[textFieldName].renderEdit()
        
        html += "</div>"
        html += "<br/>"

        html += self.questionOrderChoiceElement.renderEdit()
        html += self.timerChoiceElement.renderEdit()

        html += _("<h2>Clickable Areas</h2>")
        for clickableAreaElement in self.clickableAreaElements:
            html += clickableAreaElement.renderEdit()

        html += "<br/>"
        html += common.submitButton("addClickableArea"+str(self.id), _("Add Clickable Area"))
        html += "<br/>"

        html += self.renderEditButtons()
        html += "</div>\n"
        return html


    def renderPreview(self, style):
        """
        Returns an XHTML string for previewing this block
        """
        html = ""
        html += self._renderGame(style, "preview")
        return html


    def renderView(self, style):
        """
        Returns an XHTML string for viewing this block
        """
        html = ""
        html += self._renderGame(style, "view")
        return html

class ClickInOrderClickableAreaElement(Element):
    
    #here field should be placeableobjectfield
    def __init__(self, field):
        Element.__init__(self, field) 
        
        self.textElements = {}
        self.textAreaElements = {}

        for textFieldName, textFieldDetails in field.textFieldNames.items():
            self.textElements[textFieldName] = TextElement(field.textFields[textFieldName])
        
        for textAreaFieldName, textAreaFieldDetails in field.textAreaFieldNames.items():
            self.textAreaElements[textAreaFieldName] = TextAreaElement(field.textAreaFields[textAreaFieldName])

    def process(self, request):
        #see if its time to delete ourselves
        self.field.message = ""
        
        if "action" in request.args and request.args["action"][0] == self.id:
            self.field.idevice.clickableAreaFields.remove(self.field)
            
        for textElementName, textElement in self.textElements.items():
            textElement.process(request)
        for textAreaElementName, textAreaElement in self.textAreaElements.items():
            textAreaElement.process(request)
        
        errMsg = field_engine_check_fields_are_ints(self.textElements, \
                    ['top', 'left', 'width', 'height', 'hideDelay'], None, self.field.idevice, self.field)
            
   
    def renderEdit(self):
        html = "<div stlye='border: 1px solid green; padding-top: 20px;'>"
        html += common.fieldShowEditMessageEle(self)
        textElementItems = ["left", "top", "width", "height", "hideDelay"]
        textAreaItems = ["Hint", "ShowMe"]
        
        for textElementName in textElementItems:
            html += self.textElements[textElementName].renderEdit()
        
        #for textAreaElementName, textAreaElement in self.textAreaElements.iteritems():
        for textAreaElementName in textAreaItems: 
            html +=self.textAreaElements[textAreaElementName].renderEdit()
            
        html += common.submitImage(self.id, self.field.idevice.id, 
                                   "/images/stock-cancel.png",
                                   _("Delete Clickable Area"))
        html += "</div>"
        return html

# ===========================================================================
"""Register this block with the BlockFactory"""
from exe.engine.clickinorderidevice import ClickInOrderIdeviceInc
from exe.webui.blockfactory     import g_blockFactory
g_blockFactory.registerBlockType(ClickInOrderBlockInc, ClickInOrderIdeviceInc)    

# ===========================================================================
