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
import os
from exe.engine.path               import Path
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
        self.message = False

        i = 0
        for question in idevice.questions:
            self.questionElements.append(TestquestionElement(i, idevice, 
                                                             question))
            i += 1

    def process(self, request):
        """
        Process the request arguments from the web server
        """
        Block.process(self, request)
        
            
        if ("addQuestion"+unicode(self.id)) in request.args: 
            self.idevice.addQuestion()
            self.idevice.edit = True
            
        if "passrate" in request.args:
            self.idevice.passRate = request.args["passrate"][0]


        for element in self.questionElements:
            element.process(request)

            
        if "action" in request.args and request.args["action"][0] == "done":
            for question in self.idevice.questions:
                if question.correctAns == -2:
                    self.idevice.isAnswered = False
                    self.idevice.edit = True
                    break
            
        if "submitScore" in request.args:
            self.idevice.score = self.__calcScore()
            
        
            
            
    def renderEdit(self, style):
        """
        Returns an XHTML string with the form element for editing this block
        """

        html  = "<div class=\"iDevice\">\n"
        if not self.idevice.isAnswered:
            html += '<br/><font color="red"><b> '
            html += _("Please select a correct answer for each question.") 
            html += "</font></b><br/><br/>"
        html += "<b>" + _("Quiz Test:") + " </b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        html += _("Select a pass rate")
        html += "<select name=\"passrate\">\n"
        isChecked = ""
        for i in range(1, 11):
            if str(i)+ "0" == self.idevice.passRate:
                isChecked = "selected"
            else:
                isChecked = ""
            html += "<option value=%s0 %s> %s0%% </option>" % (str(i), isChecked,
                                                              str(i))
            
        html += "</select><br/><br/>\n"

        for element in self.questionElements:
            html += element.renderEdit() 
            
        value = _("Add another question")    
        html += common.submitButton("addQuestion"+unicode(self.id), value)
        html += "<br /><br />" + self.renderEditButtons()
        html += "</div>\n"
        self.idevice.isAnswered = True

        return html

    
    def renderView(self, style):
        """
        Returns an XHTML string for viewing this block
        """
        scriptDir = None
        if os.path.isdir(Path(".").joinpath("webui")):
            scriptDir = Path(".").joinpath("webui", "scripts")
        else:
            scriptDir = Path(".").joinpath("scripts")
            
        outfile = open(scriptDir+"/quizForScorm.js", "w")
        outfile.write(self.__createJavascriptForScorm()) 
        outfile.close()
        
        outfile2 = open(scriptDir+"/quizForWeb.js", "w")
        outfile2.write(self.__createJavascriptForWeb()) 
        outfile2.close()
        
      #  html  = self.__createJavascript()
        html  = '<form name="contentForm">\n'
        html += "<div class=\"iDevice\">\n"
        html += "<img class=\"iDevice_icon\" "
        html += "src=\"multichoice.gif\" />\n"
        html += "<span class=\"iDeviceTitle\">"       
        html += self.idevice.title+"</span><br/>\n"
        
        for element in self.questionElements:
            html += element.renderView() + "<br/>"  
        html += "</div>\n"
        
        html += '<input type="button" name="submitB" '
        html += 'value="%s"' % _("SUBMIT ANSWERS")
        html += 'onClick="calcScore()">\n'
        html += '</form>\n'

        return html
    
    def __createJavascriptForWeb(self):
        """
        Return an XHTML string for generating the javascript for web export
        """
        scriptStr  = "var numQuestions = " +str(len(self.questionElements))+";\n"
        scriptStr += "var rawScore = 0;\n" 
        scriptStr += "var actualScore = 0;\n"
        answerStr  = """function getAnswer()
        {"""
        varStrs     = ""
        keyStrs     = ""
        answers     = ""
        rawScoreStr = """}
        function calcRawScore(){\n"""
        
        for element in self.questionElements:
            i = element.index
            varStr    = "question" + str(i)
            keyStr    = "key" + str(i)
            quesId    = "key" + str(element.index) + "b" + self.id
            numOption = element.getNumOption()
            answers  += "var key"  + str(i) + " = " 
            answers  += str(element.question.correctAns) + ";\n"
            chk = "document.contentForm." + quesId+"[i].checked"
            value = "document.contentForm." + quesId+"[i].value"
            varStrs += "var " + varStr + ";\n"
            keyStrs += "var key" + str(i)+ " = " 
            keyStrs += str(element.question.correctAns) + ";\n"   
            
            answerStr += """
            for (var i=0; i <= %s; i++)
            {
               if (%s)
               {
                  %s = %s;
                  break;
               }
            }
            """ % (numOption, chk, varStr, value) 
            
            rawScoreStr += """
            if (%s == %s)
            {
               rawScore++;
            }""" % (varStr, keyStr)
            
        scriptStr += varStrs       
        scriptStr += keyStrs
        
        scriptStr += answerStr 
                        
        scriptStr += rawScoreStr 
        
        scriptStr += """
        
        }
        
        function calcScore()
        {
            getAnswer();
     
            calcRawScore();
            actualScore =  Math.round(rawScore / numQuestions * 100);
            document.contentForm.submitB.disabled = "True"
            alert("Your score is " + actualScore + "%")
           
        }\n"""
        

        return scriptStr
    
    def __createJavascriptForScorm(self):
        """
        Return an XHTML string for generating the javascript for scorm export
        """

        scriptStr  = "var numQuestions = "
        scriptStr += unicode(len(self.questionElements))+";\n"
        scriptStr += "var rawScore = 0;\n" 
        scriptStr += "var actualScore = 0;\n"
        answerStr  = """function getAnswer()
        {"""
        varStrs     = ""
        keyStrs     = ""
        answers     = ""
        rawScoreStr = """}
        function calcRawScore(){\n"""
        
        
        for element in self.questionElements:
            i = element.index
            varStr    = "question" + unicode(i)
            keyStr    = "key" + unicode(i)
            quesId    = "key" + unicode(element.index) + "b" + self.id
            numOption = element.getNumOption()
            answers  += "var key"  + unicode(i) + " = " 
            answers  += unicode(element.question.correctAns) + ";\n"
            chk = "document.contentForm." + quesId+"[i].checked"
            value = "document.contentForm." + quesId+"[i].value"
            varStrs += "var " + varStr + ";\n"
            keyStrs += "var key" + unicode(i)+ " = " 
            keyStrs += unicode(element.question.correctAns) + ";\n"           
            answerStr += """
            doLMSSetValue("cmi.interactions.%s.id","%s");
            doLMSSetValue("cmi.interactions.%s.type","choice");
            doLMSSetValue("cmi.interactions.%s.correct_responses.0.pattern","%s");
            """ % (unicode(i), quesId, unicode(i), unicode(i), element.question.correctAns)
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
           """ % (numOption, chk, varStr, value, unicode(i), varStr)            
            rawScoreStr += """
            if (%s == %s)
            {
               doLMSSetValue("cmi.interactions.%s.result","correct");
               rawScore++;
            }
            else
            {
               doLMSSetValue("cmi.interactions.%s.result","wrong");
            }""" % (varStr, keyStr, unicode(i), unicode(i))
            
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
                 if ( actualScore <= %s )
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
          
        }\n""" % self.idevice.passRate
    #    </script>\n"""
        
        return scriptStr



    def renderPreview(self, style):
        """
        Returns an XHTML string for previewing this block
        """
        html  = "<div class=\"iDevice\" "
        html += "ondblclick=\"submitLink('edit'," + self.id+", 0);\">\n"
        html += "<img class=\"iDevice_icon\" "
        html += "src=\"/style/"+style+"/multichoice.gif\" />\n"
        html += "<span class=\"iDeviceTitle\">"       
        html += self.idevice.title+"</span><br/>\n"

        if not self.idevice.score == -1:
            message = "Your score is " + unicode(self.idevice.score) + "%"
            html += "<b>"+ message+ "</b><br/>"
                                                                  
        for element in self.questionElements:
            html += element.renderView() + "<br/>"
        html += self.renderViewButtons()
        html += "</div>\n"
        html += '<input type="submit" name="submitScore"'
        html += ' value="%s"/> ' % _("Submit Answer")
        self.idevice.score = -1
        

        
        return html
    
    def __calcScore(self):
        """
        Return a score for preview mode.
        """
        rawScore = 0
        numQuestion = len(self.questionElements)
        score = 0

        for question in self.idevice.questions:
            if (question.userAns == question.correctAns):
                log.info("userAns " +unicode(question.userAns) + ": " 
                         + "correctans " +unicode(question.correctAns))
                rawScore += 1
        
        if numQuestion > 0:
            score = rawScore * 100 / numQuestion
            
        for question in self.idevice.questions:
            question.userAns = -1
            
        return score 
            
        


# ===========================================================================
