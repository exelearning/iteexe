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
from exe.webui.blockfactory        import g_blockFactory
from exe.engine.reflectionidevice  import ReflectionIdevice
from exe.webui                     import common

log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class ReflectionBlock(Block):
    """
    ReflectionBlock can render and process ReflectionIdevices as XHTML
    """
    def __init__(self, idevice):
        """
        Initialize a new Block object
        """
        Block.__init__(self, idevice)
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
        

    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this block
        """
        self.activity = self.activity.replace("\r", "")
        self.activity = self.activity.replace("\n","\\n")
        self.activity = self.activity.replace("'","\\'")
        self.answer   = self.answer.replace("\r", "")
        self.answer   = self.answer.replace("\n","\\n")
        self.answer   = self.answer.replace("'","\\'")
        html  = "<div id=\"iDevice\" class=\"reflection\">\n"
        html +=  _("Reflective question:") 
        html += common.elementInstruc("activity"+self.id, self.activityInstruc)
        html += "<br/>" + common.richTextArea("activity"+self.id, self.activity)
        html += _("Response:")
        html += common.elementInstruc("answer"+self.id, self.answerInstruc)
        html += "<br/>" + common.richTextArea("answer"+self.id, self.answer)
        html += "<br/>" + self.renderEditButtons()
        html += "</div>\n"
        return html


    def renderPage(self):
        """
        Returns an XHTML string for this block
        """
        html  = "<script type=\"text/javascript\">\n"
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

        html  = self.activity   
        html += '<div id="view%s" style="display:block;">' % self.id
        html += '<input type="button" name ="btnshow%s" ' % self.id
        html += 'value ="Click here" ' 
        html += 'onclick ="showAnswer(\'%s\',1)"/></div>\n ' % self.id
        html += '<div id="hide%s" style="display:none;">' % self.id
        html += '<input type="button" name ="btnhide%s" '  % self.id 
        html += 'value ="Hide"'
        html += 'onclick ="showAnswer(\'%s\',0)"/></div>\n ' % self.id
        html += '<div id="s%s" class="feedback" style=" ' % self.id
        html += 'display: none;">'
        html += self.answer
        html += "</div>\n"
        return html
    

    def renderView(self):
        """
        Returns an XHTML string for viewing this block
        """
        html  = "<div id=\"iDevice\" class=\"reflection\">\n"
        html += self.renderPage()
        html += "</div>\n"
        return html


    def renderPreview(self):
        """
        Returns an XHTML string for previewing this block
        """
        html  = "<div id=\"iDevice\" class=\"reflection\">\n"
        html += self.renderPage()
        html += self.renderViewButtons()
        html += "</div>\n"
        return html


g_blockFactory.registerBlockType(ReflectionBlock, ReflectionIdevice)


# ===========================================================================
