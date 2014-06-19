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
	init : function(mode,criteria,hide){
		
		var h = 200;
		if (mode=="exact") h = 50;

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
			plugins : "clearfloat,advalign,autolink,lists,pagebreak,style,layer,table,advhr,advimage,advlink,emotions,iespell,insertdatetime,preview,media,exemath,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,wordcount,advlist,visualblocks,pastecode,inlinepopups,spellchecker,template",
			valid_children : this.getValidChildren(),
			valid_elements : this.getValidElements(),
			extended_valid_elements : this.getExtendedValidElements(),
			entity_encoding : "raw",
			// Theme options
			theme_advanced_buttons1 : "newdocument,spellchecker,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,clearfloat,|,bullist,numlist,|,outdent,indent,blockquote,|,formatselect,fontsizeselect,fontselect,|,forecolor,backcolor,|,sub,sup,|,fullscreen",
			theme_advanced_buttons2 : "undo,redo,|,cut,copy,paste,pastetext,pasteword,|,pastehtml,pastecode,|,search,replace,|,link,unlink,anchor,|,image,media,|,removeformat,cleanup,|,insertdate,inserttime,advhr,cite,abbr,acronym,del,ins,attribs,nonbreaking,|,charmap,exemath,|,styleprops",
			theme_advanced_buttons3 : "template,|,tablecontrols,|,code,help",
			theme_advanced_toolbar_location : "top",
			theme_advanced_toolbar_align : "left",
			theme_advanced_statusbar_location : "bottom",
			theme_advanced_resizing : true,	

			template_external_list_url : "/scripts/tinymce_templates/lang/"+tinyMCE_language+".js",
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
		if (exe_export_format=="html5" && exe_editor_mode=='strict') s = "html5";
		return s;
	},
	getValidElements : function(){
		var e = "*[*]";
		if (exe_editor_mode=="strict") e = "";
		return e;
	},
	getValidChildren : function(){
		var v = "+body[style]";
		if (exe_editor_mode=="strict") {
			v = "";
			if (exe_export_format=="html5") v = "+video[a],+audio[a]";
		}
		return v;
	},
	getExtendedValidElements : function(){
		var e = "";
		if (exe_editor_mode=="strict") {
			// Allow exe_math_latex for images and allowfullscreen for iframes
			// We just allow any attributes and values for both tags
			e = "img[*],iframe[*]";
		}
		return e;
	}
}

/* The TEXTAREAS with the class "mceSimpleEditor" will have a different configuration (they will only be activated when demanded or necessary) */
var $exeTinyMCEToggler = {
	setup : function(){
		$("textarea.mceSimpleEditor").each(function(){
			var n = this.name;
			this.id = n;
			var e = $(this);
			if (e.val()=="" || e.val()==e.html()) {
				e.css({
					border : "1px solid #ccc",
					height : "1.5em",
					padding : "15px",
					margin : "0 0 1.5em 0"
				});
				$exeTinyMCEToggler.createEditorLink(e,n);
			} else {
				$exeTinyMCEToggler.startEditor(n)
			}
		});
	},
	createEditorLink : function(e,id) {
		var l = $('<a href="#" id="'+id+'-toggler" onclick="$exeTinyMCEToggler.startEditor(\''+id+'\',false);$(this).remove();return false" class="visible-editor">'+_("Editor")+'</a>');		
		//Get the help link (tables)
		var previousTR = e.parent().parent().prev();
		var firstLink = $("A",previousTR).eq(0);
		if (firstLink.length==1 && firstLink.html().indexOf("Click for completion instructions")!=-1) {
			firstLink.css("margin-right","5px").after(l);
		}
		
	},
	startEditor : function(id,hide){
		$exeTinyMCE.init("exact",id,hide);
	},
	run : function(id,lab,l,hide) {
		lab.css("margin-right","5px").after(l);
		if (hide!=false) this.toggle(id,document.getElementById(id+"-toggler"));
	},
	init : function(id,hide) {
        var linkId = id.replace(/\./g,'');
		var l = $('<a href="#" id="'+id+'-toggler" onclick="$exeTinyMCEToggler.toggle(\''+id+'\',this);return false" class="visible-editor">'+_("Editor")+'</a>');
		var e = $("#"+id);
		//Get the help link (tables)
		var previousTR = e.parent().parent().prev();
		var firstLink = $("A",previousTR).eq(0);
		if (firstLink.length==1 && firstLink.html().indexOf("Click for completion instructions")!=-1) {
			this.run(id,firstLink,l,hide);
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

/* Init TinyMCE (both) */
$(function(){
	$exeTinyMCE.init("specific_textareas","mceEditor");
	$exeTinyMCEToggler.setup();
});