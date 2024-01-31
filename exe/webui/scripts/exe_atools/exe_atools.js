$exe.atools = {
	options : {
		draggable : true,
		modeToggler : false,
		translator : false
	},
	storage : {
		originalFontSize : "",
		setOriginalFontSize : function(){
			var originalFontSize = window.getComputedStyle(document.body).getPropertyValue('font-size');
				originalFontSize = originalFontSize.replace("px","");
				$exe.atools.storage.originalFontSize = Number(originalFontSize);
		},
		getTranslatorStatus : function(){
			var opts = $exe.atools.options;
			if (opts.translator!==true) return "off";
			var e = localStorage.getItem('exeAtoolsTranslator');
			if (e==="on") return "on";
			return "off";
		},
		getToolbarStatus : function(){
			var e = localStorage.getItem('exeAtoolsStatus');
			if (e==="on") return "on";
			return "off";
		},
		getFontSize : function(){
			var e = localStorage.getItem('exeAtoolsFontSize');
			if (e) return e;
			return "";
		},
		getFontFamily : function(){
			var e = localStorage.getItem('exeAtoolsFontFamily');
			if (e) return e;
			return "";
		},
		getToolbarPosition : function(){
			var e = localStorage.getItem('exeAtoolsToolbarStyles');
			if (e) return e;
			return "";
		}
	},
	init : function(){
		if (!$("body").hasClass("exe-atools")) return;
		if (typeof(localStorage)=='undefined') return;
		$exe.loadScript("exe_atools.css","$exe.atools.start()");
	},
	start : function(){
		var opts = $exe.atools.options;
		$exe.atools.storage.setOriginalFontSize();
		var reader = "";
		if (typeof(SpeechSynthesisUtterance)=="function") reader = '<button id="eXeAtoolsReadBtn">'+$exe_i18n["read"]+'</button>';
		var translator = "";
		if (opts.translator==true) translator = '<button id="eXeAtoolsTranslateBtn">'+$exe_i18n["translate"]+' (Google Translate)</button>';
		var dragBtn = "";
		if (opts.draggable==true) {
			dragBtn = '<button id="eXeAtoolsSetDragHandler" data-drog>'+$exe_i18n["drag_and_drop"]+'</button>';		
		} else {
			localStorage.setItem('exeAtoolsToolbarStyles','');
		}
		var modeBtn = "";
		if (opts.modeToggler==true) {
			modeBtn = '<button id="eXeAtoolsModeToggler">'+$exe_i18n["mode_toggler"]+'</button>';		
		}
		var html = '\
			<div id="eXeAtools" class="loading">\
				<div id="eXeAtoolsBtnSet"><button id="eXeAtoolsBtn" title="'+$exe_i18n.accessibility_tools+'"><span class="sr-av">'+$exe_i18n.accessibility_tools+'</span></button></div>\
				<div id="eXeAtoolsSet">\
                    <h2 class="sr-av">'+$exe_i18n.accessibility_tools+'</h2>\
					'+dragBtn+'<label for="eXeAtoolsFont" class="sr-av">'+$exe_i18n["default_font"]+'</label>\
					<select id="eXeAtoolsFont">\
						<option value="">'+$exe_i18n["default_font"]+'</option>\
						<option value="od">OpenDyslexic</option>\
						<option value="ah">Atkinson Hyperlegible</option>\
						<option value="mo">Montserrat</option>\
					</select><button id="eXeAtoolsLgTextBtn">'+$exe_i18n["increase_text_size"]+'</button><button id="eXeAtoolsSmTextBtn">'+$exe_i18n["decrease_text_size"]+'</button><button id="eXeAtoolsResetBtn">'+$exe_i18n["reset"]+'</button>'+modeBtn+reader+translator+'<button id="eXeAtoolsCloseBtn">'+$exe_i18n["close_toolbar"]+'</button>\
				</div>\
			</div>\
		';
		if ($("body").hasClass("exe-web-site")) $("#skipNav").after(html);
		else $("body").prepend(html);
		if ($exe.atools.storage.getToolbarStatus()=="on") $("body").addClass("exe-atools-on");
		$("#eXeAtoolsSet button").each(function(){
			this.title = this.innerHTML;
			this.innerHTML = '<span class="sr-av">'+this.innerHTML+'</span>';
		});
		this.setEvents();
		// Check the font size
		if ($exe.atools.storage.getFontSize()!="") {
			document.body.style.fontSize = $exe.atools.storage.getFontSize();
		}
		// Choose the font family
		$("#eXeAtoolsFont").val($exe.atools.storage.getFontFamily()).trigger("change");
		// Check if the translator should be on
		if ($exe.atools.storage.getTranslatorStatus()==="on") {
			localStorage.setItem('exeAtoolsTranslator',false);
			$exe.atools.toggleGoogleTranslateWidget();
		}
		// Check the reset button status
		$exe.atools.checkResetBtnStatus();
		// Show the toolbar
		$("#eXeAtools").removeClass("loading");
		// Make it draggable amd set the previous position
		if (opts.draggable==true) {
			var handler = document.getElementById("eXeAtoolsSet");			
			var css = $exe.atools.storage.getToolbarPosition();
			if (css!="") {
				handler.style = css;
			}
			Drog.on(handler);
			// Move so the element does not move to bottom left the first time you drag it
			$exe.atools.Drog.fixPosition(handler);		
		}
	},
	checkResetBtnStatus : function(){
		var btn = $("#eXeAtoolsResetBtn");
		if ($exe.atools.storage.getTranslatorStatus()=="on" || $exe.atools.storage.getFontSize()!="" || $exe.atools.storage.getFontFamily()!="") {
			btn.removeClass("reset-disabled");
		} else {
			btn.addClass("reset-disabled");
		}
	},
	setEvents : function(){
		$("#eXeAtoolsBtn,#eXeAtoolsCloseBtn").click(function(){
			var e = $("body");
			var v = "off";
			e.toggleClass("exe-atools-on");
			if (e.hasClass("exe-atools-on")) v = "on";
			else {
				$("#eXeAtoolsBtn").addClass("eXeAreminder");
				setTimeout(function(){
					$("#eXeAtoolsBtn").removeClass("eXeAreminder");
				},1000);
			}
			localStorage.setItem('exeAtoolsStatus',v);
		});
		$("#eXeAtoolsFont").change(function(){
			var v = this.value;
			var fonts = [
				"od",
				"ah",
				"mo"
			];
			for (var i=0;i<fonts.length;i++) {
				$("body").removeClass("exe-atools-"+fonts[i]);
			}
			if (v!=""){
				$("body").addClass("exe-atools-"+v);
			}
			localStorage.setItem('exeAtoolsFontFamily',v);
			// Check the reset button status
			$exe.atools.checkResetBtnStatus();			
		});
		$("#eXeAtoolsLgTextBtn").click(function(){
			$exe.atools.setFontSize(1);
			// Check the reset button status
			$exe.atools.checkResetBtnStatus();
		});
		$("#eXeAtoolsSmTextBtn").click(function(){
			$exe.atools.setFontSize(-1);
			// Check the reset button status
			$exe.atools.checkResetBtnStatus();
		});
		$("#eXeAtoolsTranslateBtn").click(function(){
			$exe.atools.toggleGoogleTranslateWidget();
			// Check the reset button status
			$exe.atools.checkResetBtnStatus();
		});
		$("#eXeAtoolsReadBtn").click(function(){
			$exe.atools.reader.read();
		});
		$("#eXeAtoolsResetBtn").click(function(){
			if (this.className=="reset-disabled") return false;
			document.body.style.fontSize="";
			localStorage.setItem('exeAtoolsFontSize', '');
			$("#eXeAtoolsFont").val("").trigger("change");
			localStorage.setItem('exeAtoolsFontFamily', '');
			if($exe.atools.storage.getTranslatorStatus()=="on") $exe.atools.toggleGoogleTranslateWidget();
			// To review (Back to left bottom?)
			// $("#eXeAtoolsSet").attr("style","");
			// localStorage.setItem('exeAtoolsToolbarStyles','');
		});
		$("#eXeAtoolsModeToggler").click(function(){
			var c = "exe-atools-dm";
			var b = $("body");
			if (b.hasClass(c)) {
				b.removeClass(c);
				localStorage.setItem('exeAtoolsMode', "");
			} else {
				b.addClass(c);
				localStorage.setItem('exeAtoolsMode', 'dark');
			}
		});
		if ($exe.atools.options.draggable==true) {
			$(window).on("resize",function(){
				$exe.atools.Drog.checkPosition();
			});			
		}
	},
	reader : {
		isReading : false,
		read : function(){
			if (typeof($exe.atools.reader.utterance)=='undefined') $exe.atools.reader.utterance = new SpeechSynthesisUtterance();
			let selectedText = window.getSelection().toString();
			let text = '';
			let lang = document.documentElement.lang;
			if (selectedText !== '') {
				text = selectedText;
				let selectedNode = window.getSelection().anchorNode;
				while (selectedNode && selectedNode.nodeType !== Node.ELEMENT_NODE) {
					selectedNode = selectedNode.parentNode;
				}
				if (selectedNode) {
					const selectedLang = selectedNode.getAttribute('lang');
					if (selectedLang) {
						lang = selectedLang;
					}
				}
			} else {
				text = document.getElementById("main").innerText;
				const bodyLang = document.body.getAttribute('lang');
				if (bodyLang) {
					lang = bodyLang;
				}
			}
			$exe.atools.reader.utterance.lang = lang;
			$exe.atools.reader.utterance.text = text;
			if ($exe.atools.reader.isReading==false) {
				$exe.atools.reader.isReading = true;
				$("#eXeAtoolsReadBtn").addClass("eXeAtoolsReading").attr("title",$exe_i18n["stop_reading"]);
				speechSynthesis.speak($exe.atools.reader.utterance);
			} else {
				$exe.atools.reader.isReading = false;
				$("#eXeAtoolsReadBtn").removeClass("eXeAtoolsReading").attr("title",$exe_i18n["read"]);
				speechSynthesis.cancel();
			}
			$exe.atools.reader.utterance.addEventListener('end', () => {
				$exe.atools.reader.isReading = false;
				$("#eXeAtoolsReadBtn").removeClass("eXeAtoolsReading").attr("title",$exe_i18n["read"]);
			});			
		}
	},
	setFontSize : function(size) {
		// var currentFontSize = parseInt(window.getComputedStyle(document.body).getPropertyValue('font-size'));
		var currentFontSize = document.body.style.fontSize;
			currentFontSize = currentFontSize.replace("px","");
			currentFontSize = parseInt(currentFontSize);
		if (isNaN(currentFontSize)) currentFontSize = $exe.atools.storage.originalFontSize;
		currentFontSize += size;
		$("h2 strong").text(parseInt(window.getComputedStyle(document.body).getPropertyValue('font-size')) + " - " + currentFontSize)
		if (currentFontSize<=$exe.atools.storage.originalFontSize) {
			document.body.style.fontSize = "";
			localStorage.setItem('exeAtoolsFontSize', '');
			return false;
		}
		document.body.style.fontSize = currentFontSize + 'px';
		localStorage.setItem('exeAtoolsFontSize', currentFontSize + 'px');
	},
	toggleGoogleTranslateWidget : function() {
		var googleTranslateWidgetVisible = $exe.atools.storage.getTranslatorStatus();
		if (googleTranslateWidgetVisible=="off") {
			const script = document.createElement('script');
				script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
				script.id = 'google-translate-script';
			document.head.appendChild(script);
			const googleTranslateElement = document.createElement('div');
				googleTranslateElement.id = 'google_translate_element';
				googleTranslateElement.style.position = 'fixed';
				googleTranslateElement.style.top = '0';
				googleTranslateElement.style.right = '0';
				googleTranslateElement.style.zIndex = '1000';
			document.body.appendChild(googleTranslateElement);
			window.googleTranslateElementInit = function() {
				new google.translate.TranslateElement({pageLanguage: 'auto', layout: google.translate.TranslateElement.FloatPosition.TOP_RIGHT}, 'google_translate_element');
			};
			googleTranslateWidgetVisible = "on";
		} else {
			$("#google-translate-script,#google_translate_element,.skiptranslate").remove();
			document.body.style.top = "auto";
			googleTranslateWidgetVisible = "off";
		}
		localStorage.setItem('exeAtoolsTranslator',googleTranslateWidgetVisible);
	},
	Drog : {
		limit : function(x,y){
			var e = $("#eXeAtoolsSet");
			var h = e.height();
			var w = e.width();
			var maxTop = ($(window).height()-h);
			var bodyT = $("body").css("top");
			if (bodyT=="40px") {
				maxTop = maxTop-40;
			}
			var maxLeft = ($(window).width()-w);
			if (x>maxLeft) x = maxLeft;
			else if (x<0) x = 0;
			if (-y>maxTop) y = -maxTop;
			else if (y>0) y = 0;	
			return [x, y];			
		},
		checkPosition : function(){
			if (!$("body").hasClass("exe-atools-on")) return;
			var e = document.getElementById("eXeAtoolsSet");
			var translate = $exe.atools.Drog.getTranslation(e);
			var translateX = translate[0];
			var translateY = translate[1];
			if (translateX==0&&translateY==0) return;
			var pos = $exe.atools.Drog.limit(translateX,translateY);
			var x = pos[0];
			var y = pos[1];
			
			if (x==0&&y==0) {
				e.style = "";
				localStorage.setItem('exeAtoolsToolbarStyles', '');
				return;
			}
			
			e.style.transform = "translate("+x+"px, "+y+"px)";
			localStorage.setItem('exeAtoolsToolbarStyles', e.style.cssText);
		},
		fixPosition : function(e){
			var translate = $exe.atools.Drog.getTranslation(e);
			var translateX = translate[0];
			var translateY = translate[1];
			if (translateX==0&&translateY==0) return;
			Drog.move(e, translateX, translateY);			
		},
		getTranslation : function(e){
			var style = window.getComputedStyle(e);
			var matrix = new WebKitCSSMatrix(style.transform);
			var translateX = matrix.m41;
			var translateY = matrix.m42;
			return [translateX,translateY];
		}
	}
};
/*!
 * Drog.js v1.2.1
 * [Back-compatibility: IE11+]
 * Copyright (c) 2021, Emanuel Rojas Vásquez
 * BSD 3-Clause License
 * https://github.com/erovas/Drog.js
 */
(function(window, document){

    if(window.Drog)
        return console.error('Drog.js has already been defined');

    let Xi = '-Xi', Yi = '-Yi', Xf = '-Xf', Yf = '-Yf', Xt = '-x', Yt = '-y',
        mousedown = 'mousedown', touchstart = 'touchstart',
        mousemove = 'mousemove', touchmove = 'touchmove',
        mouseup = 'mouseup', touchend = 'touchend',
        father = '-f', passive = { passive: false },
        isDrog = '-d', data = '[data-drog]', elmnt, that;

    function addEvent(element, event, callback, opt){
        element.addEventListener(event, callback, opt || false);
    }

    function removeEvent(element, event, callback, opt){
        element.removeEventListener(event, callback, opt || false);
    }    

    function on(element){

        if(element[isDrog])
            return;

        let target = element.querySelector(data) || element;

        // save reference original element into target
        target[father] = element;

        // Save element position
        element[Xt] = 0;
        element[Yt] = 0;

        //element[Xi] = 0;
        //element[Yi] = 0;
        //element[Xf] = 0;
        //element[Yf] = 0;

        // element.style.zIndex = 100000;
        target.style.touchAction = "none";

        // signing element
        element[isDrog] = true;

        addEvent(target, mousedown, drogInit);
        addEvent(target, touchstart, drogInit, passive);
    }

    /*
	function off(element){

        if(!element[isDrog])
            return;        

        let target = element.querySelector(data) || element;

        element.style.zIndex = '';
        element.style.transform = '';
        target.style.touchAction = '';

        // deleting references
        target[father] = null;

        // unsigning element
        element[isDrog] = null;

        removeEvent(target, mousedown, drogInit);
        removeEvent(target, touchstart, drogInit);
    }
	*/

    

    function move(element, x, y){
        
        if(!element[isDrog])
            return;

        x = parseFloat(x) || 0;
        y = parseFloat(y) || 0
        element[Xt] = x;
        element[Yt] = y;
        element.style.transform = 'translate(' + x + 'px,' + y + 'px)';
		// To do now localStorage.setItem('exeAtoolsToolbarStyles', element.style.cssText);
		// To do now console.debug(element.style.cssText)
    }

    function drogInit(e){

        //Fire by central or left click, avoid it
        if(e.which === 2 || e.which === 3)
            return;

        that = this;
        elmnt = that[father];

        //e.preventDefault();

        // get the mouse cursor position at startup:
        elmnt[Xi] = e.clientX || e.targetTouches[0].clientX;
        elmnt[Yi] = e.clientY || e.targetTouches[0].clientY;

        // call a function whenever the cursor moves:
        if(e.type === touchstart){
            addEvent(that, touchmove, drogMove, passive);
            addEvent(that, touchend, drogEnd, passive);
        }
        else {
            addEvent(document, mousemove, drogMove);
            addEvent(document, mouseup, drogEnd);
        }
    }

    function drogMove(e){

        e.preventDefault();
        
        if(e.type === touchmove)
            elmnt = this[father];

        // calculate the new cursor position:
        try{
			elmnt[Xf] = e.clientX || e.targetTouches[0].clientX;
			elmnt[Yf] = e.clientY || e.targetTouches[0].clientY;
		}catch(e){}

        elmnt[Xt] -= elmnt[Xi] - elmnt[Xf];
        elmnt[Yt] -= elmnt[Yi] - elmnt[Yf];

        elmnt[Xi] = elmnt[Xf];
        elmnt[Yi] = elmnt[Yf];
		
		// To do
		// elmnt[Xi] and elmnt[Yi] 
		
		// elmnt should not be dragged out of the window
		var pos = $exe.atools.Drog.limit(elmnt[Xt],elmnt[Yt]);
			elmnt[Xt] = pos[0];
			elmnt[Yt] = pos[1];
			
		if (pos[0]==0&&pos[1]==0) {
			elmnt.style = "";
			localStorage.setItem('exeAtoolsToolbarStyles', '');
			return;
		}

        elmnt.style.transform = 'translate(' + elmnt[Xt] + 'px,' + elmnt[Yt] + 'px)';
		localStorage.setItem('exeAtoolsToolbarStyles', elmnt.style.cssText);
    }

    function drogEnd(){

        that = this;
        // stop moving when mouse/touch is released:
        removeEvent(document, mousemove, drogMove);
        removeEvent(document, mouseup, drogEnd);

        removeEvent(that, touchmove, drogMove, passive);
        removeEvent(that, touchend, drogEnd, passive);
    }

    window.Drog = {
        on: on,
        // off: off,
        move: move
    }

})(window, document);