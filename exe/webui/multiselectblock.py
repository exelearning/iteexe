# ===========================================================================
# eXe 
# Copyright 2004-2006, University of Auckland
# Copyright 2006-2007 eXe Project, New Zealand Tertiary Education Commission
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
MultiSelectBlock can render and process MultiSelectIdevices as XHTML
"""

import logging
from exe.webui.block    import Block
from exe.webui.element  import SelectquestionElement
from exe.webui          import common

log = logging.getLogger(__name__)


# ===========================================================================
class MultiSelectBlock(Block):
    """
    MultiSelectBlock can render and process MultiSelectIdevices as XHTML
    """
    def __init__(self, parent, idevice):
        """
        Initialize a new Block object
        """
        Block.__init__(self, parent, idevice)
        self.idevice           = idevice
        self.questionElements  = []
        if not hasattr(self.idevice,'undo'):
            self.idevice.undo = True

        for question in idevice.questions:
            self.questionElements.append(SelectquestionElement(question))


    def process(self, request):
        """
        Process the request arguments from the web server
        """
        Block.process(self, request)
        
        is_cancel = common.requestHasCancel(request)
            
        if ("addQuestion"+self.id) in request.args: 
            self.idevice.addQuestion()
            self.idevice.edit = True
            # disable Undo once a question has been added:
            self.idevice.undo = False

        for element in self.questionElements:
            element.process(request)

        if "title"+self.id in request.args \
        and not is_cancel:
            self.idevice.title = request.args["title"+self.id][0]

        if ("action" in request.args and request.args["action"][0] == "done"
            or not self.idevice.edit):
            # remove the undo flag in order to reenable it next time:
            if hasattr(self.idevice,'undo'): 
                del self.idevice.undo
            

    def renderEdit(self, style):
        """
        Returns an XHTML string with the form element for editing this block
        """
        html  = "<div class=\"iDevice\">\n"
        html += common.textInput("title"+self.id, self.idevice.title)
        html += u"<br/><br/>\n"
        

        for element in self.questionElements:
            html += element.renderEdit() 
            
        value = _("Add another Question")    
        html += "<br/>" 
        html += common.submitButton("addQuestion"+self.id, value)
        
        html += "<br/><br/>" 
        html += self.renderEditButtons(undo=self.idevice.undo)
        html += "</div>\n"


        return html

    def renderPreview(self, style):
        """
        Returns an XHTML string for previewing this block
        """
        html = '<div class="'+self.idevice.klass+'">'
        html += u"<div class=\"iDevice "
        html += u"emphasis"+unicode(self.idevice.emphasis)+"\" "
        html += u"ondblclick=\"submitLink('edit',"+self.id+", 0);\">\n"
        html += common.ideviceHeader(self, style, "preview")
        html += u'<div class="iDevice_inner">\n'

        for element in self.questionElements:
            html += element.renderPreview() + "<br/>"
        
        html += u"</div>\n"
        html += self.renderViewButtons()
        html += u"</div>\n"
        html += u"</div>\n"
        return html
    
    
    def renderView(self, style):
        """
        Returns an XHTML string for viewing this block
        """
        html  = u'<div class="iDevice '
        html += u'emphasis'+unicode(self.idevice.emphasis)+'">\n'
        html += common.ideviceHeader(self, style, "view")
        html += u'<div class="iDevice_inner">\n'
        for element in self.questionElements:
            html += element.renderView() + "<br/>"  

        html += "</div></div>\n"

        return html
    


from exe.engine.multiselectidevice import MultiSelectIdevice
from exe.webui.blockfactory        import g_blockFactory
g_blockFactory.registerBlockType(MultiSelectBlock, MultiSelectIdevice)  


# ===========================================================================
