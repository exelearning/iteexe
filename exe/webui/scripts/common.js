// ===========================================================================
// eXe
// Copyright 2004-2005, University of Auckland
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

// This module is for the common Javascript used in all webpages.

// Called upon loading the page this function clears the hidden
// action and object fields so they can be used by submitLink
var objBrowse = navigator.appName;

// An array of js strings to evaluate on document load
var onLoadHandlers = [clearHidden];
var beforeSubmitHandlers = new Array();

// Called on document load
function onLoadHandler() {
    runFuncArray(onLoadHandlers)
}

// Calls function in an array where each 'row' of the array is in the format:
// func
// or
// [func, arg]
function runFuncArray(handlers) {
    for (var i=0; i < handlers.length; i++) {
        var row = handlers[i] 
        if (typeof row=="function")
            row()
        else {
            // row[0] is a function, row[1] are its args
            row[0].apply(this, row[1]);
        }
    }
}

// Asks the user for an image, returns the path or an empty string
function askUserForImage(multiple) {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    if (multiple) {
        var mode = nsIFilePicker.modeOpenMultiple;
    } else {
        var mode = nsIFilePicker.modeOpen;
    }
    fp.init(window, "Select an image", mode);
    fp.appendFilter("Image Files", "*.jpg; *.jpeg; *.png; *.gif");
    fp.appendFilters(nsIFilePicker.filterAll);
    var res = fp.show();
    if (res == nsIFilePicker.returnOK) {
        if (multiple) {
            var result = new String("");
            var lastFile = null;
            var file     = null;
            while (fp.files.hasMoreElements()) {
                file = fp.files.getNext().QueryInterface(Components.interfaces.nsIFile)
                if (file == lastFile) {
                    break;
                }
                lastFile = file;
                if (result != "") {
                    result += "&";
                }
                result += escape(file.path);
            }
            return result;
        } else {
            return fp.file.path;
        }
    } else {
        return ""
    }
}

// Called by the user to provide an image or flash file name to add to the package
function addImage(elementId) {
    var imagePath = askUserForImage()
    if (imagePath != "") {
        var image = document.getElementById('img'+elementId);
        image.removeAttribute('width');
        image.removeAttribute('height');
        var path  = document.getElementById('path'+elementId);
        path.value = imagePath;
        image.src  = 'file://'+imagePath;
    }
}

// Called by the user to provide an image or flash file name to add to the package
function addJpgImage(elementId) {
    var imagePath = askUserForJpgImage()
    if (imagePath != "") {
        var image = document.getElementById('img'+elementId);
        image.removeAttribute('width');
        image.removeAttribute('height');
        var path  = document.getElementById('path'+elementId);
        path.value = imagePath;
        image.src  = 'file://'+imagePath;
    }
}

// Asks the user for a jpg image, returns the path or an empty string
function askUserForJpgImage(multiple) {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    if (multiple) {
        var mode = nsIFilePicker.modeOpenMultiple;
    } else {
        var mode = nsIFilePicker.modeOpen;
    }
    fp.init(window, "Select an image ", mode);
    fp.appendFilter("JPEG Files", "*.jpg; *.jpeg");
    fp.appendFilters(nsIFilePicker.filterAll);
    var res = fp.show();
    if (res == nsIFilePicker.returnOK) {
        if (multiple) {
            var result = new String("");
            var lastFile = null;
            var file     = null;
            while (fp.files.hasMoreElements()) {
                file = fp.files.getNext().QueryInterface(Components.interfaces.nsIFile)
                if (file == lastFile) {
                    break;
                }
                lastFile = file;
                if (result != "") {
                    result += "&";
                }
                result += escape(file.path);
            }
            return result;
        } else {
            return fp.file.path;
        }
    } else {
        return ""
    }
}
// Called by the user to provide one or more image files name to add to the package
function addGalleryImage(galleryId) {
    var imagePath = askUserForImage(true);
    if (imagePath != "") {
        // Save the change
        submitLink("gallery.addImage."+imagePath, galleryId, true);
    }
}

// Called by the user to change an existing gallery image
function changeGalleryImage(galleryId, imageId) {
    var imagePath = askUserForImage(false)
    if (imagePath != "") {
        // Save the change
        submitLink("gallery.changeImage."+imageId+"."+imagePath, galleryId, true);
    }
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

function changeImageWidth(elementId) {
    var image  = document.getElementById('img'+elementId);
    var width  = document.getElementById('width'+elementId);
    var height = document.getElementById('height'+elementId);
    image.removeAttribute('height');
    if (width.value) {
        image.width  = width.value;
    } else {
        image.removeAttribute('width');
        width.value  = image.width;
    }
    height.value = image.height;
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

function changeImageHeight(elementId) {
    var image  = document.getElementById('img'+elementId);
    var width  = document.getElementById('width'+elementId);
    var height = document.getElementById('height'+elementId);
    image.removeAttribute('width');
    if (height.value) {
        image.height = height.value;
    } else {
        image.removeAttribute('height');
        height.value = image.height;
    }
    width.value  = image.width;
}


// Called by the user to provide a flash movie file name to add to the package
function addFlashMovie(blockId) {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, "Select a file", nsIFilePicker.modeOpen);
    fp.appendFilter("Flash Movie", "*.flv");
    fp.appendFilters(nsIFilePicker.filterAll);
    var res = fp.show();
    if (res == nsIFilePicker.returnOK) {
        var path  = document.getElementById('path'+blockId);
        path.type  = 'text';
        path.value = fp.file.path;
    }
}

// Called by the user to provide a flash file name to add to the package
function addFlash(blockId) {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, "Select a file", nsIFilePicker.modeOpen);
    fp.appendFilter("Flash Object", "*.swf");
    fp.appendFilters(nsIFilePicker.filterAll);
    var res = fp.show();
    if (res == nsIFilePicker.returnOK) {
        var path  = document.getElementById('path'+blockId);
        path.type  = 'text';
        path.value = fp.file.path;
    }
}

function addMp3(blockId) {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, "Select a mp3 file", nsIFilePicker.modeOpen);
    fp.appendFilter("Mp3 Audio", "*.mp3");
    fp.appendFilters(nsIFilePicker.filterAll);
    var res = fp.show();
    if (res == nsIFilePicker.returnOK) {
        var path  = document.getElementById('path'+blockId);
        path.type  = 'text';
        path.value = fp.file.path;
    }
}


// Called by the user to provide a file name to add to the package
function addFile(blockId) {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, "Select a file", nsIFilePicker.modeOpen);
    fp.appendFilters(nsIFilePicker.filterAll);
    var res = fp.show();
    if (res == nsIFilePicker.returnOK) {
        var path  = document.getElementById('path'+blockId);
        path.value = fp.file.path;
    }
}

function uploadFile(blockId) {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, "Select a file", nsIFilePicker.modeOpen);
    fp.appendFilters(nsIFilePicker.filterAll);
    var res = fp.show();
    if (res == nsIFilePicker.returnOK) {
        var path  = document.getElementById('path'+blockId);
        path.value = fp.file.path;
    }
    var theForm = top["authoringIFrame1"].document.getElementById('contentForm')
    if (!theForm) {
        // try and find the form for the authoring page
        theForm = document.getElementById('contentForm')
    }
    theForm.submit();
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
        elmDiv.style.cssText = 'position:absolute; left: ' + 
                               (xpos) + 'px; top: '+(ypos - h/2) + 
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


// Called upon loading the page this function clears the hidden
// action and object fields so they can be used by submitLink
function clearHidden()
{
    var theForm = top["authoringIFrame1"].document.getElementById('contentForm')
    if (!theForm) {
        // try and find the form for the authoring page
        theForm = document.getElementById('contentForm')
    }
    theForm.action.value = "";
    theForm.object.value = "";
}

// Sets the hidden action and object fields, then submits the 
// contentForm to the server
function submitLink(action, object, changed) 
{
    var theForm = top["authoringIFrame1"].document.getElementById('contentForm')
    if (!theForm) {
        // try and find the form for the authoring page
        theForm = document.getElementById('contentForm')
    }
    theForm.action.value    = action;
    theForm.object.value    = object;
    theForm.isChanged.value = changed;
    runFuncArray(beforeSubmitHandlers)
    theForm.submit();
}


// Check the user really really wants to do this before submitting
function confirmThenSubmitLink(message, action, object, changed) 
{
    if (confirm(message)) {
        submitLink(action, object, changed);
    }
}

function getFeedback(optionId, optionsNum, ideviceId, mode) {
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
        input = inputs[i];
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
        input = inputs[i];
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
            ele.style.backgroundColor = "lime";
            break;
    }
    return mark
}

// Return the last mark applied to a word
function getClozeMark(ele) {
    // Return last mark applied
    switch (ele.style.backgroundColor) {
        case 'red':   return 1; // Wrong
        case 'lime':  return 2; // Correct
        default:      return 0; // Not attempted
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
    scorePara.innerHTML = "Your score is " + score + "/" + inputs.length + ".";
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

//change forum or discussion topic or lms for discussion idevice.
function submitChange(action, selectId) 
{
    var form = document.getElementById("contentForm")      
    form.action.value = action
    var select = document.getElementById(selectId) 
    form.object.value = select.value;
    form.isChanged.value = 1;
    form.submit();
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
