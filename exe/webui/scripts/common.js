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

function showMe(ident, w, h)
{
    var elmDiv = document.getElementById('popupmessage');

    hideMe();
        
    if (!elmDiv || 
        elmDiv.innerHTML != document.getElementById(ident).innerHTML){

        var elmDiv = document.createElement('div');
        elmDiv.id  = 'popupmessage';
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


function clearHidden()
{
    document.contentForm.action.value = "";
    document.contentForm.object.value = "";
}

// Sets the hidden action and object fields, then submits the 
// contentForm to the server
function submitLink(action, object) 
{
    document.contentForm.action.value = action;
    document.contentForm.object.value = object;
    document.contentForm.submit();
}


