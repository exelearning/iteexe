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
ReflectionBlock can render and process ReflectionIdevices as XHTML
"""

import logging
import gettext
from exe.webui.block               import Block
from exe.webui                     import common

log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class ReflectionBlock(Block):
    """
    ReflectionBlock can render and process ReflectionIdevices as XHTML
    """
    def __init__(self, parent, idevice):
        """
        Initialize a new Block object
        """
        Block.__init__(self, parent, idevice)
        self.activity        = idevice.activity 
        self.answer          = idevice.answer
        self.activityInstruc = idevice.activityInstruc
        self.answerInstruc   = idevice.answerInstruc


    def process(self, request):
        """
        Process the request arguments from the web server
        """
        Block.process(self, request)
        
        if "activity"+self.id in request.args:
            self.idevice.activity = request.args["activity"+self.id][0]

        if "answer"+self.id in request.args:
            self.idevice.answer = request.args["answer"+self.id][0]
        
        if "title"+self.id in request.args:
            self.idevice.title = request.args["title"+self.id][0]
        

    def renderEdit(self, style):
        """
        Returns an XHTML string with the form element for editing this block
        """
        activity = self.activity.replace("\r", "")
        activity = activity.replace("\n","\\n")
        activity = activity.replace("'","\\'")
        answer   = self.answer.replace("\r", "")
        answer   = answer.replace("\n","\\n")
        answer   = answer.replace("'","\\'")
        html  = "<div class=\"iDevice\"><br/>\n"
        html += common.textInput("title"+self.id, self.idevice.title)
        html += u"<br/><br/>\n"
        html +=  _("Reflective question:") 
        html += common.elementInstruc("activity"+self.id, self.activityInstruc)
        html += "<br/>" + common.richTextArea("activity"+self.id, activity)
        html += _("Response:")
        html += common.elementInstruc("answer"+self.id, self.answerInstruc)
        html += "<br/>" + common.richTextArea("answer"+self.id, answer)
        html += "<br/>" + self.renderEditButtons()
        html += "</div>\n"
        return html


    def renderViewContent(self):
        """
        Returns an XHTML string for this block
        """
        html  = "<div class=\"iDevice_inner\">\n"
        html += "<script type=\"text/javascript\">\n"
        html += "<!--\n"
        html += """
            function showAnswer(id,isShow){
                if (isShow==1){
                    document.getElementById("s"+id).style.display = "block";
                    document.getElementById("hide"+id).style.display = "block";
                    document.getElementById("view"+id).style.display = "none";
                }else{
                    document.getElementById("s"+id).style.display = "none";
                    document.getElementById("hide"+id).style.display = "none";
                    document.getElementById("view"+id).style.display = "block";
                }
            }\n"""           
        html += "//-->\n"
        html += "</script>\n"

        html += self.activity   
        html += '<div id="view%s" style="display:block;">' % self.id
        html += '<input type="button" name="btnshow%s" ' % self.id
        html += 'value ="%s" ' % _(u"Click here")
        html += 'onclick="showAnswer(\'%s\',1)"/></div>\n ' % self.id
        html += '<div id="hide%s" style="display:none;">' % self.id
        html += '<input type="button" name="btnhide%s" '  % self.id 
        html += 'value="%s" ' % _(u"Hide")
        html += 'onclick="showAnswer(\'%s\',0)"/></div>\n ' % self.id
        html += '<div id="s%s" class="feedback" style=" ' % self.id
        html += 'display: none;">'
        html += self.answer
        html += "</div>\n"
        html += "</div>\n"
        return html
    

# ===========================================================================
