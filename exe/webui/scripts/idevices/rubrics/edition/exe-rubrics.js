/**
 * Rubrics iDevice (edition code)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Ignacio Gros (http://gros.es/) for http://exelearning.net/
 *
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */

// To do:
// Try to use eXe's confirm messages
// Remove the hasCategories option
// Add validation (see what happens when trying to save it empty)

var $exeDevice = {
	
	// i18n
	title : _("Rubric"),
	
	// Default rubrics (just one for the moment)
	rubrics : [			
		{
			"title" : "Example rubric (4x4)",
			"categories" : [
				"Criteria 1",
				"Criteria 2",
				"Criteria 3",
				"Criteria 4"
			],
			"scores" : [
				"Level 1",
				"Level 2",
				"Level 3",
				"Level 4"
			],
			"descriptions" : [
				[
					{
						"weight" : "2.5",
						"text" : "Descriptor (1.1)"
					},
					{
						"weight" : "1.75",
						"text" : "Descriptor (1.2)"
					},
					{
						"weight" : "1.50",
						"text" : "Descriptor (1.3)"
					},
					{
						"weight" : "1.25",
						"text" : "Descriptor (1.4)"
					}						
				],
				[
					{
						"weight" : "2.5",
						"text" : "Descriptor (2.1)"
					},
					{
						"weight" : "1.75",
						"text" : "Descriptor (2.2)"
					},
					{
						"weight" : "1.50",
						"text" : "Descriptor (2.3)"
					},
					{
						"weight" : "1.25",
						"text" : "Descriptor (2.4)"
					}					
				],
				[
					{
						"weight" : "2.5",
						"text" : "Descriptor (3.1)"
					},
					{
						"weight" : "1.75",
						"text" : "Descriptor (3.2)"
					},
					{
						"weight" : "1.50",
						"text" : "Descriptor (3.3)"
					},
					{
						"weight" : "1.25",
						"text" : "Descriptor (3.4)"
					}						
				],
				[
					{
						"weight" : "2.5",
						"text" : "Descriptor (4.1)"
					},
					{
						"weight" : "1.75",
						"text" : "Descriptor (4.2)"
					},
					{
						"weight" : "1.50",
						"text" : "Descriptor (4.3)"
					},
					{
						"weight" : "1.25",
						"text" : "Descriptor (4.4)"
					}						
				]					
			]
		}
	],	
	
	init : function(){
		
		var field = $("#activeIdevice textarea").eq(0);
		
		// Create the edition form (#yyyRubricEditor)
		// All the form will be created each time a default rubric is loaded or when editing an existing rubric
		// The editable table and the "Rubric information" fieldset will be in #yyyRubricEditor
		var html = '\
			<div class="exe-idevice-info">'+_("Complete the table to define a scoring guide. Define the score or value of each descriptor.")+'</div>\
			<div id="yyyRubricEditor"></div>\
			<div id="yyyPreviousContent"></div>\
		';
		field.before(html);	
	
		// Get original data (the iDevice content) and put it in #yyyPreviousContent
		var originalHTML = field.val();
		$("#yyyPreviousContent").html(originalHTML);
		
		// Save the content in a JSON object (the Rubric information won't be in it yet)
		var data = this.tableToJSON("yyyPreviousContent");
		
		this.resetForm(true);
		
		if (data) {
			
			var block, tmp;
			
			// Rubric instructions
			block = $(".exe-rubric-instructions",div);
			if (block.length==1) {
				data.instructions = block.text();
			}
			
			// Rubric information
			var div = $("#yyyPreviousContent");
			var author = "";
			var authorURL = "";
			var license = "";
			var visibleInfo = true;
			
			block = $(".exe-rubric-authorship",div);
			if (block.length==1) {
				// Visibility
				if (block.hasClass("sr-av")) var visibleInfo = false;
				// Author
				tmp = $("span.author",block);
				if (tmp.length==1) {
					tmp = tmp.eq(0);
					author = tmp.text();
				} else {
					tmp = $("a.author",block);
					if (tmp.length==1) {
						tmp = tmp.eq(0);
						authorURL = tmp.attr("href");
						author = tmp.text();
					}
				}
				// License
				tmp = $("span.license a",block);
				if (tmp.length==1) {
					tmp = tmp.eq(0);
					tmp = tmp.text();
					if (tmp.indexOf("CC ")==0) {
						license = tmp.replace("CC ","CC-");
					}
				} else {
					tmp = $("span.license",block);
					if (tmp.length==1) {
						tmp = tmp.eq(0);
						tmp = tmp.text();
						if (tmp=="GNU/GPL") license = "gnu-gpl";
						else if (tmp==_("All Rights Reserved")) license = "copyright";
						else if (tmp==_("Public Domain")) license = "pd";
					}
				}
			}
			data.author = author;
			data['author-url'] = authorURL;
			data.license = license;
			data["visible-info"] = visibleInfo;
			
			this.jsonToTable(data,"edition");
			this.originalData = data; 
		}
	},
	translateRubric : function(data) {
		data = JSON.stringify(data);
		data = data.replace(/Example rubric/g,_("Example rubric"));
		data = data.replace(/Level/g,_("Level"));
		data = data.replace(/Criteria/g,_("Criteria"));
		data = data.replace(/Descriptor/g,_("Descriptor"));
		data = JSON.parse(data);
		return data;
	},
	confirm : function(str) {
		return confirm(str);
	},
	enableFieldsetToggle : function(){
		// Enable the FIELDSETs Toggler (see authoring.js)
		$("#yyyRubricInformation legend a").click(function(){
			$("#yyyRubricInformation").toggleClass("exe-fieldset-closed");
			return false;
		});
		$("#yyyRubricIntro legend a").click(function(){
			$("#yyyRubricIntro").toggleClass("exe-fieldset-closed");
			return false;
		});	
	},
	
	// Create the form to edit the rubric (each time a rubric is selected or when editing an existing one)
	resetForm : function(createEditor){
		
		// Get the available rubrics (a list)
		if (typeof($exeDevice.options)=='undefined') $exeDevice.options = $exeDevice.getRubricModels();
		
		// Create the "Create rubric" top form
		// The SELECT will be hidden until CEDEC's rubrics are loaded
		var html = '\
			<p>\
				<input type="button" value="'+_("New rubric")+'" id="yyyCreateNewRubric" /> \
				<span id="yyyNewTableOptions">\
					<label for="yyyNewTable">'+_("New rubric: ")+'\
					<select id="yyyNewTable">\
						<option value=""></option>\
						'+$exeDevice.options+'\
					</select>\
					</label>\
				</span>\
				<input type="button" value="'+_("Load CEDEC's rubrics (in Spanish)")+'" id="yyyLoadCEDECRubrics" /> \
			</p>\
		';
		
		// Insert the form in the rubric editor
		var ed = $("#yyyRubricEditor");
			ed.html(html);
			
		// Events
		$("#yyyCreateNewRubric").click(function(){
			var data = $exeDevice.translateRubric($exeDevice.rubrics[0]);
			$exeDevice.jsonToTable(data,"edition");
			$exeDevice.enableFieldsetToggle();
			$exeDevice.setEditionFocus();
			return false;
		});
		$("#yyyNewTable").change(function(){
			var rubric = this.value;
			if (rubric=="") {
				$exeDevice.alert(_("Please select a template"));
				return;
			}
			var data;
			if (rubric.indexOf("cedec")==0) {
				rubric = rubric.replace("cedec","");
				rubric = parseInt(rubric)
				data = $exeDevice.cedecRubrics.rubrics[rubric];
			} else {
				data = $exeDevice.translateRubric($exeDevice.rubrics[rubric]);
			}
			$exeDevice.jsonToTable(data,"edition");
			$exeDevice.enableFieldsetToggle();
			$exeDevice.setEditionFocus();
		});
		
		// Link to load CEDEC's rubrics if onLine and if those rubrics are not loaded yet
		if (navigator && navigator.onLine && typeof($exeDevice.cedecRubrics)=='undefined') {
			var lnk = $("#yyyLoadCEDECRubrics");
			$("#yyyLoadCEDECRubrics").click(function(){
				$("#yyyRubricEditor").addClass("loading");
				$.ajaxSetup({ cache: false });
				$.ajax({
					url: "http://gros.es/tests/cedec/cedec.json",
					dataType: 'json',
					success: function(res){
						$("#yyyRubricEditor").removeClass("loading");
						$exeDevice.cedecRubrics = res;
						$exeDevice.completeRubricModels();
					},
					error: function(){
						$exeDevice.alert(_("Could not retrieve data (Core error)"));
						$("#yyyRubricEditor").removeClass("loading");
					}
				});					
				return false;
			}).show();
		}			
		
		// The first time the form is created, we add the table editor right after it
		if (createEditor==true) ed.after('<div id="yyyTableEditor"></div>');

	},
	
	// Use eXe's alert messages
	alert : function(str) {
		eXe.app.alert(str);
	},
	
	// Get a list of the available rubrics (only one for the moment, that's why there's just a "New rubric" button)
	getRubricModels : function(){
		var html = "";
		var rubrics = $exeDevice.rubrics;
		var rubric, title;
		for (var i=0;i<rubrics.length;i++) {
			rubric = rubrics[i];
			title = rubric['title'];
			title = title.replace(/Example rubric/g,_("Example rubric"));
			html += '<option value="'+i+'">'+title+'</option>';
		}
		return html;
	},
	
	// Update the list of rubrics to include CEDEC's, then show the SELECT and remove the "Load CEDEC's rubrics" button
	completeRubricModels : function(){
		
		// Default rubrics
		var rubrics = $exeDevice.rubrics;
		var rubric, title, i;
		var html = '<optgroup label="'+_("Example rubrics")+'">';
		for (i=0;i<rubrics.length;i++) {
			rubric = rubrics[i];
			title = rubric['title'];
			title = title.replace(/Example rubric/g,_("Example rubric"));
			html += '<option value="'+i+'">'+title+'</option>';
		}
		html += '</optgroup>';
		
		// CEDEC's rubrics
		rubrics = $exeDevice.cedecRubrics.rubrics;
		html += '<optgroup label="'+_("CEDEC's rubrics")+'">';
		for (i=0;i<rubrics.length;i++) {
			rubric = rubrics[i];
			title = rubric['title'];
			title = title.replace(/Example rubric/g,_("Example rubric"));
			html += '<option value="cedec'+i+'">'+title+'</option>';
		}				
		html += '</optgroup>';
		
		$exeDevice.options = html;
		
		$exeDevice.resetForm();
		
		$("#yyyCreateNewRubric").remove();
		$("#yyyNewTableOptions").show();
		
	},
	
	// After adding a new table, change the focus to the first visible INPUT so the user knows what to do
	setEditionFocus : function(){
		$("#yyyCell-2").select();
	},
	
	// Get the table of #id and return it as a JSON object
	tableToJSON : function(id){
		var i, z, t = $("#"+id+" table"), hasCategories = false;
		if (t.length!=1) return;
		var data = {};
			data.title = $("caption",t).html();
			data.categories = [];
			data.scores = [];
			data.descriptions = [];
		var trs = $("tbody tr",t);
		for (i=0;i<trs.length;i++) {
			var tdH = $("th",trs[i]);
			if (tdH.length==1) {
				hasCategories = true;
				data.categories.push(tdH.html());
			}
			var tds = $("td",trs[i]);
			var description = [];
			var tdContent;
			for (z=0;z<tds.length;z++) {
				tdContent = tds[z].innerHTML;
				tdContent = tdContent.split(" <span");
				var txt = tdContent[0];
				var weight = "";
				if (tdContent.length==2) {
					// Get text between two rounded brackets
					try {
						weight = tdContent[1].match(/\(([^)]+)\)/)[1];
					} catch(e){
						weight = "";
					}
				}
				tdContent = {
					"weight" : weight,
					"text" : txt
				}
				description.push(tdContent)
			}
			data.descriptions.push(description);
		}
		var ths = $("thead th",t);
		for (i=0;i<ths.length;i++) {
			if (!(hasCategories && i==0)) data.scores.push(ths[i].innerHTML);
			
		}	
		if (data.categories.length==0) delete data.categories;
		return data;			
	},
	
	// Add the scores of the first level and show the result in #yyyMaxScore
	setMaxScore : function(){
		var trs = $("#yyyTableEditor tbody tr");
		var nums = [];
		trs.each(function(){
			var val = $("td input",this).eq(1).val();
				val = val.replace(/[^0-9.,]/g, "");
				val = val.replace(/,/g, ".");
			var isNumeric = true;
			if (val=="" || isNaN(val)) isNumeric = false;
			if (isNumeric) nums.push(val);
		});
		var res = 0;
		for (var i=0;i<nums.length;i++){
			res += parseFloat(nums[i]);
		}
		res = Math.round( res * 10 ) / 10;
		$("#yyyMaxScore").val(res);
	},
	
	// Transform a JSON object into an HTML table
	getTableHTML : function(data,hasCategories) {
		var html = "<table class='exe-table'>";
			html += "<caption>"+data.title+"</caption>";
			html += "<thead>";
			html += "<tr>";
				if (hasCategories) html += "<th>&nbsp;</th>";
				for (i=0;i<data.scores.length;i++) {
					html += "<th>"+data.scores[i]+"</th>";
				}
			html += "</tr>";
			html += "</thead>";
			html += "<tbody>";
				for (i=0;i<data.descriptions.length;i++){
					c = data.descriptions[i];
					html += "<tr>";
						if (hasCategories) html += "<th>"+data.categories[i]+"</th>";
						for (z=0;z<data.scores.length;z++) {
							html += "<td>"+c[z].text;
							if (c[z].weight!="") html+= " <span>("+c[z].weight+")</span>";
							html += "</td>";	
						}
					html += "</tr>";
					html += "";
				}
			html += "";
			html += "</tbody>";
			html += "</table>";
		return html;
	},
	
	// Tranform the JSON data into:
	// If mode is "normal":  Instructions (optional) + A table + the rubric footer (authorship, license...)
	// If mode is "edition": Instructions (fieldset) + A table + The max score input + The buttons to reset and add rows and columns + The "Rubric information" fieldset + The i18n tab
	jsonToTable : function(data,mode){
		
		var hasCategories = true;
		if (!data.categories || data.categories.length==0) hasCategories = false;
		var table = $exeDevice.getTableHTML(data,hasCategories);
		
		// Create the iDevice content
		if (mode=="normal") {
			
			var intro = "";
			var instructions = $("#yyyRubricInstructions").val();
			if (instructions!="") intro = '<p class="exe-rubric-instructions">'+instructions+'</p>';
			
			var info = "";
			var author = $("#yyyRubricAuthor").val();
			var authorURL = $("#yyyRubricAuthorURL").val();
			var license = $("#yyyRubricLicense").val();
			
			var visibility = " sr-av";
			if ($("#yyyShowRubricInfo").prop("checked")) visibility = "";
			if (author!="" || authorURL!="" || license!="") {
				var info = '<p class="exe-rubric-authorship'+visibility+'">';
				if (author!="") {
					if (authorURL!="") info += '<a href="'+authorURL+'" target="_blank" class="author" rel="noopener">'+author+'</a>. '
					else info += '<span class="author">'+author+'</span>. ';
				}
				info += '<span class="title"><em>'+data.title+'</em></span> '
				if (license!="") {
					info += '<span class="license">(';
						if (license.indexOf("CC")==0) info += '<a href="http://creativecommons.org/licenses/" rel="license nofollow noopener" target="_blank" title="Creative Commons '+license+'">'+license.replace("CC-","CC ")+'</a>'
						else if (license=="gnu-gpl") info += 'GNU/GPL';
						else if (license=="copyright") info += _("All Rights Reserved");
						else if (license=="pd") info += _("Public Domain");
					info += ')</span>';
				}
				info += '</p>';
			}
			return intro + table + info;
		}		
		
		var html = "";
		
			html += '<div class="exe-form-tab" title="' + _('General settings') + '">';
		
			// Rubric use instructions
			var instructions = "";
			if (data.instructions) instructions = data.instructions;			
			html += '\
				<fieldset id="yyyRubricIntro" class="exe-fieldset exe-feedback-fieldset exe-fieldset-closed">\
					<legend><a href="#">'+_("Instructions")+'</a></legend>\
					<div>\
						<p class="exe-text-field">\
							<label for="yyyRubricInstructions">'+_("Rubric use instructions (optional)")+': </label>\
							<input type="text" id="yyyRubricInstructions" value="'+instructions+'" />\
						</p>\
					</div>\
				</fieldset>';
		
			html += table;
			
			// Max score + Buttons (reset, add row, add column)
			html += '<p>\
				<label for="yyyMaxScore">'+_("Maximum score:")+'</label> <input type="text" id="yyyMaxScore" readonly="readonly" value="" /> <span id="yyyMaxScoreInstructions">'+_("The result of adding the scores of the first level.")+'</span>\
				<input type="button" id="yyyAppendCol" value="'+_("New column")+'" />\
				<input type="button" id="yyyAppendRow" value="'+_("New row")+'" />\
				<input type="button" id="yyyReset" value="'+_("Reset")+'" />\
			</p>';
			
			// Rubric information
			var author = "";
			var authorLink = "";
			var license = "";
			if (data.author) author = data.author;
			if (data['author-url']) authorLink = data['author-url'];
			if (data.license) license = data.license;
			html += '\
				<fieldset id="yyyRubricInformation" class="exe-fieldset exe-feedback-fieldset exe-fieldset-closed">\
					<legend><a href="#">'+_("Rubric information")+'</a></legend>\
					<div>\
						<p><label for="yyyShowRubricInfo"><input type="checkbox" id="yyyShowRubricInfo" /> '+_("Show rubric information")+'</label></p>\
						<p>\
							<label for="yyyRubricAuthor">'+_("Source/Author")+':</label> <input type="text" id="yyyRubricAuthor" value="'+author+'" /> \
							<label for="yyyRubricAuthorURL">'+_("Source/Author Link")+':</label> <input type="text" id="yyyRubricAuthorURL" value="'+authorLink+'" /> \
							<label for="yyyRubricLicense">'+_("License")+'</label>\
							<select id="yyyRubricLicense">\
								<option value="">&nbsp;</option>\
								<option value="pd">'+_("Public Domain")+'</option>\
								<option value="gnu-gpl">GNU/GPL</option>\
								<option value="CC-BY">Creative Commons BY</option>\
								<option value="CC-BY-SA">Creative Commons BY-SA</option>\
								<option value="CC-BY-ND">Creative Commons BY-ND</option>\
								<option value="CC-BY-NC">Creative Commons BY-NC</option>\
								<option value="CC-BY-NC-SA">Creative Commons BY-NC-SA</option>\
								<option value="CC-BY-NC-ND">Creative Commons BY-NC-ND</option>\
								<option value="copyright">Copyright ('+_("All Rights Reserved")+')</option>\
							</select>\
						</p>\
					</div>\
				</fieldset>';
				
			html += '</div>'; // / .exe-form-tab (General settings)
			
			// Language tab (i18n)
			html += '<div class="exe-form-tab" title="' + _('Language settings') + '">\
				<p>' + _("Custom texts (or use the default ones):") + '</p>\
				<p>To do.</p>\
			</div>';
		
		var ed = $("#yyyTableEditor");
		this.editor = ed;
		ed.html(html);
		
		// Enable the tabs
		$exeAuthoring.iDevice.tabs.init("yyyTableEditor");
		
		// Buttons (events)
		$("#yyyReset").click(function(){
			Ext.Msg.confirm(_("Atention"), _("Revert all changes? This can't be undone."), function(button) {
				if (button == "yes") {
					if (typeof($exeDevice.originalData)!='undefined') {
						$exeDevice.jsonToTable($exeDevice.originalData,"edition");
						$exeDevice.enableFieldsetToggle();
					} else {
						$("#yyyTableEditor").html("");
					}
				}
			});
		});				
		$("#yyyAppendRow").click(function(){
			$exeDevice.dom.addRow("end");
		});
		$("#yyyAppendCol").click(function(){
			$exeDevice.dom.addCol();
		});			
		
		// Should the rubric information be visible?
		var showRubricInfo = data["visible-info"] || true;
		$("#yyyShowRubricInfo").prop("checked",showRubricInfo);
		
		// Select the right license
		$("#yyyRubricLicense").val(license);
		
		// Add the "with-categories" css class if needed (to review)
		$("table",ed).attr("id","yyyTable");
		if (hasCategories) {
			$("table",ed).addClass("with-categories");
		}
		
		// Make the table editable
		this.makeEditable();
				
	},
	
	// DOM methods to add a row or a column to the table
	dom : {
		addRow : function(position){
			// We always add the row at the end, but you could add it at the beggining too.
			$exeDevice.makeNormal();
			var trs = $("#yyyTable tbody tr");
			// Copy the last row and paste it at the end with no data
			var tr = trs.eq(trs.length-1);
			var newTR = tr.clone();
			var tmp = $("<div></div>");
				tmp.html(newTR);
				$("th,td",tmp).each(function(){
					var html = this.innerHTML;
					if (html.indexOf("<span")==-1) this.innerHTML = "X";
					else this.innerHTML = "X <span>(X)</span>";
				});
				if (position=="end") tr.after(tmp.html());
				else if (position=="start") $("#yyyTable tbody").prepend(tmp.html());
			$exeDevice.makeEditable();
		},
		addCol : function() {
			$exeDevice.makeNormal();
			$("#yyyTable tr").each(function(i){
				var td, newTD;
				if (i==0) {
					td = $("th",this);
					newTD = '<th>X</th>';
				} else {
					td = $("td",this);
					newTD = '<td>X</td>';
				}
				td = td.eq(td.length-1);
				td.after(newTD);					
			});
			$exeDevice.makeEditable();
		}
	},
	
	save : function(){
		
		this.makeNormal();
		var data = this.tableToJSON("yyyTableEditor");
		
		// To do now: Validate
		
		// Get the rubic instructions and add the to the data
		var instructions = $("#yyyRubricInstructions").val();
		if (instructions!="") data.instructions = instructions;
		
		// Get the rubric information and add it to data
		data["visible-info"] = $("#yyyShowRubricInfo").prop("checked");
		var author = $("#yyyRubricAuthor").val();
		if (author!="") data.author = author;
		var authorURL = $("#yyyRubricAuthorURL").val();
		if (authorURL!="") data["author-url"] = authorURL;
		var license = $("#yyyRubricLicense").val();			
		if (license!="") data.license = license;	
		
		// Return the HTML to save
		return this.jsonToTable(data,"normal");
		
	},
	
	// Make the table editable
	makeEditable : function() {
		
		var cells = $("caption,td,th",this.editor);
		this.cells = cells;
		cells.each(function(i){
			var html = this.innerHTML;
			var isTopCell = false;
			if (html=="&nbsp;") isTopCell = true;
			html = html.split(" <span");
			var extra = ""
			// The text INPUT of the first cell should be hidden
			if (isTopCell) extra = 'style="visibility:hidden" '
			this.innerHTML = '<input type="text" '+extra+'id="yyyCell-'+i+'" value="'+html[0]+'" />';
			if ($(this).prop("tagName")=='TD') {
				if (html.length=="2") {
					try {
						// Try to get anything between ()
						html = html[1].match(/\(([^)]+)\)/)[1];
					} catch(e){
						html = "";
					}
				} else {
					html = "";
				}
				this.innerHTML += '<span><label>'+_("Score")+': </label><input type="text" id="yyyCell-'+i+'-weight" class="yyyWeight" value="'+html+'" title="'+_("Score (include a number)")+'" /></span>';
			}
		});
		
		// Add row buttons (move up, mode down, delete row)
		var trActions = '<span class="yyyActions">\
				<a href="#" class="yyyMoveTRUp" title="'+_("Up")+'"><span class="sr-av">&#8593;</span></a> \
				<a href="#" class="yyyMoveTRDown" title="'+_("Down")+'"><span class="sr-av">&#8595;</span></a> \
				<a href="#" class="yyyDeleteTR" title="'+_("Delete")+'"><span class="sr-av">&#120;</span></a> \
			</span>';
		$("tbody tr",this.editor).each(function(){
			$(this.firstChild).prepend(trActions);
		});
		// Events:
			// Move up or down
			$(".yyyMoveTRUp,.yyyMoveTRDown").click(function(){
				var row = $(this).parents("tr:first");
				if ($(this).is(".yyyMoveTRUp")) {
					row.insertBefore(row.prev());
				} else {
					row.insertAfter(row.next());
				}
				return false;
			});
			// Delete row
			$(".yyyDeleteTR").click(function(){
				var confirm = $exeDevice.confirm(_("Delete the row?"));
				if (confirm==false) return false;
				var row = $(this).parents("tr:first");
					row.remove();
				return false;
			});		
		
		// Add column buttons (move left, move right, delete)
		var thActions = '<span class="yyyActions">\
				<a href="#" class="yyyMoveTRToTheLeft" title="'+_("Left")+'"><span class="sr-av">&#8592;</span></a> \
				<a href="#" class="yyyMoveTRToTheRight" title="'+_("Right")+'"><span class="sr-av">&#8594;</span></a> \
				<a href="#" class="yyyDeleteColumn" title="'+_("Delete")+'"><span class="sr-av">&#120;</span></a> \
			</span>';
		$("thead th",this.editor).each(function(){
			$(this).prepend(thActions);
		});		
		// Events: 
			// Move left
			$(".yyyMoveTRToTheLeft").click(function(){
				var colnum = $(this).closest("th").prevAll("th").length;
				jQuery.each($("#yyyTable tr"), function() { 
					$(this).children(":eq("+colnum+")").after($(this).children(":eq("+(colnum-1)+")"));
				});
				return false;                    
			}); 
			// Move right
			$(".yyyMoveTRToTheRight").click(function(){
				var colnum = $(this).closest("th").prevAll("th").length;
				jQuery.each($("#yyyTable tr"), function() { 
					$(this).children(":eq("+(colnum+1)+")").after($(this).children(":eq("+(colnum)+")"));
				});
				return false;                    
			});
			// Delete column
			$(".yyyDeleteColumn").click(function(){
				if ($("#yyyTable thead th").length==2) {
					$exeDevice.alert(_("There should be at least one level."));
					return false;
				}				
				var confirm = $exeDevice.confirm(_("Delete the column?"));
				if (confirm==false) return false;
				var colnum = $(this).closest("th").prevAll("th").length;
				if (colnum==0) $("#yyyTable").removeClass("with-categories");
				$("#yyyTable tr").each(function(){
					$("th,td",this).each(function(i){
						if (i==colnum) $(this).remove();
					});
				});
				return false;
			});		
		
		// Set the maximum score
		$(".yyyWeight").keyup(function(){
			$exeDevice.setMaxScore();	
		}).blur(function(){
			$exeDevice.setMaxScore();	
		});
		$exeDevice.setMaxScore();
		
	},
	
	// Transform the editable table into a normal one
	makeNormal : function(){
		var cells = this.cells;
		cells.each(function(i){
			var id;
			var html = this.innerHTML;
			var tmp = $("<div></div>");
			tmp.html(html);
			$("label",tmp).remove();
			var inputs = $("input",tmp);
			if (inputs.length==1) {
				id = inputs.eq(0).attr("id");
				html = $("#"+id).val();
			} else if (inputs.length==2) {
				id = inputs.eq(0).attr("id");
				html = $("#"+id).val();
				id = inputs.eq(1).attr("id");
				html += ' <span>('+$("#"+id).val()+')</span>';
			}
			this.innerHTML = html;
		});
	}
	
}