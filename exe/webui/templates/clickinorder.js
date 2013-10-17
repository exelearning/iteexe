/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


var clickInOrderActiveGameId = "";
var lastClickEvent = null;

//x, y, width, height
var BOUND_X = 0;
var BOUND_Y = 1;
var BOUND_WIDTH = 2;
var BOUND_HEIGHT = 3;

function clickInOrderPassClick(evt) {
    lastClickEvent = evt;
    setTimeout("clickInOrderPassClickRun()", 200);
}

function clickInOrderPassClickRun() {
    var currentClickInOrderObj = eval("clickInOrderGame" + clickInOrderActiveGameId);
    currentClickInOrderObj.validateClick(lastClickEvent);
}

function ClickInOrder(gameId) {
    this.gameId = gameId;

    //this tracks what should be the next thing to click on
    this.currentClickableItemIndex = 0;

    this.areasToClick = new Array();

    //this is used to see if the click was correct - find wrong clicks
    //by waiting 50ms and then checking if this was within the timeout
    this.lastValidClickTime = 0;

    this.gameWon = false;

    this.randomizeQuestions = false;

    //Timer Mode = 0 : No Timer, 1 : Stopwatch
    this.timerMode = 0;

    this.gameRunning = false;

    this.timerInterval = -1;

    this.timeStarted = 0;

    this.init = function() {
        //go through and hide the elements that we need to
        for (var i = 0; i < this.areasToClick.length; i++) {
            var currentArea = this.areasToClick[i];
            $("#clickableAreaInstruction_" + this.gameId + "_" +
                currentArea.clickAreaId).hide();
            $("#clickableArea_" + this.gameId + "_" +
                currentArea.clickAreaId).hide();
            $("#clickableAreaShowMe_" + this.gameId + "_" +
                currentArea.clickAreaId).hide();
        }

        $("#clickableAreaNegativeFeedback" + this.gameId).hide();
        $("#clickableAreaPositiveFeedback" + this.gameId).hide();
        $("#clickableAreaGameCompleteFeedback" + this.gameId).hide();
        $("#clickinordermainarea" + this.gameId).hide();
        $("#clickinorderstartarea" + this.gameId).css("cursor", "pointer");
        


        //shuffle questions if we want to...
        if(this.randomizeQuestions == true) {
                this.areasToClick.sort(function() { return 0.5 - Math.random()});
        }

        
    };
    
    //start the game here
    this.startGame = function() {
        this.showHint(0);
        this.timeStarted = new Date().getTime();
        this.gameRunning = true;
        
        document.getElementById("clickinordercontainer" + this.gameId).onclick = clickInOrderPassClick;
        
        $("#clickinorderstartarea" + this.gameId).hide();
        $("#clickinordermainarea" + this.gameId).show();
        if(this.timerMode != 0) {
                this.timerInterval = setInterval('clickInOrderGame' + this.gameId 
                + '.incrementTimer()', 1000);
        }
        
        clickInOrderActiveGameId = this.gameId;
    }

    this.incrementTimer = function() {
        var totalTime = new Date().getTime() - this.timeStarted;
        var mins = parseInt((totalTime / 1000)/60);
        var seconds = Math.round(((totalTime / 1000) - (mins * 60)));
        var timerStr = new String(mins) + ":" + new String(seconds);
        $("#clickinordertimer" + this.gameId).val(timerStr);
    };    

    this.addClickableArea = function(clickableAreaId, hideAfterTime, bounds) {
        this.areasToClick[this.areasToClick.length] =
            new ClickableArea(this, clickableAreaId, hideAfterTime, bounds);
    };

    this.advanceArea = function() {
        if(this.currentClickableItemIndex < this.areasToClick.length - 1) {
            this.showHint(this.currentClickableItemIndex + 1);
            this.currentClickableItemIndex++;
        }else {
            //Game won
            if(this.timerMode != 0) {
                clearInterval(this.timerInterval);
            }

            this.gameRunning = false;
            setTimeout('$("#clickableAreaGameCompleteFeedback' + this.gameId + '").show("explode");', 3000)
        }
        
    };

    //this will show the
    this.showHint = function(clickableAreaIndex) {
        if(clickableAreaIndex != this.currentClickableItemIndex) {
            var oldInstructionElementId = "#clickableAreaInstruction_" + this.gameId 
                    + "_" + this.areasToClick[this.currentClickableItemIndex].clickAreaId;
            $(oldInstructionElementId).hide();
            //hide the box that is not for clicking (can mess things up)
            var oldClickableAreaId = "#clickableArea_" + this.gameId + "_"
                + this.areasToClick[this.currentClickableItemIndex].clickAreaId;
            $(oldClickableAreaId).hide();
        }
        var elementId = "#clickableAreaInstruction_" + this.gameId + "_" +
            this.areasToClick[clickableAreaIndex].clickAreaId;
        $(elementId).show();
        var clickableElementId = "#clickableArea_" + this.gameId + "_" +
            this.areasToClick[clickableAreaIndex].clickAreaId;
        //$(clickableElementId).show();
        $("#clickinordercounter" + this.gameId).attr("value",
            new String(clickableAreaIndex + 1) + "/" +
            new String(this.areasToClick.length));
    };

    this.showFeedback = function(feedbackElementId) {
        setTimeout("$('" + feedbackElementId + "').hide()", 3000);
        $(feedbackElementId).show();
    }

    this.checkClickTimer = function() {

    };

    this.validateClick = function(evt) {
        //check that the game is running and has been going more than 100ms 
        if(this.gameRunning == false || (new Date().getTime() - this.timeStarted) <= 500) {
            return;
        }
        
        var bounds = this.areasToClick[this.currentClickableItemIndex].bounds;
        var mainAreaOffset = $("#clickinordermainarea" + this.gameId).offset();
        var x = 0;
        var y = 0;
        
        //Strange behaviour - in Chrome layerX is inaccurate, in Firefox evt.offsetX is null
        if(evt.offsetX) {
            x = evt.offsetX;
            y = evt.offsetY;
        }else {
            x = evt.layerX;
            y = evt.layerY;
        }
        
        //bounds x, y, width, height
        if( (x > bounds[BOUND_X] && x < (bounds[BOUND_X] + bounds[BOUND_WIDTH])) && (y > bounds[BOUND_Y] && (bounds[BOUND_Y] + bounds[BOUND_HEIGHT]))) {
            this.correctAnswer(this.areasToClick[this.currentClickableItemIndex].clickAreaId);
        }else if((new Date().getTime() - this.lastValidClickTime ) > 100) {
            this.showFeedback("#clickableAreaNegativeFeedback" + this.gameId);
        }
    };
    
    this.correctAnswer = function(clickableAreaId) {
        //correct - show the item there...
        if(this.areasToClick[this.currentClickableItemIndex].hideAfterTime &&
            this.areasToClick[this.currentClickableItemIndex].hideAfterTime > 0)
            {
                    setTimeout("$('#clickableAreaShowMe_" + this.gameId + "_" +
                        clickableAreaId + "').hide()",
                        this.areasToClick[this.currentClickableItemIndex].hideAfterTime);
            }

        this.advanceArea();
        this.lastValidClickTime = new Date().getTime();
        this.showFeedback("#clickableAreaPositiveFeedback" + this.gameId);
        $("#clickableAreaShowMe_" + this.gameId + "_" + clickableAreaId).show();
        
    }

    this.checkClick = function(clickableAreaId) {
        if(this.gameRunning == false) {
                return;
        }

        if(this.areasToClick[this.currentClickableItemIndex].clickAreaId == clickableAreaId) {
            this.correctAnswer(clickableAreaId);
        }else {
            setTimeout('clickInOrderGame' + this.gameId + '.validateClick()', 100);
        }
    }

}

/**
 * This represents a clickable area object
 *
 * id needs to correlate with two dom objects:
 *   clickableArea_<gameId>_clickAreaId
 *   clickableAreaInstruction_<gameId>_clickAreaId
 *   bounds x, y, width, height
 */
function ClickableArea(clickInOrderGame, clickAreaId,  hideAfterTime, bounds) {

    this.clickInOrderGame = clickInOrderGame;

    this.clickAreaId = clickAreaId;

    this.hideAfterTime = hideAfterTime;

    this.bounds = bounds;

}
