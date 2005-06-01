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
This module is for the common HTML used in all webpages.
"""

import logging
import gettext

log = logging.getLogger(__name__)
_   = gettext.gettext


def docType():
    """Generates the documentation type string"""
    return (u'<?xml version="1.0" encoding="iso-8859-1"?>\n'
            u'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"'
            u' "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n')


def header(style=u'default'):
    """Generates the common header XHTML"""
    # NB: Authoring Page has its own header
    return (docType() + 
            u'<html xmlns="http://www.w3.org/1999/xhtml">\n'
            u'<head>\n'
            u'<style type="text/css">\n'
            u'  @import url(/css/exe.css);\n'
            u'  @import url(/style/%s/content.css);</style>\n'
            u'<script language="JavaScript" src="/scripts/common.js">'
            u'</script>\n'
            u'<script language="JavaScript" src="/scripts/fckeditor.js">'
            u'</script>\n'
            u'<script language="JavaScript" src="/scripts/libot_drag.js">'
            u'</script>\n'
            u'<title>%s</title>\n'
            u'<meta http-equiv="content-type" '
            u' content="text/html; charset=UTF-8"></meta>\n'
            u'</head>\n'
            % (style, _('eXe : elearning XHTML editor')))


def footer():
    """Generates the common page footer XHTML"""
    return u'</form></body></html>\n'

    
def hiddenField(name, value=u""):
    """Adds a hidden field to a form"""
    html  = u'<input type="hidden" name="%s" ' % name
    html += u'value="%s" />\n' % value
    return html


def textInput(name, value=u"", size=40, disabled=u""):
    """Adds a text input to a form"""
    html  = u'<input type="text" name="%s" id="%s"' % (name, name)
    html += u' value="%s"' % value
    html += u' size="%s" %s />\n' % (size, disabled)
    return html


def textArea(name, value="", disabled=""):
    """Adds a text area to a form"""
    log.debug(u"textArea "+value)
    html  = u'<textarea name="%s" ' % name
    html += u'cols="52" rows="8" %s>%s' % (disabled, value)
    html += u'</textarea><br/>'
    return html


def richTextArea(name, value="", width="100%", height=100):
    """Adds a FCKEditor to a form"""
    log.debug(u"richTextArea "+value+", height="+unicode(height))
    html  = u'<script type="text/javascript">\n'
    html += u'<!--\n'
    html += u"    var editor = new FCKeditor('"+name+"', '"
    html += u"%s', '%s', 'Armadillo', '%s');\n" % (width, height, value)
    html += u"    editor.BasePath = '/scripts/';\n"
    html += u"    editor.Config['CustomConfigurationsPath'] ="
    html += u" '/scripts/armadillo.js';\n"
    html += u"    editor.Create();\n"
    html += u"//-->\n"
    html += u"</script>\n"
    return html
        

def submitButton(name, value, enabled=True):
    """Adds a submit button to a form"""
    html  = u'<input type="submit" name="%s" ' % name
    html += u'value="%s" ' % value
    if not enabled:
        html += u' disabled'
    html += u'/>\n'
    return html


def submitImage(action, object_, imageFile, title=u"", isChanged=1):
    """
    Adds an image link which will trigger the javascript needed to
    post a form with the action and object passed in the args
    """
    onclick = "submitLink('%s', %s, %d);" % (action, object_, isChanged)
    titleText = u''
    if title:
        titleText = u'title="%s" ' % title
    html  = u'<a %s' % titleText
    html += ' href="#" onclick="%s">' % onclick
    html += image(imageFile)
    html += '</a>\n' 
    return html


def image(imageFile):
    """Returns the XHTML for an image"""
    html  = u'<img src="/images/%s" ' % imageFile
    html += u' align="middle" border="0" />'
    return html


def select(action, object_, options, selection=None):
    """Adds a dropdown selection to a form"""
    onclick = u"submitLink('%s', %s);" % (action, object_)
    html = u'<select onchange="%s" name="%s%s" >' % (onclick, action, object)
    for opt, value in options:
        selected = u''
        if selection == opt:
            selected = u'selected'

        html += u' <option value="%s" %s>' % (value, selected)
        html += opt
        html += u'</option>\n'

    html += u'</select>\n'
    return html


def option(name, checked, value):
    """Add a option input"""
    chkStr = u''
    if checked:
        chkStr = u'checked'
    html  = (u'<input type="radio" name="%s"'
             u' value="%s" %s/>\n' % 
              (name, value, chkStr))
    return html


def checkbox(name, checked, value=""):
    """Add a checkbox"""
    chkStr = u''
    if checked:
        chkStr = u'checked'
        
    html  = (u'<input type="checkbox" name="%s"'
             u' value="%s" %s/>\n' % 
              (name, value, chkStr))
    return html



def elementInstruc(instrucId, instruc, imageFile="help.gif",
                   label="Instructions"):
    """add a help instruction for a element"""
    if instruc == u'':
        html = u''
    else:
        html  = u'<a onmousedown="Javascript:updateCoords(event);" '
        html += u' title="%s"" ' % _('Instructions for completion')
        html += u'onclick="Javascript:showMe(\'i%s\', 350, 100);" ' % instrucId
        html += u'href="Javascript:void(0)" style="cursor:help;"> ' 
        html += u'<img src="/images/%s" border="0" align="middle"/>' % imageFile
        html += u'</a>\n'
        html += u'<div id="i%s" style="display:none; z-index:99;">' % instrucId
        html += u'<div style="float:right;" >'
        html += u'<img src="/images/stock-stop.png" title="%s" ' % _("Close")
        html += u' onmousedown="Javascript:hideMe();"/></div>'
        html += u'<b>%s:</b><br/>%s<br/>' % (label, instruc)                
        html += u'</div>\n'
    return html
