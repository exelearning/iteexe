
var testFrameNode = document.getElementById('testframe');
testFrameNode.addEventListener('load', loadNotify, true);

var sendSubmitEvent = function(theTarget, callWhenDone) {
    var theEvent = testFrameNode.contentDocument.createEvent("HTMLEvents");
    theEvent.initEvent("submit",
        true,
        true);
    theTarget.dispatchEvent(theEvent);
    callWhenDone()
}

var sendClickEvent = function(targetId, callWhenDone) {
    var theTarget = testFrameNode.contentDocument.getElementById(targetId);
    var doEventOfType = function(eventType) {
    var theEvent = testFrameNode.contentDocument.createEvent("MouseEvents");
    var evt = document.createEvent("MouseEvents")    evt.initMouseEvent(eventType,        true, //can bubble        true,        window,        1,        theTarget.offsetLeft + theTarget.offsetWidth / 2 + window.screenX, //screen x        theTarget.offsetTop + theTarget.offsetTop / 2 + window.screenY, //screen y        theTarget.offsetLeft + theTarget.offsetWidth / 2, //client x        theTarget.offsetTop + theTarget.offsetTop / 2, //client y        false,        false,        false,        false,        1,        theTarget); 
    theTarget.dispatchEvent(evt);
    }
    doEventOfType('mousedown');
    doEventOfType('mouseup');
    doEventOfType('click');
    callWhenDone();
}

