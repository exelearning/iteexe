_ = parent._;
/*******************************************/	
/********** Available languages **********/
/***************************************/
var tinyMCE_languages=["ca","es","eu","fr","gl","it","nl","pt","ru"];
var tinyMCE_language = getTinyMCELang(document.getElementsByTagName("HTML")[0].lang);
/*******************************************/	
/*****************************************/
/****************************************/
var $exeTinyMCE = {
    
    plugins : "exeeffects,blockquoteandcite,definitionlist,tooltip,clearfloat,advalign,autolink,lists,pagebreak,style,layer,table,advhr,advimage,advlink,emotions,iespell,insertdatetime,preview,media,exemath,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,wordcount,advlist,visualblocks,pastecode,inlinepopups,spellchecker,template",
    buttons1 : "newdocument,spellchecker,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,clearfloat,|,bullist,numlist,definitionlist,|,outdent,indent,blockquote,blockquoteandcite,|,formatselect,fontsizeselect,fontselect,|,forecolor,backcolor,|,sub,sup,|,fullscreen",
    buttons2 : "undo,redo,|,cut,copy,paste,pastetext,pasteword,|,pastehtml,pastecode,|,search,replace,|,link,unlink,anchor,tooltip,|,image,media,exeeffects,|,removeformat,cleanup,|,insertdate,inserttime,advhr,cite,abbr,acronym,del,ins,attribs,nonbreaking,|,charmap,exemath,|,styleprops",
    buttons3 : "template,|,tablecontrols,|,code,help",
    templates : "/scripts/tinymce_templates/lang/"+tinyMCE_language+".js",
    
	init : function(mode,criteria,hide){
		
		var h = 300;
		if (mode=="exact") h = 50;
		var w = 882;
		if (typeof($exeTinyMCEToggler.documentWidth)=='undefined' || (typeof($exeTinyMCEToggler.documentWidth)!='undefined' && $exeTinyMCEToggler.documentWidth<900)) w = '';

		tinyMCE.init({
			// General options
			mode : mode,
			elements : criteria,
			editor_selector : criteria,	
			theme : "advanced",
			convert_urls : false,
			schema : this.getSchema(),
			content_css : "/css/extra.css," + exe_style,
			height : h,
			width : w,
			plugins : this.plugins,
			valid_children : this.getValidChildren(),
			valid_elements : this.getValidElements(),
			extended_valid_elements : this.getExtendedValidElements(),
			entity_encoding : "raw",
			// Theme options
			theme_advanced_buttons1 : this.buttons1,
			theme_advanced_buttons2 : this.buttons2,
			theme_advanced_buttons3 : this.buttons3,
			theme_advanced_toolbar_location : "top",
			theme_advanced_toolbar_align : "left",
			theme_advanced_statusbar_location : "bottom",
			theme_advanced_resizing : true,

			// Numbered lists
			advlist_number_styles: [
				{title : _("Default"), styles : { listStyleType : '' } },
				{title : _("Lower Alpha"), styles : { listStyleType : 'lower-alpha' }, cssClass : '' },
				{title : _("Lower Greek"), styles : { listStyleType : 'lower-greek' }, cssClass : '' },
				{title : _("Lower Roman"), styles : { listStyleType : 'lower-roman' }, cssClass : '' },
				{title : _("Upper Alpha"), styles : { listStyleType : 'upper-alpha' }, cssClass : '' },
				{title : _("Upper Roman"), styles : { listStyleType : 'upper-roman' }, cssClass : '' },
				{title : _("Automatic Numbering"), styles : { listStyleType : 'decimal' }, cssClass : 'auto-numbered' }
			],

			template_external_list_url : this.templates,
			// No new base64 images
			setup : function(ed) {
				ed.onInit.add(function(ed, e) {
					if (mode=="exact") $exeTinyMCEToggler.init(ed.editorId,hide);
					$exeAuthoring.countBase64(ed);
					$(ed.getDoc()).bind('drop', function(event){
						return tinymce.dom.Event.cancel(event);
					});		
				});	
				ed.onChange.add(function(ed, e) {
					$exeAuthoring.compareBase64(ed);
				});
			},
			// Spell check
			init_instance_callback : function() {
				if (tinyMCE.activeEditor.execCommands.mceSpellCheck) tinymce.execCommand('mceSpellCheck', true);
			},   
			// Image & media
			file_browser_callback : "exe_tinymce.chooseImage",
			media_types: "flash=swf,mp3,mp4,flv;qt=mov,qt,mpg,mpeg;wmp=avi,wmv,wm,asf;rmp=rm,ra,ram",		
			flash_video_player_url: "../templates/flowPlayer.swf"	

		});
		
	},
    
	getSchema : function(){
		var s = "html4";
		if (exe_export_format=="html5") s = "html5";
		return s;
	},
	
	getValidElements : function(){
		var e = "*[*]";
		if (exe_editor_mode=="strict") e = "";
		return e;
	},
	
	getValidChildren : function(){
		var v = "+body[style]";
		if (exe_export_format=="html5") v += ",+video[a],+audio[a]";
		if (exe_editor_mode=="strict") {
			v = "";
			if (exe_export_format=="html5") v = "+video[a],+audio[a]";
		}
		return v;
	},
	
	getExtendedValidElements : function(){
		var e = "";
		if (exe_editor_mode=="strict") {
			// To review (this is not really Strict)
			// Allow exe_math_latex for images and allowfullscreen for iframes
			// We just allow any attributes and values for both tags
			e = "img[*],iframe[*]";
			// Allow lang for span in HTML5
			if (exe_export_format=="html5") e += ",span[*]";
		}
		return e;
	}
	
}

/* This will run when having more than one TEXTAREA in a page */
var $exeTinyMCEToggler = {

	// mode - Always load TinyMCE or not.
	// setup - Step 0.
	// createViewer - Step 1. It creates the viewer (if mode!="always" it creates a link that will create the viewer).
	// removeViewer - It removes the viewer and init TinyMCE (with or without buttons).
	// getHelpLink - It looks for a help link to place the "Editor" link after it.
	// createEditorLink - It creates the link to toggle the editor. If there's no help link it just creates the editor.
	// startEditor - Init TinyMCE
	// addLinkAndToggle - It creates a link to toggle the editor after enabling it
	// init - Init TinyMCE (called from startEditor)
	// toggle - Toggle the editor
	
	mode : "always", // "always" if you don't want to have contents without HTML (plain textareas). Any other value if you do.
	
	setup : function(eds){
		eds.each(function(){
			var n = this.name;
			this.id = n;
			var e = $(this);
			if ($exeTinyMCEToggler.mode=="always") {
				$exeTinyMCEToggler.createViewer(e);
			} else {
				if (e.val()=="" || e.val()==e.html()) {
					// No HTML (plain textarea)
					e.css({
						border : "1px solid #ccc",
						height : "1.5em",
						width : "80%",
						padding : "15px",
						margin : "0 0 1.5em 0"
					});
					$exeTinyMCEToggler.createEditorLink(e,n);
				} else {
					$exeTinyMCEToggler.createViewer(e);
				}
			}
		});
	},
	
	createViewer : function(e){
		if (typeof(this.documentWidth)=='undefined') {
			this.documentWidth = $(document).width();
		}
		var id = e.attr("id");
		var n = e.attr("name");
		var c = e.val();
		var w = ";width:852px";
		if (this.documentWidth<900) w = "";
		$exeTinyMCEToggler.createEditorLink(e,n);
		var v = $('<div id="'+id+'-viewer" style="height:96px;padding:2px 15px;border:1px solid #ccc;overflow:auto'+w+'" onclick="$exeTinyMCEToggler.removeViewer(\''+id+'\')">'+c+'</div>');
		e.hide().before(v);
	},
	
	removeViewer : function(id){
		$('#'+id+'-toggler').remove();
		this.startEditor(id,true);
	},
	
	getHelpLink : function(e) {
    
        // The textarea has a label with an ID: textareaID-editor-label
        var w = $("#"+e.attr("id")+"-editor-label");
        if (w.length>0) return w;

		// Get the help link to insert the TinyMCE toggler after it
		var r = "";

		// Multi-choice, etc.
		var p = e.parent().parent().prev();
		var f = $("A",p).eq(0); // f = First link in p, being p the previous element (it can be different in each case)
		if (f.length==1 && f.html().indexOf("/images/help.gif")!=-1) {
			return f;
		}

		// Look for the help link in the previous .block
		p = e.parent().prev(".block");
		f = $("A",p).eq(0);
		if (f.length==1 && f.html().indexOf("/images/help.gif")!=-1) {
			return f;
		} 
			
		// Multi-select question has a different HTML. We look for the help link.
		p = e.parent();
		f = $("A",p).eq(0);
		if (f.length==1 && f.html().indexOf("/images/help.gif")!=-1) {
			return f;
		} 

		// Case Study...
		p = e.parent().prev().prev().prev();
		if (p.length==1) {
			var h = p.attr("href");
			if (h && h.indexOf("Javascript:void")==0) {
				return p;
			}
		}

		return r;
		
	}, 
	
	createEditorLink : function(e,id) {
        var f = this.getHelpLink(e);
        if (f!="") {
            var l = $('<a href="#" id="'+id+'-toggler" onclick="$exeTinyMCEToggler.startEditor(\''+id+'\',false);$(this).remove();return false" class="visible-editor">'+_("Editor")+'</a>');
            f.css("margin-right","5px").after(l);
        } else {
            // We can't find the help link, so be just enable the editor
            $exeTinyMCEToggler.startEditor(id,false);
        }        
	},
	
	startEditor : function(id,hide){
		$("#"+id+"-viewer").remove();
		$("#"+id).show();
		$exeTinyMCE.init("exact",id,hide);
	},
	
	addLinkAndToggle : function(id,lab,l,hide) {
		lab.css("margin-right","5px").after(l);
		if (hide!=false) this.toggle(id,document.getElementById(id+"-toggler"));
	},
	
	init : function(id,hide) {

        var e = $("#"+id);
        var f = this.getHelpLink(e);
        
        if (f!="") {
            var l = $('<a href="#" id="'+id+'-toggler" onclick="$exeTinyMCEToggler.toggle(\''+id+'\',this);return false" class="visible-editor">'+_("Editor")+'</a>');
            this.addLinkAndToggle(id,f,l,hide);
        }

	},
	
	toggle : function(id,e) {
		var p = $("#"+id).parent();
		window[e.id+"-iframeHeight"] = "134px";
		var t = $("IFRAME",p);
		var i = "";
		if (t.length==1) i = t.eq(0);
		if (e.className=='visible-editor') {
			//Hide toolbars
			if (i!='') {
				window[e.id+"-iframeHeight"] = i.css("height");
				var w = i.css("width");
				if (parseInt(w.replace("px",""))<500) w = "700px";
				i.css("width",w);
				var h = parseInt(window[e.id+"-iframeHeight"].replace("px"));
                h = 100; // Force height: Comment this line to make it as high as the TinyMCE editor
				i.css("height",h+"px");             
			}
			e.className = 'hidden-editor';
		} else {
			//Show toolbars
			if (i!='') i.css("height",window[e.id+"-iframeHeight"]);
			e.className = 'visible-editor';
		}   
		$(".mceStatusbar",p).toggle()
        $(".mceToolbar",p).toggle()
	}
	
}

$(function(){
	var eds = $("textarea.mceEditor");
	if (eds.length==0) return false;
	if (eds.length==1) {
		$exeTinyMCE.init("specific_textareas","mceEditor");
		// Use the following code to add the Hide/Show link even when there's just one editor
		/*
		var ed = eds.eq(0);
		var id = ed.attr("name");
		ed.attr("id",id);
		// Start the editor with the Hide/Show link, but don't hide it (false)
		$exeTinyMCEToggler.startEditor(id,false);
		*/
	}
	else $exeTinyMCEToggler.setup(eds);
});