#!/usr/bin/env python
#-*- coding: utf-8 -*-
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
FPD - ClozeLang
Renders a paragraph where the content creator can choose which words the student
must fill in.
"""

import logging
from exe.webui.block   import Block
from exe.webui         import common
from exe.webui.element import ClozelangElement, TextAreaElement


log = logging.getLogger(__name__)

# ===========================================================================
class ClozelangfpdBlock(Block):
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
			
        dT = common.getExportDocType()
        sectionTag = "div"
        if dT == "HTML5":
            sectionTag = "section"        
        
        idevice.instructionsForLearners.htmlTag = sectionTag
        idevice.instructionsForLearners.class_ = "block instructions"
        idevice.feedback.htmlTag = sectionTag			

        self.instructionElement = \
            TextAreaElement(idevice.instructionsForLearners)
        self.clozelangElement = ClozelangElement(idevice.content)
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
        self.clozelangElement.process(request)
        self.feedbackElement.process(request)
        Block.process(self, request)

    def renderEdit(self, style):
        """
        Renders a screen that allows the user to enter paragraph text and choose
        which words are hidden.
        """
	"""
        html = [
            u'<div class="iDevice">',
            u'<div class="block">',
#            common.textInput("title"+self.id, self.idevice.title),
            common.textInput("title"+self.id, x_(u"Now it's your turn")),
            u'</div>',
            self.instructionElement.renderEdit(),
            self.clozelangElement.renderEdit(),
            self.feedbackElement.renderEdit(),
            self.renderEditButtons(),
            u'</div>'
            ]
        return u'\n    '.join(html)
	"""
	html  = "<div class=\"iDevice\"><br/>\n"
	html  = "<div class=\"block\">"

	# JRJ
	# Quitamos el prefijo "FPD -"
	# (let's remove the "FPD -" prefix)
	if self.idevice.title.find("FPD - ") == 0:
		self.idevice.title = x_(u"Now It's Your Turn")
        html += common.textInput("title"+self.id, self.idevice.title)

	html += "</div>"
	html += self.instructionElement.renderEdit()
	html += self.clozelangElement.renderEdit()
	html += self.feedbackElement.renderEdit()
	html += self.renderEditButtons()
	html += "</div>"
        return html
    
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
                clozeContent = self.clozelangElement.renderPreview(feedbackID)
            else: 
                clozeContent = self.clozelangElement.renderView(feedbackID)
        else:
            if self.previewing: 
                clozeContent = self.clozelangElement.renderPreview()
            else:
                clozeContent = self.clozelangElement.renderView()
        instruction_html = ""
        if self.previewing: 
            instruction_html = self.instructionElement.renderPreview()
        else:
            instruction_html = self.instructionElement.renderView()
        # html = u'<div class="iDevice_inner">\n'
        
        dT = common.getExportDocType()
        sectionTag = "div"
        if dT == "HTML5":
            sectionTag = "section"        
        
        html = instruction_html
        html += '<'+sectionTag+' class="activity" id="activity-'+self.id+'">\n'
        if not self.previewing:
            html += '<form name="cloze-form-'+self.id+'" action="#" onsubmit="return false" class="activity-form">\n'
        html += clozeContent
        if not self.previewing:
            html += '</form>\n'
        html += '</'+sectionTag+'>\n'
        if self.feedbackElement.field.content: 
            if self.previewing: 
                html += self.feedbackElement.renderPreview(False, class_="feedback")
            else:
                html += self.feedbackElement.renderView(False, class_="feedback")
        # html += u'</div>\n'

	#JR: Anadimos la etiqueta noscript
	# 2014 - JavaScript is required
	'''
	if self.previewing:
		cloze = self.clozelangElement.field.content_w_resourcePaths
		feedback = self.feedbackElement.field.content_w_resourcePaths
	else:
		cloze = self.clozelangElement.field.content_wo_resourcePaths
		feedback = self.feedbackElement.field.content_wo_resourcePaths
	html += u'<noscript><div class="feedback">\n'
	html += u"<strong>" + c_("Solution") + u": </strong><br/>\n"
	html += cloze
	if self.feedbackElement.field.content:
		html += u"<br/><br/><strong>" + c_("Feedback") + ": </strong><br/>\n"
		html += feedback
	html += u"</div></noscript>"
	'''

	return html

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
            html += '<p>%s:</P>' % c_(u"Feedback") 
            if self.previewing: 
                html += '<p>' +self.feedbackElement.renderPreview(False, 
                                                        class_="feedback") 
                html += '</p>'
            else:
                html += '<p>' +self.feedbackElement.renderView(False, 
                                                        class_="feedback") 
                html += '</p>'
        html += self.clozelangElement.renderAnswers()
        return html
    
from exe.engine.clozelangfpdidevice import ClozelangfpdIdevice
from exe.webui.blockfactory  import g_blockFactory
g_blockFactory.registerBlockType(ClozelangfpdBlock, ClozelangfpdIdevice)    


# ===========================================================================
