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
The EditorPane is responsible for creating new idevice
"""

import logging
from exe.webui                 import common
from exe.engine.field          import TextField, TextAreaField, ImageField, FlashField
from exe.engine.field          import FeedbackField, MultimediaField
from exe.webui.editorelement   import TextEditorElement
from exe.webui.editorelement   import TextAreaEditorElement
from exe.webui.editorelement   import ImageEditorElement
from exe.webui.editorelement   import FeedbackEditorElement
from exe.webui.editorelement   import FlashEditorElement
from exe.webui.editorelement   import MultimediaEditorElement
from exe.engine.idevice        import Idevice
from exe.engine.genericidevice import GenericIdevice
from exe.engine.path           import Path
from exe.engine.translate      import lateTranslate


log = logging.getLogger(__name__)


# ===========================================================================
class EditorPane(object):
    """
    The EditorPane is responsible for creating new idevice
    """
    def __init__(self, webServer):
        """
        Initialize
        """
        self.ideviceStore     = webServer.application.ideviceStore
        self.webDir           = webServer.application.config.webDir
        self.styles           = webServer.application.config.styles
        self.elements         = []
        self.idevice          = GenericIdevice("", "", "", "", "")
        self.idevice.id       = self.ideviceStore.getNewIdeviceId()
        self.originalIdevice  = GenericIdevice("", "", "", "", "")
        self.purpose          = ""
        self.tip              = ""
        self.message          = ""
        self._nameInstruc     = \
           x_(u"Your new iDevice will appear in the iDevice "
              u"pane with this title. This is a compulsory field "
              u"and you will be prompted to enter a label if you try "
              u"to submit your idevice without one.")
        self._authorInstruc   = x_(u"This is an optional field.")
        self._purposeInstruc  = x_(u"The purpose dialogue allows you to describe"
                                 u" your intended purpose of the device to other"
                                 u" potential users.")
        self._emphasisInstruc = x_(u"Use Emphasis to distinguish the importance "
                                 u" of the information being presented in the "
                                 u"iDevice.")
        self._tipInstruc      = x_(u"A pedagogical tip allows you to describe "
                                 u"your intended use and the pedagogy behind "
                                 u"the device's development.")
        self._lineInstruc     = x_(u"Add a single text line to an iDevice. "
                                 u"Useful if you want the ability to place a "
                                 u"label within the device.")
        self._textBoxInstruc  = x_(u"Add a text entry box to an iDevice. "
                                 u"Used for entering description textual "
                                 u"content.")
        self._imageInstruc    = x_(u"Add an image to your iDevice. Enables "
                                 u"the selection of an image from your stored "
                                 u"picture files.")
        self._feedbackInstruc = x_(u"Add interactive feedback to your iDevice.")
        self._flashInstruc = x_(u"Add a flash video to your iDevice.")
        self._mp3Instruc = x_(u"Add a mp3 file to your iDevice.")

        self.style            = "default"
   
    # Properties
    
    nameInstruc     = lateTranslate('nameInstruc')    
    authorInstruc   = lateTranslate('authorInstruc')
    purposeInstruc  = lateTranslate('purposeInstruc')
    emphasisInstruc = lateTranslate('emphasisInstruc')
    tipInstruc      = lateTranslate('tipInstruc')
    lineInstruc     = lateTranslate('lineInstruc')
    textBoxInstruc  = lateTranslate('textBoxInstruc')
    imageInstruc    = lateTranslate('imageInstruc')
    feedbackInstruc = lateTranslate('feedbackInstruc')
    flashInstruc    = lateTranslate('flashInstruc')
    mp3Instruc      = lateTranslate('mp3Instruc')
    
    def setIdevice(self, idevice):
        """
        Sets the iDevice to edit
        """
        self.idevice         = idevice.clone()
        self.idevice.id      = idevice.id
        self.originalIdevice = idevice
        
    def process(self, request, status):
        """
        Process
        """
        
        log.debug("process " + repr(request.args))
        self.message = ""
        
        if status == "old":
            for element in self.elements:
                element.process(request)
                           
            if "title" in request.args:
                self.idevice.title = unicode(request.args["title"][0], 'utf8')
    
    
            if "tip" in request.args:
                self.idevice.tip = unicode(request.args["tip"][0], 'utf8')
                
            if "emphasis" in request.args:
                self.idevice.emphasis = int(request.args["emphasis"][0])
                if self.idevice.emphasis == 0:
                    self.idevice.icon = ""
        
        
        if "addText" in request.args:
            field = TextField(_(u"Enter the label here"),
                 _(u"Enter instructions for completion here"))
            field.setIDevice(self.idevice)
            self.idevice.addField(field)
        
        if "addTextArea" in request.args:
            field = TextAreaField(_(u"Enter the label here"), 
                 _(u"Enter the instructions for completion here"))
            field.setIDevice(self.idevice)
            self.idevice.addField(field)
           
                
        if "addImage" in request.args:
            field = ImageField(_(u"Enter the label here"),
                               _(u"Enter the instructions for completion here"))
            imagePath = self.webDir/"images"/ImageEditorElement.DefaultImage
            field.defaultImage = unicode(imagePath.abspath())
            field.setIDevice(self.idevice)
            self.idevice.addField(field)
            
            
        if "addFeedback" in request.args:
            field = FeedbackField(_(u"Enter the label here"), 
                 _(u"""Feedback button will not appear if no 
data is entered into this field."""))
            field.setIDevice(self.idevice)
            self.idevice.addField(field)
            
        #if "addFlash" in request.args:
            #print "add a flash"
            #field = FlashField(_(u"Enter the label here"), 
                 #_(u"Enter the instructions for completion here"))
            #field.setIDevice(self.idevice)
            #self.idevice.addField(field)
            
        if "addMP3" in request.args:

            field = MultimediaField(_(u"Enter the label here"), 
                 _(u"Enter the instructions for completion here"))
            field.setIDevice(self.idevice)
            self.idevice.addField(field)
            
        if ("action" in request.args and 
            request.args["action"][0] == "selectIcon"):
            self.idevice.icon = request.args["object"][0]

        if "preview" in request.args:
            if self.idevice.title == "":
                self.message = _("Please enter<br />an idevice name.")
            else:
                self.idevice.edit = False

        if "edit" in request.args:
            self.idevice.edit = True
            
        if "cancel" in request.args:
            ideviceId       = self.idevice.id
            self.idevice    = self.originalIdevice.clone()
            self.idevice.id = ideviceId 
            
        if ("action" in request.args and 
            request.args["action"][0] == "changeStyle"):
            self.style = request.args["object"][0]
            
        self.__buildElements()  
            
        
    def __buildElements(self):
        """
        Building up element array
        """
        self.elements  = []
        elementTypeMap = {TextField:      TextEditorElement,
                          TextAreaField:  TextAreaEditorElement,
                          ImageField:     ImageEditorElement,
                          FeedbackField:  FeedbackEditorElement,
                          MultimediaField: MultimediaEditorElement,
                          FlashField:     FlashEditorElement}
        
        for field in self.idevice.fields:
            elementType = elementTypeMap.get(field.__class__)

            if elementType:
                # Create an instance of the appropriate element class
                log.debug(u"createElement "+elementType.__class__.__name__+
                          u" for "+field.__class__.__name__)
                self.elements.append(elementType(field))
            else:
                log.error(u"No element type registered for " +
                          field.__class__.__name__)
        
            
    def renderButtons(self, request):
        """
        Render the idevice being edited
        """
        html = "<font color=\"red\"<b>"+self.message+"</b></font>"
        
        html += "<fieldset><legend><b>" + _("Add Field")+ "</b></legend>"
        html += common.submitButton("addText", _("Text Line"))
        html += common.elementInstruc(self.lineInstruc) + "<br/>"
        html += common.submitButton("addTextArea", _("Text Box"))
        html += common.elementInstruc(self.textBoxInstruc) + "<br/>"
        html += common.submitButton("addImage", _("Image"))  
        html += common.elementInstruc(self.imageInstruc) + "<br/>"
        html += common.submitButton("addFeedback", _("Feedback"))
        html += common.elementInstruc(self.feedbackInstruc) + "<br/>"
        #html += common.submitButton("addFlash", _("Flash"))
        #html += common.elementInstruc(self.flashInstruc) + "<br/>"
        html += common.submitButton("addMP3", _("MP3"))
        html += common.elementInstruc(self.mp3Instruc) + "<br/>"
        html += "</fieldset>\n"

        html += "<fieldset><legend><b>" + _("Actions") + "</b></legend>"

        if self.idevice.edit:
            html += common.submitButton("preview", _("Preview"))
        else:
            html += common.submitButton("edit", _("Edit"))

        html += "<br/>"
        html += common.submitButton("cancel", _("Cancel"))
        #html += "</fieldset>"

        return html


    def renderIdevice(self, request):
        """
        Returns an XHTML string for rendering the new idevice
        """
        html  = "<div id=\"editorWorkspace\">\n"
        html += "<script type=\"text/javascript\">\n"
        html += "<!--\n"
        html += """
            function submitLink(action, object, changed) 
            {
                var form = document.getElementById("contentForm")
            
                form.action.value = action;
                form.object.value = object;
                form.isChanged.value = changed;
                form.submit();
            }\n"""
        html += """
            function submitIdevice() 
            {
                var form = document.getElementById("contentForm")
                if (form.ideviceSelect.value == "newIdevice")
                    form.action.value = "newIdevice"
                else
                    form.action.value = "changeIdevice"
                form.object.value = form.ideviceSelect.value;
                form.isChanged.value = 1;
                form.submit();
            }\n"""
        html += """
            function submitStyle()
            {
                var form = document.getElementById("contentForm")
                form.action.value = "changeStyle";
                form.object.value = form.styleSelect.value;
                form.isChanged.value = 0;
                form.submit();
            }\n"""
        html += "//-->\n"
        html += "</script>\n"
        
        self.purpose = self.idevice.purpose.replace("\r", "")
        self.purpose = self.purpose.replace("\n","\\n")
        
        self.tip     = self.idevice.tip.replace("\r", "")
        self.tip     = self.tip.replace("\n","\\n")
        
        if self.idevice.edit:
            html += "<b>" + _("Name") + ": </b>\n"
            html += common.elementInstruc(self.nameInstruc) + "<br/>"
            html += '<input type="text" name= "title" id="title" value="%s"/>' % self.idevice.title
   
            html += common.formField('richTextArea', _(u"Pedagogical Tip"),'tip',
                                     '', self.tipInstruc, self.tip)
     
            html += "<b>" + _("Emphasis") + ":</b> "
            html += "<select onchange=\"submit();\" name=\"emphasis\">\n"

            emphasisValues = {Idevice.NoEmphasis:     _(u"No emphasis"),
                              Idevice.SomeEmphasis:   _(u"Some emphasis")}
            for value, description in emphasisValues.items():
                html += "<option value=\""+unicode(value)+"\" "
                if self.idevice.emphasis == value:
                    html += "selected "
                html += ">" + description + "</option>\n"

            html += "</select> \n"
            html += common.elementInstruc(self.emphasisInstruc)
            html += "<br/><br/>\n"
            
            if self.idevice.emphasis > 0:
                html += self.__renderStyles() + " "
                html += u'<a href="#" '
                html += u'onmousedown="Javascript:updateCoords(event);"\n'
                html += u'onclick="Javascript:showMe(\'iconpanel\', 350, 100);">'
                html += u'Select an icon:</a> \n'
                icon = self.idevice.icon
                if icon != "":
                    html += '<img align="middle" '
                    html += 'src="/style/%s/icon_%s' % (self.style, icon)
                    html += '.gif"/><br/>'
                html += u'<div id="iconpanel" style="display:none; z-index:99;">'
                html += u'<div style="float:right;" >\n'
                html += u'<img alt="%s" ' % _("Close")
                html += u'src="/images/stock-stop.png" title="%s"\n' % _("Close")
                html += u'onmousedown="Javascript:hideMe();"/></div><br/> \n'
                html += u'<div align="center"><b>%s:</b></div><br/>' % _("Icons")
                html += self.__renderIcons()
                html += u'</div><br/>\n'
            for element in self.elements:
                html += element.renderEdit()       
        else:
            html += "<b>" + self.idevice.title + "</b><br/><br/>"
            for element in self.elements:
                html += element.renderPreview()               
            if self.idevice.purpose != "" or self.idevice.tip != "":
                html += "<a title=\""+_("Pedagogical Help")+"\" "
                html += "onmousedown=\"Javascript:updateCoords(event);\" \n"
                html += "onclick=\"Javascript:showMe('phelp', 380, 240);\" \n" 
                html += "href=\"Javascript:void(0)\" style=\"cursor:help;\">\n " 
                html += '<img alt="%s" src="/images/info.png" border="0" \n' % _('Info')
                html += "align=\"middle\" /></a>\n"
                html += "<div id=\"phelp\" style=\"display:none;\">\n"
                html += "<div style=\"float:right;\" "
                html += '<img alt="%s" src="/images/stock-stop.png" \n' % _('Close')
                html += " title='"+_("Close")+"' border='0' align='middle' \n"
                html += "onmousedown=\"Javascript:hideMe();\"/></div>\n"
                if self.idevice.purpose != "":
                    html += "<b>Purpose:</b><br/>%s<br/>" % self.purpose
                    
                if self.idevice.tip != "":
                    html += "<b>Tip:</b><br/>%s<br/>" % self.idevice.tip
                    
                html += "</div>\n"  
        html += "</div>\n"
        self.message = ""

        return html
    
    def __renderStyles(self):
        """
        Return xhtml string for rendering styles select
        """
        html  = '<select onchange="submitStyle();" name="styleSelect">\n'
        for style in self.styles:
            html += "<option value=\""+style+"\" "
            if self.style == style:
                html += "selected "
            html += ">" + style + "</option>\n"
        html += "</select> \n"
        
        return html
    
    def __renderIcons(self):
        """
        Return xhtml string for dispay all icons
        """
        iconpath  = Path(self.webDir).joinpath("style", self.style)
        iconfiles = iconpath.files("icon_*")
        html = ""
        for iconfile in iconfiles:
            iconname = iconfile.namebase
            icon     = iconname.split("_", 1)[1]
            filename = "/style/%s/%s.gif" % (self.style, iconname)
            html += u'<div style="float:left; text-align:center; width:80px;\n'
            html += u'margin-right:10px; margin-bottom:10px" > '
            html += u'<img src="%s" \n' % filename
            html += u' alt="%s" ' % _("Submit")
            html += u"onclick=\"submitLink('selectIcon','%s',1)\">\n" % icon
            html += u'<br/>%s.gif</div>\n' % icon
        return html
# ===========================================================================
