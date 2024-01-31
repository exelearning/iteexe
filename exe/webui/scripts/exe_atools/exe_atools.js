$exe.atools = {
	options : {
		translator : true,
		draggable : true
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
			dragBtn = '<button id="eXeAtoolsSetDragHandler">'+$exe_i18n["drag_and_drop"]+'</button>';		
		} else {
			localStorage.setItem('exeAtoolsToolbarStyles','');
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
					</select><button id="eXeAtoolsLgTextBtn">'+$exe_i18n["increase_text_size"]+'</button><button id="eXeAtoolsSmTextBtn">'+$exe_i18n["decrease_text_size"]+'</button><button id="eXeAtoolsResetBtn">'+$exe_i18n["reset"]+'</button>'+reader+translator+'<button id="eXeAtoolsCloseBtn">'+$exe_i18n["close_toolbar"]+'</button>\
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
				$exe.atools.checkToolbarPosition();
				setTimeout(function(){
					
				},1000);
			}
			$exe.atools.dragElement(handler);	
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
		if ($exe.atools.options.draggable==true) {
			$(window).on("resize",function(){
				$exe.atools.checkToolbarPosition();
			});			
		}
	},
	checkToolbarPosition : function(){
		if ($("body").hasClass("exe-atools-on")) {
			var e = $("#eXeAtoolsSet");
			elmnt = e[0];
			if (elmnt.style.bottom!="auto") return;
			var mt = elmnt.offsetTop;
			var ml = elmnt.offsetLeft;
			var maxTop = ($(window).height()-$(elmnt).height());
			if (mt>maxTop) {
				mt = maxTop;
			} else if (mt<0) {
				mt = 0;
			}
			var maxLeft = ($(window).width()-$(elmnt).width());
			if (ml>maxLeft) {
				ml = maxLeft;
			} else if (ml<0) {
				ml = 0;
			}	
			// No styles required
			if (ml==0&&mt==maxTop) {
				elmnt.style="";
				localStorage.setItem('exeAtoolsToolbarStyles', '');
				return;
			}
			elmnt.style.top = mt + "px";
			elmnt.style.left = ml + "px";
			elmnt.style.bottom = "auto";
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
		currentFontSize = parseInt(window.getComputedStyle(document.body).getPropertyValue('font-size'));
		currentFontSize += size;
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
	dragElement : function(elmnt){
		var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
		document.getElementById(elmnt.id + "DragHandler").onmousedown = dragMouseDown;
		function dragMouseDown(e) {
			e = e || window.event;
			e.preventDefault();
			pos3 = e.clientX;
			pos4 = e.clientY;
			document.onmouseup = closeDragElement;
			document.onmousemove = elementDrag;
		}
		function elementDrag(e) {
			e = e || window.event;
			e.preventDefault();
			pos1 = pos3 - e.clientX;
			pos2 = pos4 - e.clientY;
			pos3 = e.clientX;
			pos4 = e.clientY;
			var mt = (elmnt.offsetTop - pos2);
			var ml = (elmnt.offsetLeft - pos1);
			var maxTop = ($(window).height()-$(elmnt).height());
			if (mt>maxTop) {
				mt = maxTop;
			} else if (document.body.style.top=="40px"&&mt<40) {
				mt = 40;
			} else if (mt<0) {
				mt = 0;
			}
			var maxLeft = ($(window).width()-$(elmnt).width());
			if (ml>maxLeft) {
				ml = maxLeft;
			} else if (ml<0) {
				ml = 0;
			}
			// No styles required
			if (ml==0&&mt==maxTop) {
				elmnt.style="";
				localStorage.setItem('exeAtoolsToolbarStyles', '');
				return;
			}			
			elmnt.style.top = mt + "px";
			elmnt.style.left = ml + "px";
			elmnt.style.bottom = "auto";
			localStorage.setItem('exeAtoolsToolbarStyles',elmnt.style.cssText);
		}
		function closeDragElement(e) {
			document.onmouseup = null;
			document.onmousemove = null;
		}
	}
}