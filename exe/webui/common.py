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
    html  = "<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>\n"
    html += "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" "
    html += " \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n"
    return html


def header(style='default'):
    """Generates the common header XHTML"""
    # NB: Authoring Page has its own header
    html  = docType()
    html += "<html xmlns=\"http://www.w3.org/1999/xhtml\">\n"
    html += "<head>\n"
    html += "<style type=\"text/css\">\n"
    html += "@import url(/css/exe.css);\n"
    html += "@import url(/style/"+style+"/content.css);</style>\n"
    html += '<script language="JavaScript" src="/scripts/common.js"></script>\n'
    html += '<script language="JavaScript" src="/scripts/fckeditor.js">'
    html += '</script>\n'
    html += '<script language="JavaScript" src="/scripts/libot_drag.js">'
    html += '</script>\n'
    html += "<title>"+_("eXe : elearning XHTML editor")+"</title>\n"
    html += "<meta http-equiv=\"content-type\" content=\"text/html; "
    html += " charset=UTF-8\"></meta>\n";
    html += "</head>\n"
    return html


def banner(request): 
    """Generates the common page banner XHTML"""
    html  = "<body>\n"
    html += "<form method=\"post\" action=\""+request.path+"\""
    html += " id=\"contentForm\" name=\"contentForm\""
    html += " onload=\"clearHidden();\">\n"
    html += hiddenField("action")
    html += hiddenField("object")
    html += hiddenField("isChanged", "0")
    return html


def footer():
    """Generates the common page footer XHTML"""
    html  = "</form></body></html>\n"
    return html

    
def hiddenField(name, value=""):
    """Adds a hidden field to a form"""
    html  = "<input type=\"hidden\" name=\"%s\" " % name
    html += "value=\"%s\" />\n" % value
    return html


def textInput(name, value="", size=40, disabled=""):
    """Adds a text input to a form"""
    html  = "<input type=\"text\" name=\"%s\" id=\"%s\" " % (name, name)
    html += "value=\"%s\"" % value
    html += " size=\"%s\" %s />\n" % (size, disabled)
    return html


def textArea(name, value="", disabled=""):
    """Adds a text area to a form"""
    log.debug("textArea "+value)
    html  = "<textarea name=\"%s\" " % name
    html += "cols=\"52\" rows=\"8\" %s>%s" % (disabled, value)
    html += "</textarea><br/>"
    return html


def richTextArea(name, value="", width="100%", height=100):
    """Adds a FCKEditor to a form"""
    log.debug("richTextArea "+value+", height="+str(height))
    html  = "<script type=\"text/javascript\">\n"
    html += "<!--\n"
    html += "    var editor = new FCKeditor('"+name+"', '"
    html += str(width)+"', '"+str(height)+"', 'Armadillo', '"+value+"');\n"
    html += "    editor.BasePath = '/scripts/';\n"
    html += "    editor.Config['CustomConfigurationsPath'] ="
    html += " '/scripts/armadillo.js';\n"
    html += "    editor.Create();\n"
    html += "//-->\n"
    html += "</script>\n"
    return html
        

def submitButton(name, value, enabled=True):
    """Adds a submit button to a form"""
    html  = "<input type=\"submit\" name=\"%s\" " % name
    html += "value=\"%s\" " % value
    if not enabled:
        html += " disabled"
    html += "/>\n"
    return html


def submitImage(action, object_, imageFile, title="", isChanged=1):
    """
    Adds an image link which will trigger the javascript needed to
    post a form with the action and object passed in the args
    """
    html  = "<a "
    if title != "":
        html += "title=\""+title+"\" "
    html += " href=\"#\" onclick=\"submitLink('" + action
    html += "', '" + object_ + "', %d);\" >" % isChanged
    html += image(imageFile)
    html += "</a>\n" 
    return html


def image(imageFile):
    """returns the XHTML for an image"""
    html  = "<img src=\"/images/"+imageFile+"\" "
    html += " align=\"middle\" border=\"0\" />"
    return html


def select(action, object_, options, selection=None):
    """Adds a dropdown selection to a form"""
    html  = "<select onchange=\"submitLink('" + action
    html += "', '" + object_ + "');\" "
    html += "name=\""+action+object_+"\" >"

    for option, value in options:
        if selection == option:
            selected = "selected"
        else:
            selected = ""

        html += " <option value=\""+value+"\""+selected+">"
        html += option
        html += "</option>\n"

    html += "</select>\n"
    return html


def option(name, checked, value):
    """Add a option input"""
    chkStr = ""
    if checked:
        chkStr = "checked"
        
    html  = '<input type = "radio" name = "'+name+'"'
    html += ' value="'+value+'" '
    html += chkStr+' />\n'
    return html


def elementInstruc(instrucId, instruc):
    """add a help instruction for a element"""
    if instruc == "":
        html = ""
    else:
        html  = "<a onmousedown=\"Javascript:updateCoords(event);\" "
        html += " title=\"" + _("Instructions for completion") + "\" "
        html += "onclick=\"Javascript:showMe('i%s', 350, 100);\" " % instrucId
        html += "href=\"Javascript:void(0)\" style=\"cursor:help;\"> " 
        html += "<img src=\"/images/help.gif\" border=\"0\" align=\"middle\"/>"
        html += "</a>\n"
        html += "<div id=\"i%s\" style=\"display:none; z-index:99;\">" % \
                instrucId
        html += "<div style=\"float:right;\" >"
        html += "<img src=\"/images/stock-stop.png\" title=\""+_("Close")+"\" "
        html += " onmousedown=\"Javascript:hideMe();\"/></div>"
        html += "<b>Instructions:</b><br/>%s<br/>" % instruc                
        html += "</div>\n"
    
    return html
    
    
# ===========================================================================

if __name__ == "__main__":
    class MyRequest:
        def __init__(self):
            self.path = ""
    print header()
    print banner(MyRequest())
    print textInput("text")
    print textArea("area")
    print submitButton("ok", "OK")
    print footer()
