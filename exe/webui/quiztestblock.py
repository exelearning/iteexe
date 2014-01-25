# ===========================================================================
# eXe 
# Copyright 2004-2006, University of Auckland
# Copyright 2004-2008 eXe Project, http://eXeLearning.org
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
from exe.webui.block                 import Block
from exe.webui.testquestionelement   import TestquestionElement
from exe.webui                       import common
log = logging.getLogger(__name__)


# ===========================================================================
class QuizTestBlock(Block):
    """
    QuizTestBlock can render and process QuizTestIdevices as XHTML
    """
    def __init__(self, parent, idevice):
        """
        Initialize a new Block object
        """
        Block.__init__(self, parent, idevice)
        self.idevice           = idevice
        self.questionElements  = []
        self.message = False
        if not hasattr(self.idevice,'undo'): 
            self.idevice.undo = True

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
        
        is_cancel = common.requestHasCancel(request)
            
        if ("addQuestion"+unicode(self.id)) in request.args: 
            self.idevice.addQuestion()
            self.idevice.edit = True
            # disable Undo once a question has been added: 
            self.idevice.undo = False
            
        if "passrate" in request.args \
        and not is_cancel:
            self.idevice.passRate = request.args["passrate"][0]


        for element in self.questionElements:
            element.process(request)

            
        if ("action" in request.args and request.args["action"][0] == "done"
            or not self.idevice.edit):
            self.idevice.isAnswered = True
            # remove the undo flag in order to reenable it next time:
            if hasattr(self.idevice,'undo'): 
                del self.idevice.undo
            for question in self.idevice.questions:
                if question.correctAns == -2:
                    self.idevice.isAnswered = False
                    self.idevice.edit = True
                    break
            
        if "submitScore" in request.args \
        and not is_cancel:
            self.idevice.score = self.__calcScore()
            
        if "title"+self.id in request.args \
        and not is_cancel:
            self.idevice.title = request.args["title"+self.id][0]
            

    def renderEdit(self, style):
        """
        Returns an XHTML string with the form element for editing this block
        """
        html  = "<div class=\"iDevice\">\n"
        if not self.idevice.isAnswered:
            html += common.editModeHeading(
                _("Please select a correct answer for each question."))
        html += common.textInput("title"+self.id, self.idevice.title)
        html += u"<br/><br/>\n"
        

        for element in self.questionElements:
            html += element.renderEdit() 
            
        value = _("Add another Question")    
        html += "<br/>" 
        html += common.submitButton("addQuestion"+unicode(self.id), value)
        html += "<br/><br/>" +  _("Select pass rate: ")
        html += "<select name=\"passrate\">\n"
        template = '  <option value="%s0"%s>%s0%%</option>\n'
        for i in range(1, 11):
            if str(i)+ "0" == self.idevice.passRate:
                html += template % (str(i), ' selected="selected"', str(i))
            else:
                html += template % (str(i), '', str(i))
        html += "</select>\n"
        html += "<br /><br />" + self.renderEditButtons(undo=self.idevice.undo)
        html += "</div>\n"
        self.idevice.isAnswered = True

        return html

    def renderView(self, style, preview=False):
        """
        Returns an XHTML string for viewing this block
        """
        html  = u'<form name="quizForm%s" id="quizForm%s" ' % (
                self.idevice.id, self.idevice.id)
        html += u'action="javascript:calcScore2();">\n'
        html += common.ideviceHeader(self, style, "view")
        html += u'<div class="passrate" value="%s"></div>\n' % self.idevice.passRate
        for element in self.questionElements:
            if preview: 
                html += element.renderPreview() + "<br/>"  
            else:
                html += element.renderView() + "<br/>"  
        
        html += '<input type="submit" name="submitB" '
        html += 'value="%s"/>\n' % _(u"SUBMIT ANSWERS")
        html += common.ideviceFooter(self, style, "view")
        html += '</form>\n'

        return html
    

    def renderJavascriptForWeb(self):
        """
        Return an XHTML string for generating the javascript for web export
        """
        scriptStr  = '<script type="text/javascript">\n'
        scriptStr += '<!-- //<![CDATA[\n'
        scriptStr += "var numQuestions = " 
        scriptStr += str(len(self.questionElements))+";\n"
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
            getEle    = 'document.getElementById("quizForm%s")' % \
                        self.idevice.id
            chk       = '%s.%s[i].checked'% (getEle, quesId)
            value     = '%s.%s[i].value' % (getEle, quesId)
            varStrs += "var " + varStr + ";\n"
            keyStrs += "var key" + str(i)+ " = " 
            keyStrs += str(element.question.correctAns) + ";\n"   
            
            answerStr += """
            for (var i=0; i < %s; i++)
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
        
        function calcScore2()
        {
            getAnswer();
     
            calcRawScore();
            actualScore =  Math.round(rawScore / numQuestions * 100);
            document.getElementById("quizForm%s").submitB.disabled = true;
            """ % self.idevice.id
        scriptStr += 'alert("'
        scriptStr += _("Your score is ")
        scriptStr += '" + actualScore + "%")'
        scriptStr += """
           
        }
//]]>    -->
    </script>\n"""

        return scriptStr

    
    def renderJavascriptForScorm(self):
        """
        Return an XHTML string for generating the javascript for scorm export
        """
        scriptStr  = '<script type="text/javascript">\n'
        scriptStr += '<!-- //<![CDATA[\n'
        scriptStr += "var numQuestions = "
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
            getEle    = 'document.getElementById("quizForm%s")' % \
                        self.idevice.id
            chk       = '%s.%s[i].checked'% (getEle, quesId)
            value     = '%s.%s[i].value' % (getEle, quesId)
            varStrs += "var " + varStr + ";\n"
            keyStrs += "var key" + unicode(i)+ " = "
            keyStrs += unicode(element.question.correctAns) + ";\n"          
            answerStr += """
            scorm.SetInteractionValue("cmi.interactions.%s.id","%s");
            scorm.SetInteractionValue("cmi.interactions.%s.type","choice");
            scorm.SetInteractionValue("cmi.interactions.%s.correct_responses.0.pattern",
                          "%s");
            """ % (unicode(i), quesId, unicode(i), unicode(i),
                   element.question.correctAns)
            answerStr += """
            for (var i=0; i < %s; i++)
            {
               if (%s)
               {
                  %s = %s;
                  scorm.SetInteractionValue("cmi.interactions.%s.student_response",%s);
                  break;
               }
            }
           """ % (numOption, chk, varStr, value, unicode(i), varStr)           
            rawScoreStr += """
            if (%s == %s)
            {
               scorm.SetInteractionValue("cmi.interactions.%s.result","correct");
               rawScore++;
            }
            else
            {
               scorm.SetInteractionValue("cmi.interactions.%s.result","wrong");
            }""" % (varStr, keyStr, unicode(i), unicode(i))
           
        scriptStr += varStrs      
        scriptStr += keyStrs
        scriptStr += answerStr
        scriptStr += rawScoreStr
        scriptStr += """
        }
       
        function calcScore2()
        {
           computeTime();  // the student has stopped here.
       """
        scriptStr += """
           document.getElementById("quizForm%s").submitB.disabled = true;
       """ % (self.idevice.id)
        scriptStr += """
           getAnswer();
    
           calcRawScore();
          
           actualScore = Math.round(rawScore / numQuestions * 100);
        """
        scriptStr += 'alert("'
        scriptStr += _("Your score is ")
        scriptStr += '" + actualScore + "%")'
        scriptStr += """  
          
           scorm.SetScoreRaw(actualScore+"" );
           scorm.SetScoreMax("100");
          
           var mode = scorm.GetMode();

               if ( mode != "review"  &&  mode != "browse" ){
                 if ( actualScore < %s )
                 {
                   scorm.SetCompletionStatus("incomplete");
                   scorm.SetSuccessStatus("failed");
                 }
                 else
                 {
                   scorm.SetCompletionStatus("completed");
                   scorm.SetSuccessStatus("passed");
                 }

                 scorm.SetExit("");
                 }

         exitPageStatus = true;
    
    
         scorm.save();
    
         scorm.quit();
         
        }
//]]> -->
</script>\n""" % self.idevice.passRate

        return scriptStr

    def renderPreview(self, style):
        """
        Returns an XHTML string for previewing this block
        """
        html = common.ideviceHeader(self, style, "preview")

        for element in self.questionElements:
            html += element.renderPreview() + "<br/>"
       
        html += '<input type="submit" name="submitScore"'
        html += ' value="%s"/> ' % _("Submit Answer")
        
        if not self.idevice.score == -1:
            message = _("Your score is ") + unicode(self.idevice.score) + "%"
            html += "<b>"+ message+ "</b><br/>"

        self.idevice.score = -1
        
        html += common.ideviceFooter(self, style, "preview")
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
"""Register this block with the BlockFactory"""
from exe.engine.quiztestidevice  import QuizTestIdevice
from exe.webui.blockfactory      import g_blockFactory
g_blockFactory.registerBlockType(QuizTestBlock, QuizTestIdevice)    


# ===========================================================================
