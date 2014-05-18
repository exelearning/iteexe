# ===========================================================================
# eXe 
# Copyright 2004-2006, University of Auckland
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
ExternalUrlBlock can render and process ExternalUrlIdevices as XHTML
"""

import logging
from exe.webui.block            import Block
from exe.webui                  import common

log = logging.getLogger(__name__)


# ===========================================================================
class ExternalUrlBlock(Block):
    """
    ExternalUrlBlock can render and process ExternalUrlIdevices as XHTML
    """
    def __init__(self, parent, idevice):
        Block.__init__(self, parent, idevice)
        if not hasattr(self.idevice,'undo'): 
            self.idevice.undo = True


    def process(self, request):
        """
        Process the request arguments from the web server to see if any
        apply to this block
        """
        is_cancel = common.requestHasCancel(request)

        Block.process(self, request)
        if "url"+self.id in request.args \
        and not is_cancel:
            self.idevice.url = request.args["url"+self.id][0]
            #if (self.idevice.url and 
            #    not self.idevice.url.startswith("http://") and 
            #    not self.idevice.url.startswith("https://") and
            #    not self.idevice.url.startswith("ftp://")):
            #    self.idevice.url = "http://" + self.idevice.url

        if "height"+self.id in request.args \
        and not is_cancel:
            self.idevice.height = request.args["height"+self.id][0]

    def renderEdit(self, style):
        """
        Returns an XHTML string with the form element for editing this block
        """
        html  = u'<div class="block">\n'
        html += u"<strong>%s</strong> " % _('URL:')
        html += common.elementInstruc(self.idevice.urlInstruc)
        html += u"</div>\n"
        html += u'<div class="block">\n'
        html += common.textInput("url"+self.id, self.idevice.url) 
        heightArr = [[_('small'),      '200'],
                     [_('medium'),     '300'],
                     [_('large'),      '500'],
                     [_('super-size'), '800']]
        html += u"</div>\n"
        html += u'<div class="block">\n'
        this_package = None
        if self.idevice is not None and self.idevice.parentNode is not None:
            this_package = self.idevice.parentNode.package
        html += common.formField('select', this_package, _('Frame Height:'), 
                                 "height"+self.id,
                                 options = heightArr,
                                 selection = self.idevice.height)
        html += u"</div>\n"
        html += self.renderEditButtons()
        return html


    def renderViewContent(self):
        """
        Returns an XHTML string for previewing this block
        """
        lb = "\n" #Line breaks
        dT = common.getExportDocType()   
        if dT == "HTML5":
            html = '<div class="iDevice_content" style="width:100%">'+lb
            if self.idevice.url:
                html += '<iframe src="'+self.idevice.url+'" width="600" height="'+self.idevice.height+'" style="width:100%"></iframe>'+lb
        else:        
            html = '<div class="iDevice_content">'+lb
            if self.idevice.url:
                html += '<iframe src="'+self.idevice.url+'" width="100%" height="'+self.idevice.height+'px"></iframe>'+lb
        html += '</div>'+lb
        return html


from exe.engine.externalurlidevice import ExternalUrlIdevice
from exe.webui.blockfactory     import g_blockFactory
g_blockFactory.registerBlockType(ExternalUrlBlock, ExternalUrlIdevice)    

# ===========================================================================
