/*
Script that runs a memory match game
*/


function MemoryMatchGame(gameId) {
	this.gameId = gameId;
	

	/** Number of rows in this grid */
	this.gridRows = 2;

	/** Number of cols in this grid */
	this.gridCols = 2;
	

	/** width of each cell */
	this.cellWidth = 100;
	
	/** height of each cell */
	this.cellHeight = 100;

	/** time in ms from revealing to hiding again in case of non-match */
	this.hideTime = 3000;

	/** multi dimensional array used to hold the pairs */
	this.pairIds = new Array();

	//the image that will normally show in front of items
	this.coverImg = "backface.gif";

	//the image that will be shown behind the question itself
	this.cellbackImg = "fade.gif";

	//this is the item showing right now (if any) whilst waiting for the next one to be chosen
	this.itemRevealed = null;

	this.feedbackEffects = new Array()	
	this.feedbackEffects['positive'] = 'explode';
	this.feedbackEffects['negative'] = 'pulsate';
	
	//default background tile when content is revealed
	this.revealedBg = "";

	/** If true then we can check cards, otherwise something is going on... */
	this.clickEnabled = true;

	/** utime that the first click was made */
	this.startTime = -1;

	/** the total number of matches made so far */
	this.numMatches = 0;

	/** if we are going to use a timer or not */
	this.useTimer = true;

	/** interval reference for timer update function */
	this.timerInterval = null;

	/** If true will hide the cards after the match */
	this.hideAfterMatch = true;

	/** Amount of time to take to hide items after the match */
	this.hideAfterMatchDelay = 4000;
		
	this.hideAfterMatchEffect = "pulsate";

	this.backgroundImg = "background.jpg";

	/** Cell padding in the main table */
	this.cellPadding = 2;

	/** Cell spacing in the main table */
	this.cellSpacing = 2;

	/** default css for items in the cells */
	this.cellStyle = "font: 16pt bold arial, sans-serif; color: white; text-align: center; padding: 5px;";

	this.init = function() {
		$("#memfeedbackpositive" + this.gameId).hide();
		$("#memfeedbacknegative" + this.gameId).hide();
		if(this.useTimer == true) {
			$("#memgame_timer" + this.gameId).val("");
		}else {
		    $("#memgame_timelabel" + this.gameId).hide();
		    $("#memgame_timer" + this.gameId).hide();
        }
	}
	

	/**
	This will generate the game area table
	*/
	this.generateGrid = function() {
		var gridHTML = "";
		//go through and make a single dimensional array in random order
		var gridArray = new Array();
		for (var i = 0; i < this.pairIds.length; i++) {
			var startIndex = i * 2;
			gridArray[startIndex] = this.pairIds[i][0];
		    gridArray[startIndex + 1] = this.pairIds[i][1];
		}
		gridArray.sort(function() { return 0.5 - Math.random(); });
		gridHTML += "<br/>";
		if(this.backgroundImg != null && this.backgroundImg != "") {
			gridHTML += "<img style='position: absolute; z-index: -1' src='"
				+ this.backgroundImg + "'/>";
		}

	    gridHTML += "<table cellpadding='0' cellspacing='0'>";
		

		var dimensionStr = "width: " + this.cellWidth + "px; height: " 
			+ this.cellHeight + "px; ";

		for (var rows = 0; rows < this.gridRows; rows++) {
			gridHTML += "<tr>";
			for (var cols = 0; cols < this.gridCols; cols++) {
				gridHTML += "<td valign='top' style='" + dimensionStr + "'>";
				var cellIndex = (rows * this.gridRows) + cols;
				var cellIdToCopy = gridArray[cellIndex];

				//overall container used to completely hide it....				
				gridHTML += "<div id='matchcontainer" + cellIdToCopy + "' style='overflow: hidden; " + dimensionStr + "'>";

				//cover layer
				gridHTML += "<img id='matchcover" + cellIdToCopy + "' src='" + 
					this.coverImg + "' style='cursor: pointer; position: absolute; z-index: 3'" +
					" onclick='memMatchGame" + this.gameId + ".revealItem(\"" + cellIdToCopy + "\")'/>";
				//actual item
				gridHTML += "<div id='matchitemcell_" + cellIdToCopy  + 
					"' style='position: absolute; overflow: hidden; z-index: 2; " + dimensionStr + " " + this.cellStyle + "'>";
				gridHTML += $("#matchitem" + cellIdToCopy).html();
				gridHTML += "</div>";
				if(this.cellbackImg != null && this.cellbackImg != "") {
					gridHTML += "<img style='position: absolute; z-index: 1' id='matchback" + cellIdToCopy + "' src='" + this.cellbackImg + "'/>";
				}
				
				gridHTML += "</div></td>";
			}
			gridHTML += "</tr>";
		}

		gridHTML += "</table>";

		return gridHTML;
	}

	this.showFeedback = function(feedbackType) {
		var itemId = "memfeedback" + feedbackType + this.gameId;
		$("#" + itemId).show(
			this.feedbackEffects[feedbackType]);
		setTimeout("$('#" + itemId + "').fadeOut();", this.hideTime);
	}

	this.updateTimer = function() {
		var timeNow = new Date().getTime();
		var numSecsTotal = (timeNow - this.startTime) / 1000;
		var numMins = parseInt(numSecsTotal / 60);
		var numSecs = Math.round(numSecsTotal - (numMins * 60));
		var numSecsStr = new String(numSecs);
		if(numSecs < 10) {
			numSecsStr = "0" + numSecsStr;
		}
		var timerStr = new String(numMins) + ":" + numSecsStr;
		$("#memgame_timer" + this.gameId).val(timerStr);
	}

	this.revealItem = function(itemId) {
		//check and see if something is going on ...
		if(this.clickEnabled == false) {
			return;
		}

		//check and see if we need to start the timer
		if(this.useTimer == true && this.startTime == -1) {
			this.startTime = new Date().getTime();
			this.timerInterval = setInterval("memMatchGame" + 
				this.gameId + ".updateTimer()", 1000);
		}

		$("#matchcover" + itemId).fadeOut();
		if(this.itemRevealed == null) {
			//nothing else shown right now... so assign it
			this.itemRevealed = itemId;
		}else {
			//see is this a correct guess or a wrong guess
			this.clickEnabled = false;
			setTimeout("memMatchGame" + this.gameId + ".clickEnabled = true", this.hideTime + 500);
			var gotMatch = this.checkForMatch(itemId, this.itemRevealed);
			if(gotMatch) {
				//leave items and set itemRevealed as null
				this.showFeedback("positive");
				this.numMatches++;
				if(this.numMatches == ((this.gridRows * this.gridCols)/2)) {
					//we have matched 'em all...
					if(this.useTimer == true) {
						clearInterval(this.timerInterval);
					}
				}
				$("#matchitemcell_" + this.itemRevealed).effect("pulsate", "fast");	
				$("#matchitemcell_" + itemId).effect("pulsate", "fast");
				if(this.hideAfterMatch) {
					setTimeout('$("#matchcontainer' + this.itemRevealed + 
						'").hide("' + this.hideAfterMatchEffect +'");', this.hideAfterMatchDelay);
					setTimeout('$("#matchcontainer' + itemId + 
						'").hide("' + this.hideAfterMatchEffect +'");', this.hideAfterMatchDelay);
				}
				this.itemRevealed = null;
			}else {
				setTimeout('$("#matchcover' + this.itemRevealed + '").fadeIn();', this.hideTime);
				setTimeout('$("#matchcover' + itemId + '").fadeIn();', this.hideTime);
				this.itemRevealed = null;
				this.showFeedback('negative');
			}
		}
	}

	/**	
	This function will check two ids to see if they are actually a match
	*/
	this.checkForMatch = function(id1, id2) {
		for(var i = 0; i < this.pairIds.length; i++) {
			if(this.pairIds[i][0] == id1 && this.pairIds[i][1] == id2) {
				return true;
			}else if(this.pairIds[i][0] == id2 && this.pairIds[i][1] == id1) {
				return true;
			}
		}
		return false;
	}

	/**
	This will add a new pair of matching elements to the game
	They should have element ids matchitem<id> e.g. matchitem0_0
	In the argument to this function provide only 0_0
	*/
	this.addPairToMatch = function(id1, id2) {
		var newPairArr = new Array(id1, id2);
		this.pairIds[this.pairIds.length] = newPairArr;
	}
}
