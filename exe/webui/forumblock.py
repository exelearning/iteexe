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
ForumBlock can render and process ForumIdevices as XHTML
"""

import logging
from exe.webui.block         import Block
from exe.webui               import common
from exe.webui.forumelement  import DiscussionElement, ForumElement
from exe.engine.forumidevice import Forum, Discussion
from exe.engine.translate    import lateTranslate

log = logging.getLogger(__name__)


# ===========================================================================
class ForumBlock(Block):
    """
    ForumBlock can render and process ForumIdevices as XHTML
    """
    def __init__(self, parent, idevice):
        """
        Initialize a new Block object
        """
        Block.__init__(self, parent, idevice)
        self.forumElement = ForumElement(idevice)
        self.discussionElement = DiscussionElement(idevice)
        self.message = self.idevice.message
   

    def process(self, request):
        """
        Process the request arguments from the web server
        """
        Block.process(self, request)
            
        self._message = x_("")
        self.forumElement.process(request)
            
            

        if (("action" in request.args and 
             request.args["action"][0] == "changeForum") and ("forumSelect" + \
             self.id in request.args)):
            self.idevice.edit = True
            self.idevice.noForum = False
            
            value = request.args["object"][0]

            if value == "":
                self.idevice.noForum = True
            elif value == "newForum":
                forum = Forum()
                self.idevice.forum = forum
                self.idevice.isNewForum = True
            else:
                for forum in self.idevice.forumsCache.getForums():
                    if forum.forumName == value:
                        self.idevice.forum = forum
                        break
                
        if ("action" in request.args and 
            request.args["action"][0] == "changeTopic" and "topicSelect" +
            self.id in request.args and not self.idevice.noForum):
            self.idevice.edit = True
            self.idevice.isNewTopic = False
            value = request.args["object"][0]
            if value == "none":
                pass
            elif value == "newTopic":
                newTopic = Discussion()
                self.idevice.discussion = newTopic
                self.idevice.discussion.isNone = False
                self.idevice.isNewTopic = True
                
            else:
                for topic in self.idevice.forum.discussions:
                    if topic.topic == value:
                        break
                self.idevice.discussion = topic
       
        if ("action" in request.args and 
            request.args["action"][0] == "changeLms" 
            and not self.idevice.noForum and "lmsSelect" + \
            self.id in request.args):
            self.idevice.edit = True
            self.idevice.forum.lms.lms = request.args["object"][0]    
             
        if (("action" in request.args and request.args["action"][0] == "done" \
            or not self.idevice.edit) and "forumSelect" + \
            self.id in request.args):

            if self.idevice.noForum: 
                self._message += x_("Please select a forum.\n")
                self.idevice.edit = True
            else:
                if self.idevice.forum.forumName == "":
                    self._message += \
                        x_("Please enter a name for the forum\n")
                    self.idevice.edit = True
                elif self.idevice.isNewForum:
                    for forum in self.idevice.forumsCache.getForums():
                        if forum.forumName == self.idevice.forum.forumName:
                            self._message = x_("duplicate forum name.\n")
                            self.idevice.edit = True
                            break
                    if self.idevice.forum.lms.lms == "":
                        self._message = x_("Please select LMS.\n")
                        self.idevice.edit = True
                if self.idevice.isNewTopic:                    
                    if self.idevice.discussion.topic == "":
                        self._message = \
                            x_("Please enter a discussion topic name.\n")
                        self.idevice.edit = True
                    for topic in self.idevice.forum.discussions:
                        if topic.topic == self.idevice.discussion.topic:
                            self._message = x_("duplicate topic name.")
                            self.idevice.edit = True
                            break
                        
                if (not self.idevice.edit and not self.idevice.discussion.isNone
                    and not self.idevice.discussion.isAdded):
                    discussion = self.idevice.discussion
                    self.idevice.forum.discussions.append(discussion)
                    discussion.isAdded = True
                    self.idevice.isNewTopic = False
                    
                if not self.idevice.edit and not self.idevice.isAdded:
                    self.idevice.forumsCache.addForum(self.idevice.forum)
                    self.idevice.isNewForum = False
                    self.idevice.isAdded = True
                    
                self.idevice.message = self.message
                        
    # Properties
    message = lateTranslate('message')    
                
            
    def renderEdit(self, style):
        """
        Returns an XHTML string with the form element for editing this block
        """
                                   
        html  = self.forumElement.renderEdit()
        html += u"<br/>" + self.renderEditButtons() + "<br/><br/>"

        return html
    
 
    def renderPreview(self, style):
        """
        Returns an XHTML string for previewing this block
        """
        html  = u'<div class="iDevice '
        html += u'emphasis'+unicode(self.idevice.emphasis)+'">\n'
        html += u'<img alt="" class="iDevice_icon" '
        html += u'src="/style/'+style+'/icon_'+self.idevice.icon+'.gif" />\n'
        html += u'<span class="iDeviceTitle">'
        html += self.idevice.title+'</span><br/>\n'
        html += self.forumElement.renderView()
        html += self.renderViewButtons()
        html += u"</div>"
        return html

    def renderView(self, style):
        """
        Returns an XHTML string for viewing this block
        """
        html  = u'<div class="iDevice '
        html += u'emphasis'+unicode(self.idevice.emphasis)+'">\n'
        html += u'<img alt="" class="iDevice_icon" '
        html += u'src="icon_'+self.idevice.icon+'.gif" />\n'
        html += u'<span class="iDeviceTitle">'
        html += self.idevice.title+'</span><br/>\n'
        html += self.forumElement.renderView()
        html += u"</div>"
        return html
    
    

    
  

from exe.engine.forumidevice import ForumIdevice
from exe.webui.blockfactory  import g_blockFactory
g_blockFactory.registerBlockType(ForumBlock, ForumIdevice)    

# ===========================================================================
