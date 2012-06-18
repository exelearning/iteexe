var liveevil_unload = false; var auto_open = true;

function createRequest() {
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest()
    } else {
        return new ActiveXObject("Microsoft.XMLHTTP")
    }
}

var last_request = null

function connect(outputNum) {
    var xmlhttp = createRequest()
    last_request = xmlhttp
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.responseText) {
                eval(xmlhttp.responseText)
                if (!liveevil_unload && auto_open) {
                    connect(outputNum + 1)
                }
            } else {
                last_request = null
                if (!liveevil_unload) {
                    alert('The connection to the remote server was lost. The page may fail to work correctly. Reloading the page may fix the problem.');
                }
            }
        }
    }
    xmlhttp.open("GET", "nevow_liveOutput?outputNum=" + outputNum, true)
    xmlhttp.send(null)
}

function register_onunload() {
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
}

register_onunload()
if (auto_open) {
    connect(0)
}


function nevow_clientToServerEvent(theTarget, node) {
    if (liveevil_unload) {
        // Server had previously closed the output; let's open it again.
        if (auto_open) {
            liveevil_unload = false }
        connect(0)
    }
    var additionalArguments = ''
    for (i = 2; i<arguments.length; i++) {
        additionalArguments += '&arguments='
        additionalArguments += encodeURIComponent(arguments[i])
    }

    input = createRequest()
    input.onreadystatechange = function() {
        //alert('change');
    }
    input.open("GET", "nevow_liveInput?target=" + encodeURIComponent(theTarget)+additionalArguments)
    input.send(null)
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

function nevow_closeLive() {
    // Tell connect() not to complain at us when the server closes the 
    // connection with no serverToClientEvent
    liveevil_unload = true
    var old_auto_open = auto_open
    auto_open = false
    // Tell the server we know we're done, send us an empty event
    nevow_clientToServerEvent('close', '')
    auto_open = old_auto_open
}

