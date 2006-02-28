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


import logging
from exe.webui import common
from forumidevice import Forum, Lms, Discussion

log = logging.getLogger(__name__)
# ===========================================================================
class LmsElement(object):
    """
    LmsElement is responsible for a block of lms.  Used by
    ForumElement.
    """
    def __init__(self, idevice):
        """
        Initialize
        """
        self.id      = idevice.id       
        self.idevice = idevice
        self.lms     = idevice.forum.lms 
        
    def process(self, request):
        """
        Process arguments from the web server. 
        """
        if "type"+self.id in request.args:
            self.lms.type = request.args["type"+self.id][0]

            
        if "studentpost"+self.id in request.args:
            self.lms.studentpost = request.args["studentpost"+self.id][0]
            
        if "groupmode"+self.id in request.args:
            self.lms.groupmode = request.args["groupmode"+self.id][0]
       
        if "visible"+self.id in request.args:
            self.lms.visible = request.args["visible"+self.id][0]
        
        if "subscription"+self.id in request.args:
            self.lms.subscription = request.args["subscription"+self.id][0]
            
        if "other"+self.id in request.args:
            self.lms.otherLabel = request.args["other"+self.id][0]
            
        if "url"+self.id in request.args:
            self.lms.otherUrl = request.args["url"+self.id][0]
            
    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this field
        """

        if self.lms.lms == "":
            return ""
        
        if self.lms.lms == "moodle":
            typeArr    = [[_(u'A single simple discussion'),       'single'],
                          [_(u'Each person posts one discussion'), 'eachuser'],
                          [_(u'Standard forum for general use'),   'general']]
          
            postArr    = [[_(u'Discussions and replies are allowed'),     '2'],
                          [_(u'No discussions, but replies are allowed'), '1'],
                          [_(u'No discussions, no replies'),              '0']]
              
            subscArr   = [[_(u'No'),             '0'], 
                          [_(u'Yes, forever'),   '1'], 
                          [_(u'Yes, initially'), '2']]
            
            groupArr   = [[_(u'No groups'),       '0'], 
                          [_(u'Separate groups'), '1'], 
                          [_(u'Visible groups'),  '2']]
            
            visibleArr = [[_(u'Show'), '1'], 
                          [_(u'Hide'), '0']]

            html  = common.formField('select', _(u"Forum type:"),
                                     'type', self.id,
                                     self.lms.typeInstruc,
                                     typeArr, self.lms.type)

            html  = common.formField('select', 
                                     _(u"Can a student post to this forum?:"),
                                     'studentpost', self.id,
                                     self.lms.postInstruc,
                                     postArr, self.lms.studentpost)

            html  = common.formField('select', 
                                     _(u"Force everyone to be subscribed?:"),
                                     'subscription', self.id,
                                     self.lms.subscInstruc,
                                     subscArr, self.lms.subscription)

            html  = common.formField('select', 
                                     _(u"Group mode:"),
                                     'groupmode', self.id,
                                     self.lms.groupInstruc,
                                     groupArr, self.lms.groupmode)

            html  = common.formField('select', 
                                     _(u"Visible to students:"),
                                     _(u"Group mode:"),
                                     'visible', self.id,
                                     self.lms.visibleArr,
                                     visibleArr, self.lms.visible)

        else:
            html  = common.textInput("other"+self.id, 
                                     self.lms.otherLabel)
            html += u"http://" + common.textInput("url"+self.id, 
                                        self.lms.otherUrl) + u"<br/>"
        
        return html
    

    def renderView(self):
        """
        Returns an XHTML string for viewing or previewing this element
        """

        html = ""
    
        if self.lms.lms == "other":
            html += "_______________________________<br/>"
            url = "http://%s" % self.lms.otherUrl
            html += "<br/><b>%s </b>" % self.lms.otherLabel
            html += '<a href="%s">%s</a>' % (url, url)  
        return html

# ===========================================================================
class ForumElement(object):
    """
    ForumElement is responsible for a block of forum.  Used by
    Forumblock.
    """
    def __init__(self, idevice):
        """
        Initialize
        """
        self.id                = idevice.id      
        self.forum             = idevice.forum
        self.lmsElement        = LmsElement(idevice) 
        self.discussionElement = DiscussionElement(idevice)
        self.idevice           = idevice
  
        

    def process(self, request):
        """
        Process arguments from the web server.  Return any which apply to this 
        element.
        """
        log.debug("process " + repr(request.args))
        self.idevice.message = ""
        if "fName"+self.id in request.args:
            self.forum.forumName = request.args["fName"+self.id][0]
            
        if "fIntro"+self.id in request.args:
            self.forum.introduction = request.args["fIntro"+self.id][0]
            
        self.discussionElement.process(request)
        self.lmsElement.process(request)
        
                    
    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this field
        """
        html  = ""
        if self.idevice.message <> "":
            html += '<p style="color: red; font-weight: bold;">'
            html += '%s</p>' % self.idevice.message

        html += u'<p>'
        html += common.textInput("name"+ self.id, self.idevice.title)
        html += u'</p>'

        forums = [(_(u"New Forum"), 'newForum')]
        forums += [(pt.forumName, pt.forumName) for pt in 
                    self.idevice.forumsCache.getForums()]
        if self.idevice.isNewForum:
            selected = 'newForum'
        else:
            selected = self.forum.forumName
        html  = common.formField('select', 
                                 _(u"Forum Name:"),
                                 'changeForum', 'forumSelect'+self.id,
                                 '',
                                 forums, selected)

        if not self.idevice.noForum:
            introduction = self.forum.introduction.replace("\r", "")
            introduction = introduction.replace("\n","\\n")
            html += common.textInput("fName"+ self.id, self.forum.forumName)
            html += common.elementInstruc(self.forum.nameInstruc)
            html += "<p><b>%s</b></p>" % _("Introduction")
            html += common.richTextArea("fIntro"+self.id, 
                                        introduction)

        topics = [(_('None'), 'none'), (_('New Topic'), 'newTopic')]
        topics += [(pt.topic, pt.topic) for pt in self.forum.discussions]
        if self.idevice.isNewTopic:
            selected = 'newTopic'
        else:
            selected = self.idevice.discussion.topic
        html  = common.formField('select', 
                                 _(u"Discussion Topic/Thread:"),
                                 'changeTopic', 'topicSelect'+self.id,
                                 '',
                                 topics, selected)

        html += self.discussionElement.renderEdit()

        lmss = [(_(u"Please select a LMS"), ''),
                (_('Moodle'), 'moodle'),
                (_('Other'), 'other')]
        
        html  = common.formField('select', 
                                 _(u"Learning Management System:"),
                                 'changeLms', 'lmsSelect'+self.id,
                                 self.forum.lmsInstruc,
                                 lmss, self.forum.lms.lms)

        html += self.lmsElement.renderEdit()
        
        return html
        
    def renderPreview(self):
        """
        Returns an XHTML string for previewing this element
        """
        html  = ""
        html += u'<b>%s%s</b>' % (_(u"Forum Name: "),self.forum.forumName)
        html += u"<p>%s</p>" % self.forum.introduction
        html += u"<p>"
        html += self.discussionElement.renderPreview()
        html += self.lmsElement.renderView()
        html += u"</p>\n"
        
        return html
    
    def renderView(self):
        """
        Returns an XHTML string for viewing this element
        """
        link = ""
        if self.forum.lms.lms == "moodle":
            link = "<!--%slink-->\n" % self.forum.forumName
        html  = ""
        html += u'<b>%s%s%s</b>' % (_(u"Forum Name: "),self.forum.forumName,link)
        html += u"<p>%s</p>" % self.forum.introduction
        html += u"<p>"
        html += self.discussionElement.renderView()
        html += self.lmsElement.renderView()
        html += u"</p>\n"
        
        return html
 
#===========================================================================  
class DiscussionElement(object):
    """ 
    DiscussionElement is a discussion topic
    """
    def __init__(self, idevice):
        """
        Initialize
        """
        self.id = idevice.id
        self.idevice = idevice
        self.discussion = idevice.discussion

 
    def process(self, request):
        """
        Process arguments from the web server. 
        """
        if "topic"+self.id in request.args:
            self.discussion.topic = request.args["topic"+self.id][0]
        if "dIntro"+self.id in request.args:
            self.discussion.intro = request.args["dIntro"+self.id][0]
            

    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this field
        """
        if self.discussion.isNone:
            return ""
        
        html  = u"<p>"
        html += common.textInput("topic" + self.id, self.discussion.topic)
        html += common.elementInstruc(self.discussion.instruc)
        html += u"</p>\n"
        html += common.richTextArea("dIntro" + self.id, self.discussion.intro)

        return html
    
    def renderPreview(self):
        """
        Returns an XHTML string for viewing or previewing this element
        """
        if self.discussion.isNone:
            return ""
        html = ""
        html += u"<p><b>%s" % _(u"Thread: ")
        html += u"%s</b></p>\n" % self.discussion.topic
        html += u"<p>"
        html += self.discussion.intro
        html += u"</p>\n"
        return html   

    def renderView(self):
        """
        Returns an XHTML string for viewing or previewing this element
        """
        if self.discussion.isNone:
            return ""
        link = ""
        if self.idevice.forum.lms.lms == "moodle":
            topic = self.discussion.topic.replace(" ", "_")
            link  = u"<!--%slink_%s--><br/>\n" % \
            (self.idevice.forum.forumName,link)
        html = ""
        html += u"<p><b>%s" % _(u"Thread: ")
        html += u"%s%s</b></p>\n" % (self.discussion.topic, link)
        html += u"<p>"
        html += self.discussion.intro
        html += u"</p>\n"
        return html
   
    
# ===========================================================================
