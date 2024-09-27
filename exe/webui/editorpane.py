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
from exe.engine.field          import FeedbackField, MultimediaField, AttachmentField
from exe.webui.editorelement   import TextEditorElement
from exe.webui.editorelement   import TextAreaEditorElement
from exe.webui.editorelement   import ImageEditorElement
from exe.webui.editorelement   import FeedbackEditorElement
from exe.webui.editorelement   import FlashEditorElement
from exe.webui.editorelement   import MultimediaEditorElement
from exe.webui.editorelement   import AttachmentEditorElement
from exe.engine.idevice        import Idevice
from exe.engine.genericidevice import GenericIdevice
from exe.engine.path           import Path
from exe.engine.translate      import lateTranslate
from exe                     import globals as G


log = logging.getLogger(__name__)


# ===========================================================================
class EditorPane(object):
    """
    The EditorPane is responsible for creating new idevice
    """
    def __init__(self, webServer, parent):
        """
        Initialize
        JR: anado parente para poder acceder a algunos atributos de editorpag, en concreto a showHide
        """
        self.ideviceStore     = webServer.application.ideviceStore
        self.webDir           = webServer.application.config.webDir
        self.styles           = webServer.application.config.styleStore.getStyles()
        self.elements         = []
        self.idevice          = GenericIdevice("", "", "", "", "")
        self.idevice.id       = self.ideviceStore.getNewIdeviceId()
        self.originalIdevice  = GenericIdevice("", "", "", "", "")
        self.purpose          = ""
        self.tip              = ""
        self.message          = ""
        self.parent           = parent
        self._nameInstruc     = \
           x_("Your new iDevice will appear in the iDevice "
              "pane with this title. This is a compulsory field "
              "and you will be prompted to enter a label if you try "
              "to submit your iDevice without one.")
        self._authorInstruc   = x_("This is an optional field.")
        self._purposeInstruc  = x_("The purpose dialogue allows you to describe"
                                 " your intended purpose of the iDevice to other"
                                 " potential users.")
        self._emphasisInstruc = x_("Use this pulldown to select whether or not "
                                 " the iDevice should have any formatting "
                                 " applied to it to distinguish "
                                 "it; ie. a border and an icon.")
        self._tipInstruc      = x_("Use this field to describe "
                                 "your intended use and the pedagogy behind "
                                 "the device's development. This can be useful "
                                 "if your iDevice is to be exported for others "
                                 "to use.")
        self._lineInstruc     = x_("Add a single text line to an iDevice. "
                                 "Useful if you want the ability to place a "
                                 "label within the iDevice.")
        self._textBoxInstruc  = x_("Add a text entry box to an iDevice. "
                                 "Used for entering larger amounts of textual "
                                 "content.")
        self._feedbackInstruc = x_("Add an interactive feedback field to your iDevice.")
        self._flashInstruc    = x_("Add a flash video to your iDevice.")
        self._mp3Instruc      = x_("Add an mp3 file to your iDevice.")
        self._attachInstruc   = x_("Add an attachment file to your iDevice.")

        self.style            = self.styles[0]
   
    # Properties
    
    nameInstruc     = lateTranslate('nameInstruc')    
    authorInstruc   = lateTranslate('authorInstruc')
    purposeInstruc  = lateTranslate('purposeInstruc')
    emphasisInstruc = lateTranslate('emphasisInstruc')
    tipInstruc      = lateTranslate('tipInstruc')
    lineInstruc     = lateTranslate('lineInstruc')
    textBoxInstruc  = lateTranslate('textBoxInstruc')
    feedbackInstruc = lateTranslate('feedbackInstruc')
    flashInstruc    = lateTranslate('flashInstruc')
    mp3Instruc      = lateTranslate('mp3Instruc')
    attachInstruc   = lateTranslate('attachInstruc')
    
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
                self.idevice.title = str(request.args["title"][0], 'utf8')
    
    
            if "tip" in request.args:
                self.idevice.tip = str(request.args["tip"][0], 'utf8')
                
            if "emphasis" in request.args:
                self.idevice.emphasis = int(request.args["emphasis"][0])
                if self.idevice.emphasis == 0:
                    self.idevice.icon = ""
        
        
        if "addText" in request.args:
            field = TextField(_("Enter the label here"),
                 _("Enter instructions for completion here"))
            field.setIDevice(self.idevice)
            self.idevice.addField(field)
            self.idevice.edit = True
        
        if "addTextArea" in request.args:
            field = TextAreaField(_("Enter the label here"), 
                 _("Enter the instructions for completion here"))
            field.setIDevice(self.idevice)
            self.idevice.addField(field)
            self.idevice.edit = True
            
            
        if "addFeedback" in request.args:
            field = FeedbackField(_("Enter the label here"), 
                 _("""Feedback button will not appear if no 
data is entered into this field."""))
            field.setIDevice(self.idevice)
            self.idevice.addField(field)
            self.idevice.edit = True
            
        #if "addFlash" in request.args:
            #print "add a flash"
            #field = FlashField(_(u"Enter the label here"), 
                 #_(u"Enter the instructions for completion here"))
            #field.setIDevice(self.idevice)
            #self.idevice.addField(field)
            
        if "addMP3" in request.args:

            field = MultimediaField(_("Enter the label here"), 
                 _("Enter the instructions for completion here"))
            field.setIDevice(self.idevice)
            self.idevice.addField(field)
            if not 'xspf_player.swf' in self.idevice.systemResources:
                self.idevice.systemResources += ['xspf_player.swf']
            self.idevice.edit = True
            
        if "addAttachment" in request.args:

            field = AttachmentField(_("Enter the label here"), 
                 _("Enter the instructions for completion here"))
            field.setIDevice(self.idevice)
            self.idevice.addField(field)
            self.idevice.edit = True
            
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
            self.parent.showHide = False
            
        if ("action" in request.args and 
            request.args["action"][0] == "changeStyle"):
            self.style = self.styles[int(request.args["object"][0])]
            
        self.__buildElements()  
            
        
    def __buildElements(self):
        """
        Building up element array
        """
        self.elements  = []
        elementTypeMap = {TextField:       TextEditorElement,
                          TextAreaField:   TextAreaEditorElement,
                          ImageField:      ImageEditorElement,
                          FeedbackField:   FeedbackEditorElement,
                          MultimediaField: MultimediaEditorElement,
                          FlashField:      FlashEditorElement,
                          AttachmentField: AttachmentEditorElement}
        
        for field in self.idevice.fields:
            elementType = elementTypeMap.get(field.__class__)

            if elementType:
                # Create an instance of the appropriate element class
                log.debug("createElement "+elementType.__class__.__name__+
                          " for "+field.__class__.__name__)
                self.elements.append(elementType(field))
            else:
                log.error("No element type registered for " +
                          field.__class__.__name__)
        
            
    def renderButtons(self, request):
        """
        Render the idevice being edited
        """
        html = "<font color=\"red\"><b>"+self.message+"</b></font>"
        
        html += "<fieldset><legend><b>" + _("Add Field")+ "</b></legend>"
        html += common.submitButton("addText", _("Text Line"))
        html += common.elementInstruc(self.lineInstruc) + "<br/>"
        html += common.submitButton("addTextArea", _("Text Box"))
        html += common.elementInstruc(self.textBoxInstruc) + "<br/>"
        html += common.submitButton("addFeedback", _("Feedback"))
        html += common.elementInstruc(self.feedbackInstruc) + "<br/>"
        #  Attachments are now embeddable:
        #html += common.submitButton("addAttachment", _("Attachment"))
        #html += common.elementInstruc(self.attachInstruc) + "<br/>"
        #  MP3 fields are now embeddable:
        #html += common.submitButton("addMP3", _("MP3"))
        #html += common.elementInstruc(self.mp3Instruc) + "<br/>"
        html += "</fieldset>\n"

        html += "<fieldset><legend><b>" + _("Actions") + "</b></legend>"

        if self.idevice.edit:
            html += common.submitButton("preview", _("Preview"), not self.parent.isGeneric)
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
            function selectStyleIcon(icon,e) {
                var div = document.getElementById("styleIcons");
                var imgs = div.getElementsByTagName("IMG");
                for (var i=0;i<imgs.length;i++) {
                    imgs[i].style.border = "1px solid #E8E8E8";
                }
                e.style.border = "1px solid #333333";            
                submitLink("selectIcon",icon,1);
            }        
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
   
            this_package = None
            html += common.formField('richTextArea', this_package,
                                     _("Pedagogical Tip"),'tip',
                                     '', self.tipInstruc, self.tip)
     
            html += "<b>" + _("Emphasis") + ":</b> "
            html += "<select onchange=\"submit();\" name=\"emphasis\">\n"

            emphasisValues = {Idevice.NoEmphasis:     _("No emphasis"),
                              Idevice.SomeEmphasis:   _("Some emphasis")}
            for value, description in list(emphasisValues.items()):
                html += "<option value=\""+str(value)+"\" "
                if self.idevice.emphasis == value:
                    html += "selected "
                html += ">" + description + "</option>\n"

            html += "</select> \n"
            html += common.elementInstruc(self.emphasisInstruc)
            html += "<br/><br/>\n"
            
            if self.idevice.emphasis > 0:
                html += self.__renderStyles() + " "
                html += '<a style="margin-right:.5em" href="javascript:void(0)" '
                html += 'onclick="showMessageBox(\'iconpanel\');">'
                html += '%s</a>' % _('Select an icon')
                icon = self.idevice.icon
                if icon != "":
                
                    iconExists = False
                    myIcon = Path(G.application.config.stylesDir/self.style.get_dirname()/"icon_" + self.idevice.icon + ".gif")
                    if myIcon.exists():
                        iconExists = True
                    else:
                        myIcon = Path(G.application.config.stylesDir/self.style.get_dirname()/"icon_" + self.idevice.icon + ".png")
                        if myIcon.exists():
                            iconExists = True
                        else:
                            myIcon = Path(G.application.config.stylesDir/self.style.get_dirname()/"icon_" + self.idevice.icon + ".svg")
                            if myIcon.exists():
                                iconExists = True
                    if iconExists:
                        html += '<img style="vertical-align:middle;max-width:60px;height:auto" '
                        html += 'src="/style/%s/icon_%s' % (self.style.get_dirname(), icon)
                        html += '%s"/><br />' % myIcon.ext
                        
                html += '<div style="display:none;z-index:99;">'
                html += '<div id="iconpaneltitle">'+_("Icons")+'</div>'
                html += '<div id="iconpanelcontent">'
                html += self.__renderIcons()
                html += '</div>'
                html += '</div>\n'
                html += '<br style="clear:both;margin-bottom:10px" />'
            for element in self.elements:
                html += element.renderEdit()       
        else:
            html += "<b>" + self.idevice.title + "</b><br/><br/>"
            for element in self.elements:
                html += element.renderPreview()               
            if self.idevice.purpose != "" or self.idevice.tip != "":
                html += "<a title=\""+_("Pedagogical Help")+"\" "
                html += "onclick=\"showMessageBox('phelp');\" " 
                html += "href=\"javascript:void(0)\" style=\"cursor:help;\">\n " 
                html += '<img alt="%s" src="/images/info.png" border="0" ' % _('Info')
                html += "align=\"middle\" /></a>\n"
                html += "<div style='display:none;'>"
                if self.idevice.purpose != "":
                    html += "<div id='phelptitle'>"+_('Purpose')+"</div>"
                    html += "<div id='phelpcontent'>"+self.purpose+"</div>"
                if self.idevice.tip != "":
                    html += "<div id='phelptitle'>"+_('Tip:')+"</div>"
                    html += "<div id='phelpcontent'>"+self.idevice.tip+"</div>"
                html += "</div>"  
                html += "</div>\n"
        html += "</div>\n"
        self.message = ""

        return html
    
    def __renderStyles(self):
        """
        Return xhtml string for rendering styles select
        """
        html  = '<select onchange="submitStyle();" style="display:none" name="styleSelect" id="styleSelect">\n'
        idx = 0
        isSelected = False
        for style in self.styles:
            html += "<option value='%d' " % idx
            if self.style.get_name() == style.get_name():
                html += "selected "
                isSelected = True
            html += ">" + style.get_name() + "~" + str(style.get_dirname()) + "</option>\n"
            idx = idx + 1
        html += "</select> \n"
        # Auto-select the current style
        # This should be done with Python, not JavaScript
        # It's just a provisional solution so the user does not have to choose the right Style
        html += "<script type='text/javascript'>\
            function autoSelectStyle(){\
                var autoSelectStyle = document.getElementById('styleSelect');\
                if (autoSelectStyle.options[autoSelectStyle.value].innerHTML.split('~')[1]==top.exe_style_dirname) return false;\
                var currentStyleFolder;\
                for (var i=0; i<autoSelectStyle.options.length; i++) {\
                    currentStyleFolder = autoSelectStyle.options[i].innerHTML.split('~')[1];\
                    if (top.exe_style_dirname==currentStyleFolder) {\
                        autoSelectStyle.value=i;\
                        submitStyle();\
                    }\
                }\
            }\
            if (typeof(top.exe_style_dirname)!='undefined') {\
                autoSelectStyle();\
            }\
            \
        </script>";
        
        return html
    
    def __renderIcons(self):
        """
        Return xhtml string for dispay all icons
        """
        iconpath  = self.style.get_style_dir()
        iconfiles = iconpath.files("icon_*")
        html = '<div id="styleIcons"><div style="height:300px;overflow:auto">'
        
        for iconfile in iconfiles:
            iconname = iconfile.namebase
            icon     = iconname.split("_", 1)[1]
            
            iconExists = False
            iconExtension = "gif"
            myIcon = Path(G.application.config.stylesDir/self.style.get_dirname()/iconname + ".gif")
            if myIcon.exists():
                iconExists = True
            else:
                myIcon = Path(G.application.config.stylesDir/self.style.get_dirname()/iconname + ".png")
                if myIcon.exists():
                    iconExists = True 
                    iconExtension = "png"
                else:
                    myIcon = Path(G.application.config.stylesDir/self.style.get_dirname()/iconname + ".svg")
                    if myIcon.exists():
                        iconExists = True 
                        iconExtension = "svg"               
            
            if iconExists:
                filename = "/style/%s/%s.%s" % (self.style.get_dirname(), iconname, iconExtension)
                html += '<div style="float:left; text-align:center; width:105px;\n'
                html += 'margin-right:10px; margin-bottom:15px" > '
                html += '<img src="%s" \n' % filename
                # html += u' alt="%s" ' % _("Submit")
                # window[1] because we use Ext.MessageBox instead of libot_drag.js
                html += "style=\"border:1px solid #E8E8E8;padding:5px;cursor:pointer;max-width:60px;max-height:60px;height:auto\" onclick=\"window[1].selectStyleIcon('%s',this)\" title=\"%s.%s\">\n" % (icon, icon, iconExtension)
                # html += u"style=\"cursor:pointer\" onclick=\"window[1].submitLink('selectIcon','%s',1)\">\n" % icon
                html += '<br /><span style="display:inline-block;width:100px;overflow:hidden;text-overflow:ellipsis">%s.%s</span></div>\n' % (icon, iconExtension)
        
        html += '</div></div>'
        
        return html
# ===========================================================================
