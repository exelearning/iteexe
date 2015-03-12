// ===========================================================================
// eXe
// Copyright 2004-2005, University of Auckland
// Copyright 2004-2008 eXe Project, http://eXeLearning.org/
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
// ===========================================================================

var objBrowse = navigator.appName;

//flag to indicate if this is a touch screen device or not
var exe_isTouchScreenDev = false;

//flag to indicate if there are generic negative/positive sounds
var addedAudioTags = false;
var audioTagInterval = null;

/*
 Write the audio tags that we are going to need to run this stuff
*/
function exeWriteSFXAudioTags() {
    if(addedAudioTags == false) {
        if(audioTagInterval == null) {
            audioTagInterval = setInterval("exeWriteSFXAudioTags()", 30);
        }
        
        if(document.body != null) {
            //we are ready now
            var x = 0;            
            clearInterval(audioTagInterval);
            audioTagInterval = null;
            addedAudioTags = true;
            var audioElements = makeSoundDOMElements();
            var y = 0;
            for (var i = 0; i < audioElements.length; i++) {
                document.body.appendChild(audioElements[i]);
            }
        }
    }
}

//exeWriteSFXAudioTags();


/*
 Finds all the audio and video tags that are in a given domElement
 as returned by document.getElementById.  Can be handy to find and play
 tags for feedback purposes
*/
function findAllMediaInElement(domElement) {
    var foundElements = new Array();
    for(var i = 0; i < domElement.childNodes.length; i++) {
        var currentChild = domElement.childNodes[i];
        if(currentChild.childNodes.length > 0) {
            var subMediaElements = findAllMediaInElement(currentChild);
            for(var j = 0; j < subMediaElements.length; j++) {
                foundElements[foundElements.length] = subMediaElements[j];
            }
            if(currentChild.nodeName == "AUDIO" | currentChild.nodeName == "VIDEO") {
                foundElements[foundElements.length] = currentChild;
            }
        }
    }

    return foundElements;
}

//borrowed from EXE Slide show
var mediaLoadInterval = null;
var mediaCheckElement = null;
var mediaCallback = null;
var mediaToWaitFor = null;

/*
 Makes sure that all the media have loaded inside a given element
 when they have run the callbackFunctio
*/
function checkAllMediaLoaded(domElement, callbackFunction) {
    if(mediaCheckElement == null) {
        mediaCheckElement = domElement;
    }


    if(mediaLoadInterval == null) {
        mediaToWaitFor = findAllMediaInElement(domElement);
        //alert("found " + mediaToWaitFor.length + "media items");
        //go through the list then start calling this function

        mediaCallback = callbackFunction;
        mediaLoadInterval = setInterval("checkAllMediaLoaded(null,'" + callbackFunction + "')", 300);

    }else {
        var allLoaded = true;

        for(var i = 0; i < mediaToWaitFor.length; i++) {
            if(mediaToWaitFor[i].readyState < 4) {
                allLoaded = false;
            }
        }

        if(allLoaded == true) {
            //alert("all loaded");
            //all done can clear interval and do callback
            mediaCheckElement = null;
            clearInterval(mediaLoadInterval);
            mediaLoadInterval = null;
            //alert("call " + callbackFunction);
            setTimeout(new String(callbackFunction), 10);
            mediaCallback = null;
        }
    }

    return 1;
}

/*
 Finds the longest clip inside the given element and returns that length
 If autoplay is true it will play any item it finds
*/
function getMaxMediaDuration(domElement, autoplay) {
    var longestClipLength = 0;
    var mediaItems = findAllMediaInElement(domElement);
    for(var i = 0; i < mediaItems.length; i++) {

        //test here for HTML 5 audio and video support
        if(autoplay == true) {
            mediaItems[i].play();
        }
        if(mediaItems[i].duration > longestClipLength) {
            longestClipLength = mediaItems[i].duration;
        }

    }

    return longestClipLength;
}

//try and play a given audio element
function playAndReset(audioElement) {
    if(audioElement.paused == true && audioElement.currentTime == 0) {
        try {
            audioElement.play();
        }catch(err) {
            //something went wrong
        }
    }else {
        try {
            audioElement.pause();
            audioElement.addEventListener("seeked", 
                function() { audioElement.play(); }, true); 
            audioElement.currentTime = 0; 
        }catch(err2) {
            //something went wrong
        }
    }
}

/*
 Plays the default positive feedback sound - select at random from three available.
*/
function playPositiveFeedbackDefault() {
    //play positive feedback sound
    var sndToPlayIndex = Math.floor(Math.random() * 3);
    var audioElementToPlay = document.getElementById("exesfx_good" + sndToPlayIndex);
    playAndReset(audioElementToPlay);
}

/*
 Plays the default negative feedback sound.
*/
function playNegativeFeedbackDefault() {
    var audioElementToPlay = document.getElementById("exesfx_wrong");
    playAndReset(audioElementToPlay);
}

function playClickSound() {
    
}


//Makes an array of dom elements containing audio tags for the default sound fx
//assumes there are files called exesfx_good0.ogg exesfx_good1.ogg exesfx_good2.ogg exesfx_wrong.ogg
function makeSoundDOMElements() {
    var soundElementsArr = new Array();
    
    for (var i = 0; i < 3; i++) {
        soundElementsArr[i] = document.createElement('audio');
        soundElementsArr[i].setAttribute("src", "exesfx_good" + i + ".ogg");
        soundElementsArr[i].setAttribute("id", "exesfx_good" + i);
        soundElementsArr[i].setAttribute("preload", "auto");
    }
    soundElementsArr[3] = document.createElement("audio");
    soundElementsArr[3].setAttribute("src", "exesfx_wrong.ogg");
    soundElementsArr[3].setAttribute("id", "exesfx_wrong");
    soundElementsArr[3].setAttribute("preload", "auto");
    
    return soundElementsArr;
}

function appendSoundHTML() {
    var htmlSound = makeSoundHTML();
    document.body.innerHTML += htmlSound;
}



/*
 See if the device that we are dealing with is touch screen
 if yes so set the variable - provides hints as needed for other stuff 
  (e.g. idevice for cloze etc)
*/

var touchScreenDetectDone = false;
function doTouchScreenDetect() {
    if(touchScreenDetectDone == true) {
        return; //already done - don't do it again.
    }
    
    
    var userAgent = navigator.userAgent;
    if(userAgent.indexOf("Android") != -1) {
        exe_isTouchScreenDev = true;
        //disable this so that the keypad entry does not come
        
    }
}

doTouchScreenDetect();

function convertToDropType() {
    if(exe_isTouchScreenDev) {
        $(".ClozeIdevice INPUT.clozeblank").each(function() {

        $(this).css("display", "none");
        var myId = $(this).attr("id");
            var blankId = myId.substring(10);
        var myOnclick = "setClozeBlankFromCurrentValue('" + blankId + "')";
       
        $(this).after("<span id='span_" + myId + "' onclick=\"" + myOnclick + "\" class='idevicesubblank'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>");
        }
        );
        
        
        $(".ClozeInstructions LI").css("display", "none");
    }
}

var lastTouch;

function getFeedback(optionId, optionsNum, ideviceId, mode) {
    var i, id;
    if (mode=="truefalse") {
        var answer = 'right';
        if (optionId==1) answer = 'wrong';
        var r = document.getElementById("s"+ideviceId+"-result");
        var f = document.getElementById("s"+ideviceId);
        if (!r || !f) return false;
        var msg = $exe_i18n.incorrect;
        if (r.className==answer) msg = $exe_i18n.correct;
        r.innerHTML = msg;
        f.style.display='block';
    } else {
        // Multi choice iDevice (mode=='multi')
        for (i = 0; i< optionsNum; i++) { 
            id = "sa" + i + "b" +ideviceId;
            if(i==optionId) document.getElementById(id).style.display = "block";
            else document.getElementById(id).style.display = "none";
        }
    }    
}

// Cloze Field Stuff /////////////////////////////////////////////////

// Constants 
NOT_ATTEMPTED = 0
WRONG = 1
CORRECT = 2

// Functions 

// Called when a learner types something into a cloze word space
function onClozeChange(ele) {
    var ident = getClozeIds(ele)[0];
    var instant = eval(document.getElementById(
        'clozeFlag'+ident+'.instantMarking').value);
    if (instant) {
        checkAndMarkClozeWord(ele);
        // Hide the score paragraph if visible
        var scorePara = document.getElementById('clozeScore' + ident);
        scorePara.innerHTML = "";
    }
}

// Recieves and marks answers from student
function clozeSubmit(ident) {
    // Mark all of the words
    showClozeScore(ident, 1);
    // Hide Submit
    toggleElementVisible('submit'+ident);
    // Show Restart
    toggleElementVisible('restart'+ident);
    // Show Show Answers Button
    toggleElementVisible('showAnswersButton'+ident);
    // Show feedback
    toggleClozeFeedback(ident);
}

// Makes cloze idevice like new :)
function clozeRestart(ident) {
    // Hide Feedback
    toggleClozeFeedback(ident);
    // Clear the answers (Also hides score)
    toggleClozeAnswers(ident, true);
    // Hide Restart
    toggleElementVisible('restart'+ident);
    // Hide Show Answers Button
    toggleElementVisible('showAnswersButton'+ident);
    // Show Submit
    toggleElementVisible('submit'+ident);
}

// Show/Hide all answers in the cloze idevice
// 'clear' is an optional argument, that forces all the answers to be cleared
// whether they are all finished and correct or not
function toggleClozeAnswers(ident, clear){
    // See if any have not been answered yet
    var allCorrect = true;
    var inputs = getCloseInputs(ident)
    if (!clear) {
        for (var i=0; i<inputs.length; i++) {
            var input = inputs[i];
            if (getClozeMark(input) != 2) {
                allCorrect = false;
                break;
            }
        }
    }
    if (allCorrect) {
        // Clear all answers
        clearClozeInputs(ident, inputs);
    } else {
        // Write all answers
        fillClozeInputs(ident, inputs);
    }
    // Hide the score paragraph, irrelevant now
    var scorePara = document.getElementById('clozeScore' + ident);
    scorePara.innerHTML = "";
    // If the get score button is visible and we just filled in all the right
    // answers, disable it until they clear the scores again.
    var getScoreButton = document.getElementById('getScore' + ident);
    if (getScoreButton) {
        getScoreButton.disabled = !allCorrect;
    }
}

// Shows all answers for a cloze field
// 'inputs' is an option argument containing a list of the 'input' elements for
// the field
function fillClozeInputs(e, t) {
    if (!t) {
        var t = getCloseInputs(e)
    }
    for (var n = 0; n < t.length; n++) {
        var r = t[n];
        
        var a = getClozeAnswer(r); // Right Answer
        a = a.trim();
        var isMultiple = false;
        
        // Check if it has more than one right answer: |dog|bird|cat|
        if (a.indexOf("|")==0 && a.charAt(a.length-1)=="|") {
            var o = a; // Right answer (to operate with this var)
            var o = o.substring(1,(o.length-1)); 
            var as = o.split("|");
            if (as.length>1) {
                isMultiple = true;
                var toShow = ""
                for (x=0;x<as.length;x++) {
                    toShow += as[x];
                    if (x<(as.length-1)) toShow += " — ";
                    if (as[x]=="") isMultiple = false;
                }
            }
            if (isMultiple) {
                // Update the field width to display all the answers and save the previous width (the user may want to try again)
                r.className = "autocomplete-off width-"+r.style.width
                r.style.width = "auto";
                a = toShow
            }
            
        }
        
        // Show the right answer
        r.value = a;
        markClozeWord(r, CORRECT);
        r.setAttribute("readonly", "readonly")        
    }
}

// Blanks all the answers for a cloze field
// 'inputs' is an option argument containing a list of the 'input' elements for
// the field
function clearClozeInputs(e, t) {
    if (!t) {
        var t = getCloseInputs(e)
    }
    for (var n = 0; n < t.length; n++) {
        var r = t[n];
        // Reset the field width if it has more than one right answer: |dog|bird|cat|
        if (r.className.indexOf("autocomplete-off width-")!=-1) {
            var w = r.className.replace("autocomplete-off width-","");
            r.style.width = w;
        }
        r.value = "";
        markClozeWord(r, NOT_ATTEMPTED);
        r.removeAttribute("readonly")
    }
}
function clearClozeInputs(ident, inputs) {
    if (!inputs) {
        var inputs = getCloseInputs(ident)
    }
    for (var i=0; i<inputs.length; i++) {
        var input = inputs[i];
        input.value="";
        markClozeWord(input, NOT_ATTEMPTED);
        // Toggle the readonlyness of the answers also
        input.removeAttribute('readonly');
    }
}

// Marks a cloze word in view mode.
// Returns NOT_ATTEMPTED, CORRECT, or WRONG
function checkAndMarkClozeWord(ele) {
    var result = checkClozeWord(ele);
    if (result != '') {
        markClozeWord(ele, CORRECT);
        ele.value = result;
        return CORRECT;
    } else if (!ele.value) {
        markClozeWord(ele, NOT_ATTEMPTED);
        return NOT_ATTEMPTED;
    } else {
        markClozeWord(ele, WRONG);
        return WRONG;
    }
}

// Marks a cloze question (at the moment just changes the color)
// 'mark' should be 0=Not Answered, 1=Wrong, 2=Right
function markClozeWord(ele, mark) {
    switch (mark) {
        case 0:
            // Not attempted
            ele.style.backgroundColor = "";
            ele.style.color = "";
            break;
        case 1:
            // Wrong
            ele.style.backgroundColor = "#FF9999";
            ele.style.color = "#000000";
            break;
        case 2: 
            // Correct
            ele.style.backgroundColor = "#CCFF99";
            ele.style.color = "#000000";
            break;
    }
    return mark
}

// Return the last mark applied to a word
function getClozeMark(ele) {
    // JR: Esta función no funcionaba correctamente y ha sido reemplazada
    var result = checkClozeWord(ele);
    if (result != '') {
        return CORRECT;
    } else if (!ele.value) {
        return NOT_ATTEMPTED;
    } else {
        return WRONG;
    }
}

// Decrypts and returns the answer for a certain cloze field word
function getClozeAnswer(ele) {
    var idents = getClozeIds(ele)
    var ident = idents[0]
    var inputId = idents[1]
    var answerSpan = document.getElementById('clozeAnswer'+ident+'.'+inputId);
    var code = answerSpan.innerHTML;
    code = decode64(code)
    code = unescape(code)
    // XOR "Decrypt"
    result = '';
    var key = 'X'.charCodeAt(0);
    for (var i=0; i<code.length; i++) {
        var letter = code.charCodeAt(i);
        key ^= letter
        result += String.fromCharCode(key);
    }
    return result
}

// Base64 Decode
// Base64 code from Tyler Akins -- http://rumkin.com
function decode64(input) {
   var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
   var output = "";
   var chr1, chr2, chr3;
   var enc1, enc2, enc3, enc4;
   var i = 0;
   // Remove all characters that are not A-Z, a-z, 0-9, +, /, or =
   input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
   do {
      enc1 = keyStr.indexOf(input.charAt(i++));
      enc2 = keyStr.indexOf(input.charAt(i++));
      enc3 = keyStr.indexOf(input.charAt(i++));
      enc4 = keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
         output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
         output = output + String.fromCharCode(chr3);
      }
   } while (i < input.length);
   return output;
}

// Returns the corrected word or an empty string
function checkClozeWord(ele) {
    var guess = ele.value;
    // Extract the idevice id and the input number out of the element's id
    var original = getClozeAnswer(ele);
    var answer = original;
    answer = answer.trim();
    var first = answer.indexOf("|");
    var last = answer.lastIndexOf("|");
    if(first==0 && last==answer.length-1)
    {
        var answers = answer.split("|"); 
        var answer_i_ok;
        for (var i in answers) {
            if(answers[i]!="")
            {
                answer_i_ok = checkClozeWordAnswer(ele,answers[i]);
                if (answer_i_ok != "")
                    return answers[i];
            }
        }
        return "";
    }
    else
        return checkClozeWordAnswer(ele,answer);
}

// Returns the corrected word or an empty string agains one of the possible answers
function checkClozeWordAnswer(ele,original_answer) {
    original_answer = original_answer.trim();
    var guess = ele.value;
    // Extract the idevice id and the input number out of the element's id
    //var original = getClozeAnswer(ele);
    var answer = original_answer;
    var ident = getClozeIds(ele)[0];
    // Read the flags for checking answers
    var strictMarking = eval(document.getElementById(
        'clozeFlag'+ident+'.strictMarking').value);
    var checkCaps = eval(document.getElementById(
        'clozeFlag'+ident+'.checkCaps').value);
    if (!checkCaps) {
        guess = guess.toLowerCase();
        answer = answer.toLowerCase();
    }
    if (guess == answer)
        // You are right!
        return original_answer;
    else if (strictMarking || answer.length <= 4)
        // You are wrong!
        return "";
    else {
        // Now use the similarity check algorythm
        var i = 0;
        var j = 0;
        var orders = [[answer, guess], [guess, answer]];
        var maxMisses = Math.floor(answer.length / 6) + 1;
        var misses = 0;
        if (guess.length <= maxMisses) {
            misses = Math.abs(guess.length - answer.length);
            for (i = 0; i < guess.length; i++ ) {
                if (answer.search(guess[i]) == -1) {
                    misses += 1;
                }
            }
            if (misses <= maxMisses) {
                return original_answer;
            } else {
                return "";
            }
        }
        // Iterate through the different orders of checking
        for (i = 0; i < 2; i++) {
            var string1 = orders[i][0];
            var string2 = orders[i][1];
            while (string1) {
                misses = Math.floor(
                            (Math.abs(string1.length - string2.length) +
                             Math.abs(guess.length - answer.length)) / 2)
                var max = Math.min(string1.length, string2.length)
                for (j = 0; j < max; j++) {
                    var a = string2.charAt(j);
                    var b = string1.charAt(j);
                    if (a != b)
                        misses += 1;
                    if (misses > maxMisses)
                        break;
                }
                if (misses <= maxMisses)
                    // You are right
                    return original_answer;
                string1 = string1.substr(1);
            }
        }
        // You are wrong!
        return "";
    }
}

// Extracts the idevice id and input id from a javascript element
function getClozeIds(ele) {
    // Extract the idevice id and the input number out of the element's id
    // id is "clozeBlank%s.%s" % (idevice.id, input number)
    var id = ele.id.slice(10); 
    var dotindex = id.indexOf('.')
    var ident = id.slice(0, dotindex)
    var inputId = id.slice(id.indexOf('.')+1)
    return [ident, inputId]
}

// Calculate the score for cloze idevice
function showClozeScore(ident, mark) {
    var score = 0
    var div = document.getElementById('cloze' + ident)
    var inputs = getCloseInputs(ident)
    for (var i=0; i<inputs.length; i++) {
        var input = inputs[i];
        if (mark) {
            var result = checkAndMarkClozeWord(input);
        } else {
            var result = getClozeMark(input);
        }
        if (result == 2) {
            score++;
        }
    }
    // Show it in a nice paragraph
    var scorePara = document.getElementById('clozeScore' + ident);
    scorePara.innerHTML = YOUR_SCORE_IS + score + "/" + inputs.length + ".";
}

// Returns an array of input elements that are associated with a certain idevice
function getCloseInputs(ident) {
    var result = new Array;
    var clozeDiv = document.getElementById('cloze'+ident)
    recurseFindClozeInputs(clozeDiv, ident, result)
    return result
}

// Adds any cloze inputs found to result, recurses down
function recurseFindClozeInputs(dad, ident, result) {
    for (var i=0; i<dad.childNodes.length; i++) {
        var ele = dad.childNodes[i];
        // See if it is a blank
        if (ele.id) {
            if (ele.id.search('clozeBlank'+ident) == 0) {
                result.push(ele);
                continue;
            }
        }
        // See if it contains blanks
        if (ele.hasChildNodes()) {
            recurseFindClozeInputs(ele, ident, result);
        }
    }
}
    

// Pass the cloze element's id, and the visible property of the feedback element
// associated with it will be toggled. If there is no feedback field, does
// nothing
function toggleClozeFeedback(ident,e) {
    var feedbackIdEle = document.getElementById('clozeVar'+ident+'.feedbackId');
    if (feedbackIdEle) {
        var feedbackId = feedbackIdEle.value;
        if (e) {
            if (e.value == $exe_i18n.showFeedback) e.value = $exe_i18n.hideFeedback;
            else e.value = $exe_i18n.showFeedback;
        }
        toggleElementVisible(feedbackId);
    }
}

// Toggle the visiblity of an element from it's id
function toggleElementVisible(ident) {
    $("#"+ident).toggle();
}

// Call the function like this:
//insertAtCursor(document.formName.fieldName, this value);
function insertAtCursor(myField, myValue, num) {
    //MOZILLA/NETSCAPE support
   
    if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myField.value = myField.value.substring(0, startPos)
            + myValue
            + myField.value.substring(endPos, myField.value.length);
        myField.selectionStart = startPos + myValue.length - num
    } else {
        myField.value += myValue;
    } 
    myField.selectionEnd = myField.selectionStart
    myField.focus();
}

//used by maths idevice
function insertSymbol(id, string, num){
    var ele = document.getElementById(id);
    insertAtCursor(ele, string, num)
}

//used for multiple select idevice for calculating score and showing feedback.
function calcScore(num, ident){
    var score = 0, i, chk;
    for(i=0; i<num; i++){
        var chkele = document.getElementById(ident+i.toString());        
        var ansele = document.getElementById("ans"+ident+i.toString())
        chk = "False"
        if (chkele.checked==1)
            chk = "True"   
        if (chk == chkele.value){
            score++
            ansele.style.color = "black"
        }else{            
            ansele.style.color = "red"
        }
    }
    var fele = document.getElementById("f"+ident)
    fele.style.display = "block"
    alert(YOUR_SCORE_IS  + score + "/" + num)
}

// used to show question's feedback for multi-select idevice 
function showFeedback(e,num,ident){
    var i, chk, t, k;
    for(i=0; i<num; i++){
        var id = ident+i.toString();
        var ele = document.getElementById("op"+id);
        chk = "False";
        t = $exe_i18n.incorrect;
        k = "wrong";
        if (ele.checked==1) chk = "True";
        if (chk == ele.value) {
            t = "<strong>"+$exe_i18n.correct+"</strong>";
            k = "right";
        }
        var c = '<p class="'+k+'-option">'+t+'</p>';
        var f = $("#feedback-"+id);
        if (e.value==$exe_i18n.showFeedback) f.html(c).show();
        else f.hide();
    }
    if (e.value==$exe_i18n.showFeedback) {
        $("#f"+ident).show();
        e.value=$exe_i18n.hideFeedback;
    } else {
        $("#f"+ident).hide();
        e.value=$exe_i18n.showFeedback;
    }
}

///////////////////////////////////////////////
// Media plugin detection codes, modified from:
// http://developer.apple.com/internet/webcontent/detectplugins.html
function detectQuickTime() {
    pluginFound = detectPlugin('QuickTime');
    return pluginFound;
}

function detectReal() {
    pluginFound = detectPlugin('RealPlayer');
     return pluginFound;
}

function detectFlash() {
    pluginFound = detectPlugin('Shockwave','Flash'); 
     return pluginFound;
}

function detectDirector() { 
    pluginFound = detectPlugin('Shockwave','Director'); 
     return pluginFound;
}


function detectWindowsMedia() {
    pluginFound = detectPlugin('Windows Media');
      return pluginFound;
}

function detectPlugin() {
    // allow for multiple checks in a single pass
    var daPlugins = detectPlugin.arguments;
    // consider pluginFound to be false until proven true
    var pluginFound = false;
    // if plugins array is there and not fake
    if (navigator.plugins && navigator.plugins.length > 0) {
    var pluginsArrayLength = navigator.plugins.length;
    // for each plugin...
    for (var pluginsArrayCounter=0; pluginsArrayCounter < pluginsArrayLength; pluginsArrayCounter++ ) {
        // loop through all desired names and check each against the current plugin name
        var numFound = 0;
        for(var namesCounter=0; namesCounter < daPlugins.length; namesCounter++) {
        // if desired plugin name is found in either plugin name or description
        if( (navigator.plugins[pluginsArrayCounter].name.indexOf(daPlugins[namesCounter]) >= 0) || 
            (navigator.plugins[pluginsArrayCounter].description.indexOf(daPlugins[namesCounter]) >= 0) ) {
            // this name was found
            numFound++;
        }   
        }
        // now that we have checked all the required names against this one plugin,
        // if the number we found matches the total number provided then we were successful
        if(numFound == daPlugins.length) {
        pluginFound = true;
        // if we've found the plugin, we can stop looking through at the rest of the plugins
        break;
        }
    }
    }
    return pluginFound;
} // detectPlugin
///////////////////////////////////////////////

// JR
// Cloze Lang Field Stuff /////////////////////////////////////////////////

// Constants 
NOT_ATTEMPTED = 0
WRONG = 1
CORRECT = 2

// Functions 

// Called when a learner types something into a cloze word space
function onClozelangChange(ele) {
    var ident = getClozelangIds(ele)[0];
    var instant = eval(document.getElementById(
        'clozelangFlag'+ident+'.instantMarking').value);
    if (instant) {
        checkAndMarkClozelangWord(ele);
        // Hide the score paragraph if visible
        var scorePara = document.getElementById('clozelangScore' + ident);
        scorePara.innerHTML = "";
    }
}

// Recieves and marks answers from student
function clozelangSubmit(ident) {
    // Mark all of the words
    showClozelangScore(ident, 1);
    // Hide Submit
    toggleElementVisible('submit'+ident);
    // Show Restart
    //toggleElementVisible('restart'+ident);
    // Show Show Answers Button
    //toggleElementVisible('showAnswersButton'+ident);
    // Show feedback
    toggleClozelangFeedback(ident);
}

// Makes cloze idevice like new :)
function clozelangRestart(ident) {
    // Hide Feedback
    toggleClozelangFeedback(ident);
    // Clear the answers (Also hides score)
    toggleClozelangAnswers(ident, true);
    // Hide Restart
    toggleElementVisible('restart'+ident);
    // Hide Show Answers Button
    toggleElementVisible('showAnswersButton'+ident);
    // Show Submit
    toggleElementVisible('submit'+ident);
}

// Show/Hide all answers in the cloze idevice
// 'clear' is an optional argument, that forces all the answers to be cleared
// whether they are all finished and correct or not
function toggleClozelangAnswers(ident, clear){
    // See if any have not been answered yet
    var allCorrect = true;
    var inputs = getCloseInputsCloze(ident)
    if (!clear) {
        for (var i=0; i<inputs.length; i++) {
            var input = inputs[i];
            if (getClozelangMark(input) != 2) {
                allCorrect = false;
                break;
            }
        }
    }
    if (allCorrect) {
        // Clear all answers
        clearClozelangInputs(ident, inputs);
    } else {
        // Write all answers
        fillClozelangInputs(ident, inputs);
    }
    // Hide the score paragraph, irrelevant now
    var scorePara = document.getElementById('clozelangScore' + ident);
    scorePara.innerHTML = "";
    // If the get score button is visible and we just filled in all the right
    // answers, disable it until they clear the scores again.
    var getScoreButton = document.getElementById('getScore' + ident);
    if (getScoreButton) {
        getScoreButton.disabled = !allCorrect;
    }
}

// Shows all answers for a cloze field
// 'inputs' is an option argument containing a list of the 'input' elements for
// the field
function fillClozelangInputs(ident, inputs) {
    if (!inputs) {
        var inputs = getCloseInputsCloze(ident)
    }
    for (var i=0; i<inputs.length; i++) {
        var input = inputs[i];
        input.value = getClozelangAnswer(input);
        markClozeWord(input, CORRECT);
        // Toggle the readonlyness of the answers also
        input.setAttribute('readonly', 'readonly');
    }
}

// Blanks all the answers for a cloze field
// 'inputs' is an option argument containing a list of the 'input' elements for
// the field
function clearClozelangInputs(ident, inputs) {
    if (!inputs) {
        var inputs = getCloseInputsCloze(ident)
    }
    for (var i=0; i<inputs.length; i++) {
        var input = inputs[i];
        input.value="";
        markClozeWord(input, NOT_ATTEMPTED);
        // Toggle the readonlyness of the answers also
        input.removeAttribute('readonly');
    }
}

// Marks a cloze word in view mode.
// Returns NOT_ATTEMPTED, CORRECT, or WRONG
function checkAndMarkClozelangWord(ele) {
    var result = checkClozelangWord(ele);
    if (result != '') {
        markClozelangWord(ele, CORRECT);
        ele.value = result;
        return CORRECT;
    } else if (!ele.value) {
        markClozelangWord(ele, NOT_ATTEMPTED);
        return NOT_ATTEMPTED;
    } else {
        markClozelangWord(ele, WRONG);
        return WRONG;
    }
}

// Marks a cloze question (at the moment just changes the color)
// 'mark' should be 0=Not Answered, 1=Wrong, 2=Right
function markClozelangWord(ele, mark) {
    switch (mark) {
        case 0:
            // Not attempted
            ele.style.backgroundColor = "";
            break;
        case 1:
            // Wrong
            ele.style.backgroundColor = "#FF9999";
            break;
        case 2: 
            // Correct
            ele.style.backgroundColor = "#CCFF99";
            break;
    }
    return mark
}

// Return the last mark applied to a word
function getClozelangMark(ele) {
    // Return last mark applied
    switch (ele.style.backgroundColor) {
        case '#FF9999':   return 1; // Wrong
        case '#CCFF99':  return 2; // Correct
        default:      return 0; // Not attempted
    }
}

// Decrypts and returns the answer for a certain cloze field word
function getClozelangAnswer(ele) {
    var idents = getClozelangIds(ele)
    var ident = idents[0]
    var inputId = idents[1]
    var answerSpan = document.getElementById('clozelangAnswer'+ident+'.'+inputId);
    var code = answerSpan.innerHTML;
    code = decode64(code)
    code = unescape(code)
    // XOR "Decrypt"
    result = '';
    var key = 'X'.charCodeAt(0);
    for (var i=0; i<code.length; i++) {
        var letter = code.charCodeAt(i);
        key ^= letter
        result += String.fromCharCode(key);
    }
    return result
}

// Returns the corrected word or an empty string
function checkClozelangWord(ele) {
    var guess = ele.value;
    // Extract the idevice id and the input number out of the element's id
    var original = getClozelangAnswer(ele);
    var answer = original;
    var guess = ele.value
    var ident = getClozelangIds(ele)[0]
    // Read the flags for checking answers
    var strictMarking = eval(document.getElementById(
        'clozelangFlag'+ident+'.strictMarking').value);
    var checkCaps = eval(document.getElementById(
        'clozelangFlag'+ident+'.checkCaps').value);
    if (!checkCaps) {
        guess = guess.toLowerCase();
        answer = original.toLowerCase();
    }
    if (guess == answer)
        // You are right!
        return original
    else if (strictMarking || answer.length <= 4)
        // You are wrong!
        return "";
    else {
        // Now use the similarity check algorythm
        var i = 0;
        var j = 0;
        var orders = [[answer, guess], [guess, answer]];
        var maxMisses = Math.floor(answer.length / 6) + 1;
        var misses = 0;
        if (guess.length <= maxMisses) {
            misses = Math.abs(guess.length - answer.length);
            for (i = 0; i < guess.length; i++ ) {
                if (answer.search(guess[i]) == -1) {
                    misses += 1;
                }
            }
            if (misses <= maxMisses) {
                return answer;
            } else {
                return "";
            }
        }
        // Iterate through the different orders of checking
        for (i = 0; i < 2; i++) {
            var string1 = orders[i][0];
            var string2 = orders[i][1];
            while (string1) {
                misses = Math.floor(
                            (Math.abs(string1.length - string2.length) +
                             Math.abs(guess.length - answer.length)) / 2)
                var max = Math.min(string1.length, string2.length)
                for (j = 0; j < max; j++) {
                    var a = string2.charAt(j);
                    var b = string1.charAt(j);
                    if (a != b)
                        misses += 1;
                    if (misses > maxMisses)
                        break;
                }
                if (misses <= maxMisses)
                    // You are right
                    return answer;
                string1 = string1.substr(1);
            }
        }
        // You are wrong!
        return "";
    }
}

// Extracts the idevice id and input id from a javascript element
function getClozelangIds(ele) {
    // Extract the idevice id and the input number out of the element's id
    // id is "clozelangBlank%s.%s" % (idevice.id, input number)
    var id = ele.id.slice(14); 
    var dotindex = id.indexOf('.')
    var ident = id.slice(0, dotindex)
    var inputId = id.slice(id.indexOf('.')+1)
    return [ident, inputId]
}

// Calculate the score for cloze idevice
function showClozelangScore(ident, mark) {
    var showScore = eval(document.getElementById(
        'clozelangFlag'+ident+'.showScore').value);
    if (showScore) {
        var score = 0
        var div = document.getElementById('clozelang' + ident)
        var inputs = getCloseInputsCloze(ident)
        for (var i=0; i<inputs.length; i++) {
        var input = inputs[i];
        if (mark) {
            var result = checkAndMarkClozelangWord(input);
        } else {
            var result = getClozelangMark(input);
        }
        if (result == 2) {
            score++;
        }
        }
        // Show it in a nice paragraph
        var scorePara = document.getElementById('clozelangScore' + ident);
        scorePara.innerHTML = YOUR_SCORE_IS + score + "/" + inputs.length + ".";
     }
}

// Returns an array of input elements that are associated with a certain idevice
function getCloseInputsCloze(ident) {
    var result = new Array;
    var clozeDiv = document.getElementById('clozelang'+ident)
    recurseFindClozelangInputs(clozeDiv, ident, result)
    return result
}

// Adds any cloze inputs found to result, recurses down
function recurseFindClozelangInputs(dad, ident, result) {
    for (var i=0; i<dad.childNodes.length; i++) {
        var ele = dad.childNodes[i];
        // See if it is a blank
        if (ele.id) {
            if (ele.id.search('clozelangBlank'+ident) == 0) {
                result.push(ele);
                continue;
            }
        }
        // See if it contains blanks
        if (ele.hasChildNodes()) {
            recurseFindClozelangInputs(ele, ident, result);
        }
    }
}
    

// Pass the cloze element's id, and the visible property of the feedback element
// associated with it will be toggled. If there is no feedback field, does
// nothing
function toggleClozelangFeedback(ident) {
    var feedbackIdEle = document.getElementById(
        'clozelangVar'+ident+'.feedbackId');
    if (feedbackIdEle) {
        var feedbackId = feedbackIdEle.value;
        toggleElementVisible(feedbackId);
    }
}

// Toggle the visiblity of an element from it's id
//function toggleElementVisible(ident) {
//    // Toggle the visibility of an element
//    var element = document.getElementById(ident);
//    if (element) {
//        if (element.style.display != "none") {
//            element.style.display = "none";
//        } else {
//            element.style.display = "";
//        }
//    }
//}

sfHover = function() {
    var nav = document.getElementById("siteNav");
    if (nav) {
        var sfEls = nav.getElementsByTagName("LI");
        for (var i=0; i<sfEls.length; i++) {
            sfEls[i].onmouseover=function() {
                this.className="sfhover";
            }
            sfEls[i].onmouseout=function() {
                this.className="sfout";
            }
        }
        //Enable Keyboard:
        var mcEls = nav.getElementsByTagName("A");
        for (var i=0; i<mcEls.length; i++) {
            mcEls[i].onfocus=function() {
                this.className+=(this.className.length>0? " ": "") + "sffocus"; //a:focus
                this.parentNode.className+=(this.parentNode.className.length>0? " ": "") + "sfhover"; //li < a:focus
                if(this.parentNode.parentNode.parentNode.nodeName == "LI") {
                    this.parentNode.parentNode.parentNode.className+=(this.parentNode.parentNode.parentNode.className.length>0? " ": "") + "sfhover"; //li < ul < li < a:focus
                    if(this.parentNode.parentNode.parentNode.parentNode.parentNode.nodeName == "LI") {
                        this.parentNode.parentNode.parentNode.parentNode.parentNode.className+=(this.parentNode.parentNode.parentNode.parentNode.parentNode.className.length>0? " ": "") + "sfhover"; //li < ul < li < ul < li < a:focus
                    }
                }
            }
            mcEls[i].onblur=function() {
                this.className=this.className.replace(new RegExp("( ?|^)sffocus\\b"), "");
                this.parentNode.className=this.parentNode.className.replace(new RegExp("( ?|^)sfhover\\b"), "");
                if(this.parentNode.parentNode.parentNode.nodeName == "LI") {
                    this.parentNode.parentNode.parentNode.className=this.parentNode.parentNode.parentNode.className.replace(new RegExp("( ?|^)sfhover\\b"), "");
                    if(this.parentNode.parentNode.parentNode.parentNode.parentNode.nodeName == "LI") {
                        this.parentNode.parentNode.parentNode.parentNode.parentNode.className=this.parentNode.parentNode.parentNode.parentNode.parentNode.className.replace(new RegExp("( ?|^)sfhover\\b"), "");
                    }
                }
            }
        }
    }
}
if (document.addEventListener){
    window.addEventListener('load',sfHover,false);
} else {
    window.attachEvent('onload',sfHover);
}

/* Quicktime and Real Media for IE */
var ie_media_replace = function() {
    var objs = document.getElementsByTagName("OBJECT");
    var i = objs.length;
    while (i--) {
        if(objs[i].type=="video/quicktime" || objs[i].type=="audio/x-pn-realaudio-plugin") {
            if(typeof(objs.classid)=='undefined') {
                objs[i].style.display="none";
                var clsid = "02BF25D5-8C17-4B23-BC80-D3488ABDDC6B";
                if (objs[i].type=="audio/x-pn-realaudio-plugin") clsid = "CFCDAA03-8BE4-11CF-B84B-0020AFBBCCFA";
                var h = objs[i].height;
                var w = objs[i].width;
                var s = objs[i].data;
                var e = document.createElement("DIV");
                e.innerHTML = '<object classid="clsid:'+clsid+'" data="'+s+'" width="'+w+'" height="'+h+'"><param name="controller" value="true" /><param name="src" value="'+s+'" /><param name="autoplay" value="false" /></object>';
                objs[i].parentNode.insertBefore(e,objs[i]);
            }
        }
    }
}
if (navigator.appName=="Microsoft Internet Explorer") {
    if (document.addEventListener){
        window.addEventListener('load',ie_media_replace,false);
    } else {
        window.attachEvent('onload',ie_media_replace);
    }   
}

var $exe = {
    init : function(){
        var d = document.body.className;
        $exe.addRoles();
        //iDevice Toggler
        if (d!='exe-single-page js') {
            var ie_v = $exe.isIE();
            if (ie_v) {
                if (ie_v>7) $exe.iDeviceToggler.init();
            } else $exe.iDeviceToggler.init();
        }
        //Load exe_media.js
        if (d.indexOf("exe-epub3")!=0) {
        	var h=document.body.innerHTML;
        	if(h.indexOf(' class="mediaelement"')!=-1 || h.indexOf(" class='mediaelement")!=-1){
        		$exe.loadMediaPlayer.getPlayer()
        	}         
        }
        $exe.hint.init();
        $exe.setIframesProtocol();
		$exe.hasTooltips();
    },
	hasTooltips:function(){
		if($("A.exe-tooltip").length>0){
			var p = "";
			if (typeof(exe_editor_mode)!="undefined") p = "/scripts/exe_tooltips/";
			$exe.loadScript(p+"exe_tooltips.js","$exe.tooltips.init('"+p+"')");
		}
	},
    addRoles : function(){
        $('#header').attr('role','banner'); 
        $('#siteNav').attr('role','navigation'); 
        $('#main').attr('role','main'); 
        $('#siteFooter').attr('role','contentinfo');
        $('.js-feedback').attr('role','status');
    },   
    isIE :function() {
        var n = navigator.userAgent.toLowerCase();
        return (n.indexOf('msie') != -1) ? parseInt(n.split('msie')[1]) : false;
    },
    imageGallery : {
        init : function(id) {
            $("A","#"+id).attr("rel","lightbox["+id+"]");
        }
    },
    hint : {
        init : function(){
            $(".iDevice_hint").each(function(i){
                var x = (i+1);
                var id = "hint-"+x;
                var h = $(".iDevice_hint_content",this);
                var t = $(".iDevice_hint_title",this);
                if (h.length==1 && t.length==1) {
                    h.eq(0).attr("id",id);
                    var tit = t.eq(0);
                    var o = tit.html();
                    tit.html('<a href="#'+id+'" title="'+$exe_i18n.show+'" class="hint-toggler show-hint" id="toggle-'+id+'" onclick="$exe.hint.toggle(this);return false" style="background-image:url('+$exe.hint.imgs[0]+')">'+o+'</a>')
                }
            });
        },
        toggle : function(e) {
            var id = e.id.replace("toggle-","");
            if (e.title==$exe_i18n.show) {
                $("#"+id).fadeIn("slow");
                e.title = $exe_i18n.hide;
                e.className = "hint-toggler hide-hint";
                e.style.backgroundImage = "url("+$exe.hint.imgs[1]+")";
            } else {
                $("#"+id).fadeOut();
                e.title = $exe_i18n.show;
                e.className = "hint-toggler show-hint";
                e.style.backgroundImage = "url("+$exe.hint.imgs[0]+")";
            }
        }
    },   
    iDeviceToggler : {
        init : function(){
            if ($(".iDevice").length<2) return false;
            var em = $(".iDevice_header,.iDevice.emphasis0");
            em.each(function(){
                var t = $exe_i18n.hide;
                    e = $(this),
                    c = e.hasClass('iDevice_header')? 'em1': 'em0',
                    eP = e.parents('.iDevice_wrapper');
                if (eP.length) {
                    
                    var l = '<p class="toggle-idevice toggle-' + c + '"><a href="#" onclick="$exe.iDeviceToggler.toggle(this,\''+eP.attr('id')+'\',\'' + c + '\')" title="'+t+'"><span>'+t+'</span></a></p>';
                    if (c == 'em1') {
                        var h = e.html();
                        e.html(h+l);
                    }
                    else
                        e.before(l);
                }
            });
            $("INPUT.autocomplete-off").attr("autocomplete","off");
        },
        toggle : function(e,id,em) {
            var t = $exe_i18n.hide;
            var i = $("#"+id);
            var sel = ".iDevice_content";
            if (em=="em1") sel = ".iDevice_inner";
            var iC = $(sel,i);
            var c = i.attr("class");
            if (typeof(c)=='undefined') return false;
            if (c.indexOf(" hidden-idevice")==-1) {
                t = $exe_i18n.show;
                c += " hidden-idevice";
                iC.slideUp("fast");
                e.className = "show-idevice";
                e.title = t;
                e.innerHTML = "<span>"+t+"</span>";
            } else {
                c = c.replace(" hidden-idevice","");
                iC.slideDown("fast");
                e.className = "hide-idevice";
                e.title = t;
                e.innerHTML = "<span>"+t+"</span>";
            }
            i.attr("class",c);
        }
    },
	alignMediaElement : function(m){
		var e = $(m);
		var p = e.parents().eq(2);
		var k = p.attr("class");
		if (typeof(k)=='string' && k.indexOf("mejs-container")==0) {
			var mL = m.style.marginLeft;
			var mR = m.style.marginRight;
			if ((mL == 'auto') && (mL == mR)) $(p).wrap('<div style="text-align:center"></div>')
		}
	},
    loadMediaPlayer : {
        getPlayer : function(){
			$exe.mediaelements = $('.mediaelement');
        	$exe.mediaelements.each(function(){
				if (typeof(this.localName)!="undefined" && this.localName=="video") {
					var w = this.width;
					var wW = $(window).width();
					if (w>wW) {
						var nW = (wW-20);
						var h = parseInt((this.height*nW)/w);
						this.width = nW;
						this.height=h;
					}
				}
			}).hide();
        	var file = 'exe_media.js';
        	if (typeof eXe != 'undefined') {
        		file = '../scripts/mediaelement/' + file;
        	}
            $exe.loadScript(file,"$exe.loadMediaPlayer.getCSS()");
        },
        getCSS : function(){
        	var file = 'exe_media.css';
        	if (typeof eXe != 'undefined') {
        		file = '../scripts/mediaelement/' + file;
        	}
            $exe.loadScript(file,"$exe.loadMediaPlayer.init()");
        },
        init : function(){
        	if (typeof eXe != 'undefined') {
        		mejs.MediaElementDefaults.flashName = '../scripts/mediaelement/' + mejs.MediaElementDefaults.flashName;
        		mejs.MediaElementDefaults.silverlightName = '../scripts/mediaelement/' + mejs.MediaElementDefaults.silverlightName;
        	}
            $exe.mediaelements.mediaelementplayer().show().each(function(){
				$exe.alignMediaElement(this);
			});
        }
    },
    setIframesProtocol : function(){
        var p = window.location.protocol;
        var l = false;
        if (p!="http" && p!="https") l = true;
        $("IFRAME").each(
            function(){
                var s = $(this).attr("src");
                if (l && s.indexOf("//")==0) $(this).attr("src","http:"+s);
            }
        );
    },
    loadScript : function(url, callback){
        var s;
        if (url.split('.').pop()=="css") {
            s = document.createElement("link");
            s.type = "text/css";
            s.rel = "stylesheet";
            s.href = url;   
        } else {
            s = document.createElement("script");
            s.type = "text/javascript";
            s.src = url;
        }
        if (s.readyState){  //IE
            s.onreadystatechange = function(){
                if (s.readyState == "loaded" ||
                        s.readyState == "complete"){
                    s.onreadystatechange = null;
                    if (callback) eval(callback);
                }
            };
        } else {  //Others
            s.onload = function(){
                if (callback) eval(callback);
            };
        }
        document.getElementsByTagName("head")[0].appendChild(s);
    },
    toggleFeedback : function(e,changeText) {
        var id = e.name.replace("toggle-","");
        var f = document.getElementById(id);
        if (f) {
            if (f.className == "feedback js-feedback js-hidden") {
                f.className = "feedback js-feedback";
                if (changeText) e.value = $exe_i18n.hideFeedback
            } else {
                f.className = "feedback js-feedback js-hidden";
                if (changeText) e.value = $exe_i18n.showFeedback
            }
        }
    }
}

if (typeof jQuery != 'undefined') {
	$(function(){
		$exe.init();
	});
}
