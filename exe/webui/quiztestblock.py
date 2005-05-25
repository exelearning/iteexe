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
QuizTestBlock can render and process QuizTestIdevices as XHTML
"""

import logging
import gettext
from exe.webui.block               import Block
from exe.webui.testquestionelement import TestquestionElement
from exe.webui                     import common

log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class QuizTestBlock(Block):
    """
    QuizTestBlock can render and process QuizTestIdevices as XHTML
    """
    def __init__(self, idevice):
        """
        Initialize a new Block object
        """
        Block.__init__(self, idevice)
        self.idevice           = idevice
        self.questionElements  = []
        self.message = ""
        
        i = 0
        for question in idevice.questions:
            self.questionElements.append(TestquestionElement(i, idevice, question))
            i += 1

    def process(self, request):
        """
        Process the request arguments from the web server
        """
        Block.process(self, request)
            
        if ("addQuestion"+str(self.id)) in request.args: 
            self.idevice.addQuestion()
            self.idevice.edit = True

        for element in self.questionElements:
            element.process(request)
            
        if "submitScore" in request.args:
            self.idevice.score = self.__calcScore()
            
            
    def renderEdit(self, style):
        """
        Returns an XHTML string with the form element for editing this block
        """

        html  = "<div class=\"iDevice\">\n"
        html += "<b>" + _("Quiz Test:") + " </b><br/>"   

        for element in self.questionElements:
            html += element.renderEdit() 
            
        value = _("Add another question")    
        html += common.submitButton("addQuestion"+str(self.id), value)
        html += "<br /><br />" + self.renderEditButtons()
        html += "</div>\n"

        return html

    
    def renderView(self, style):
        """
        Returns an XHTML string for viewing this block
        """
        
        html  = self.__createJavascript()
        html += '<form name="contentForm">\n'
        html += "<div class=\"iDevice\">\n"
        html += "<img class=\"iDevice_icon\" "
        html += "src=\"multichoice.gif\" />\n"
        html += "<span class=\"iDeviceTitle\">"       
        html += self.idevice.title+"</span><br/>\n"
        
        for element in self.questionElements:
            html += element.renderView() + "<br/>"  
        html += "</div>\n"
        
        html += '<INPUT TYPE="BUTTON" VALUE=" SUBMIT ANSWERS " onClick="calcScore()">\n'
        html += '</form>\n'

        return html
    
    def __createJavascript(self):
        scriptStr = "<SCRIPT LANGUAGE=\"javascript\">\n"
        scriptStr += "var numQuestions = " +str(len(self.questionElements))+";\n"
        scriptStr += "var rawScore = 0;\n" 
        scriptStr += "var actualScore = 0;\n"
        answerStr  = """function getAnswer()
        {"""
        varStrs  = ""
        keyStrs  = ""
        answer = ""
        answers = ""
        rawScoreStr = """}
        function calcRawScore(){\n"""

        for element in self.questionElements:
            i = element.index
            answer    = element.question.correctAns
            varStr    = "question" + str(i)
            keyStr    = "key" + str(i)
            quesId    = "key" + str(element.index) + "b" + self.id
            NumOption = element.getNumOption()
            answers  += "var key" + str(i)+ " = " + str(answer) + ";\n"
            chk = "document.contentForm." + quesId+"[i].checked"
            value = "document.contentForm." + quesId+"[i].value"
            varStrs += "var " +varStr + ";\n"
            keyStrs += "var " +keyStr + " = " +str(answer) + ";\n"           
            answerStr += """
                doLMSSetValue("cmi.interactions.%s.id","%s");
                doLMSSetValue("cmi.interactions.%s.type","choice");
                doLMSSetValue("cmi.interactions.%s.correct_responses.0.pattern","%s");
                """ % (str(i), quesId, str(i), str(i), answer)
            answerStr += """
                for (var i=0; i <= %s; i++)
                {
                   if (%s)
                   {
                      %s = %s;
                      doLMSSetValue("cmi.interactions.%s.student_response",%s);
                      break;
                   }
                }
               """ % (NumOption, chk, varStr, value, str(i), varStr)            
            rawScoreStr += """
                if (%s == %s)
                {
                   doLMSSetValue("cmi.interactions.%s.result","correct");
                   rawScore++;
                }
                else
                {
                   doLMSSetValue("cmi.interactions.%s.result","wrong");
                }""" % (varStr, keyStr, str(i), str(i))
            
        scriptStr += varStrs       
        scriptStr += keyStrs
        
        scriptStr += answerStr 
                        
        scriptStr += rawScoreStr 
        
        scriptStr += """
        
        }
        
        function calcScore()
        {
           computeTime();  // the student has stopped here.
     
           getAnswer();
     
           calcRawScore();
           actualScore = ( rawScore / numQuestions ) * 100;
           
           doLMSSetValue( "cmi.core.score.raw", rawScore );
           
           var mode = doLMSGetValue( "cmi.core.lesson_mode" );
     
               if ( mode != "review"  &&  mode != "browse" ){
                 if ( actualScore <= 70 )
                 {
                   doLMSSetValue( "cmi.core.lesson_status", "failed" );
                 }
                 else 
                 {
                   doLMSSetValue( "cmi.core.lesson_status", "passed" );
                 }
               
                 doLMSSetValue( "cmi.core.exit", "" );
                 } 
     
         exitPageStatus = true;
     
     
         doLMSCommit();
     
         doLMSFinish();
          
        }
        </SCRIPT>\n"""
        
        return scriptStr



    def renderPreview(self, style):
        """
        Returns an XHTML string for previewing this block
        """
        html  = "<div class=\"iDevice\" "
        html += "ondblclick=\"submitLink('edit',"+self.id+", 0);\">\n"
        html += "<img class=\"iDevice_icon\" "
        html += "src=\"/style/"+style+"/multichoice.gif\" />\n"
        html += "<span class=\"iDeviceTitle\">"       
        html += self.idevice.title+"</span><br/>\n"
        if self.idevice.score <> -1:
            message = "Your score is " + str(self.idevice.score) + "%"
            html += "<b>"+ message+ "</b><br/>"
                                                                  
        for element in self.questionElements:
            html += element.renderPreview() + "<br/>"

        html += self.renderViewButtons()
        html += "</div>\n"
        html += '<input type="submit" name="submitScore" value="%s"/> ' % _("Submit Answer")
        self.idevice.score = -1
        
        return html
    
    def __calcScore(self):
        
        rawScore = 0
        numQuestion = len(self.questionElements)
        score = 0

        for question in self.idevice.questions:
            if (question.userAns == question.correctAns):
                log.info("userAns " +str(question.userAns) + ": " 
                         + "correctans " +str(question.correctAns))
                rawScore += 1
        
        if numQuestion > 0:
            score = rawScore/numQuestion * 100
            
        return score 
            
        
        



# ===========================================================================
