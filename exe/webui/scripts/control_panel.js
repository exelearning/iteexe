/*
**  DTML instructions to set caching headers. Inside comments area to play nicer with CSS editors.
**
** **   
**   
**   
** */

var iewin = ((navigator.appName == "Microsoft Internet Explorer") && (navigator.platform == "Win32")) ? 1 : 0;
var TABNAMES = ['links', 'course', 'style'];

// Global state variables
var gFixState;
var gworkboxState;

initTabs();

// Initialization - calculate current state from cookies and then execute those states
function initTabs() {
    toggleFix(readCookie('fix', 0));
    toggleworkbox(readCookie('workbox', 1));
}

function readCookie(name, default_value) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return default_value;
}

function setCookie(key, value) {
    var expdate = new Date();
    expdate.setTime(expdate.getTime() + (1000*3600*24*365));
    document.cookie = key + '=' + value + '; expires=' + expdate.toGMTString() + '; path=/';
}

// ################################################################################
// ########### Change between LINK (0), COURSE (1), and STYLE (2) tabs ############
// ################################################################################

function chooseTab(index) {
	
	setTab(TABNAMES[index]);
	setCookie('tab', index);
	
	// Force workbox open since the user requested a tab
	toggleworkbox(1);
	toggleFix(1);
}


function setTab(tab) {
    
    if (tab=='course') {
	document.getElementById("workbox").className = "course-on";
	document.getElementById("links-off").className = "off";
	document.getElementById("style-off").className = "off";
	document.getElementById("course-off").className = "on";
    } else if (tab=='style') {
	document.getElementById("workbox").className = "style-on";
	document.getElementById("links-off").className = "off";
	document.getElementById("style-off").className = "on";
	document.getElementById("course-off").className = "off";
    } else if (tab=='links') { 
	document.getElementById("workbox").className = "links-on";
	document.getElementById("links-off").className="on";
	document.getElementById("style-off").className="off";
	document.getElementById("course-off").className="off";
    }
}


// ################################################################################
// ########### FIXed position in Mozilla (plus other page adjustments) ############
// ################################################################################


function toggleFix(state){

    gFixState = state;

    setCookie('fix', state);

}



// ################################################################################
// ########### HIDE/SHOW workbox (and turn it on if a tab is selected) ############
// ################################################################################

function toggleworkbox(state) {

        gworkboxState = state;

	hiddenAndOrFixed();

	setCookie('workbox', state);
}


// ############ Hidden and/or Fixed ############### 

function hiddenAndOrFixed(){
	var name;

if (document.getElementById("whole-enchilada")) {

	if (gFixState==1) {
		document.getElementById("whole-enchilada").className = 'fixed';
	} else if (gFixState==0) {
		document.getElementById("whole-enchilada").className = '';
	}

	if (gworkboxState==0) {
		document.getElementsByTagName("body")[0].className = 'hidden';
	} else if (gworkboxState==1) {
		document.getElementsByTagName("body")[0].className = '';
	}
			
} else {

        if (gFixState==1 && gworkboxState==1) {
		name = "fixed";
        } else if (gFixState==1 && gworkboxState==0) {
		name = "hidden fixed";
        } else if (gFixState==0 && gworkboxState==0) {
		name = "hidden";
        } else if (gFixState==0 && gworkboxState==1) {
		name = "";
	}
	document.getElementsByTagName("body")[0].className = name;
}
}
