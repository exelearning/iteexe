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
This module is for the common HTML used in all webpages.
"""

import logging
from nevow      import tags as T
from nevow.flat import flatten

lastId = 0

def newId():
    """
    Generates a sequential id unique for this exe session. 
    """
    global lastId
    lastId += 1
    return 'id%d' % lastId

    
log = logging.getLogger(__name__)

def docType():
    """Generates the documentation type string"""
    return (u'<?xml version="1.0" encoding="UTF-8"?>\n'
            u'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 '
            u'Transitional//EN" '
            u'"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n')


def header(style=u'default'):
    """Generates the common header XHTML"""
    # NB: Authoring Page has its own header
    return (docType() + 
            u'<html xmlns="http://www.w3.org/1999/xhtml">\n'
            u'<head>\n'
            u'<style type="text/css">\n'
            u'  @import url(/css/exe.css);\n'
            u'  @import url(/style/base.css);\n'
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


def textInput(name, value=u"", size=40, disabled=u"", **kwargs):
    """Adds a text input to a form"""
    html  = u"<input type=\"text\" "
    html += u"name=\"%s\" " % name
    html += u"id=\"%s\" " % name
    html += u"value=\"%s\" " % value
    html += u"size=\"%s\" " % size
    for key, val in kwargs.items():
        html += u' %s="%s"' % (key.replace('_', ''), val.replace('"', '\\"'))
    html += disabled+u" />\n"
    return html


def textArea(name, value="", disabled="", cols="80", rows="8"):
    """Adds a text area to a form"""
    log.debug(u"textArea %s" % value)
    html  = u'<textarea name="%s" ' % name
    html += 'id = "%s"' % name
    if disabled:
        html += u'disabled="disabled" '
    html += u'style=\"width:100%"'
    html += u'cols="%s" rows="%s">' %(cols, rows)
    html += value
    html += u'</textarea><br/>'
    return html


def richTextArea(name, value="", width="100%", height=100):
    """Adds a editor to a form"""
    log.debug(u"richTextArea %s, height=%s" % (value, height))
    html  = u'<textarea name="%s" ' % name
    html += u'style=\"width:' + width + '; height:' + str(height) + 'px;" '
    html += u'class="mceEditor" '
    html += u'cols="52" rows="8">'
    html += value
    html += u'</textarea><br/>'
    return html


def image(name, value, width="", height="", alt=None):
    """Returns the XHTML for an image"""
    if alt is None:
        alt = name
    log.debug(u"image %s" % value)
    html  = u"<img id=\"%s\" " % name
    html += u'alt="%s" ' % alt
    if width:
        html += u"width=\"%s\" " % width
    if height:
        html += u"height=\"%s\" " % height
    html += u"src=\"%s\" " % value
    html += u"/>\n"
    return html

def flash(src, width, height, id_=None, params=None, **kwparams):
    """Returns the XHTML for flash.
    'params' is a dictionary of name, value pairs that will be turned into a
    bunch of <param> tags"""
    log.debug(u"flash %s" % src)
    stan = \
        T._object(type='application/x-shockwave-flash',
                 width=width,
                 height=height,
                 **kwparams)
    if id_:
        stan.attributes['id'] = id_
    stan.attributes['data'] = src
    if params is None:
        params = {}
    params.setdefault('movie', src)
    for name, value in params.items():
        stan = stan[T.param(name=name, value=value)]
    return unicode(flatten(stan).replace('&amp;', '&'), 'utf8')

def flashMovie(movie, width, height, resourcesDir='', autoplay='false'):
    """Returns the XHTML for a flash movie"""
    log.debug(u"flash %s" % movie)
    src = resourcesDir + 'flowPlayer.swf'
    params={'movie': src,
            'allowScriptAccess' :'sameDomain', 
            'quality' :'high', 
            'scale':'noScale',
            'wmode':'transparent',
            'allowNetworking':'all',
            'flashvars' : 'config={ '
                'autoPlay: %(autoplay)s, '
                'loop: false, '
                'initialScale: \'scale\', ' 
                'showLoopButton: false, '
                'showPlayListButtons: false, '
                'playList: [ { url: \'%(movie)s\' }, ]'
            '}' % {'movie': movie, 'autoplay': autoplay}
            }
    return flash(src, width, height, id="flowPlayer", params=params)


def submitButton(name, value, enabled=True, **kwargs):
    """Adds a submit button to a form"""
    html  = u'<input class="button" type="submit" name="%s" ' % name
    html += u'value="%s" ' % value
    if not enabled:
        html += u' disabled'
    for key, val in kwargs.items():
        html += u' %s="%s"' % (key.replace('_', ''), val.replace('"', '\\"'))
    html += u'/>\n'
    return html


def button(name, value, enabled=True, **kwargs):
    """Adds a NON-submit button to a form"""
    html  = u'<input type="button" name="%s"' % name
    html += u' value="%s"' % value
    if not enabled:
        html += u' disabled'
    for key, val in kwargs.items():
        html += u' %s="%s"' % (key.replace('_', ''), val.replace('"', '\\"'))
    html += u'/>\n'
    return html

def feedbackButton(name, value=None, enabled=True, **kwparams):
    """Adds a feedback button"""
    if value is None:
        value = _(u'Feedback')
    kwparams.setdefault('class', 'feedbackbutton')
    return button(name, value, enabled, **kwparams)


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
    html += u'<img alt="%s" class="submit" src="%s"/>' % (_('Submit'), imageFile)
    html += u'</a>\n' 
    return html

def insertSymbol(name, image, title, string, text ='', num=0):
    """
    Adds an image link which will trigger the javascript needed to
    post a form with the action and object passed in the args
    """
    onclick = "insertSymbol('%s', '%s', %d);" % (name, string, num)
    html = u'<a onclick="%s" ' % onclick
    html += u'title="%s">' % title
    html += text
    if image <> "":
        html += u'<img alt="%s" src="%s"/>' % ('symbol', image)
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
    html += u'<img alt="%s" src="%s"/>' % (_('Confirm and submit'), imageFile)
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


def checkbox(name, checked, value="", title="", instruction=""):
    """Add a checkbox"""
    chkStr = u''
    if checked:
        chkStr = u'checked'
    html = ''
    if title:
        html += u'<b>%s</b>' % title
    html += (u'<input type="checkbox" name="%s"'
             u' value="%s" %s/>\n' % 
              (name, value, chkStr))
    if instruction:
        html += elementInstruc(instruction)
    return html


def elementInstruc(instruc, imageFile="help.gif", label=None):
    """Add a help instruction for a element"""
    if label is None:
        label = _(u"Instructions")
    if not instruc.strip():
        html = u''
    else:
        id_ = newId()
        html  = u'<a onmousedown="Javascript:updateCoords(event);" '
        html += u' title="%s" ' % _(u'Click for completion instructions')
        html += u'onclick="Javascript:showMe(\'i%s\', 350, 100);" ' % id_
        html += u'href="Javascript:void(0)" style="cursor:help;"> ' 
        html += u'<img alt="%s" ' % _(u'Click for completion instructions')
        html += u'src="/images/%s" style="vertical-align:middle;"/>' % imageFile
        html += u'</a>\n'
        html += u'<div id="i%s" style="display:none;">' % id_
        html += u'<div style="float:right;" >'
        html += u'<img alt="%s" ' % _("Close")
        html += u'src="/images/stock-stop.png" title="%s" ' % _("Close")
        html += u' onmousedown="Javascript:hideMe();"/></div>'
        html += u'<div class="popupDivLabel">%s</div>%s' % (label, instruc)
        html += u'</div>\n'
    return html

def formField(type_, caption, action, object_='', instruction='', *args, **kwargs):
    """
    A standard way for showing any form field nicely
    """
    html  = '<div class="block">'
    html += '<strong>%s</strong>' % caption
    if instruction:
        html += elementInstruc(instruction)
    html += '</div>'
    html += '<div class="block">'
    if type_ == 'select':
        html += select(action, object_, *args, **kwargs)
    elif type_ == 'richTextArea':
        html += richTextArea(action+object_, *args, **kwargs)
    elif type_ == 'textArea':
        html += textArea(action+object_, *args, **kwargs)
    elif type_ == 'textInput':
        html += textInput(action+object_, *args, **kwargs)
    elif type_ == 'checkbox':
        html += checkbox(*args, **kwargs)
    html += '</div>'
    return html

def select(action, object_='', options=[], selection=None):
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

def editModeHeading(text):
    """
    Provides a styled editSectionHeading
    """
    return u'<p style="editModeHeading">%s</p>' % text
