# ===========================================================================
# eXe
# Copyright 2004-2006, University of Auckland
# Copyright 2004-2007 eXe Project, http://eXeLearning.org/
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


def richTextArea(name, value="", width="100%", height=100, package=None):
    """Adds a editor to a form"""
    log.debug(u"richTextArea %s, height=%s" % (value, height))
    # to counter TinyMCE's ampersand-processing:
    safe_value = value.replace('&','&amp;')
    if safe_value != value:
        value = safe_value
        log.debug(u"richTextArea pre-processed value to: %s" % value)
    html  = u'<textarea name="%s" ' % name
    html += u'style=\"width:' + width + '; height:' + str(height) + 'px;" '
    html += u'class="mceEditor" '
    html += u'cols="52" rows="8">'
    ########
    # add exe_tmp_anchor tags 
    # for ALL anchors available in the entire doc!
    # (otherwise TinyMCE will only see those anchors within this field)
    if package is not None and hasattr(package, 'anchor_fields') \
    and package.anchor_fields is not None:
        log.debug(u"richTextArea adding exe_tmp_anchor tags for user anchors.")
        for anchor_field in package.anchor_fields: 
            anchor_field_path = anchor_field.GetFullNodePath()
            for anchor_name in anchor_field.anchor_names:
                full_anchor_name = anchor_field_path + "#" + anchor_name
                html += u'<exe_tmp_anchor title="%s" name="%s"></exe_tmp_anchor>'\
                    % (full_anchor_name, full_anchor_name)
    # and below the user-defined anchors, also show "auto_top" anchors for ALL:
    if package is not None and package.root is not None:
        log.debug(u"richTextArea adding exe_tmp_anchor auto_top for ALL nodes.")
        node_anchors = True
        if node_anchors:
            root_node = package.root
            anchor_node_path = root_node.GetFullNodePath() + "#auto_top"
            html += u'<exe_tmp_anchor title="%s" name="%s"></exe_tmp_anchor>'\
                % (anchor_node_path, anchor_node_path)
            for this_node in root_node.walkDescendants():
                anchor_node_path = this_node.GetFullNodePath() + "#auto_top"
                html += u'<exe_tmp_anchor title="%s" name="%s"></exe_tmp_anchor>'\
                    % (anchor_node_path, anchor_node_path)
    # these exe_tmp_anchor tags will be removed when processed by
    # FieldWithResources' ProcessPreviewed()
    ########
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
    html += u'<img alt="%s" class="submit" src="%s"/>' % (title, imageFile)
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
    html += u'<img alt="%s" class="submit" src="%s"/>' % (title, imageFile)
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
        html += u'<img class="help" alt="%s" ' \
                % _(u'Click for completion instructions')
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

def formField(type_, package, caption, action, object_='', instruction='', \
        *args, **kwargs):
    """
    A standard way for showing any form field nicely
    package is only needed for richTextArea, to present all available internal anchors.
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
        html += richTextArea(action+object_, package=package, *args, **kwargs)
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
    return u'<p class="editModeHeading">%s</p>' % text



def removeInternalLinks(html, anchor_name=""):
    """
    take care of any internal links which are in the form of:
       href="exe-node:Home:Topic:etc#Anchor"
    For this non-Web  Export, go ahead and remove the link entirely,
    leaving only its text, since such links are not to be in the LMS.
    Used by:  SCORM, IMS, and Common Cartridge exports
    (note that the Text and iPod exports already remove any HTML tags)
    """
    # use lower-case for the exe-node, for TinyMCE copy/paste compatibility
    intlink_start = 'href="exe-node:'
    intlink_pre   = 'href="'
    last_end_pos = 0
    next_link_pos = html.find(intlink_start)
    while next_link_pos >= 0: 
        link_name_start_pos = next_link_pos + len(intlink_pre)
        link_name_end_pos = html.find('"', link_name_start_pos)
        if link_name_end_pos >= 0: 
            link_name = html[link_name_start_pos : link_name_end_pos] 
            href_link_name = html[next_link_pos : link_name_end_pos] 
            if anchor_name == "": 
                # if no specific one specified, then removing all of them:
                log.warn("Export removing internal link: " + link_name)
                # otherwise we don't yet know if this link should be removed

            # Okay, try backing up to find the beginning <a of the href:
            # =====> Ideally, eventually do the full tag processing here!
            openA_start_pos = html.rfind('<a ', last_end_pos, next_link_pos)
            openA_end_pos = -1
            if openA_start_pos >= 0: 
                openA_end_pos = html.find('>', openA_start_pos)
            closeA_start_pos = -1
            if openA_end_pos >= 0: 
                closeA_start_pos = html.find('</a>', openA_end_pos)
            closeA_end_pos = -1
            if closeA_start_pos >= 0: 
                closeA_end_pos = closeA_start_pos + len('</a>')

            # okay, hopefully have all the positions by now:
            full_link_name = ""
            link_text = ""
            if closeA_end_pos >= 0:
                full_link_name = html[openA_start_pos : closeA_end_pos]
                link_text = html[openA_end_pos+1 : closeA_start_pos]

            # try the easy way out here, and instead of backing up a few 
            # characters (but: what if other attributes such as popups?)
            # and trying to remove the entire <a href="...">..</a> tag pair,
            # just clear out the href="..." part, which should essentially
            # default to a no-op, eh?
            if full_link_name and link_text: 
                # finally, FOR SCORM EXPORT,
                # remove this particular node name:
                # and try removing the entire href="" bit of it,
                # still leaving the <a ...></a>

                # now this routine is also coded to allow the removal of
                # a single anchor.  If so, ensure that it IS the requested:
                if anchor_name == "" or anchor_name == link_name: 
                    html = html.replace(full_link_name, link_text, 1)

        # else the href quote is unclosed.  ignore, eh?
        last_end_pos = next_link_pos+1
        next_link_pos = html.find(intlink_start, last_end_pos)
            
    return html
       
def removeInternalLinkNodes(html):
    """
    take care of any internal links which are in the form of:
       href="exe-node:Home:Topic:etc#Anchor"
    For this SinglePage Export, go ahead and keep the #Anchor portion,
    but remove the 'exe-node:Home:Topic:etc' Node portion, 
    since it is all exported into the same file.
    """
    # use lower-case for the exe-node, for TinyMCE copy/paste compatibility
    intlink_start = 'href="exe-node:'
    intlink_pre   = 'href="'
    next_link_pos = html.find(intlink_start)
    while next_link_pos >= 0: 
        link_name_start_pos = next_link_pos + len(intlink_pre)
        link_name_end_pos = html.find('"', link_name_start_pos)
        if link_name_end_pos >= 0: 
            link_name = html[link_name_start_pos : link_name_end_pos] 
            log.debug("Export rendering internal link, without nodename: " 
                    + link_name)
            # assuming that any '#'s in the node name have been escaped,
            # the first '#' should be the actual anchor:
            node_name_end_pos = link_name.find('#')
            if node_name_end_pos < 0:
                # no hash found, => use the whole thing as the node name:
                node_name_end_pos = len(link_name) - 1
            link_node_name = link_name[0 : node_name_end_pos]
            if link_node_name: 
                # finally, FOR SINGLE-PAGE EXPORT,
                # remove this particular node name:
                old_node_name = intlink_pre + link_node_name
                no_node_name = intlink_pre
                html = html.replace(old_node_name, no_node_name, 1)
        # else the href quote is unclosed.  ignore, eh?
        next_link_pos = html.find(intlink_start, next_link_pos+1)
            
    return html
        


def findLinkedField(package, exe_node_path, anchor_name):
    """
    find the field which corresponds to the exe_node_name of the form:
       "exe-node:Home:Topic:etc" of the  href="exe-node:Home:Topic:etc#Anchor"
    rather than searching through the entire node-tree, shortcut straight
    to the package's list of anchor_fields
    """
    if hasattr(package, 'anchor_fields') and package.anchor_fields:
        for anchor_field in package.anchor_fields:
            if anchor_field.GetFullNodePath() == exe_node_path:
                if anchor_name:
                    # now ensure that this field has an anchor of this name:
                    if anchor_name in  anchor_field.anchor_names: 
                        # break out and return this matching field's node:
                        #return anchor_field.idevice.parentNode
                        return anchor_field
                else: 
                    # with no anchor_name, there is no way to further 
                    # determine if this is the correct field/node or not,
                    # so just break out and return the first matching one:
                    #return anchor_field.idevice.parentNode
                    return anchor_field

    return None


def findLinkedNode(package, exe_node_path, anchor_name, check_fields=True):
    """
    find the node which corresponds to the exe_node_name of the form:
       "exe-node:Home:Topic:etc" of the  href="exe-node:Home:Topic:etc#Anchor"
    just a wrapper around common.findLinkedField()
    """
    linked_node = None
    linked_field = None
    if check_fields: 
        linked_field = findLinkedField(package, exe_node_path, anchor_name)
    if linked_field and linked_field.idevice is not None:
        linked_node = linked_field.idevice.parentNode
    elif anchor_name == u"auto_top" and package is not None and package.root:
        # allow the node "auto_top" to be found, 
        # even if no anchors are explicitly specified.
        # IF this node has already been linked to:
        if hasattr(package, 'anchor_nodes') and package.anchor_nodes:
            for anchor_node in package.anchor_nodes:
                if anchor_node.GetFullNodePath() == exe_node_path:
                    return anchor_node
        # and for those which have not yet been linked to,
        # go ahead and do a complete and proper walkthru all package nodes:
        root_node = package.root
        this_node_path = root_node.GetFullNodePath()
        if this_node_path == exe_node_path:
            return root_node
        else:
            for this_node in root_node.walkDescendants():
                this_node_path = this_node.GetFullNodePath() 
                if this_node_path == exe_node_path:
                    return this_node

    return linked_node

def getAnchorNameFromLinkName(link_name):
    """
    little helper to pull out of the (possibly optional?) Anchor from 
       href="exe-node:Home:Topic:etc#Anchor"
    """ 
    anchor_name = ""
    anchor_pos = link_name.find('#') 
    if anchor_pos >= 0: 
        # hash found, => strip off the anchor:
        anchor_name = link_name[anchor_pos + 1 : ]
    return anchor_name
       
def renderInternalLinkNodeFilenames(package, html):
    """
    take care of any internal links which are in the form of:
       href="exe-node:Home:Topic:etc#Anchor"
    For this WebSite Export, go ahead and keep the #Anchor portion,
    but replace the 'exe-node:Home:Topic:etc' Node portion, 
    with the actual target's filename, now temporarily stored in the 
    Node's tmp_export_filename attribute, after being processed by
    the export's Page:uniquifyNames()
    """
    found_all_anchors = True
    # use lower-case for the exe-node, for TinyMCE copy/paste compatibility
    intlink_start = 'href="exe-node:'
    intlink_pre   = 'href="'
    next_link_pos = html.find(intlink_start)
    while next_link_pos >= 0: 
        link_name_start_pos = next_link_pos + len(intlink_pre)
        link_name_end_pos = html.find('"', link_name_start_pos)
        if link_name_end_pos >= 0: 
            link_name = html[link_name_start_pos : link_name_end_pos] 
            log.debug("Export rendering internal link: " + link_name)
            # assuming that any '#'s in the node name have been escaped,
            # the first '#' should be the actual anchor:
            node_name_end_pos = link_name.find('#')
            if node_name_end_pos < 0:
                # no hash found, => use the whole thing as the node name:
                node_name_end_pos = len(link_name) - 1
                link_anchor_name = ""
            else:
                link_anchor_name = link_name[node_name_end_pos+1 : ]
            link_node_name = link_name[0 : node_name_end_pos]

            found_node = None
            if link_node_name: 
                # Okay, FOR WEBSITE EXPORT, need to find the actual node
                # being referenced by this link, and its actual export filename:
                found_node = findLinkedNode(package, link_node_name,
                        link_anchor_name)
                if found_node and hasattr(found_node, 'tmp_export_filename'):
                    # Finally, replace this particular node name 
                    # with its actual export filename: 
                    old_node_name = intlink_pre + link_node_name 
                    new_node_name = intlink_pre + found_node.tmp_export_filename
                    if link_anchor_name:
                        old_node_name = old_node_name + "#" + link_anchor_name
                        new_node_name = new_node_name + "#" + link_anchor_name
                    html = html.replace(old_node_name, new_node_name, 1)

            if found_node is None:
                found_all_anchors = False
                log.warn('Export unable to find corresponding node&anchor; '
                        + 'unable to render link to: ' + link_name)

        # else the href quote is unclosed.  ignore, eh?
        next_link_pos = html.find(intlink_start, next_link_pos+1)

    if not found_all_anchors:
        # then go ahead and clear out any remaining invalid links:
        html = removeInternalLinks(html)
            
    return html
        

