/**
 * GeoGebra Activity iDevice (edition code)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Authors: Ignacio Gros (http://gros.es/) and Javier Cayetano Rodríguez for http://exelearning.net/
 *
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
 
var $exeDevice = {
    
    // We use eXe's _ function
	i18n : {
		name : _('GeoGebra Activity')
	},

    activityURLbase : "https://www.geogebra.org/m/",
	
	init : function(){
		
		 this.createForm();
		 
	},
	
	// True/false options
	trueFalseOptions : {
		"showMenuBar": [_("Show menu bar"),false],
		"showAlgebraInput": [_("Allow algebra input"),false],
		"showToolBar": [_("Show toolbar"),false],
		"showToolBarHelp": [_("Show toolbar help"),false],
		"showResetIcon": [_("Show reset icon"),false],
		"enableRightClick": [_("Enable right click"),false],
		"errorDialogsActive": [_("Error dialogs active"),false],
		"preventFocus": [_("Prevent focus"),false],
		"showZoomButtons": [_("Show zoom buttons"),true],
		"showFullscreenButton": [_("Show fullscreen button"),true],
		"disableAutoScale": [_("Disable auto-scale"),false],
		"showSuggestionButtons": [_("Show suggestion buttons"),true],
		"playButton": [_("Play button"),true]
		/*
		"scale":1,
		"appName":"classic",
		"buttonRounding":0.7,
		"language":"en",
		*/		
	},
	
	// Create the form to insert HTML in the TEXTAREA
	createForm : function(){
		var html = '\
			<div id="eXeAutoGeogebraForm">\
				<p class="exe-idevice-description">'+_("Insert a GeoGebra activity from www.geogebra.org. It requires an Internet connection.").replace(' www.geogebra.org',' <a href="https://www.geogebra.org/" target="_blank" rel="noopener noreferrer">www.geogebra.org</a>')+'</p>\
				<fieldset class="exe-fieldset">\
					<legend><a href="#">'+_("Instructions")+'</a></legend>\
					<div class="exe-textarea-field">\
						<label for="geogebraActivityInstructions" class="sr-av">'+_("Instructions")+': </label>\
						<textarea id="geogebraActivityInstructions" class="exe-html-editor"\></textarea>\
					</div>\
				</fieldset>\
				<fieldset class="exe-fieldset">\
					<legend><a href="#">'+_("General Settings")+'</a></legend>\
					<div>\
						<p>\
							<label for="geogebraActivityURL">'+_("URL")+': </label><input type="text" name="geogebraActivityURL" id="geogebraActivityURL" /> \
							<label for="geogebraActivityURLexample">'+_("Example")+': </label><input type="text" id="geogebraActivityURLexample" name="geogebraActivityURLexample" readonly="readonly" value="'+this.activityURLbase+'VgHhQXCC" />\
						</p>\
						<p>\
							<label for="geogebraActivityWidth">'+_("Width")+': </label><input type="text" max="1500" name="geogebraActivityWidth" id="geogebraActivityWidth" /> px\
							<label for="geogebraActivityHeight">'+_("Height")+': </label><input type="text" max="1500" name="geogebraActivityHeight" id="geogebraActivityHeight" /> px\
						</p>\
					</div>\
				</fieldset>\
				<fieldset id="eXeAutoGeogebraAdvancedOptions" class="exe-fieldset exe-fieldset-closed exe-feedback-fieldset">\
					<legend><a href="#">'+_("Advanced Options")+'</a></legend>\
					<div>\
						<p id="geogebraActivityLangWrapper">\
							<label for="geogebraActivityLang">'+_("Language")+': </label><input type="text" max="2" name="geogebraActivityLang" id="geogebraActivityLang" /> <span class="input-instructions">es, en, fr, de, ca, eu, gl...</span>\
							<label for="geogebraActivityBorderColor">'+_("Border color")+': </label><input type="text" max="6" name="geogebraActivityBorderColor" id="geogebraActivityBorderColor" class="exe-color-picker" />\
						</p>\
						<div id="eXeAutoGeogebraCheckOptions">'+this.getTrueFalseOptions()+'</div>\
						<p id="geogebraActivitySCORMblock">\
							<label for="geogebraActivitySCORM"><input type="checkbox" name="geogebraActivitySCORM" id="geogebraActivitySCORM" /> '+_("Save score button")+'</label>\
							<span id="geogebraActivitySCORMoptions">\
								<label for="geogebraActivitySCORMbuttonText">'+_("Button text")+': </label>\
								<input type="text" max="100" name="geogebraActivitySCORMbuttonText" id="geogebraActivitySCORMbuttonText" value="'+_("Save score")+'" /> \
							</span>\
						</p>\
						<div id="geogebraActivitySCORMinstructions">\
							<ul>\
								<li>'+_("The button will only be displayed when exporting as SCORM and while editing in eXeLearning.")+'</li>\
								<li>'+_('Include only one GeoGebra activity with a "Save score" button in the page.')+'</li>\
								<li>'+_("The activity with button has to be the last GeoGebra activity on the page (or it won't work).")+'</li>\
								<li>'+_('Do not include a "SCORM Quiz" iDevice in the same page.')+'</li>\
							</ul>\
						</div>\
					</div>\
				</fieldset>\
			</div>\
		';
		
		// Insert the form
        var field = $("#activeIdevice textarea");
        field.before(html);
		
        $("#geogebraActivityURLexample").focus(function(){
			this.select();
		});
        
        $("#geogebraActivityWidth,#geogebraActivityHeight").keyup(function(){
            var v = this.value;
            v = v.replace(/\D/g,'');
            v = v.substring(0,4);
            this.value = v;
        });
		
		$("#geogebraActivityLang").keyup(function(){
            var v = this.value;
            v = v.replace(/[^A-Za-z]/g, "");
            v = v.substring(0,2);
            this.value = v;
		});
		
		$("#geogebraActivitySCORM").change(function(){
			if (this.checked) {
				$("#geogebraActivitySCORMoptions,#geogebraActivitySCORMinstructions").hide().css({opacity:0,visibility:"visible"}).show().animate({opacity:1},500);
			} else {
				$("#geogebraActivitySCORMoptions,#geogebraActivitySCORMinstructions").hide();
			}
		});
		
		this.loadPreviousValues(field);
		
	},
	
	getTrueFalseOptions : function(){
		
		var html = "";
		var opts = this.trueFalseOptions;
		for (var i in opts) {
			var checked = "";
			html += '<p>';
				html += '<label for="geogebraActivity'+i+'">';
				if (opts[i][1]==true) checked = ' checked="checked"';
				html += '<input type="checkbox" id="geogebraActivity'+i+'"'+checked+' /> ';
				html += opts[i][0];
				html += '</label>';
			html += '</p>';
		}
		
		return html;
		
	},
	
	// Load the saved values in the form fields
	loadPreviousValues : function(field){
		
		// Set default language
		var defaultLang = "en";
		var langs = ["es","en","fr","de","ca","eu"];
		var docLang = $("html").eq(0).attr("lang");
		if (langs.indexOf(docLang)>-1) defaultLang = langs[langs.indexOf(docLang)];
		var langField = $("#geogebraActivityLang");
		langField.val(defaultLang);

		var originalHTML = field.val();
		if (originalHTML != '') {
			
			var wrapper = $("<div></div>");
			wrapper.html(originalHTML);
			
			var div = $("div",wrapper);
            
            if (div.length==0) return;
			div = div.eq(0);
			if (!div.hasClass("auto-geogebra")) return;			
			
			var css = div.attr("class");
            
            // URL
            var id = css.replace("auto-geogebra auto-geogebra-","");
                id = id.split(" ");
                id = id[0];                
            if (id!="") $("#geogebraActivityURL").val(this.activityURLbase+id);
            
            if (div.hasClass("auto-geogebra-scorm")) {
				$('#geogebraActivitySCORM').prop('checked', true);
				// scorm-button-text
				var btn = $(".scorm-button-text",div);
				if (btn.length==1) {
					btn = btn.html();
					btn = btn.replace(" (","");
					btn = btn.slice(0,-1);
					$("#geogebraActivitySCORMbuttonText").val(btn);
				}
				$("#geogebraActivitySCORMoptions").css("visibility","visible");
				$("#geogebraActivitySCORMinstructions").show();
			}
			var parts = css.split(" ");
			for (var i=0;i<parts.length;i++) {
                var part = parts[i];
				var part0 = part;
				if (part.indexOf("auto-geogebra-height-")>-1) {
                    part = parseInt(part.replace("auto-geogebra-height-",""));
                    $('#geogebraActivityHeight').val(part);
                } else if (part.indexOf("auto-geogebra-width-")>-1) {
                    part = parseInt(part.replace("auto-geogebra-width-",""));
                    $('#geogebraActivityWidth').val(part);
                } else if (part.indexOf("language-")>-1) {
					$('#geogebraActivityLang').val(part.replace("language-",""));
				} else if (part.indexOf("auto-geogebra-border-")>-1) {
					$('#geogebraActivityBorderColor').val(part.replace("auto-geogebra-border-",""));
				}
				var opts = this.trueFalseOptions;
				for (var p in opts) {
					if (part==p) {
						if (opts[p][1]==false) $('#geogebraActivity'+p).prop('checked', true);
					} else {
						if (part0.slice(0,-1)==p) $('#geogebraActivity'+p).prop('checked', false);
					}
				}
            }
			
			// Instructions
			var instructions = $(".auto-geogebra-instructions",wrapper);
			if (instructions.length==1) $("#geogebraActivityInstructions").val(instructions.html());
		}		
		
	},
	
	save : function(){
        
        var urlBase = this.activityURLbase;
        
        // URL
        var url = $("#geogebraActivityURL").val();
            url = url.replace("https://ggbm.at/",urlBase);
        if (url=="") {
            eXe.app.alert(_("Required") + ": " +_("URL"));
            return false;
        } else if (url.indexOf(urlBase)!=0) {
            eXe.app.alert(_("Format") + ' - ' +_("URL") + ": "+urlBase+"VgHhQXCC");
            return false;
        }
        
        url = url.replace(urlBase,"");
        url = url.split("/");
        if (url.length!=1 || url=='') {
            eXe.app.alert(_("Format") + ' - ' +_("URL") + ": "+urlBase+"VgHhQXCC");
            return false;
        }        
        url = url[0];
		
		var divContent = "";
		
		// Instructions
		var instructions = tinymce.editors[0].getContent();
		if (instructions!="") divContent = '<div class="auto-geogebra-instructions">'+instructions+'</div>';
		
		divContent += '<p><a href="'+urlBase+url+'" target="_blank">'+urlBase+url+' ('+_("New Window")+')</a></p>';
        
        var css = 'auto-geogebra auto-geogebra-'+url;
        
        if (document.getElementById("geogebraActivitySCORM").checked) {
			var buttonText = $("#geogebraActivitySCORMbuttonText").val();
			if (buttonText=="") {
				eXe.app.alert(_("Please write the button text."));
				return false;
			}
			css += " auto-geogebra-scorm";
			divContent += '<span class="scorm-button-text"> ('+buttonText+')</span>';
		}
        
        var width = $("#geogebraActivityWidth").val();
        if (!isNaN(width) && width!="") {
            css += " auto-geogebra-width-"+width;
        }
        
        var height = $("#geogebraActivityHeight").val();
        if (!isNaN(height) && height!="") {
            css += " auto-geogebra-height-"+height;
        }
		
		// Border color
		var borderColor = $("#geogebraActivityBorderColor").val();
		if (borderColor!="" && borderColor!="ffffff") css += " auto-geogebra-border-"+borderColor;

		// Advanced options
		var lang = $("#geogebraActivityLang").val();
		if (lang.length==2 && lang!="en") css += " language-"+lang;
		
		var opts = this.trueFalseOptions;
		for (var i in opts) {
			var opt = $("#geogebraActivity"+i);
			if (opt.is(':checked')) {
				if (opts[i][1]==false) css += " "+i;
			} else {
				if (opts[i][1]==true) css += " "+i+"0";
			}
		}		
        
		var html = '<div class="'+css+'">'+divContent+'</div>';
		
        // Return the HTML to save
		return html;
		
	}

}
