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

log = logging.getLogger(__name__)


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
            u'<script type="text/javascript" src="/scripts/common.js">'
            u'</script>\n'
            u'<script type="text/javascript" src="/scripts/libot_drag.js">'
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
    html  = u"<input type=\"hidden\" "
    html += u"name=\"%s\" " % name
    html += u"id=\"%s\" " % name
    html += u"value=\"%s\"/>\n" % value
    return html


def textInput(name, value=u"", size=40, disabled=u""):
    """Adds a text input to a form"""
    html  = u"<input type=\"text\" "
    html += u"name=\"%s\" " % name
    html += u"id=\"%s\" " % name
    html += u"value=\"%s\" " % value
    html += u"size=\"%s\" " % size
    html += disabled+u" />\n"
    return html


def textArea(name, value="", disabled=""):
    """Adds a text area to a form"""
    log.debug(u"textArea %s" % value)
    html  = u'<textarea name="%s" ' % name
    if disabled:
        html += u'disabled="disabled" '
    html += u'cols="52" rows="8">'
    html += value
    html += u'</textarea><br/>'
    return html


def richTextArea(name, value="", width="100%", height=100):
    """Adds a editor to a form"""
    log.debug(u"richTextArea %s, height=%s" % (value, height))
    html  = u'<textarea name="%s" ' % name
    html += u'style=\"width:' + width + '; height:' + str(height) + 'px; \" >'
    html += value
    html += u'</textarea><br/>'

    return html


def image(name, value, width="", height=""):
    """Returns the XHTML for an image"""
    log.debug(u"image %s" % value)
    html  = u"<img id=\"%s\" " % name
    html += u'alt="%s" ' % name
    if width:
        html += u"width=\"%s\" " % width
    if height:
        html += u"height=\"%s\" " % height
    html += u"src=\"%s\" " % value
    html += u"/>\n"
    return html


def flash(name, value, width, height):
    """Returns the XHTML for flash"""
    log.debug(u"flash %s" % value)
    html  = u'<embed id="%s" ' % name 
    html += u'width="%s" height="%s" fullscreen="no" ' %(width, height)
    html += u'src="%s"/>\n' % value
  
    return html

def flashMovie(value, width, height):
    """Returns the XHTML for a flash movie"""
    log.debug(u"flash %s" % value)
    html  = u'<object type="application/x-shockwave-flash"'
    html += u'data="videoContainer.swf?'
    html += u'videoSource=%s&autoPlay=false" ' % value
    html += u'width="%d" height="%d">\n' %(width, height)
    html += u'<param name="movie"\n'
    html += u'value="videoContainer.swf?'
    html += u'videoSource=%s&autoPlay=false"/>\n' % value
    html += u'<param name="menu" value="flase" /></object>\n'
    return html


def submitButton(name, value, enabled=True):
    """Adds a submit button to a form"""
    html  = u'<input class="button" type="submit" name="%s" ' % name
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
    onclick = "submitLink('%s', '%s', %d);" % (action, object_, isChanged)
    titleText = u''
    if title:
        titleText = u'title="%s" ' % title
    html  = u'<a %s' % titleText
    html += u' href="#" onclick="%s">' % onclick
    html += u'<img alt="Submit" src="%s"/>' % imageFile
    html += u'</a>\n' 
    return html


def confirmThenSubmitImage(message, action, object_, imageFile, 
                           title=u"", isChanged=1):
    """
    Adds an image link which will trigger the javascript needed to
    post a form with the action and object passed in the args
    """
    html  = u"<a "
    if title:
        html += u"title=\""+title+"\" "
    html += " href=\"#\" "
    html += "onclick=\"confirmThenSubmitLink('"+message+"', '"+action+"', "
    html += "'"+object_+"', "+unicode(isChanged)+");\" >"
    html += u'<img alt="Confirm and submit" src="%s"/>' % imageFile
    html += u'</a>\n' 
    return html


def option(name, checked, value):
    """Add a option input"""
    chkStr = u''
    if checked:
        chkStr = u'checked="checked"'
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
                   label=None):
    """add a help instruction for a element"""
    if label is None:
        label = _(u"Instructions")
    if not instruc.strip():
        html = u''
    else:
        html  = u'<a onmousedown="Javascript:updateCoords(event);" '
        html += u' title="%s" ' % _(u'Instructions for completion')
        html += u'onclick="Javascript:showMe(\'i%s\', 350, 100);" ' % instrucId
        html += u'href="Javascript:void(0)" style="cursor:help;"> ' 
        html += u'<img alt="%s" ' % _(u'Instructions for completion')
        html += u'src="/images/%s" style="vertical-align:middle;"/>' % imageFile
        html += u'</a>\n'
        html += u'<div id="i%s" style="display:none;">' % instrucId
        html += u'<div style="float:right;" >'
        html += u'<img alt="%s" ' % _("Close")
        html += u'src="/images/stock-stop.png" title="%s" ' % _("Close")
        html += u' onmousedown="Javascript:hideMe();"/></div>'
        html += u'<div class="popupDivLabel">%s</div>%s' % (label, instruc)
        html += u'</div>\n'
    return html


def select(action, options, object_="", selection=None):
    """Adds a dropdown selection to a form"""
    html  = u'<select '
    html += u'name="'+action+object_+'" '

    if action and object_:
        # If the user gives an object_ create an onchange handler
        html += u'onchange="submitLink(\''+action+'\', \''+object_+'\');"'

    html += u'>\n'

    for option, value in options:
        html += u' <option value="'+unicode(value)+'" '
        if value == selection:
            html += u'selected="selected" '
        html += u'>'
        html += option
        html += u'</option>\n'
    html += u'</select>\n'

    return html

