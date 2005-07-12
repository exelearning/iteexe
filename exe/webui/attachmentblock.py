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
AttachmentBlock can render and process AttachmentIdevices as XHTML
"""

import logging
import gettext
from exe.webui.block   import Block
from exe.webui         import common

log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class AttachmentBlock(Block):
    """
    AttachmentBlock can render and process AttachmentIdevices as XHTML
    """
    def __init__(self, parent, idevice):
        """
        Initialize
        """
        Block.__init__(self, parent, idevice)


    def process(self, request):
        """
        Process the request arguments from the web server to see if any
        apply to this block
        """
        log.debug("process " + repr(request.args))
        Block.process(self, request)

        if (u"action" not in request.args or
            request.args[u"action"][0] != u"delete"):
            if u"label" + self.id in request.args:
                self.idevice.label = request.args[u"label" + self.id][0]
                
            if u"description" + self.id in request.args:
                self.idevice.description = (request.args[u"description" + 
                                                self.id][0])

            if "path" + self.id in request.args:
                self.idevice.setAttachment(request.args["path"+self.id][0])
                
            if self.idevice.label == "":
                self.idevice.label = self.idevice.filename


    def renderEdit(self, style):
        """
        Returns an XHTML string with the form elements for editing this block
        """
        log.debug("renderEdit")
        description = self.idevice.description.replace(u"\r", u"")
        description = description.replace(u"\n", u"\\n")
        description = description.replace(u"'",  u"\\'")
        html  = (u'<div class="iDevice">',
                 u'<a href="#" onclick="addFile(\'%s\');">' % self.id,
                _(u'Select a file'),
                u'</a>',
                common.elementInstruc('filename'+self.id,
                                      self.idevice.filenameInstruc),
                u'<br/>',
                common.hiddenField('path'+self.id),
                u'<b>%s</b>' % _(u'Label'),
                common.elementInstruc('label'+self.id,
                                      self.idevice.labelInstruc),
                u'<br/>',
                common.textInput(u'label'+self.id, self.idevice.label),
                u'<br/>',
                u'<b>%s</b>' % _(u'Description:'),
                common.elementInstruc('description'+self.id,
                                      self.idevice.descriptionInstruc),
                u'<br/>',
                common.richTextArea(u'description'+self.id,
                                    description),
                u'<span style="text-decoration:underline">'
                 u'%s</span>' % self.idevice.filename,
                u'<br/>',
                self.renderEditButtons(),
                u'</div>')
        return '\n'.join(html)


    def renderPreview(self, style):
        """
        Returns an XHTML string for previewing this block
        """
        log.debug("renderPreview")
        html  = u"<div class=\"iDevice "
        html += u"emphasis"+unicode(self.idevice.emphasis)+"\" "
        html += u"ondblclick=\"submitLink('edit',"+self.id+", 0);\">\n"
        html += u"""<a onclick="window.open('resources/%s', '_blank')" >""" % self.idevice.filename
        html += self.idevice.label
        html += u"</a> <br/> \n"
        html += self.idevice.description + u"<br/>"
        html += self.renderViewButtons()
        html += u"</div>\n"
        return html
    

    def renderView(self, style):
        """
        Returns an XHTML string for viewing this block
        """        
        log.debug("renderView")
        html  = u"<div class=\"iDevice "
        html += u"emphasis"+unicode(self.idevice.emphasis)+"\">\n"
        html += u"""<a onclick="window.open('%s', '_blank')" >""" % self.idevice.filename
        html += self.idevice.label
        html += u"</a> <br/> \n"
        html += self.idevice.description + u"<br/>"
        html += u"</div>\n"
        return html
    

# ===========================================================================
