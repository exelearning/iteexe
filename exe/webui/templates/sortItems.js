
//if this variable is set then we will not check the text value to automatically mark something correct
// for sorting e.g. B-O-B
var sortActivityExcludeAutoText = new Array();

var sortAcitvitySelectedArr = new Array();

var activeBg = "red";


var colorCache = "";

var sortItemsAdvanceText = "<<";
var sortItemsPrevText = ">>";


function clickItem(itemId, sortId) {
    if(colorCache != "") {
        if(sortAcitvitySelectedArr[sortId]) {
            document.getElementById(sortAcitvitySelectedArr[sortId]).style.backgroundColor 
                = colorCache;
        }
    }
    
    sortAcitvitySelectedArr[sortId] = itemId;
    var element = document.getElementById(itemId);
    colorCache = element.style.backgroundColor;
    element.style.backgroundColor = activeBg;
}

function moveSortableItem(sortId, increment) {
    //first find the array / order of it now
    var orderAsIs = $("#sortme" + sortId).sortable("toArray");
    var selectedItem = sortAcitvitySelectedArr[sortId];
    var currentIndex = orderAsIs.indexOf(selectedItem);
    
    var nextItem = orderAsIs[currentIndex + increment];
    if(increment == 1) {
        $("#" + selectedItem).insertAfter("#" + nextItem);    
    }else {
        $("#" + selectedItem).insertBefore("#" + nextItem);
    }
}

function initSortActivity(sortId) {
	var sortItemsListOriginal = eval("sortmeItemIds" + sortId);
	var sortItemsList = new Array();
	for (var i = 0; i < sortItemsListOriginal.length; i++) {
		sortItemsList[i] = sortItemsListOriginal[i];
	}
	sortItemsList.sort(function() { return 0.5 - Math.random()});
	var sortHolderId = "#sortme" + sortId;
	var itemStyle = eval("sortMeStyle" + sortId);
	$(function() {
		for(var i = 0; i < sortItemsList.length; i++) {	
			var thisItemHTML = $("#" + sortItemsList[i]).html();
			var thisItemId = "li" + sortItemsList[i];
			var clickHandle = "onclick='clickItem(\"li" + sortItemsList[i] + "\", \"" + sortId + "\")'" ;
			if(exe_isTouchScreenDev == false) {
			    clickHandle = "";
			}
			$(sortHolderId).append("<li class='sortablesub' " + clickHandle + " id='li" + sortItemsList[i] + "' style='z-index: 5; " 
				+ itemStyle + "'>" + thisItemHTML + "</li>");
			
		}

				
		$(sortHolderId).sortable();	
		
		var buttonContainer = "";
		
		if(exe_isTouchScreenDev == true) {
		    buttonContainer += "<div class='sortMoveButtonHolder'>";
				    buttonContainer += "<input type='button' value='" + sortItemsAdvanceText 
		        + "' style='' onclick='moveSortableItem(\"" + sortId + "\", 1)'/>";

            buttonContainer += "<input type='button' value='" + sortItemsPrevText 
                + "' style='' onclick='moveSortableItem(\"" + sortId + "\", -1)'/>";
	        buttonContainer += "</div>";
	        $(buttonContainer).insertAfter(sortHolderId);
        }
        
		//$(sortHolderId).disableSelection();
		$("#sortmecorrectoverlay" + sortId).hide();
		$("#sortmewrongoverlay" + sortId).hide();
		$(sortHolderId).unbind("click");
	});
	
	
}


/**
Check the order of the items in the list
*/
function checkOrder(sortId) {
	var orderAsIs = $("#sortme" + sortId).sortable("toArray");
	var correctOrder = eval("sortmeItemIds" + sortId);				
	var orderCorrect = true;
	for (var i = 0 ; i < orderAsIs.length; i++) {
		var currentItemId = orderAsIs[i];
		var compareToCorrectId = "li" + correctOrder[i];
		if(currentItemId != compareToCorrectId) {
		        //check and see the value of this
		        if(sortId in sortActivityExcludeAutoText &&  sortActivityExcludeAutoText[sortId] == true) {
		                orderCorrect = false;
		        }else {
		                var val1 = $("#" + currentItemId).text();
		                var val2 = $("#" + compareToCorrectId).text();
		                if(val1 != val2) {
                			orderCorrect = false;
			        }
			}
		}
	}
	if(orderCorrect) {
		$("#sortmecorrectoverlay" + sortId).show(eval("sortMeEffect" + sortId));
		$("#sortme" + sortId).sortable("disable");
		playPositiveFeedbackDefault();
	}else {
		$("#sortmewrongoverlay" + sortId).show(eval("sortMeEffectWrong" + sortId));
		setTimeout("$('#sortmewrongoverlay" + sortId + "').fadeOut();", 10000);
		playNegativeFeedbackDefault();
	}
}

