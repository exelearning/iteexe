/**
 * GeoGebra Activity iDevice
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Authors: Ignacio Gros (http://gros.es/) and Javier Cayetano Rodríguez for http://exelearning.net/
 *
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 *
 * Loading icon generated with http://www.ajaxload.info/
 */
var $eXeAutoGeogebra = {
    geogebraScript : 'https://cdn.geogebra.org/apps/deployggb.js',
    defaults : {
        width : 565,
        height : 363
    },
	hasSCORMbutton : false,
	isInExe : false,
    getBase : function(){
        if (typeof($exeAuthoring)!='undefined') return "/scripts/idevices/geogebra-activity/export/";
        return "";
    },
    init : function(){
        this.activities = $(".auto-geogebra");
        if (this.activities.length==0) return; // Nothing to do
		// Editing a iDevice
		if (typeof($exeAuthoring)!='undefined' && $("#exe-submitButton").length>0) {
			this.activities.hide();
			if (typeof(_)!='undefined') this.activities.before('<p>'+_('GeoGebra Activity')+'</p>');
			return;
		}
        if (!navigator.onLine) {
            return;
        }
		if ($(".QuizTestIdevice .iDevice").length>0) this.hasSCORMbutton = true;
        this.indicator.start();
		if (typeof($exeAuthoring)!='undefined') this.isInExe = true;
		if ($("body").hasClass("exe-scorm")) this.loadSCORM_API_wrapper();
		else this.loadGeogebraScript();
    },
    loadSCORM_API_wrapper : function(){
		if (typeof(pipwerks)=='undefined') $exe.loadScript('SCORM_API_wrapper.js','$eXeAutoGeogebra.loadSCOFunctions()');
        else this.loadSCOFunctions();
    },
    loadSCOFunctions : function(){
        if (typeof(exitPageStatus)=='undefined') $exe.loadScript('SCOFunctions.js','$eXeAutoGeogebra.loadGeogebraScript()');
        else this.loadGeogebraScript();
    },
    loadGeogebraScript : function(){
        if (typeof(GGBApplet)=='undefined') $exe.loadScript(this.geogebraScript,'$eXeAutoGeogebra.enable()');
        else this.enable();
    },
    indicator : {
        start : function(){
            $eXeAutoGeogebra.activities.each(function(i){
				window['$eXeAutoGeogebraButtonText'+i] = "";
				var txt = $(".scorm-button-text",this);
				if (txt.length==1) {
					txt = txt.html().replace(" (","");
					txt = txt.slice(0,-1);
					window['$eXeAutoGeogebraButtonText'+i] = txt;
				}
				var size = $eXeAutoGeogebra.indicator.getSize(this);
				var intro = "";
				var instructions = $(".auto-geogebra-instructions",this);
				if (instructions.length==1 && instructions.text()!="") {
					intro = '<div class="auto-geogebra-instructions">'+instructions.html()+'</div>';
				}
				$(this).before(intro).wrap('<div class="auto-geogebra-wrapper"></div>').addClass("auto-geogebra-loading").css({
					"width":size[0]+"px",
					"height":size[1]+"px"
				}).html("");
			});
        },
		getSize : function(e){
			var w = $eXeAutoGeogebra.defaults.width;
			var h = $eXeAutoGeogebra.defaults.height;
			var c = e.className;
				c = c.split(" ");
			for (var i=0;i<c.length;i++) {
				if (c[i].indexOf("auto-geogebra-width-")==0) w = c[i].replace("auto-geogebra-width-","");
				else if (c[i].indexOf("auto-geogebra-height-")==0) h = c[i].replace("auto-geogebra-height-","");
			}
			return [w,h];
		},
        stop : function(){
            $eXeAutoGeogebra.activities.removeClass('auto-geogebra-loading').css('min-height','auto');
        }
    },
    enable : function(){
        this.activities.each(function(i){
            setTimeout(function(){
                $eXeAutoGeogebra.indicator.stop();
            },3000);
            var c = this.className;
                c = c.split(" ");
                if (c.length>1) {
                    var id = c[1].replace("auto-geogebra-","");
                    $eXeAutoGeogebra.addActivity(this,id,c,i);
                }
        })
    },
    addActivity : function(e,id,c,inst) {
		var sfx = id+inst;
		$(e).html('').css('margin','0 auto');
        e.id = "auto-geogebra-"+sfx;
        var width = this.defaults.width;
        var height = this.defaults.height;
		var lang = "en";
		var borderColor = "#FFFFFF";
		for (var i=0;i<c.length;i++) {
            var currentClass = c[i];
            if (currentClass.indexOf('auto-geogebra-width-')==0) {
                currentClass = currentClass.replace("auto-geogebra-width-","");
                currentClass = parseInt(currentClass);
                if (!isNaN(currentClass) && currentClass>0) width = currentClass;
            } else if (currentClass.indexOf('auto-geogebra-height-')==0) {
                currentClass = currentClass.replace("auto-geogebra-height-","");
                currentClass = parseInt(currentClass);
                if (!isNaN(currentClass) && currentClass>0) height = currentClass;
            } else if (currentClass.indexOf('language-')==0) {
				lang = currentClass.replace("language-","");
			} else if (currentClass.indexOf('auto-geogebra-border-')==0) {
                currentClass = currentClass.replace("auto-geogebra-border-","");
                borderColor = "#"+currentClass;
            }
        }
        var parameters = {
            "id": "auto-geogebra-"+sfx,
            "width":width,
            "height":height,
            "showMenuBar":(c.indexOf("showMenuBar") > -1 ? true : false),
            "showAlgebraInput":(c.indexOf("showAlgebraInput") > -1 ? true : false),
            "showToolBar":(c.indexOf("showToolBar") > -1 ? true : false),
            "showToolBarHelp":(c.indexOf("showToolBarHelp") > -1 ? true : false),
            "showResetIcon":(c.indexOf("showResetIcon") > -1 ? true : false),
            "enableLabelDrags":false,
            "enableShiftDragZoom":false,
            "enableRightClick":(c.indexOf("enableRightClick") > -1 ? true : false),
            "errorDialogsActive":(c.indexOf("errorDialogsActive") > -1 ? true : false),
            "useBrowserForJS":false,
            "preventFocus":(c.indexOf("preventFocus") > -1 ? true : false),
            "showZoomButtons":(c.indexOf("showZoomButtons0") > -1 ? false : true),
            "showFullscreenButton":(c.indexOf("showFullscreenButton0") > -1 ? false : true),
            "scale":1,
            "disableAutoScale":(c.indexOf("disableAutoScale") > -1 ? true : false),
            "clickToLoad":false,
            "appName":"classic",
            "showSuggestionButtons":(c.indexOf("showSuggestionButtons0") > -1 ? false : true),
            "buttonRounding":0.7,
            "buttonShadows":(c.indexOf("showMenuBar") > -1 ? true : false),
            "playButton":(c.indexOf("playButton0") > -1 ? false : true),
            "language":lang,
			"borderColor":borderColor,
            // use this instead of ggbBase64 to load a material from geogebra.org
            "material_id":id
        };
        var views = {'is3D': 0,'AV': 1,'SV': 0,'CV': 0,'EV2': 0,'CP': 0,'PC': 0,'DA': 0,'FI': 0,'macro': 0};
            window['applet'+sfx] = new GGBApplet(parameters, '5.0', views);
            window['applet'+sfx].inject("auto-geogebra-"+sfx);
        
        // Get score button
		if (c.length>2 && c[2]=='auto-geogebra-scorm') {
			var buttonText = window['$eXeAutoGeogebraButtonText'+inst];
			if (buttonText!="") {
				if (this.hasSCORMbutton==false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
					this.hasSCORMbutton=true;
					var fB = '<div class="auto-geogebra-get-score iDevice_buttons feedback-button js-required">';
							if (!this.isInExe) fB += '<form action="#" onsubmit="return false">';
								fB += '<p><input type="button" id="auto-geogebra-sendScore-'+sfx+'" value="'+buttonText+'" class="feedbackbutton" /></p>';
							if (!this.isInExe) fB += '</form>';
						fB += '</div>';
					$(e).after(fB);
					$("#auto-geogebra-sendScore-"+sfx).click(function(){
						var id = this.id.replace("auto-geogebra-sendScore-","");
						$eXeAutoGeogebra.sendScore(id);
						return false;
					});					
				}
			}
        }
    },
    sendScore : function(id) {
		// To do (the applet has no method to get the score):
		// window['applet'+id].getValue("SCORMRawScore")
		if (typeof(ggbApplet)!='undefined' && typeof(ggbApplet.getValue)=='function') {
			var score = ggbApplet.getValue("SCORMRawScore");
           		scorm.SetScoreRaw(score+"" );
            		scorm.SetScoreMax("10");
            		scorm.save();
			alert($exe_i18n.yourScoreIs+score);
		} else {
			alert($exe_i18n.dataError);
		}
    }
}
$(function(){
    $eXeAutoGeogebra.init();
});
