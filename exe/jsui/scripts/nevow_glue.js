// Strings to be translated
EXCEPTION_ = "Exception: ";
CAUSED_BY_SCRIPT_ = 'Caused by script:';

var liveevil_unload = false; var auto_open = true;

var base_url = this.location.toString()
var queryParamIndex = base_url.indexOf('?')
if (queryParamIndex != -1) {
    base_url = base_url.substring(0, queryParamIndex)
}
if (base_url.charAt(base_url.length-1) != '/')
  base_url += '/'


function createRequest() {
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest()
    } else {
        return new ActiveXObject("Microsoft.XMLHTTP")
    }
}

var last_request = null
var last_server_message_time = null

function connect(outputNum) {
    var xmlhttp = createRequest()
    last_request = xmlhttp
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.responseText) {
        		last_server_message_time = new Date()
                try {
                    eval(xmlhttp.responseText)
                } catch (e) {
                    alert(EXCEPTION_ + e.toString()+'\n'+CAUSED_BY_SCRIPT_+xmlhttp.responseText)
                    throw e
                }
                if (!liveevil_unload && auto_open) {
                    connect(outputNum + 1)
                }
            } else {
                last_request = null
            }
        }
    }
    xmlhttp.onabort = function() {
        last_request = xmlhttp;
        if (!liveevil_unload && auto_open) {
            setTimeout(function(){
                connect(outputNum + 1);
            }, 4000);
        }
    }
    xmlhttp.onerror = xmlhttp.onabort;
    xmlhttp.open("GET", base_url + "nevow_liveOutput?outputNum=" + outputNum + "&client-handle-id=" + nevow_clientHandleId, true)
    xmlhttp.send(null)
}


var userAgent = navigator.userAgent.toLowerCase()
if (userAgent.indexOf("msie") != -1) {
    /* IE specific stuff */
    /* Abort last request so we don't 'leak' connections */
    window.attachEvent("onbeforeunload", function() { if (last_request != null) {last_request.abort();} } )
    /* Set unload flag */
    window.attachEvent("onbeforeunload", function() { liveevil_unload = true; } )
} else if (document.implementation && document.implementation.createDocument) {
    /* Mozilla specific stuff (onbeforeunload is in v1.7+ only) */
    window.addEventListener("beforeunload", function() { liveevil_unload = true; }, false)
}


if (auto_open) {
    connect(0)
}


function nevow_clientToServerEvent(theTarget, node, evalAfterDone) {
    if (theTarget != 'close' && liveevil_unload) {
        // Server had previously closed the output; let's open it again.
        if (auto_open) {
            liveevil_unload = false }
        connect(0)
    }
    var additionalArguments = ''
    for (i = 3; i<arguments.length; i++) {
        additionalArguments += '&arguments='
        additionalArguments += encodeURIComponent(arguments[i])
    }

    input = createRequest()
    input.onreadystatechange = function() {
        if (input.readyState == 4 && evalAfterDone) {
	    eval(evalAfterDone)
        }
    }
    input.open(
      "GET",
      base_url + "nevow_liveInput?target=" +
      encodeURIComponent(theTarget) +
      '&client-handle-id=' +
      nevow_clientHandleId +
      additionalArguments)

    input.send(null)
}


function nevow_clientToServerEventPOST(theTarget, node, evalAfterDone) {
	if (theTarget != 'close' && liveevil_unload) {
		// Server had previously closed the output; let's open it again.
		if (auto_open) {
			liveevil_unload = false
		}
		connect(0)
	}
	var additionalArguments = ''
	for (i = 3; i < arguments.length; i++) {
		additionalArguments += '&arguments='
		additionalArguments += encodeURIComponent(arguments[i])
	}

	input = createRequest()
	input.onreadystatechange = function() {
		if (input.readyState == 4 && evalAfterDone) {
			eval(evalAfterDone)
		}
	}
	input.open("POST", base_url + "nevow_liveInput?target="
			+ encodeURIComponent(theTarget) + '&client-handle-id='
			+ nevow_clientHandleId)
	input.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	input.send(additionalArguments)
}

function nevow_setNode(node, to) {
    document.getElementById(node).innerHTML = to;
}

function nevow_appendNode(node, what) {
    var oldnode = document.getElementById(node);
    var newspan = document.createElement('span');
    newspan.innerHTML = what;
    for (i=0; i<newspan.childNodes.length; i++) {
        oldnode.appendChild(newspan.childNodes[i]);
    }
}

function nevow_insertNode(node, before) {
    var oldnode = document.getElementById('before');
    var newspan = document.createElement('span');
    newspan.innerHTML = what;
    var previous = oldnode;
    for (i=0; i<newspan.childNodes.length; i++) {
        previous.parentNode.insertBefore(newspan.childNodes[i], previous);
        previous = newspan.childNodes[i];
    }
}

function nevow_closeLive(evalAfterDone) {
    // Tell connect() not to complain at us when the server closes the
    // connection with no serverToClientEvent
    liveevil_unload = true
    var old_auto_open = auto_open
    auto_open = false
    // Tell the server we know we're done, send us an empty event
    // evalAfterDone will be evalled after the server sends us an empty event
    nevow_clientToServerEvent('close', '', evalAfterDone)
    auto_open = old_auto_open
}

