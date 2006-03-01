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
Classes to XHTML elements.  Used by GenericBlock
"""
import logging
from exe.webui       import common

log = logging.getLogger(__name__)

# ===========================================================================
class Element(object):
    """
    Base class for a XHTML element.  Used by GenericBlock
    """
    def __init__(self, field):
        """
        Initialize
        """
        self.field = field
        self.id    = field.id


    def process(self, request):
        """
        Process arguments from the web server.
        """
        msg = x_(u"ERROR Element.process called directly with %s class")
        log.error(msg % self.__class__.__name__)
        return _(msg) % self.__class__.__name__


    def renderEdit(self):
        """
        Returns an XHTML string for editing this element
        """
        msg = _(u"ERROR Element.renderEdit called directly with %s class")
        log.error(msg % self.__class__.__name__)
        return _(msg) % self.__class__.__name__


    def renderPreview(self):
        """
        Returns an XHTML string for previewing this element
        (Defaults to calling renderView.)
        """
        return self.renderView()


    def renderView(self):
        """
        Returns an XHTML string for viewing this element
        """
        msg = x_(u"ERROR Element.renderView called directly with %s class")
        log.error(msg % self.__class__.__name__)
        return _(msg) % self.__class__.__name__


# ===========================================================================
class TextElement(Element):
    """
    TextElement is a single line of text
    """
    def __init__(self, field):
        """
        Initialize
        """
        Element.__init__(self, field)


    def process(self, request):
        """
        Process arguments from the web server.
        """
        if self.id in request.args:
            self.field.content = request.args[self.id][0]


    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this field
        """
	html = common.formField('textInput',self.field.name,'',
				self.id,self.field.content)
        #html  = u'<div class="block">'
        #html += u"<b>"+self.field.name+":</b>\n"
        #html += common.elementInstruc(self.field.instruc)
        #html += u"</div>\n"
        #html += '<div class="block">\n'
        #html += common.textInput(self.id, self.field.content)
        #html += "</div>\n"

        return html


    def renderView(self):
        """
        Returns an XHTML string for viewing or previewing this element
        """
        return self.field.content


# ===========================================================================

class FeedbackElement(Element):
    """
    FeedbackElement is a text which can be show and hide
    """
    def __init__(self, field):
        """
        Initialize
        """
        Element.__init__(self, field)


    def process(self, request):
        """
        Process arguments from the web server.
        """
        if self.id in request.args:
            self.field.feedback = request.args[self.id][0]


    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this field
        """
	html = common.formField('richTextArea',self.field.name,'',
				self.id, self.field.instruc,
				self.field.feedback)
        #html  = u'<div class="block">'
        #html += u"<b>"+self.field.name+":</b>\n"
        #html += common.elementInstruc(self.field.instruc)
        #html += u"</div>\n"
        #html += '<div class="block">\n'
        #html += common.richTextArea(self.id, self.field.feedback)
        #html += "</div>\n"

        return html


    def renderView(self):
        """
        Returns an XHTML string for viewing or previewing this element
        """
        html = ""
        if self.field.feedback != "":
            html += '<div class="block">\n '
            html += common.feedbackButton('btn' + self.id,
                self.field.buttonCaption,
                onclick="toggleFeedback('%s')" % self.id)
            html += '</div>\n '
            html += '<div id="fb%s" class="feedback" style="display: none;"> ' % self.id
            html += self.field.feedback
            html += "</div>\n"

        return html

# ===========================================================================

class TextAreaElement(Element):
    """
    TextAreaElement is responsible for a block of text
    """
    def __init__(self, field):
        """
        Initialize
        """
        Element.__init__(self, field)
        self.width  = "100%"
        if (hasattr(field.idevice, 'class_') and
            field.idevice.class_ in ("activity", "objectives", "preknowledge")):
            self.height = 250
        else:
            self.height = 100


    def process(self, request):
        """
        Process arguments from the web server.
        """
        if self.id in request.args:
            self.field.content = request.args[self.id][0]


    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this field
        """
        log.debug("renderEdit content="+self.field.content+
                  ", height="+unicode(self.height))
	html = common.formField('richTextArea',self.field.name,'',
				self.id, self.field.instruc,
				self.field.content,
				str(self.width), str(self.height))
       

        return html


    def renderView(self, visible=True, class_="block"):
        """
        Returns an XHTML string for viewing or previewing this element
        """
        if visible:
            visible = 'style="display:block"'
        else:
            visible = 'style="display:none"'
        return '<div id="ta%s" class="%s" %s>%s</div>' % (
		self.id, class_, visible, self.field.content)
    
# ===========================================================================
class ImageElement(Element):
    """
    for image element processing
    """
    def __init__(self, field):
        """
        Initialize
        """
        Element.__init__(self, field)


    def process(self, request):
        """
        Process arguments from the web server.
        """
        if "path"+self.id in request.args:
            self.field.setImage(request.args["path"+self.id][0])

        if "width"+self.id in request.args:
            self.field.width = request.args["width"+self.id][0]

        if "height"+self.id in request.args:
            self.field.height = request.args["height"+self.id][0]


    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this field
        """
        log.debug("renderEdit")

        if not self.field.imageResource:
            self.field.setDefaultImage()

        html  = u'<div class="block">'
        html += u'<b>'+self.field.name+':</b>\n'
        html += common.elementInstruc(self.field.instruc)
        html += u"</div>\n"
        html += u'<div class="block">'
        html += u'<img alt="%s" ' % _('Add Image')
        html += u'id="img%s" ' % self.id
        html += u"onclick=\"addImage('"+self.id+"');\" "
        html += u"src=\"resources/"+self.field.imageResource.storageName+"\" "
        if self.field.width:
            html += u"width=\""+self.field.width+"\" "
        if self.field.height:
            html += u"height=\""+self.field.height+"\" "
        html += u"/>\n"
        html += u"</div>"

        html += u'<script type="text/javascript">\n'
        html += u"document.getElementById('img"+self.id+"')."
        html += "addEventListener('load', imageChanged, true);\n"
        html += u'</script>\n'

        html += u'<div class="block">'
        html += common.textInput("path"+self.id, "", 50)
        html += u'<input type="button" onclick="addImage(\'%s\')"' % self.id
        html += u' value="%s" />' % _(u"Select an image")
        html += u'<div class="block"><b>%s</b></div>\n' % _(u"Display as:")
        html += u"<input type=\"text\" "
        html += u"id=\"width"+self.id+"\" "
        html += u"name=\"width"+self.id+"\" "
        html += u"value=\"%s\" " % self.field.width
        html += u"onchange=\"changeImageWidth('"+self.id+"');\" "
        html += u"size=\"4\"/>px "
        html += u"<b>by</b> \n"
        html += u"<input type=\"text\" "
        html += u"id=\"height"+self.id+"\" "
        html += u"name=\"height"+self.id+"\" "
        html += u"value=\"%s\" " % self.field.height
        html += u"onchange=\"changeImageHeight('"+self.id+"');\" "
        html += u"size=\"4\"/>px \n"
        html += u"(%s) \n" % _(u"blank for original size")
        html += u"</div>"

        return html


    def renderPreview(self):
        """
        Returns an XHTML string for previewing this image
        """
        if not self.field.imageResource:
            self.field.setDefaultImage()

        html = common.image("img"+self.id,
                            "resources/"+self.field.imageResource.storageName,
                            self.field.width,
                            self.field.height)
        return html


    def renderView(self):
        """
        Returns an XHTML string for viewing this image
        """
        if not self.field.imageResource:
            self.field.setDefaultImage()

        html = common.image("img"+self.id, 
                             self.field.imageResource.storageName, 
                             self.field.width,
                             self.field.height)

        return html



# ===========================================================================
class MagnifierElement(Element):
    """
    for magnifier element processing
    """
    def __init__(self, field):
        """
        Initialize
        """
        Element.__init__(self, field)


    def process(self, request):
        """
        Process arguments from the web server.
        """
        if "path"+self.id in request.args:
            self.field.setImage(request.args["path"+self.id][0])

        if "width"+self.id in request.args:
            self.field.width = request.args["width"+self.id][0]

        if "height"+self.id in request.args:
            self.field.height = request.args["height"+self.id][0]
            
            

    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this field
        """
        log.debug("renderEdit")
        
        if not self.field.imageResource:
            self.field.setDefaultImage()

        html  = u'<div class="block">\n'
        html += u"<b>"+self.field.name+":</b>\n"
        html += common.elementInstruc(self.field.instruc)
        html += u"</div>\n"
        html += u'<div class="block">\n'
        html += u'<img alt="%s" ' % _('Add JPEG Image')
        html += u'id="img%s" ' % self.id
        html += u"onclick=\"addJpgImage('"+self.id+"');\" "
        html += u"src=\"resources/"+self.field.imageResource.storageName+"\" "
        html += u"/>\n"
        html += u"</div>\n"

        html += u'<script type="text/javascript">\n'
        html += u"document.getElementById('img"+self.id+"')."
        html += "addEventListener('load', magnifierImageChanged, true);\n"
        html += u'</script>\n'

        html += u'<div class="block">\n'
        html += common.textInput("path"+self.id, "", 50)
        html += u'<input type="button" class="block" '
        html += u' onclick="addJpgImage(\'%s\')"' % self.id
        html += u' value="%s" />' % _(u"Select an image (JPG file)")
        
        html += u'<div class="block"><b>%s</b></div>\n' % _(u"Display as:")
        html += u'<input type="text" class="block" '
        html += u'id="width%s" ' % self.id
        html += u'name="width%s" ' % self.id
        html += u'value="%s" ' % self.field.width
        html += u'onchange="changeMagnifierImageWidth('"+self.id+"');" '
        html += u'size="4" />\n'
        html += u'\n'
        html += u'<input type="text" class="block" '
        html += u'id="height'+self.id+'" '
        html += u'name="height'+self.id+'" '
        html += u'value="%s" ' % self.field.height
        html += u'onchange="changeMagnifierImageHeight(''+self.id+'');" '
        html += u'size="4" />\n'
        html += u'(%s) \n' % _(u'blank for original size')
        html += u'</div>\n'

        return html


    def renderPreview(self):
        """
        Returns an XHTML string for previewing this image
        """
        if not self.field.imageResource:
            self.field.setDefaultImage()

        html = self.renderManifier(
                            "resources/"+self.field.imageResource.storageName,
                            "/templates/magnifier.swf")
        return html


    def renderView(self):
        """
        Returns an XHTML string for viewing this image
        """
        if not self.field.imageResource:
            self.field.setDefaultImage()

        html = self.renderManifier(self.field.imageResource.storageName,                            
                                   "magnifier.swf")


        return html
    
    def renderManifier(self, imageFile, magnifierFile):
        """
        Renders the magnifier flash thingie
        """
        field = self.field
        flashVars = (
            u'value="file=%s' % imageFile,
            u'&amp;width=%s&amp;height=%s' % (field.width, field.height),
            u'&amp;borderWidth=12&amp;glassSize=%s' % self.field.glassSize,
            u'&amp;initialZoomSize=%s' % field.initialZSize,
            u'&amp;maxZoomSize=%s' % field.maxZSize,
            u'&amp;targetColor=#FF0000" />\n')
        return common.flash(magnifierFile, field.width, field.height,
            id='magnifier%s' % self.id,
            params = {
                'movie': magnifierFile,
                'quality': 'high',
                'scale': 'noscale',
                'salign': 'lt',
                'bgcolor': '#888888',
                'FlashVars': flashVars})
        
# ==============================================================================
# A wussy check to see that at least one element once has rendered scripts
# before rendering edit mode content
haveRenderedEditScripts = False


class ClozeElement(Element):
    """
    Allows the user to enter a passage of text and declare that some words
    should be added later by the student
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
        clozeid = 'cloze%s' % self.id
        if clozeid in request.args:
            self.field.encodedContent = request.args[clozeid][0]
            self.field.strictMarking = \
                'strictMarking%s' % self.id in request.args
            self.field.checkCaps = \
                'checkCaps%s' % self.id in request.args
            self.field.instantMarking = \
                'instantMarking%s' % self.id in request.args

    @staticmethod
    def renderEditScripts():
        """
        Any block that includes one or more of these elements must include one
        'renderEditScripts' result before any of the elements are rendered
        """
        global haveRenderedEditScripts
        haveRenderedEditScripts = True
        return u"""
<script type="text/javascript">
<!--
  // Turns the editor on
  function startEdit(editorString, hiddenField) {
    var editor = eval(editorString);
    var content = hiddenField.value.replace('&quot;', '"');
    content = content.replace('&amp;', '&');
    editor.designMode = "on";
    editor.lastChild.style.backgroundColor = "white";
    // editor.lastChild.lastChild.innerHTML = unescape(hiddenField.value);
    editor.lastChild.lastChild.innerHTML = content;
    beforeSubmitHandlers.push([clozeBeforeSubmit,
        [editor.lastChild.lastChild, hiddenField]]);
  };

  // Makes the selected word become a gap
  function makeGap(editor) {
    editor.execCommand("underline", false, null);
  };

  // Uploads the editor content to the server
  function clozeBeforeSubmit(node, hiddenField) {
    var content = node.innerHTML.replace(/&/g, "&amp;")
    content = content.replace(/"/g, "&quot;")
    hiddenField.value = content
  };
-->
</script>
"""

    def renderEdit(self):
        """
        Enables the user to set up their passage of text
        """
        # Check that haveRenderedEditScripts has been called exactly once
        assert haveRenderedEditScripts, \
            ("You must call ClozeElement.renderEditScripts() once for each "
             "idevice before calling self.renderEdit()")
        html = [
            u'<div class="block">',
            u'<b>%s</b>' % self.field.name,
            common.elementInstruc(self.field.instruc),
            u'</div>',
            # Render the iframe box
            u' <iframe id="%s" style="width:100%%;height:250px">' % \
                self.editorId,
            u' </iframe>',
            common.hiddenField('cloze'+self.id, self.field.encodedContent),
            u' <script type="text/javascript">',
            u' <!--',
            ur'onLoadHandlers.push([startEdit, ["%s", %s]])' % \
                (self.editorJs, self.hiddenFieldJs),
            u' -->',
            u' </script>',
            # Render our toolbar
            u'<table style="width: 100%;">',
            u'<tbody>',
            u'<tr>',
            u'<td>',
            u'  <input type="button" value="%s" ' % _("Hide/Show Word")+
            ur"""onclick="makeGap(%s);"/>""" % self.editorJs,
            u'</td><td>',
            common.checkbox('strictMarking%s' % self.id,
                            self.field.strictMarking,
                            title=_(u'Strict Marking?'),
                            instruction=self.field.strictMarkingInstruc),
            u'</td><td>',
            common.checkbox('checkCaps%s' % self.id,
                            self.field.checkCaps,
                            title=_(u'Check Caps?'),
                            instruction=self.field.checkCapsInstruc),
            u'</td><td>',
            common.checkbox('instantMarking%s' % self.id,
                            self.field.instantMarking,
                            title=_(u'Instant Marking?'),
                            instruction=self.field.instantMarkingInstruc),
            u'</td>',
            u'</tr>',
            u'</tbody>',
            u'</table>',
            ]
        return '\n    '.join(html)

    def renderView(self, feedbackId=None):
        """
        Shows the text with inputs for the missing parts
        """
        html = ['<div id="cloze%s">' % self.id]
        # Store our args in some hidden fields
        def storeValue(name):
            value = str(bool(getattr(self.field, name))).lower()
            return common.hiddenField('clozeFlag%s.%s' % (self.id, name), value)
        html.append(storeValue('strictMarking'))
        html.append(storeValue('checkCaps'))
        html.append(storeValue('instantMarking'))
        if feedbackId:
            html.append(common.hiddenField('clozeVar%s.feedbackId' % self.id,
                                           'ta'+feedbackId))
        # Mix the parts together
        words = ""
        def encrypt(word):
            """
            Simple XOR encryptions
            """
            result = ''
            key = 'X'
            for letter in word:
                result += unichr(ord(key) ^ ord(letter))
                key = letter
            return result.encode('base64')
        for i, (text, missingWord) in enumerate(self.field.parts):
            if text:
                html.append(text)
            if missingWord:
                words += "'" + missingWord + "',"
                # The edit box for the user to type into
                inputHtml = [
                    ' <input type="text" value="" ',
                    '        id="clozeBlank%s.%s"' % (self.id, i),
                    '    autocomplete="off"',
                    '    style="width:%sem"/>\n' % len(missingWord)]
                if self.field.instantMarking:
                    inputHtml.insert(2, '  onKeyUp="onClozeChange(this)"')
                html += inputHtml
                # Hidden span with correct answer
                html += [
                    '<span style="display: none;" ',
                    'id="clozeAnswer%s.%s">%s</span>' % (
                        self.id, i, encrypt(missingWord))]

        # Score string
        html += ['<p id="clozeScore%s"></p>' % self.id]
	html += ['<div class="block">\n']
        if self.field.instantMarking:
            html += ['<input type="button" ',
                     'value="%s"' % _(u"Get score"),
                     'id="getScore%s"' % self.id,
                     'onclick="showClozeScore(\'%s\')"/>\n' % (self.id)]

            if feedbackId is not None:
                html += [common.feedbackButton('feedback'+self.id, 
                             _(u"Show/Hide Feedback"),
                             style="margin: 0;",
                             onclick="toggleClozeFeedback('%s')" % self.id)]
            # Set the show/hide answers button attributes
            style = 'display: inline;'
            value = _(u"Show/Clear Answers")
            onclick = "toggleClozeAnswers('%s')" % self.id
        else:
            html += [common.button('submit%s' % self.id,
                        _(u"Submit"),
                        id='submit%s' % self.id,
                        onclick="clozeSubmit('%s')" % self.id),
                     common.button(
                        'restart%s' % self.id,
                        _(u"Restart"),
                        id='restart%s' % self.id,
			style="display: none;",
                        onclick="clozeRestart('%s')" % self.id),
                     ]
            # Set the show/hide answers button attributes
            style = 'display: none;'
            value = _(u"Show Answers")
            onclick = "fillClozeInputs('%s')" % self.id
        # Show/hide answers button
        html += ['&nbsp;&nbsp;',
                 common.button(
                    '%sshowAnswersButton' % self.id,
                    value,
                    id='showAnswersButton%s' % self.id,
                    style=style,
                    onclick=onclick),
		]
	html += ['</div>\n']
        return '\n'.join(html) + '</div>'

# ===========================================================================
class FlashElement(Element):
    """
    for flash element processing
    """
    def __init__(self, field):
        """
        Initialize
        """
        Element.__init__(self, field)


    def process(self, request):
        """
        Process arguments from the web server.
        """
        if "path"+self.id in request.args:
            self.field.setFlash(request.args["path"+self.id][0])

        if "width"+self.id in request.args:
            self.field.width = request.args["width"+self.id][0]

        if "height"+self.id in request.args:
            self.field.height = request.args["height"+self.id][0]


    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this field
        """
        log.debug("renderEdit")

        html  = u'<div class="block">'
        html += u"<b>"+self.field.name+":</b>\n"
        html += common.elementInstruc(self.field.instruc)
        html += u"</div>\n"
        html += common.textInput("path"+self.id, "", 50)
        html += u'<input type="button" onclick="addFlash(\'%s\')"' % self.id
        html += u' value="%s" />' % _(u"Select Flash Object")
        html += common.elementInstruc(self.field.fileInstruc)
        html += u'<div class="block"><b>%s</b></div>\n' % _(u"Display as:")
        html += u"<input type=\"text\" "
        html += u"id=\"width"+self.id+"\" "
        html += u"name=\"width"+self.id+"\" "
        html += u"value=\"%s\" " % self.field.width
        html += u"size=\"4\" />px\n"
        html += u"<b>by</b> \n"
        html += u"<input type=\"text\" "
        html += u"id=\"height"+self.id+"\" "
        html += u"name=\"height"+self.id+"\" "
        html += u"value=\"%s\" " % self.field.height
        html += u"size=\"4\" />px\n"
        html += u"(%s) \n" % _(u"blank for original size")


        return html


    def renderPreview(self):
        """
        Returns an XHTML string for previewing this image
        """
        if self.field.flashResource:
            flashFile = 'resources/' + self.field.flashResource.storageName
        else:
            flashFile = ""
        html = common.flash(flashFile, self.field.width, self.field.height)
        return html


    def renderView(self):
        """
        Returns an XHTML string for viewing this flash
        """
        if self.field.flashResource:
            flashFile = self.field.flashResource.storageName
        else:
            flashFile = ""
        html = common.flash(flashFile, self.field.width, self.field.height)
        return html

# ===========================================================================
class FlashMovieElement(Element):
    """
    for flash movie element processing
    """
    def __init__(self, field):
        """
        Initialize
        """
        Element.__init__(self, field)


    def process(self, request):
        """
        Process arguments from the web server.
        """
        if "path"+self.id in request.args:
            self.field.setFlash(request.args["path"+self.id][0])


    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this field
        """
        log.debug("renderEdit")

        html  = u'<div class="block">'
        html += u"<b>"+self.field.name+":</b>"
        html += common.elementInstruc(self.field.fileInstruc)
        html += u"</div>"
        html += common.textInput("path"+self.id, "", 50)
        html += u'<input type="button" onclick="addFlashMovie(\'%s\')"' % self.id
        html += u' value="%s" />\n' % _(u"Select a flash video")


        return html


    def renderPreview(self):
        """
        Returns an XHTML string for previewing this image
        """
        if self.field.flashResource:
            flashFile = 'resources/' + self.field.flashResource.storageName
        else:
            flashFile = ""
        return common.flashMovie(flashFile, self.field.width, self.field.height)
        return html


    def renderView(self):
        """
        Returns an XHTML string for viewing this flash
        """
        if self.field.flashResource:
            flashFile = self.field.flashResource.storageName
        else:
            flashFile = ""

        html = common.flashMovie(flashFile,
                                 self.field.width,
                                 self.field.height)
                                 

        return html
