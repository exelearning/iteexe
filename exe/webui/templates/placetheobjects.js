/*

Place the Objects supporting javascript

v0.1

*/

var placeTheObjectsGameData = new Array();

placeTheObjectsGameData['active'] = "";


/*
Drop by click - used to allow the user to 'drop' the selected item by clicking
and will then animate into position.  Here for touch screen interfaces
(e.g. those confused that dragging is moving around the page)
*/
function objectDropByClick(evt) {
    var gameId = placeTheObjectsGameData['active'];
    var mainOffset = $("#placetheobjects_" + gameId + "_main").offset();
    var x = evt.layerX - mainOffset.left;
    var y = evt.layerY - mainOffset.top;
    
    if(gameId != "" && placeTheObjectsGameData[gameId]['activePick'] != '') {
        var activePick = placeTheObjectsGameData[gameId]['activePick'];
        var bounds = placeTheObjectsGameData[gameId]['elements'][activePick]['bounds'];
        
        if((x > bounds[0] && x < bounds[0] + bounds[2]) && (y > bounds[1] && y < bounds[1] + bounds[3])) {
            var partOffset = $("#" + activePick).offset();
            var moveX = (mainOffset.left + x) - partOffset.left;
            if(moveX > 0) {
                moveX = "+=" + moveX;
            } else {
                moveX = "-=" + Math.abs(moveX);
            }
            var moveY = (mainOffset.top + y) - partOffset.top;
            if(moveY > 0) {
                moveY = "+=" + moveY;
            } else {
                moveY = "-=" + Math.abs(moveY);
            }
            document.getElementById(activePick).style.border = "";
            document.getElementById(activePick).onclick = null;
            $("#" + activePick).animate({
                'margin-left': moveX,
                'margin-top': moveY
            }, 1000);
            placeTheObjectsGameData[gameId]['elements'][activePick]['status'] = 'placed';
            placeTheObjectsGameData[gameId]['activePick'] = "";
            objectPlaceOK(gameId, activePick);
        }else {
            checkObjectPlaceOK(gameId, activePick);
        }
    }
}

/*
This initializes the array for the place the objects game
given a game id
*/
function initPlaceTheObjectsGameData(gameId) {
        placeTheObjectsGameData[gameId] = new Array();        
        placeTheObjectsGameData[gameId]['score'] = 0;
        placeTheObjectsGameData[gameId]['elements'] = new Array();
        placeTheObjectsGameData[gameId]['activePick'] = "";

        $(document).ready(function(){
                $("#placetheobjects_" + gameId + "_main").css("visibility", "hidden");
                $("#placetheobjects" + gameId + "_partbin").css("visibility", "hidden");
                $("#placetheobjects_" + gameId + "_positivefeedback").hide();
                $("#placetheobjects_" + gameId + "_negativefeedback").hide();
                $(".placeTheObjectTargetClass" + gameId).hide();
        });
        
        //TODO: Fix me
        $("#placetheobjects" + gameId + "_partbin TD").css("width", "100px").css("height", "100px");
        
        if(exe_isTouchScreenDev == true) {
            document.getElementById("placetheobjects_" + gameId + "_main").onmousedown = objectDropByClick;
        }
}

/*
To be called when the user starts dragging an item
*/
function placeObjectReadyTarget(droppableId) {
    $("#" + droppableId).show();
}

function placeObjectHideTarget(droppableId) {
    $("#" + droppableId).hide();
}


/*
To be called when the user clicks the introduction message
*/
function startPlaceGame(gameId) {
        $("#placetheobjects_" + gameId + "_main").hide().css("visibility", "").fadeIn("slow");
        $("#placetheobjects_" + gameId + "_clicktostart").fadeOut("slow");
        $("#placetheobjects" + gameId + "_partbin").hide().css("visibility", "").fadeIn("slow");
        placeTheObjectsGameData['active'] = gameId;
}




/* used to check if a drop was successful - if not show negative feedback */
function checkObjectPlaceOK(gameId, draggableElementId) {
        var status = placeTheObjectsGameData[gameId]['elements'][draggableElementId]['status'];
        if(status != 'placed') {
                //means object in the wrong place
                var callbackFunction = function() { 
                        setTimeout('$("#placetheobjects_' + gameId + '_negativefeedback").fadeOut("slow")', 3000);
                };
                var options = {};
                $("#placetheobjects_" + gameId + "_negativefeedback").show("drop", options, callbackFunction);
        }
}

/* used to store status of elements */
function objectPlaceOK(gameId, draggableElementId) {
        var callbackFunction = function() { 
                setTimeout('$("#placetheobjects_' + gameId + '_positivefeedback").fadeOut("slow")', 3000);
        };
        var options = {};
        placeTheObjectsGameData[gameId]['elements'][draggableElementId]['status'] = 'placed';
        $("#placetheobjects_" + gameId + "_positivefeedback").show("drop", options, callbackFunction);
}

/* used to pick up a given object (for touch screen ui)*/
function objectPlacePickupElement(gameId, draggableElementId) {
    if(placeTheObjectsGameData[gameId]['activePick'] != "") {
        placeTheObjectsGameData[gameId]['activePick'].style.border = "";
    }
    
    placeTheObjectsGameData[gameId]['activePick'] = draggableElementId;
    document.getElementById(draggableElementId).style.border = "2px solid red";
    
}

