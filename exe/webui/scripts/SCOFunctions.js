/*******************************************************************************
** 
** Filename: SCOFunctions.js
**
** File Description: adaption of SCOFunctions.js file from ADL Technical Team
** SCOFunctions.js works with SCORM12 and SCOFunctions2004.js with SCORM2004
** using SCORM_API_wrapper.js
**
** Author: José Miguel Andonegi jm.andonegi@gmail.com
**
********************************************************************************
**
This software is provided "AS IS," without a warranty of any kind.  
ALL EXPRESS OR IMPLIED CONDITIONS, REPRESENTATIONS AND WARRANTIES, INCLUDING 
ANY IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE OR 
NON-INFRINGEMENT, ARE HEREBY EXCLUDED.  ADL AND ITS LICENSORS SHALL NOT BE LIABLE 
FOR ANY DAMAGES SUFFERED BY LICENSEE AS A RESULT OF USING, MODIFYING OR 
DISTRIBUTING THE SOFTWARE OR ITS DERIVATIVES.  IN NO EVENT WILL ADL OR ITS LICENSORS 
BE LIABLE FOR ANY LOST REVENUE, PROFIT OR DATA, OR FOR DIRECT, INDIRECT, SPECIAL, 
CONSEQUENTIAL, INCIDENTAL OR PUNITIVE DAMAGES, HOWEVER CAUSED AND REGARDLESS OF THE 
THEORY OF LIABILITY, ARISING OUT OF THE USE OF OR INABILITY TO USE SOFTWARE, EVEN IF 
ADL HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

*****************************************************************************
*SCOFunctions2004.js code is licensed under the Creative Commons
Attribution-ShareAlike 3.0 Unported License.

To view a copy of this license:

     - Visit http://creativecommons.org/licenses/by-sa/3.0/ 
     - Or send a letter to
            Creative Commons, 444 Castro Street,  Suite 900, Mountain View,
            California, 94041, USA.

The following is a summary of the full license which is available at:

      - http://creativecommons.org/licenses/by-sa/3.0/legalcode

*****************************************************************************

Creative Commons Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)

You are free to:

     - Share : to copy, distribute and transmit the work
     - Remix : to adapt the work

Under the following conditions:

     - Attribution: You must attribute the work in the manner specified by 
       the author or licensor (but not in any way that suggests that they 
       endorse you or your use of the work).

     - Share Alike: If you alter, transform, or build upon this work, you 
       may distribute the resulting work only under the same or similar 
       license to this one.

With the understanding that:

     - Waiver: Any of the above conditions can be waived if you get permission 
       from the copyright holder.

     - Public Domain: Where the work or any of its elements is in the public 
       domain under applicable law, that status is in no way affected by the license.

     - Other Rights: In no way are any of the following rights affected by the license:

           * Your fair dealing or fair use rights, or other applicable copyright 
             exceptions and limitations;

           * The author's moral rights;

           * Rights other persons may have either in the work itself or in how the 
             work is used, such as publicity or privacy rights.

     - Notice: For any reuse or distribution, you must make clear to others the 
               license terms of this work.

****************************************************************************/
var startDate;
var exitPageStatus;

//creating shortcut for less verbose code
var scorm = pipwerks.SCORM;


function loadPage()
{
	var result = scorm.init();
	
	var status = scorm.GetCompletionStatus();

	if (status == "not attempted")
	{
		// the student is now attempting the lesson
		scorm.SetCompletionStatus("unknown");
	}

	exitPageStatus = false;
	startTimer();
}


function startTimer()
{
   startDate = new Date().getTime();
}

function computeTime()
{
   if ( startDate != 0 )
   {
      var currentDate = new Date().getTime();
      var elapsedSeconds = ( (currentDate - startDate) / 1000 );
      var formattedTime = convertTotalSeconds( elapsedSeconds );
   }
   else
   {
	//JM:pending: create a formatting wrapper function
      formattedTime = "00:00:00.0";
   }

   scorm.SetSessionTime(formattedTime);
}

function doBack()
{
   scorm.SetExit("suspend");

   computeTime();
   exitPageStatus = true;
   
   var result;

   result = scorm.save();

	// NOTE: LMSFinish will unload the current SCO.  All processing
	//       relative to the current page must be performed prior
	//		 to calling LMSFinish.   
   
   result = scorm.quit();
}

function doContinue( status )
{
	// Reinitialize Exit to blank
	scorm.SetExit("");

	var mode = scorm.GetMode();

	if ( mode != "review"  &&  mode != "browse" )
	{ 
		scorm.SetCompletionStatus(status);
	}

	computeTime();
	exitPageStatus = true;

	var result;
	result = scorm.save();
	// NOTE: LMSFinish will unload the current SCO.  All processing
	//       relative to the current page must be performed prior
	//		 to calling LMSFinish.   

	result = scorm.quit();
}

function doQuit()
{
	scorm.SetExit("suspend");

	computeTime();
	exitPageStatus = true;

	var result;

	result = scorm.save();

	// NOTE: LMSFinish will unload the current SCO.  All processing
	//       relative to the current page must be performed prior
	//		 to calling LMSFinish.   

	result = scorm.quit();
}

/*******************************************************************************
** The purpose of this function is to handle cases where the current SCO may be 
** unloaded via some user action other than using the navigation controls 
** embedded in the content.   This function will be called every time an SCO
** is unloaded.  If the user has caused the page to be unloaded through the
** preferred SCO control mechanisms, the value of the "exitPageStatus" var
** will be true so we'll just allow the page to be unloaded.   If the value
** of "exitPageStatus" is false, we know the user caused to the page to be
** unloaded through use of some other mechanism... most likely the back
** button on the browser.  We'll handle this situation the same way we 
** would handle a "quit" - as in the user pressing the SCO's quit button.

** eXe team: we've added this doLMSSetValue here to get tracking working with Moodle
** cmi.core.lesson_status is now set to 'completed' whenever a sco is unloaded.
** brent simpson. July 7, 2005. exe@auckland.ac.nz
*******************************************************************************/
function unloadPage()
{
	console.trace('exitPageStatus'+exitPageStatus);

	if (exitPageStatus != true)
	{
		scorm.SetCompletionStatus("completed");
		doQuit();
	}

	// NOTE:  don't return anything that resembles a javascript
	//		  string from this function or IE will take the
	//		  liberty of displaying a confirm message box.
}

/*******************************************************************************
** this function will convert seconds into hours, minutes, and seconds in
** CMITimespan type format - HHHH:MM:SS.SS (Hours has a max of 4 digits &
** Min of 2 digits
*******************************************************************************/
function convertTotalSeconds(ts)
{
   var sec = (ts % 60);

   ts -= sec;
   var tmp = (ts % 3600);  //# of seconds in the total # of minutes
   ts -= tmp;              //# of seconds in the total # of hours

   // convert seconds to conform to CMITimespan type (e.g. SS.00)
   sec = Math.round(sec*100)/100;
   
   var strSec = new String(sec);
   var strWholeSec = strSec;
   var strFractionSec = "";

   if (strSec.indexOf(".") != -1)
   {
      strWholeSec =  strSec.substring(0, strSec.indexOf("."));
      strFractionSec = strSec.substring(strSec.indexOf(".")+1, strSec.length);
   }
   
   if (strWholeSec.length < 2)
   {
      strWholeSec = "0" + strWholeSec;
   }
   strSec = strWholeSec;
   
   if (strFractionSec.length)
   {
      strSec = strSec+ "." + strFractionSec;
   }


   if ((ts % 3600) != 0 )
      var hour = 0;
   else var hour = (ts / 3600);
   if ( (tmp % 60) != 0 )
      var min = 0;
   else var min = (tmp / 60);

   if ((new String(hour)).length < 2)
      hour = "0"+hour;
   if ((new String(min)).length < 2)
      min = "0"+min;

   var rtnVal = hour+":"+min+":"+strSec;

   return rtnVal;
}

function goBack() {
	scorm.set('nav.event','previous');
	var coreSCOLocation = scorm.get("cmi.location");
	window.location = coreSCOLocation;
}

function goForward() {
	doLMSSetValue('nav.event','continue');
	var coreSCOLocation = scorm.get("cmi.location");
	window.location = coreSCOLocation;
}
