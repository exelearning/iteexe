# ===========================================================================
#
# Place the objects block - works for place the objects iDevice
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
PlaceTheObjects block renders the place the objects idevice game as XHTML
"""

import logging
from exe.webui.block            import Block
from exe.webui.element          import TextAreaElement
from exe.webui.element          import Element
from exe.webui          	import common
from exe.webui.element          import TextElement
from exe.engine.extendedfieldengine        import *

log = logging.getLogger(__name__)


# ===========================================================================
class PlaceTheObjectsBlockInc(Block):
    """
    ExampleBlock can render and process ExampleIdevices as XHTML
    GenericBlock will replace it..... one day
    """
    def __init__(self, parent, idevice):
        Block.__init__(self, parent, idevice)
        self.contentElement = TextAreaElement(idevice.content)
        self.contentElement.height = 250

        self.mainAreaElement = TextAreaElement(idevice.mainArea)
        self.mainAreaElement.height = 200
        
        self.placableObjectElements = []
        for placableObjectField in idevice.objectsToPlace:
            newPlacableElement = PlacableObjectElement(placableObjectField)
            self.placableObjectElements.append(newPlacableElement)

        self.positiveResponseElement = TextAreaElement(idevice.positiveResponseArea)
        self.negativeResponseElement = TextAreaElement(idevice.negativeResponseArea)
        self.clickToStartElement = TextAreaElement(idevice.clickToStartGameArea)
        self.gameTimeLimit = TextElement(idevice.gameTimeLimit)
        self.gameTimerShown = TextElement(idevice.gameTimerShown)
        self.partbinNumCols = TextElement(idevice.partbinNumCols)


    def process(self, request):
        """
        Process the request arguments from the web server to see if any
        apply to this block
        """
        Block.process(self, request)

        self.idevice.uploadNeededScripts()

        if "addPlacableObject" + unicode(self.id) in request.args:
            self.idevice.addPlacableObject()
            self.idevice.edit = True
            self.idevice.undo = False
        if "checktimer" + unicode(self.id) in request.args:
            if "enabletimer" + unicode(self.id) in request.args:
                self.idevice.gameTimerShown.content = True
            else:
                self.idevice.gameTimerShown.content = False

        self.contentElement.process(request)
        self.mainAreaElement.process(request)
        self.positiveResponseElement.process(request)
        self.negativeResponseElement.process(request)
        self.clickToStartElement.process(request)
        self.gameTimeLimit.process(request)
        self.partbinNumCols.process(request)

        for placableObjectElement in self.placableObjectElements:
            placableObjectElement.process(request)
        

    def _makeObjectDivId(self, elementTypeName, placeableObjectElement):
        """
        Makes an id for a div that is the drag or drop element 
        as specified by elementTypeName = draggable | droppable
        for placeableObjectElement
        """

        objectdivid = "placetheobjects" + self.id + "_" + elementTypeName + placeableObjectElement.id
        return objectdivid

    def _renderForGame(self, previewMode = False):
        """
        Renders the block as the script and XHTML elements that will be needed in order
        to make this run as a game
        """
        scriptPrefix = ""
        if previewMode == True:
            scriptPrefix = "resources/"

        html = "<script src='%sjquery-ui-1.10.3.custom.min.js' type='text/javascript'></script>\n" % scriptPrefix
        html += "<script src='%splacetheobjects.js' type='text/javascript'></script>\n" % scriptPrefix
        
        #this shows the instructions
        html += self.contentElement.renderView()

        """
        Here we make the droppable target divs
        """
        for placeableObjectElement in self.placableObjectElements:
            borderStr = ""
            if previewMode == True:
                borderStr = "border: 1px solid red;"
            tolerance = int(placeableObjectElement.toleranceElement.renderView())

            html += """<div id='%(droppableid)s' class='placeTheObjectTargetClass%(gameId)s' style='position: absolute; 
                        margin-left: %(marginleft)dpx; margin-top: %(margintop)dpx;
                        width: %(width)dpx; height: %(height)dpx; %(borderstr)s '>
                        </div>
                """ % { "droppableid" : self._makeObjectDivId("droppable", placeableObjectElement), \
                        "marginleft" : int(placeableObjectElement.targetXElement.renderView()) - tolerance, \
                        "margintop" : int(placeableObjectElement.targetYElement.renderView()) - tolerance, \
                        "width": int(placeableObjectElement.widthElement.renderView()) + (tolerance * 2), \
                        "height": int(placeableObjectElement.heightElement.renderView()) + (tolerance * 2), \
                        "borderstr": borderStr, "gameId" : str(self.id) }

        """+ve/-ve feedback areas"""
        html += "<div id='placetheobjects_" + self.id +"_positivefeedback'" \
                +" style='position: absolute; z-index: 1; '>"
        if previewMode == True:
            html += self.positiveResponseElement.renderPreview()
        else:
            html += self.positiveResponseElement.renderView()
        html += "</div>"

        
        html += "<div id='placetheobjects_" + self.id + "_negativefeedback' " \
                + "style='position: absolute; z-index: 1;'>" 
        if previewMode == True:
            html += self.negativeResponseElement.renderPreview()
        else:
            html += self.negativeResponseElement.renderView()
        html += "</div>"

        """What to click to start the game"""
        html += "<div id='placetheobjects_" + self.id + "_clicktostart' style='position: " \
                + "absolute; cursor: pointer; z-index: 3' onclick='startPlaceGame(\"" + self.id + "\")'>"
        if previewMode == True:
            html += self.clickToStartElement.renderPreview()
        else:
            html += self.clickToStartElement.renderView()
        html += "</div>"



        """
        This is the main area background where the elements are going to be dropped...
        """
        html += "<div style='z-index: -4;' id='placetheobjects_" + self.id + "_main'>"
        if previewMode == True:
            html += self.mainAreaElement.renderPreview()
        else:
            html += self.mainAreaElement.renderView()

        html += "</div>"
        """
        Here we make the part bin that will contain the elements that will be dragged 
        and dropped in place
        """

        html += "<div id='placetheobjects" + self.id + "_partbin'>\n"
        html += "<table cellpadding='2' cellspacing='2'>"
        numCols = int(self.partbinNumCols.renderView())
        html += "<!-- num cols = " + str(numCols) + "-->"
        colCount = 0
        elementCount = 0

        for placeableObjectElement in self.placableObjectElements:
            if elementCount % numCols == 0:
                #we need to make a new row...
                if elementCount > 0:
                    html += "</tr>"
                html += "<tr>"
                
            idname = self._makeObjectDivId("draggable", placeableObjectElement)
            elementDimensions = {"width" : int(placeableObjectElement.widthElement.renderView()), \
                "height" : int(placeableObjectElement.heightElement.renderView()) }
            html += "<td style='width: %(width)dpx; height: $(height)spx;'>"
            html += "<div id='" + idname + "' onclick=\"objectPlacePickupElement('%(gameid)s', '%(draggableid)s')\" style='cursor: pointer;  " \
                % {"gameid" : str(self.id), "draggableid" : idname}
            html += "width: %(width)dpx; height: %(height)dpx; overflow: hidden; z-index: 1;'>\n" \
                % elementDimensions
            html += placeableObjectElement.mainContentElement.renderView()
            html += "</div>\n"
            html += "</td>"
            elementCount += 1

        html += "</tr></table>"        
        html += "</div>\n"

        html += "<!-- Javascript Code Generated by placetheobjectsblock.py - DO NOT MODIFY -->\n"
        html += "<script type='text/javascript'>\n"
        html +="initPlaceTheObjectsGameData('" + self.id + "');\n"
        html += "placeTheObjectsGameData['" + self.id + "']['showtimer'] = '" + str(self.gameTimerShown.field.content) + "';\n"
        html += "placeTheObjectsGameData['" + self.id + "']['timelimit'] = '" + str(self.gameTimeLimit.field.content) + "';\n"

        for placeableObjectElement in self.placableObjectElements:
            draggable_id = self._makeObjectDivId("draggable", placeableObjectElement)
            droppable_id = self._makeObjectDivId("droppable", placeableObjectElement)

            perItemCode = """
                if(exe_isTouchScreenDev == false) {
                    $(function() {
                    $("#%(draggableid)s").draggable({ 
                            revert : 'invalid',
                            start: function(event, ui) {
                                    placeObjectReadyTarget("%(droppableid)s");
                            },
                            stop: function (event, ui) {
                                    placeObjectHideTarget("%(droppableid)s");
                                    setTimeout('checkObjectPlaceOK("%(gameId)s", "%(draggableid)s")', 300);
                            }
                            }
                    );
                    $("#%(droppableid)s").droppable({
                    accept: "#%(draggableid)s",
                    activeClass: "ui-state-hover",
                    hoverClass: "ui-state-active",
                            drop: function(event, ui) {
                                    $("#%(draggableid)s").effect("pulsate", {}, "fast");
                                    objectPlaceOK("%(gameId)s", "%(draggableid)s");
                            }
                            });
                    });
                    document.getElementById("%(draggableid)s").onclick = null;   
                }
                
                placeTheObjectsGameData['%(gameId)s']['elements']['%(draggableid)s'] = new Array();
                placeTheObjectsGameData['%(gameId)s']['elements']['%(draggableid)s']['status'] = 'notplaced';
                placeTheObjectsGameData['%(gameId)s']['elements']['%(draggableid)s']['bounds'] = new Array(%(targetx)s, %(targety)s, %(width)s, %(height)s ); 
                               
                """ % { "draggableid" : draggable_id, "droppableid" : droppable_id, "gameId" : str(self.id), \
                "targetx": placeableObjectElement.targetXElement.renderView() , "targety" : placeableObjectElement.targetYElement.renderView(),\
                "width" : placeableObjectElement.widthElement.renderView(),  "height" : placeableObjectElement.heightElement.renderView() }
            html += perItemCode

        html += "</script>\n"
        return html


    def renderEdit(self, style):
        """
        Returns an XHTML string with the form element for editing this block
        """
        html  = u"<div>\n"
        html += self.contentElement.renderEdit()
        html += self.mainAreaElement.renderEdit()

        html +=u"<strong>"+_("Game Options") +"</strong>"
        
        html += self.clickToStartElement.renderEdit()
        html += self.positiveResponseElement.renderEdit()
        html += self.negativeResponseElement.renderEdit()
        html += self.partbinNumCols.renderEdit()
        """
        Timer Options
        """
        html += "<input type='hidden' name='checktimer%s' value='true'/>" % self.id
        html += common.checkbox("enabletimer%s" % self.id, self.idevice.gameTimerShown.content, \
                title=_("Enable Timer"), instruction=_("Enable showing the timer in the game"))
        html += self.gameTimeLimit.renderEdit()

        for placableObjectElement in self.placableObjectElements:
            html += placableObjectElement.renderEdit()
        
        html += "<br/>"
        html += common.submitButton("addPlacableObject"+unicode(self.id), _("Add Placable Object"))
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

        html += self._renderForGame(True)

        html += self.renderViewButtons()
        html += "</div>\n"
        return html


    def renderView(self, style):
        """
        Returns an XHTML string for viewing this block
        """
        html  = u"<div class=\"iDevice "
        html += u"emphasis"+unicode(self.idevice.emphasis)+"\">\n"

        html += self._renderForGame()

        html += u"</div>\n"
        return html

class PlacableObjectElement(Element):
    
    #here field should be placeableobjectfield
    def __init__(self, field):
        Element.__init__(self, field)
        # there is then field.maincontent, field.width, field.height, field.correctx, field.correcty , etc.
        self.mainContentElement = TextAreaElement(field.mainContentField)
        self.targetXElement = TextElement(field.targetX)
        self.targetYElement = TextElement(field.targetY)
        self.widthElement = TextElement(field.width)
        self.heightElement = TextElement(field.height)
        self.toleranceElement = TextElement(field.tolerance)

    def process(self, request):
        self.mainContentElement.process(request)
        self.targetXElement.process(request)
        self.targetYElement.process(request)
        self.widthElement.process(request)
        self.heightElement.process(request)
        self.toleranceElement.process(request)
        field_engine_check_delete(self, request, self.field.idevice.objectsToPlace)

    def renderEdit(self):
        html = ""
        html += self.mainContentElement.renderEdit()
        html += self.targetXElement.renderEdit()
        html += self.targetYElement.renderEdit()
        html += self.widthElement.renderEdit()
        html += self.heightElement.renderEdit()
        html += self.toleranceElement.renderEdit()
        html += field_engine_make_delete_button(self)
        return html
   
    def renderView(self):
        html = ""
        html += self.mainContentElement.renderView()
        html += self.mainContentElement.renderView()
        html += self.targetXElement.renderView()
        html += self.targetYElement.renderView()
        html += self.widthElement.renderView()
        html += self.heightElement.renderView()
        html += self.toleranceElement.renderView()

        return html

    def renderPreview(self):
        html = ""
        html += self.renderView()
        return html
    

# ===========================================================================
"""Register this block with the BlockFactory"""
from exe.engine.placetheobjectsidevice import PlaceTheObjectsIdeviceInc
from exe.webui.blockfactory     import g_blockFactory
g_blockFactory.registerBlockType(PlaceTheObjectsBlockInc, PlaceTheObjectsIdeviceInc)    

# ===========================================================================
