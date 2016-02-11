var TooltipDialog = {
	className : "exe-tooltip", // Main className (jQuery selector)
	otherClassNames : [
		// Type
		'plain-tt',
		'definition-tt',
		'ajax-tt',
		'glossary-tt',
		// Title
		'titled-tt',
		// Close button
		'with-button',
		// Colors
		'light-tt',
		'dark-tt',
		'red-tt',
		'blue-tt',
		'green-tt',
		// CSS3
		'rounded-tt',
		'shadowed-tt'
	],
	init : function() {
		mcTabs.displayTab('general_tab','general_panel');
		this.enableTypeChange();
		this.enableAppearanceChange();
		this.showTypeOptions();
		this.getNodesList('anchorlist','href');
		this.getCurrentValues();
	},
	getCurrentValues : function(){
		var elm;
		var inst = tinyMCEPopup.editor;
		elm = inst.selection.getNode();
		elm = inst.dom.getParent(elm, "A");
		if (elm != null) {
			
			var type = 1;
			var color = "" // Yellow
			var rounded = false;
			var shadow = false;
			
			var ref = inst.dom.getAttrib(elm, 'href');
			var tit = inst.dom.getAttrib(elm, 'title');
			var cls = inst.dom.getAttrib(elm, 'class');
			var trg = inst.dom.getAttrib(elm, 'target');
			
			// Get the type
			if (cls.indexOf(" definition-tt")!=-1) type = 2;
			else if (cls.indexOf(" ajax-tt")!=-1) type = 3;
			else if (cls.indexOf(" glossary-tt")!=-1) type = 4;
			
			// Get the color
			if (cls.indexOf(" light-tt")!=-1) color = "light";
			else if (cls.indexOf(" dark-tt")!=-1) color = "dark";
			else if (cls.indexOf(" red-tt")!=-1) color = "red";
			else if (cls.indexOf(" blue-tt")!=-1) color = "blue";
			else if (cls.indexOf(" green-tt")!=-1) color = "green";
			
			// Get other options
			if (cls.indexOf(" rounded-tt")!=-1) rounded = true;
			if (cls.indexOf(" shadowed-tt")!=-1) shadow = true;
			
			// Set the default tab
			this.setSelectedOption("type","type"+type);
			
			// Set the Link (common)
			var href = document.getElementById('href');
			href.value=ref;
			if (ref.indexOf("exe-node:")==0) {
				var sel = document.getElementById("anchorlist");
				sel.value = ref;
			}
			
			// Set the target (common)
			this.setSelectedOption("target",trg);
			
			// Set the color (common)
			this.setSelectedOption("color",color);
			
			// Set other options
			if (rounded) document.getElementById("rounded").checked = true;
			if (shadow) document.getElementById("shadow").checked = true;
			this.changeAppearance();
			
			// Set the close behaviour (coomon)
			if (cls.indexOf(" with-button")!=-1) {
				this.setSelectedOption("close_behaviour"," with-button");
			}
			
			// Set the tooltip title and the link title
			if (cls.indexOf(" titled-tt")!=-1) {
				tit = tit.split(" | ");
				if (tit.length==2) {
					var title = tit[0];
					var text = tit[1];
					document.getElementById('tooltipTitle').value=title;
					document.getElementById('linkTitle').value=text;
				} else {
					document.getElementById('linkTitle').value=tit;
				}
			} else {
				document.getElementById('linkTitle').value=tit;
			}
			
			// Set any extra classes
			var arr = cls.split(" ");
			var w;
			var extra = ""
			for (w=0;w<arr.length;w++) {
				if (arr[w]!="" && arr[w]!=TooltipDialog.className) {
					if (TooltipDialog.otherClassNames.indexOf(arr[w])==-1) {
						extra += " "+arr[w];
					}
				}
			}
			document.getElementById("extraClassNames").value+=extra;
			
			// Set the tooltip content
			if (type==2) {
				var id = inst.dom.getAttrib(elm, 'id');
				id = id.replace("link","t");
				var e = inst.dom.select("#"+id);
				var e = inst.contentWindow.document.getElementById(id);
				if (e) {
					if (ref.indexOf("#")==0) href.value = "#";
					document.getElementById('longtext').value=e.innerHTML;
				}
			}
		} else {
			// New tooltip... Remember the user's preferences:
			var cookie = tinymce.util.Cookie;
			var c = cookie.get("tinymceTooltipOptionsPlugin")
			if (c) {
				var c = c.split("|");
				if (c.length==3) { // In case there are different versions of the plugin
					var clr = c[0]; // Color
					var rnd = c[1]; // Rounded
					var shd = c[2]; // Shadow
					if (clr!="" && rnd!="" && shd!="") {
						this.setSelectedOption("color",clr);
						if (rnd=="true") document.getElementById("rounded").checked = true;
						if (shd=="true") document.getElementById("shadow").checked = true;
						this.changeAppearance();
					}
				}
			}
		}
	},
	enableAppearanceChange : function(){
		var x;
		var w = document.getElementById("appearance-options");
		var i = w.getElementsByTagName("INPUT");
		for (x=0;x<i.length;x++) {
			i[x].onchange = function(){
				TooltipDialog.changeAppearance();
			}
		}
	},
	changeAppearance : function(){
		var rounded = document.getElementById("rounded").checked;
		var shadow = document.getElementById("shadow").checked;
		var img = 1;
		if (rounded && !shadow) img = 2;
		else if (!rounded && shadow) img = 3;
		else if (rounded && shadow) img = 4;
		document.getElementById("preview").src = "img/appearance"+img+".png";	
	},
	enableTypeChange : function(){
		var x;
		var w = document.getElementById("types");
		var i = w.getElementsByTagName("INPUT");
		for (x=0;x<i.length;x++) {
			i[x].onchange = function(){
				TooltipDialog.showTypeOptions(this.value);
			}
		}
	},
	setSelectedOption : function(n,v){
		var radios = document.getElementsByName(n);
		for (var i = 0, length = radios.length; i < length; i++) {
			if (radios[i].value==v) {
				radios[i].checked = "checked";
				if (n=="type") this.showTypeOptions(radios[i].value);
				break;
			}
		}		
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
	showTypeOptions : function(id) {
		if (!id) var id = this.getSelectedOption("type");
		var w = document.getElementById("general_panel");
		var f = w.getElementsByTagName("DIV");
		for (i=0;i<f.length;i++) {
			f[i].style.display = "none";
		}
		document.getElementById(id+"-options").style.display = "block";
		document.getElementById("type-desc").innerHTML = document.getElementById(id+"-desc").innerHTML;
		
		var ref = document.getElementById("href");
		if (id=="type2") {
			if (ref.value=="") ref.value = "#";
		} else {
			if (ref.value=="#") ref.value = "";
		}
		
		// Default title for the definition (just for the new tooltips)
		var elm;
		var inst = tinyMCEPopup.editor;
		elm = inst.selection.getNode();
		elm = inst.dom.getParent(elm, "A");
		if (elm == null) {
			var tit = document.getElementById("linkTitle");
			if (id=="type2") {
				if (tit.value=="") tit.value = tinyMCEPopup.getLang("tooltip.see_definition");
			} else {
				if (tit.value==tinyMCEPopup.getLang("tooltip.see_definition")) tit.value = "";
			}			
		}

		// Hide/Show some fields (Page, Link URL and the target options)
		var display = "none";
		if (id=="type1") display = "";
		document.getElementById("href-row").style.display = display;
		document.getElementById("target-options").style.display = display;
		if (id=="type3") display = "";
		document.getElementById("pages-row").style.display = display;
		
		// Change the label for the tooltipTitle field
		var txt = tinyMCEPopup.getLang("tooltip.tooltip_title");
		if (id=="type2") txt = tinyMCEPopup.getLang("tooltip.term");
		document.getElementById("tooltipTitleLabel").innerHTML = txt;
		
	},
	getNodesList : function(id,target){
		var i;
		var arrayName = "tinymce_anchors";
		var w = window.parent;
		var html = "";
		if (w) {
			if (typeof w[arrayName]=="object") {
				var myArray = w[arrayName];
				for (i=0;i<myArray.length;i++){
					var n = myArray[i].replace("exe-node:","");
					var checkN = n.split("#");
					if (checkN[1]=="auto_top") n = n.replace("#auto_top","");
					n = decodeURIComponent(n);
					var newOption = '<option value="' + myArray[i] + '">' + n + '</option>';
					if (html.indexOf(newOption)==-1) html += newOption;
				}
			}
		}
		var html = '<select id="' + id + '" name="' + id + '" class="mceAnchorList"'
			+ ' onchange="this.form.' + target + '.value=this.options[this.selectedIndex].value"'
			+ '>'
			+ '<option value="">---</option>'
			+ html
			+ '</select>';
		document.getElementById("nodescontainer").innerHTML = html;
	},
	validate : function(type) {
		var t = parseInt(type.replace("type",""));
		var ref = document.getElementById("href").value;
		var tit = document.getElementById("tooltipTitle").value;
		var txt = document.getElementById("linkTitle").value;
		var lng = document.getElementById("longtext").value;
		
		if (ref=="") {
			if (t==3) return tinyMCEPopup.getLang("tooltip.page_is_required");
			else return tinyMCEPopup.getLang("tooltip.link_is_required");
		}
		if (t==1 && txt=="") return tinyMCEPopup.getLang("tooltip.title_is_required");
		if (t==2 && lng=="") return tinyMCEPopup.getLang("tooltip.definition_is_required");
		
		return "";
	},
	insert : function() {
	
		var type = this.getSelectedOption("type");
		var inst = tinyMCEPopup.editor;
		
		var errors = this.validate(type);
		if (errors!="") {
			inst.windowManager.alert(errors);
			return false;
		}
	
		var elm, elementArray, i;
		elm = inst.selection.getNode();
		elm = inst.dom.getParent(elm, "A");
		// Remove element if there is no href
		if (!document.forms[0].href.value) {
			i = inst.selection.getBookmark();
			inst.dom.remove(elm, 1);
			inst.selection.moveToBookmark(i);
			tinyMCEPopup.execCommand("mceEndUndoLevel");
			tinyMCEPopup.close();
			return;
		}
		// Create new anchor elements
		if (elm == null) {
			inst.getDoc().execCommand("unlink", false, null);
			tinyMCEPopup.execCommand("mceInsertLink", false, "#mce_temp_url#", {skip_undo : 1});
			elementArray = tinymce.grep(inst.dom.select("a"), function(n) {return inst.dom.getAttrib(n, 'href') == '#mce_temp_url#';});
			for (i=0; i<elementArray.length; i++) this.setAttribs(elm = elementArray[i],type);
		} else this.setAttribs(elm,type);
		// Don't move caret if selection was image
		if (elm.childNodes.length != 1 || elm.firstChild.nodeName != 'IMG') {
			inst.focus();
			inst.selection.select(elm);
			inst.selection.collapse(0);
			tinyMCEPopup.storeSelection();
		}
		
		// Definition
		if (type=="type2") {
			// Get the tooltip content
			var lng = document.getElementById("longtext").value;
			if (!this.hasHTML(lng)) lng = "<p>"+lng+"</p>";
			
			// Get the link ID
			var id = "";
			if (elm == null) {
				if (typeof(this.currentLinkId)!='undefined') id = id = this.currentLinkId;
			} else {
				id = inst.dom.getAttrib(elm, 'id');
				if (id=="") id = "link"+this.generateID();
			}
			
			// Get the link to update its href
			var l = inst.dom.select("#"+id);
			// Get the ID of the content
			id = id.replace("link","t");
			// Update the link's href
			inst.dom.setAttribs(l, {'href': '#'+id});
			// Create or update the content
			var e = inst.dom.select("#"+id);
			
			if (e.length==0) {
				inst.dom.add(inst.getBody(), 'div', { id : id, class : this.className+'-text' }, lng);
			} else {
				inst.dom.setHTML(e, lng);
			}
		}
		
		tinyMCEPopup.execCommand("mceEndUndoLevel");
		tinyMCEPopup.close();
	},
	hasHTML : function(str){
		var a = document.createElement('div');
		a.innerHTML = str;
		for (var c = a.childNodes, i = c.length; i--; ) {
			if (c[i].nodeType == 1) return true; 
		}
		return false;
	},
	generateID : (function() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		}
		return function() {
			return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
		};
	})(),
	setAttribs : function(elm,type) {
		
		var cls = this.className+" ";
		
		var t = parseInt(type.replace("type",""));
		
		var formObj = document.forms[0];
		var ref = formObj.href.value.replace(/ /g, '%20');
		
		var txt = document.getElementById("linkTitle").value;		
		var tit = document.getElementById("tooltipTitle").value;
		if (t==1) {
			cls += "plain-tt";
		} else if (t==2) {
			cls += "definition-tt";
			// Set the ID
			var inst = tinyMCEPopup.editor;
			var elm = inst.selection.getNode();
			elm = inst.dom.getParent(elm, "A");			
			var id = inst.dom.getAttrib(elm, 'id');
			if (id=="") {
				id = "link"+this.generateID();
				this.setAttrib(elm, 'id', id);
				this.currentLinkId = id;
				if (ref=="#") ref = "#"+id.replace("link","t");
			}
		} else if (t==3) {
			cls += "ajax-tt";
		} else {
			cls += "glossary-tt";
		}
		if (tit!="") {
			cls += " titled-tt";
			txt = tit+" | "+txt;
		}
		
		// Only Type 1 allows target="_blank"
		var trg = "";
		if (t==1) trg = this.getSelectedOption("target");
		
		// With or without close button
		var btn = this.getSelectedOption("close_behaviour");
		cls += btn;
		
		// Color (if not Yellow)
		var clr = this.getSelectedOption("color");
		if (clr!="") {
			clr += "-tt";
			cls += " "+clr;
		}
		
		// Rounded or not
		var rounded = document.getElementById("rounded").checked;
		if (rounded) cls += " rounded-tt";
		
		// Shadow
		var shadow = document.getElementById("shadow").checked;
		if (shadow) cls += " shadowed-tt";
		
		// Set the cookie to remember the user's preferences (color, rounded, shadow)
		var cookie = tinymce.util.Cookie;
		var cValue = clr.replace("-tt","")+"|"+rounded+"|"+shadow;
		cookie.set("tinymceTooltipOptionsPlugin", cValue, new Date(new Date().getFullYear() + 1, 12, 31))
		
		// Other classes
		cls += document.getElementById("extraClassNames").value;

		this.setAttrib(elm, 'href', ref);
		this.setAttrib(elm, 'title', txt);
		this.setAttrib(elm, 'target', trg);
		//this.setAttrib(elm, 'id');
		this.setAttrib(elm, 'class', cls);

		// Refresh in old MSIE
		if (tinyMCE.isMSIE5) elm.outerHTML = elm.outerHTML;
	},
	setAttrib : function(elm, attrib, value) {
		var formObj = document.forms[0];
		var valueElm = formObj.elements[attrib.toLowerCase()];
		var dom = tinyMCEPopup.editor.dom;

		if (typeof(value) == "undefined" || value == null) {
			value = "";

			if (valueElm)
				value = valueElm.value;
		}

		// Clean up the style
		if (attrib == 'style')
			value = dom.serializeStyle(dom.parseStyle(value), 'a');

		dom.setAttrib(elm, attrib, value);
	}	
};
tinyMCEPopup.onInit.add(TooltipDialog.init, TooltipDialog);