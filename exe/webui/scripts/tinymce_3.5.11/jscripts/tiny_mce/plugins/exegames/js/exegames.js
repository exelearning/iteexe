/*
 * Games Plugin for eXeLearning
 * By Ignacio Gros (http://www.gros.es/) for eXeLearning (http://exelearning.net/)
 * Creative Commons Attribution-ShareAlike (http://creativecommons.org/licenses/by-sa/3.0/)
 */
var eXeGames = {
	values : [
		'hangman'
	], 
    mode : 'create',    
    init : function(){
        mcTabs.displayTab('general_tab','general_panel');
        this.enableTypeChange();
        this.showTypeOptions();
        this.getCurrentValues();
        // Do not allow spaces in the hangman game (to review)
        this.doNotAllowSpaces("hangman-letters");
        for (var tr=0;tr<20;tr++) {
            this.doNotAllowSpaces("hangman-word-"+tr);
        }
    },
	getCurrentValues : function(){
		
		if (!parent) {
			alert(tinyMCEPopup.getLang("exegames.inline_popups_plugin_is_required"));
			return false;
		}
		
        if (typeof(parent.jQuery)!='function') {
			alert(tinyMCEPopup.getLang("exegames.jquery_is_required"));
			return false;			
		}
        
		var inst = tinyMCEPopup.editor;
		var elm = inst.selection.getNode();
		var $j = parent.jQuery;
		var e = $j(elm);
		
		eXeGames.mode = "edit";
        var inside = false;
		var isElement = false;
        
		var vals = this.values;
		var parents;
        var classToSelect;
		for (var i=0;i<vals.length;i++) {
			parents = e.parents(".exe-"+vals[i]);
			if (parents.length>0) {
				inside = true;	
				classToSelect = "exe-"+vals[i];
			} else {
				// IE gets the whole block instead of a part of it
				if (e.hasClass("exe-game") && e.hasClass("exe-"+vals[i])) {
					inside = true;	
					isElement = true;
					parents = e;
					classToSelect = "exe-"+vals[i];
				}				
			}
		}  

        eXeGames.currentGame = "";
        this.loadDefaultValues();
        
        // Edition
        if (inside) {
            if (parents.length!=1 && !isElement) {
                tinyMCEPopup.alert(tinyMCEPopup.getLang('exegames.error_recovering_data'));
                return false;
            }
            eXeGames.currentGame = parents;
            document.getElementById("insert").value=tinyMCEPopup.getLang("exegames.update");
            this.loadPreviousValues(parents,classToSelect);
		}
        
	},
    loadPreviousValues : function(e,type,html){
        var $j = parent.jQuery;
        // Hangman game
        if (type=="exe-hangman") {
            // Get the letters to choose from
            var letters = $j(".exe-hangman-letters",e).html();
            if (letters == "") {
                tinyMCEPopup.alert(tinyMCEPopup.getLang('exegames.error_recovering_data'));
                return false;
            }
            document.getElementById("hangman-letters").value=letters;
            
            var c = e.attr("class");
            
            // Automatically include capital letters 
            var checked = false;
            if (c.indexOf("add-capital-letters")!=-1) checked = true;
            document.getElementById("include-capital-letters").checked = checked;
            
            // Case sensitive
            checked = false;
            if (c.indexOf("case-sensitive")!=-1) checked = true;
            document.getElementById("case-sensitive").checked = checked;
            
            // Get the hints and words
            var hints = $j("dt",e);
            var words = $j("dd",e);
            if (hints.length!=words.length) {
                tinyMCEPopup.alert(tinyMCEPopup.getLang('exegames.error_recovering_data'));
                return false;
            }
            for (var z=0;z<hints.length;z++) {
                document.getElementById("hangman-hint-"+z).value=hints[z].innerHTML;
                document.getElementById("hangman-word-"+z).value=eXeGames.decode64(words[z].innerHTML);
            }
            
            // Accessibility
            var msg = $j(".exe-game-warning",e).html();
            if (msg!="") document.getElementById("no-js-msg").value = msg;
        }
    },
    loadDefaultValues : function(){
        // Hangman game
        document.getElementById("hangman-letters").value=tinyMCEPopup.getLang("exegames.hangman_az");
        // accessibility_panel
        document.getElementById("no-js-msg").value=tinyMCEPopup.getLang("exegames.enable_javascript");
    },
	getSelectedOption : function(n){
		var radios = document.getElementsByName(n);
		for (var i = 0, length = radios.length; i < length; i++) {
			if (radios[i].checked) {
				return radios[i].value;
				break;
			}
		}	
	}, 
    doNotAllowSpaces : function(id) {
        document.getElementById(id).onkeyup = function(){
            this.value = this.value.replace(/ /g,'');
        }        
    },
	enableTypeChange : function(){
		var x;
		var w = document.getElementById("types");
		var i = w.getElementsByTagName("INPUT");
		for (x=0;x<i.length;x++) {
			i[x].onchange = function(){
				eXeGames.showTypeOptions(this.value);
			}
		}
	},
    hideAllTypeOptions : function(){
        for (var x=1;x<(document.getElementsByName("type").length+1);x++) {
            document.getElementById("type"+x+"-options").style.display="none";
            document.getElementById("type"+x+"-instructions").style.display="none";
        }
    },
	showTypeOptions : function(id) {
        if (!id) var id = this.getSelectedOption("type");
		eXeGames.currentTypeID = id;
        this.hideAllTypeOptions();
        document.getElementById(id+"-options").style.display="block";
        document.getElementById(id+"-instructions").style.display="block";
	},
	insert : function(){
        
        var noJS = document.getElementById("no-js-msg").value;
        if (noJS=="") {
            tinyMCEPopup.alert(tinyMCEPopup.getLang('exegames.missing_js_warning'));
            return false;
        }
        
        var ed = tinyMCEPopup.editor;
        var type = this.getSelectedOption("type");
        
        // Hangman game
        var words = new Array();
        if (type=="type1") {
            
            // Check if it has letters to choose from
            var letters = document.getElementById("hangman-letters").value;
            if (letters.length==0) {
                tinyMCEPopup.alert(tinyMCEPopup.getLang('exegames.missing_az'));
                return false;
            }
            // Replace all spaces
            // letters = letters.replace(/ /g, '_');
            
            var table = document.getElementById("hangman-words");
            var trs = table.getElementsByTagName("TR");
            for (var i=0;i<(trs.length-1);i++) {
                var dt = document.getElementById("hangman-hint-"+i);
                var dd = document.getElementById("hangman-word-"+i);
                // Hint with no word
                if (dt.value!="") {
                    if (dd.value=="") {
                        tinyMCEPopup.alert(tinyMCEPopup.getLang('exegames.missing_dd'));
                        return false;
                    }
                // Word with no hint
                } else if (dd.value!="") {
                    if (dt.value=="") {
                        tinyMCEPopup.alert(tinyMCEPopup.getLang('exegames.missing_dt'));
                        return false;
                    }
                }
                // OK
                if (dt.value!="" && dd.value!="") {
                    words.push([dt.value,dd.value]);
                }
            }
            // No words!
            if (words.length==0) {
                tinyMCEPopup.alert(tinyMCEPopup.getLang('exegames.missing_words_to_guess'));
                return false;
            }
            
            // OK (at least one word with hint or definition)
            // Componse the HTML
            var html = "";
            var css = "exe-game exe-hangman";
            if (document.getElementById("include-capital-letters").checked==true) css += " add-capital-letters";
            if (document.getElementById("case-sensitive").checked==true) css += " case-sensitive";
            html += '<div class="exe-game-content">\n';
                html += '<p class="exe-hangman-letters">'+letters+'</p>\n';
                html += '<dl>\n';
                for (var x=0;x<words.length;x++) {
                    // alert("Hint: "+words[x][0]+"\n"+"Word to guess: "+words[x][1])
                    html += '<dt>'+words[x][0]+'</dt>\n';
                    html += '<dd>'+eXeGames.encode64(words[x][1])+'</dd>\n';
                }
                html += '</dl>\n';
            html += '</div>\n';
            html += '<p class="exe-game-warning">'+noJS+'</p>';
            
            // Create or update the game
            if (eXeGames.currentGame=="") {
                html = '<div class="'+css+'">\n'+html+'</div>\n<br />';
                ed.execCommand('mceInsertContent', false, html);
            } else {
                $j = parent.jQuery;
                var e = eXeGames.currentGame;
                e.attr("class",css);
                e.html(html);
            }
            tinyMCEPopup.close();
            
        } // type1 (hangman)
    },
    // Base64 encoder/decoder
    // https://jsfiddle.net/gabrieleromanato/qaght/
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode64 : function(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = this._utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
        }
        return output;
    },
    decode64: function(input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = this._utf8_decode(output);
        return output;
    },
    _utf8_encode: function(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    },
    _utf8_decode: function(utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}
tinyMCEPopup.onInit.add(eXeGames.init, eXeGames);