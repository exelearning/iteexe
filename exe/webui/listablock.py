# ===========================================================================
# eXe 
# Copyright 2004-2006, University of Auckland
# Copyright 2004-2008 eXe Project, http://eXeLearning.org/
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
Renders a paragraph where the content creator can choose which words the student
must fill in.
"""

import logging
from exe.webui.block   import Block
from exe.webui         import common
from exe.webui.element import TextAreaElement,ElementWithResources
import random


log = logging.getLogger(__name__)

# ===========================================================================
class ListaElement(ElementWithResources):

    """
    iDevice para crear listas desplegables, basado en clozeidevice. Fran Macias junio 2012
    """

    # Properties

    @property
    def editorId(self):
        """
        Returns the id string for our midas editor
        """
        return 'editorArea%s' % self.id

    @property
    def editorJs(self):
        """
        Returns the js that gets the editor document
        """
        return "document.getElementById('%s').contentWindow.document" % \
            self.editorId

    @property
    def hiddenFieldJs(self):
        """
        Returns the js that gets the hiddenField document
        """
        return "document.getElementById('cloze%s')" % self.id

    # Public Methods

    def process(self, request):
        """
        Sets the encodedContent of our field
        """
        is_cancel = common.requestHasCancel(request)

        if is_cancel:
            self.field.idevice.edit = False
            # but double-check for first-edits, and ensure proper attributes:
            if not hasattr(self.field, 'content_w_resourcePaths'):
                self.field.content_w_resourcePaths = ""
                self.field.idevice.edit = True
            if not hasattr(self.field, 'content_wo_resourcePaths'):
                self.field.content_wo_resourcePaths = ""
                self.field.idevice.edit = True
            return

        if self.editorId in request.args:
            # process any new images and other resources courtesy of tinyMCE:

            self.field.content_w_resourcePaths = \
                self.field.ProcessPreviewed(request.args[self.editorId][0])
            # likewise determining the paths for exports, etc.:
            self.field.content_wo_resourcePaths = \
                  self.field.MassageContentForRenderView(\
                         self.field.content_w_resourcePaths)
            # and begin by choosing the content for preview mode, WITH paths:
            self.field.encodedContent = self.field.content_w_resourcePaths
            """
            self.field.showScore = \
                'showScore%s' % self.id in request.args
            """
            
            

    def renderEdit(self):
        """
        Enables the user to set up their passage of text
        """
        # to render, choose the content with the preview-able resource paths:
        self.field.encodedContent = self.field.content_w_resourcePaths

        this_package = None
        if self.field_idevice is not None \
        and self.field_idevice.parentNode is not None:
            this_package = self.field_idevice.parentNode.package

        html = [
            # Render the iframe box
            common.formField('richTextArea', this_package, _('Cloze Text'),'',
                             self.editorId, self.field.instruc,
                             self.field.encodedContent),
            # Render our toolbar
            u'<table style="width: 100%;">',
            u'<tbody>',
            u'<tr>',
            u'<td>',
            u'  <input type="button" value="%s" ' % _("Hide/Show Word")+
            ur"""onclick="tinyMCE.execInstanceCommand('mce_editor_1','Underline', false);"/>""",
            u'</td><td>',
                                
            u'</td>',
            u'</tr>',
            u'</tbody>',
            u'</table>',
            ]
        """
        common.checkbox('showScore%s' % self.id,
                            self.field.showScore,
                            title=_(u'Mostrar Puntuaci&oacute;n?'),
                            instruction=self.field.showScoreInstruc),
        """ 
        return '\n    '.join(html)

    def renderPreview(self, feedbackId=None, preview=True):
        """
        Just a front-end wrapper around renderView..
        """
        # set up the content for preview mode:
        preview = True
        return self.renderView(feedbackId, preview)
    
    
    
    def renderView(self, feedbackId=None, preview=False):
        
        # Shows the text with inputs for the missing parts
       

        if preview: 
            # to render, use the content with the preview-able resource paths:
            self.field.encodedContent = self.field.content_w_resourcePaths
        else:
            # to render, use the flattened content, withOUT resource paths: 
            self.field.encodedContent = self.field.content_wo_resourcePaths

        html = ['<div id="cloze%s">' % self.id]
         # Store our args in some hidden fields
        def storeValue(name):
            value = str(bool(getattr(self.field, name))).lower()
            return common.hiddenField('clozeFlag%s.%s' % (self.id, name), value)
        #html.append(storeValue('showScore'))
          
        if feedbackId:
            html.append(common.hiddenField('clozeVar%s.feedbackId' % self.id,
                                           'ta'+feedbackId))
        # Mix the parts together
        words = ""
        wordslista='<option selected="selected" > </option>'
        wordsarray=[]
        wordsarraylimpo=[] 
        def encrypt(word):
            #             Simple XOR encryptions
            
            result = ''
            key = 'X'
            for letter in word:
                result += unichr(ord(key) ^ ord(letter))
                key = letter
            # Encode for javascript
            output = ''
            for char in result:
                output += '%%u%04x' % ord(char[0])
            return output.encode('base64')
        # 
        for i, (text, missingWord) in enumerate(self.field.parts):
            if missingWord:
                wordsarray.append([missingWord])
        

        wordsarraylimpo= [wordsarray[i] for i in range(len(wordsarray)) if wordsarray[i] not in wordsarray[:i]]
        random.shuffle(wordsarraylimpo)
        for wdlista in wordsarraylimpo:
           wordslista +='<option value="%s">%s</option>' %(wdlista[0], wdlista[0])
          
        #
        for i, (text, missingWord) in enumerate(self.field.parts):
            if text:
                html.append(text)
            if missingWord:
                words += "'" + missingWord + "',"
                # The edit box for the user to type into
                inputHtml = [
                    '<select id="clozeBlank%s.%s">' % (self.id, i),                        
                     wordslista,
                    '</select>']
                html += inputHtml
                            
                # Hidden span with correct answer
                html += [
                    '<span style="display: none;" ',
                    'id="clozeAnswer%s.%s">%s</span>' % (
                    self.id, i, encrypt(missingWord))]

        # Score string
        html += ['<div class="block">\n']
        
       
        html += [common.button('submit%s' % self.id,
                    _(u"Submit"),
                    id='submit%s' % self.id,
                    onclick="clozeSubmit('%s')" % self.id),
                  common.button('submit%s' % self.id,
                    _(u"Submit"),
                    id='restart%s' % self.id,
                    style="display: none;",
                    onclick="clozeSubmit('%s')" % self.id),
                ]       
         
        html += ['<input type="hidden" name="clozeFlag%s.strictMarking" id="clozeFlag%s.strictMarking" value="false"/>' % (self.id,self.id)]
        html += ['<input type="hidden" name="clozeFlag%s.checkCaps" id="clozeFlag%s.checkCaps" value="false"/>' % (self.id,self.id)]
        html += ['<input type="hidden" name="clozeFlag%s.instantMarking" id="clozeFlag%s.instantMarking" value="false"/>' % (self.id,self.id)]
       
        html += ['<div id="clozeScore%s"></div>' % self.id]
        html += ['</div>\n']
        return '\n'.join(html) + '</div>'
    
    def renderText(self):
        #         Shows the text with gaps for text file export
      
        html = ""
        for text, missingWord in self.field.parts:
            if text:
                html += text
            if missingWord:
                for x in missingWord:
                    html += "_"
                    
        return html
    
    def renderAnswers(self):        
       
        #Shows the answers for text file export
       
        html = ""

        html += "<p>%s: </p><p>"  % _(u"Answsers")
        answers = ""
        for i, (text, missingWord) in enumerate(self.field.parts):
            if missingWord:
                answers += str(i+1) + '.' + missingWord + ' '
        if answers <> "":        
            html += answers +'</p>'
        else:
            html = ""
                
        return html
   

class ListaBlock(Block):
    """
    Renders a paragraph where the content creator can choose which words the
    student must fill in.
    """
    def __init__(self, parent, idevice):
        """
        Pre-create our field ids
        """
        Block.__init__(self, parent, idevice)

        # to compensate for the strange unpickling timing when objects are 
        # loaded from an elp, ensure that proper idevices are set:
        if idevice.instructionsForLearners.idevice is None: 
            idevice.instructionsForLearners.idevice = idevice
        if idevice.content.idevice is None: 
            idevice.content.idevice = idevice
        if idevice.feedback.idevice is None: 
            idevice.feedback.idevice = idevice

        self.instructionElement = \
            TextAreaElement(idevice.instructionsForLearners)
        self.clozeElement = ListaElement(idevice.content)
        self.feedbackElement = \
            TextAreaElement(idevice.feedback)
        self.previewing        = False # In view or preview render
        if not hasattr(self.idevice,'undo'): 
            self.idevice.undo = True

    def process(self, request):
        """
        Handles changes in the paragraph text from editing
        """
        is_cancel = common.requestHasCancel(request)

        if "title"+self.id in request.args \
        and not is_cancel:
            self.idevice.title = request.args["title"+self.id][0]
        object = request.args.get('object', [''])[0]
        action = request.args.get('action', [''])[0]
        self.instructionElement.process(request)
        self.clozeElement.process(request)
        self.feedbackElement.process(request)
        Block.process(self, request)

    def renderEdit(self, style):
        """
        Renders a screen that allows the user to enter paragraph text and choose
        which words are hidden.
        """
        html = [
            u'<div class="iDevice">',
            u'<div class="block">',
            common.textInput("title"+self.id, self.idevice.title),
            u'</div>',
            self.instructionElement.renderEdit(),
            self.clozeElement.renderEdit(),
            self.feedbackElement.renderEdit(),
            self.renderEditButtons(),
            u'</div>'
            ]
        return u'\n    '.join(html)
    
    def renderPreview(self, style):
        """ 
        Remembers if we're previewing or not, 
        then implicitly calls self.renderViewContent (via Block.renderPreview) 
        """ 
        self.previewing = True 
        return Block.renderPreview(self, style)

    def renderView(self, style):
        """ 
        Remembers if we're previewing or not, 
        then implicitly calls self.renderViewContent (via Block.renderPreview) 
        """ 
        self.previewing = False 
        return Block.renderView(self, style)

    def renderViewContent(self):
        """
        Returns an XHTML string for this block
        """
        # Only show feedback button if feedback is present
        if self.feedbackElement.field.content.strip():
            # Cloze Idevice needs id of div for feedback content
            feedbackID = self.feedbackElement.id
            if self.previewing: 
                clozeContent = self.clozeElement.renderPreview(feedbackID)
            else: 
                clozeContent = self.clozeElement.renderView(feedbackID)
        else:
            if self.previewing: 
                clozeContent = self.clozeElement.renderPreview()
            else:
                clozeContent = self.clozeElement.renderView()
        instruction_html = ""
        if self.previewing: 
            instruction_html = self.instructionElement.renderPreview()
        else:
            instruction_html = self.instructionElement.renderView()
        html = [       
            u'<div class="iDevice_inner">\n',
            instruction_html,
            clozeContent]
        if self.feedbackElement.field.content: 
            if self.previewing: 
                html.append(self.feedbackElement.renderPreview(False, 
                                                     class_="feedback"))
            else:
                html.append(self.feedbackElement.renderView(False, 
                                                     class_="feedback"))
        html += [
            u'</div>\n',
            ]
        return u'\n    '.join(html)

    def renderText(self): 
        
        """
        Returns an XHTML string for text file export.
        """
        
        if self.previewing: 
            html = '<p>' +  self.instructionElement.renderPreview() +'</p>'
        else:
            html = '<p>' +  self.instructionElement.renderView() +'</p>'
        html += '<p>' + self.clozeElement.renderText() + '</p>'
        if self.feedbackElement.field.content:
            html += '<p>%s:</P>' % _(u"Feedback") 
            if self.previewing: 
                html += '<p>' +self.feedbackElement.renderPreview(False, 
                                                        class_="feedback") 
                html += '</p>'
            else:
                html += '<p>' +self.feedbackElement.renderView(False, 
                                                        class_="feedback") 
                html += '</p>'
        html += self.clozeElement.renderAnswers()
        return html
   
from exe.engine.listaidevice import ListaIdevice
from exe.webui.blockfactory  import g_blockFactory
g_blockFactory.registerBlockType(ListaBlock, ListaIdevice)
