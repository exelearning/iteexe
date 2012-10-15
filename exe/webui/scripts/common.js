var newEditor = true;
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

//YOUR_SCORE_IS      = "Your score is ";
YOUR_SCORE_IS      = "Tu puntuación es ";


function magnifierImageChanged(event) {
    var id = event.currentTarget.getAttribute('id');
    var elementId = id.substring(3, id.length);
    var image  = document.getElementById('img'+elementId);
    var width  = document.getElementById('width'+elementId);
    var height = document.getElementById('height'+elementId);
    image.removeAttribute('height');
    if (image.width > 700){
        image.width = 600        
        }
    if (image.width <= 700 && image.width > 300)
        image.width = image.width * 0.7
        
    if (image.height > 270){
        width.value = image.width + 84
    }else{
        width.value = image.width + 144
    }
    height.value = image.height + 24
    if (width.value < 180)
        width.value = 180
    if (height.value < 160)
        height.value = 160
}

function imageChanged(event) {
    var id = event.currentTarget.getAttribute('id');
    var elementId = id.substring(3, id.length);
    var image  = document.getElementById('img'+elementId);
    var width  = document.getElementById('width'+elementId);
    var height = document.getElementById('height'+elementId);
    width.value  = image.width;
    height.value = image.height;
}

function changeImageWidth(elementId) {
    var image  = document.getElementById('img'+elementId);
    var width  = document.getElementById('width'+elementId);
    var height = document.getElementById('height'+elementId);
    image.removeAttribute('height');
    if (width.value) {
        image.width  = width.value;
    } else if (image.hasAttribute('src')) {
        image.removeAttribute('width');
        width.value = image.width;
    } else {
        width.value = "";
    }
    height.value = image.height;
}

function changeImageHeight(elementId) {
    var image  = document.getElementById('img'+elementId);
    var width  = document.getElementById('width'+elementId);
    var height = document.getElementById('height'+elementId);
    image.removeAttribute('width');
    if (height.value) {
        image.height = height.value;
    } else if (image.hasAttribute('src')) {
        image.removeAttribute('height');
        height.value = image.height;
    } else {
        height.value = "";
    }
    width.value  = image.width;
}

function changeMagnifierImageWidth(elementId) {
    var image  = document.getElementById('img'+elementId);
    var width  = document.getElementById('width'+elementId);
    var height = document.getElementById('height'+elementId);
    image.removeAttribute('height');
    if (width.value) {
        image.width  = width.value - 84;
    } else {
        image.removeAttribute('width');
    }
    if (image.width > 600){
        image.removeAttribute('height')
        image.width = 600;
    }
    if (image.height > 270){
        width.value = image.width + 84
    }else{
        width.value = image.width + 144
    }
    height.value = image.height + 24
    if (width.value < 180)
        width.value = 180
    if (height.value < 160)
        height.value = 160
}


function changeMagnifierImageHeight(elementId) {
    var image  = document.getElementById('img'+elementId);
    var width  = document.getElementById('width'+elementId);
    var height = document.getElementById('height'+elementId);
    image.removeAttribute('width');
    if (height.value) {
        image.height = height.value - 24;
    } else {
        image.removeAttribute('height');
    }
    if (image.width > 600){
        image.removeAttribute('height');
        image.width = 600
    }
    if (image.height > 270){
        width.value = image.width + 84
    }else{
        width.value = image.width + 144
    }
    height.value = image.height + 24
    if (width.value < 180)
        width.value = 180
    if (height.value < 160)
        height.value = 160
}


function showMe(ident, w, h)
{
    var elmDiv = document.getElementById('popupmessage');
    hideMe();
        
    if (!elmDiv || 
        elmDiv.innerHTML != document.getElementById(ident).innerHTML){

        elmDiv = document.createElement('div');
        elmDiv.id = 'popupmessage';
        elmDiv.className="popupDiv";
	var xloc = (xpos+w > 740) ? Math.max(0, xpos-w-15) : xpos;
        elmDiv.style.cssText = 'position:absolute; left: ' + 
                               (xloc) + 'px; top: '+(ypos - h/2) + 
                               'px; width: ' + w + 'px;';
        elmDiv.innerHTML = document.getElementById(ident).innerHTML;
        document.body.appendChild(elmDiv);
        new dragElement('popupmessage');
    }
}

function hideMe() {
    var elmDiv = document.getElementById('popupmessage');
    if (elmDiv) {
        // removes the div from the document
        elmDiv.parentNode.removeChild(elmDiv);
    }
}

function updateCoords(e) {
    if (objBrowse == "Microsoft Internet Explorer") {
        xpos = e.offsetX;
        ypos = e.offsetY;
    } else {
        xpos = e.pageX;
        ypos = e.pageY;
    }
}


function getFeedback(optionId, optionsNum, ideviceId, mode) {
    var i, id;
    for (i = 0; i< optionsNum; i++) { 
        if (mode == "multi")
            id = "sa" + i + "b" +ideviceId
        else
            id = "s" + i + "b" +ideviceId
        if(i == optionId)
            document.getElementById(id).style.display = "block";
        else
            document.getElementById(id).style.display = "None";
    }
    if (mode == 'truefalse') {
        document.getElementById("sfbk" + ideviceId).style.display = "block";
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
function fillClozeInputs(ident, inputs) {
    if (!inputs) {
        var inputs = getCloseInputs(ident)
    }
    for (var i=0; i<inputs.length; i++) {
        var input = inputs[i];
        input.value = getClozeAnswer(input);
        markClozeWord(input, CORRECT);
        // Toggle the readonlyness of the answers also
        input.setAttribute('readonly', 'readonly');
    }
}

// Blanks all the answers for a cloze field
// 'inputs' is an option argument containing a list of the 'input' elements for
// the field
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
            break;
        case 1:
            // Wrong
            ele.style.backgroundColor = "red";
            break;
        case 2: 
            // Correct
            ele.style.backgroundColor = "forestgreen";
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
    var guess = ele.value
    var ident = getClozeIds(ele)[0]
    // Read the flags for checking answers
    var strictMarking = eval(document.getElementById(
        'clozeFlag'+ident+'.strictMarking').value);
    var checkCaps = eval(document.getElementById(
        'clozeFlag'+ident+'.checkCaps').value);
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
function toggleClozeFeedback(ident) {
    var feedbackIdEle = document.getElementById(
        'clozeVar'+ident+'.feedbackId');
    if (feedbackIdEle) {
        var feedbackId = feedbackIdEle.value;
        toggleElementVisible(feedbackId);
    }
}

// Toggle the visiblity of an element from it's id
function toggleElementVisible(ident) {
    // Toggle the visibility of an element
    var element = document.getElementById(ident);
    if (element) {
        if (element.style.display != "none") {
            element.style.display = "none";
        } else {
            element.style.display = "";
        }
    }
}

// Reflection Idevice code ////////////////////////////////////////////////

// Show or hide the feedback for reflection idevice
function showAnswer(id,isShow) {
    if (isShow==1) {
        document.getElementById("s"+id).style.display = "block";
        document.getElementById("hide"+id).style.display = "block";
        document.getElementById("view"+id).style.display = "none";
    } else {
        document.getElementById("s"+id).style.display = "none";
        document.getElementById("hide"+id).style.display = "none";
        document.getElementById("view"+id).style.display = "block";
    }
}

// show or hide the feedback for cloze idevice
function toggleFeedback(id) {
    var ele = document.getElementById('fb'+id);
    if (ele.style.display == "block") {
        ele.style.display = "none";
    } else {
        ele.style.display = "block";
    }
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
function showFeedback(num, ident){
    var i, chk;
    for(i=0; i<num; i++){
// JR añado 'op' a la hora de buscar por Id
        var ele = document.getElementById("op"+ident+i.toString())
        var ele0 = document.getElementById("op"+ident+i.toString()+"_0")
        var ele1 = document.getElementById("op"+ident+i.toString()+"_1")
        var ansele = document.getElementById("ans"+ident+i.toString())
        chk = "False"
        if (ele.checked==1)
            chk = "True"   
        if (chk == ele.value){
            ele1.style.display = "block"
			ele0.style.display = "none"
//            ansele.style.color = "black"
        }else{            
            ele0.style.display = "block"
			ele1.style.display = "none"
//            ansele.style.color = "red"
        }
    }
    var fele = document.getElementById("f"+ident)
    fele.style.display = "block"
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
            ele.style.backgroundColor = "red";
            break;
        case 2: 
            // Correct
            ele.style.backgroundColor = "forestgreen";
            break;
    }
    return mark
}

// Return the last mark applied to a word
function getClozelangMark(ele) {
    // Return last mark applied
    switch (ele.style.backgroundColor) {
        case 'red':   return 1; // Wrong
        case 'forestgreen':  return 2; // Correct
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

// Base64 Decode
// Base64 code from Tyler Akins -- http://rumkin.com
//function decode64(input) {
//   var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
//   var output = "";
//   var chr1, chr2, chr3;
//   var enc1, enc2, enc3, enc4;
//   var i = 0;
//   // Remove all characters that are not A-Z, a-z, 0-9, +, /, or =
//   input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
//   do {
//      enc1 = keyStr.indexOf(input.charAt(i++));
//      enc2 = keyStr.indexOf(input.charAt(i++));
//      enc3 = keyStr.indexOf(input.charAt(i++));
//      enc4 = keyStr.indexOf(input.charAt(i++));
//
//      chr1 = (enc1 << 2) | (enc2 >> 4);
//      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
//      chr3 = ((enc3 & 3) << 6) | enc4;
//
//      output = output + String.fromCharCode(chr1);
//
//      if (enc3 != 64) {
//         output = output + String.fromCharCode(chr2);
//      }
//      if (enc4 != 64) {
//         output = output + String.fromCharCode(chr3);
//      }
//   } while (i < input.length);
//   return output;
//}

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

/* Quicktime for IE */
var ie_quicktime_replace = function() {
	var objs = document.getElementsByTagName("OBJECT");
	var i = objs.length;
	while (i--) {
		if(objs[i].type=="video/quicktime") {
			if(typeof(objs.classid)=='undefined') {
				objs[i].style.display="none";
				var h = objs[i].height;
				var w = objs[i].width;
				var s = objs[i].data;
				var e = document.createElement("DIV");
				e.innerHTML = '<object classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" data="'+s+'" width="'+w+'" height="'+h+'"><param name="controller" value="true" /><param name="autoplay" value="false" /></object>';
				objs[i].parentNode.insertBefore(e,objs[i]);			
			}
		}
	}
}
if (navigator.appName=="Microsoft Internet Explorer") {
	if (document.addEventListener){
		window.addEventListener('load',ie_quicktime_replace,false);
	} else {
		window.attachEvent('onload',ie_quicktime_replace);
	}	
}

/* *********************************** */
/* WYSIWYG Editor and common settings */
/* ********************************* */

// Common settings
if (newEditor==true) {
	var eXeLearning_settings = {
		wysiwyg_path : "/scripts/tinymce_3.5.7/jscripts/tiny_mce/tiny_mce.js",
		wysiwyg_settings_path : "/scripts/tinymce_3.5.7_settings.js"
	}
} else {
	var eXeLearning_settings = {
		wysiwyg_path : "/scripts/tinymce/jscripts/tiny_mce/tiny_mce.js",
		wysiwyg_settings_path : "/scripts/tiny_mce_settings.js"		
	}
}

//TinyMCE
function getTinyMCELang(lang){
	var defaultLang = "en";
	for (i=0;i<tinyMCE_languages.length;i++) {
		if (tinyMCE_languages[i]===lang) defaultLang = lang;
	}
	return defaultLang;
}

//TinyMCE file_browser_callback
var exe_tinymce = {
	
	chooseImage : function(field_name, url, type, win) {
		
		var fn = function(local_imagePath) {
			win.focus();
		
			// if the user hits CANCEL, then bail "immediately",
			// i.e., after bringing the tinyMCE image dialog back into focus, above.
			if (local_imagePath == "") {
			   return;
			}
		
			// UNescape, to remove the %20's for spaces, etc.:
			var unescaped_local_imagePath = unescape(local_imagePath);
			var oldImageStr = new String(unescaped_local_imagePath);
			
			/* HTML 5 */
			exe_tinymce.uploaded_file_1_name = "";
			
			var last_uploaded_file_path = unescaped_local_imagePath.split("\\");
			var last_uploaded_file_name = last_uploaded_file_path[last_uploaded_file_path.length-1];
			/* Main file */
			if (field_name=="src") {
				exe_tinymce.uploaded_file_1_name = last_uploaded_file_name;
			}		
			/* /HTML5 */		
		
			// and replace path delimiters (':', '\', or '/') or '%', ' ', or '&' 
			// with '_':
			var RegExp1 = /[\ \\\/\:\%\&]/g;
			var ReplaceStr1 = new String("_");
			var newImageStr = oldImageStr.replace(RegExp1, ReplaceStr1);
		
			// For simplicity across various file encoding schemes, etc.,
			// just ensure that the TinyMCE media window also gets a URI safe link, 
			// for doing its showPreview():
			var early_preview_imageName = encodeURIComponent(newImageStr);
			// and one more escaping of the '%'s to '_'s, to flatten for simplicity:
			var preview_imageName  = early_preview_imageName.replace(RegExp1, ReplaceStr1);
			var full_previewImage_url = "/previews/"+preview_imageName;
		
			// pass the file information on to the server,
			// to copy it into the server's "previews" directory:
			window.parent.nevow_clientToServerEvent('previewTinyMCEimage', this, '', win, win.name, field_name, unescaped_local_imagePath, preview_imageName)
		
			// first, clear out any old value in the tinyMCE image filename field:
			win.document.forms[0].elements[field_name].value = ""; 
		
			// PreviewImage is only available for images:
			if (type == "image") {
			   win.ImageDialog.showPreviewImage(" ");
			} else if (type == "media") {
			   win.window.Media.preview();
			}    
		
			// set the tinyMCE image filename field:
			win.document.forms[0].elements[field_name].value = full_previewImage_url;
			// then force its onchange event:
		
			// PreviewImage is only available for images:
			if (type == "image") {
			   win.ImageDialog.showPreviewImage(full_previewImage_url);
			}
			else if (type == "media") {
			   win.window.Media.preview();
			}
		
			// this onchange works, but it's dirty because it is hardcoding the 
			// onChange=".." event of that field, and if that were to ever change 
			// in tinyMCE, then this would be out of sync.
		
			// and finally, be sure to update the tinyMCE window's image data:
			if (win.getImageData) {
				win.getImageData();
			} else {
				if (window.tinyMCE.getImageData) {
				   window.tinyMCE.getImageData();
				}
			}
		}
		// ask user for image or media, depending on type requested:
		if (type == "image") {
		   askUserForImage(false, fn);
		} else if (type == "media") {
		   askUserForMedia(fn);
		} else if (type == "file") {
		   // new for advlink plugin, to link ANY resource into text:
		   // re-use the Media browser, which defaults to All file types (*.*)
		   askUserForMedia(fn);
		} else if (type == "image2insert" || type == "media2insert" || type == "file2insert") {
			if (type == "file2insert" && url.indexOf('#') >= 0) {
				// looks like a link to an internal anchor due to the #, so do
				// not proceed any further, since there is no more action necessary:
				return;
				// UNLESS this causes problems with embedding real filenames w/ #!!
				// But this will only be for links or filenames typed by hand;
				// those textlink URLs inserted via its file browser will use 
				// type=file rather than type=file2insert
			}
			// new direct insert capabilities, no file browser needed.
			// just copy the passed-in URL directly, no browser necessary:
			fn(url);
		}
	}//chooseImage
	
}
