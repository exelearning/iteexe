_ = parent._;
/*******************************************/	
/********** Available languages **********/
/***************************************/
var tinyMCE_languages=["ca","es","eu","fr","gl","it","nl","pt","ru"];
var tinyMCE_language = getTinyMCELang(document.getElementsByTagName("HTML")[0].lang);
/*******************************************/	
/*****************************************/
/****************************************/
tinyMCE.init({
	// General options
	mode : "specific_textareas",
	editor_selector: "mceEditor",	
	theme : "advanced",
	convert_urls : false,
	// The New eXeLearning
	content_css : "/css/extra.css," + exe_style,
    height : "250",
	// The New eXeLearning
	plugins : "autolink,lists,pagebreak,style,layer,table,advhr,advimage,advlink,emotions,iespell,insertdatetime,preview,media,exemath,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,wordcount,advlist,visualblocks,pastecode,inlinepopups,spellchecker,template",
    //paste_text_sticky : true,    
    //paste_text_sticky_default : true,
	extended_valid_elements : "img[*],iframe[*]", //The exemath plugin uses this attribute: exe_math_latex, and the iframes might have "allowfullscreen".
	entity_encoding : "raw",

	// Theme options
	theme_advanced_buttons1 : "newdocument,spellchecker,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,bullist,numlist,|,outdent,indent,blockquote,|,formatselect,fontsizeselect,fontselect,|,forecolor,backcolor,|,sub,sup,|,fullscreen",
	theme_advanced_buttons2 : "undo,redo,|,cut,copy,paste,pastetext,pasteword,|,pastehtml,pastecode,|,search,replace,|,link,unlink,anchor,|,image,media,|,removeformat,cleanup,|,insertdate,inserttime,advhr,cite,abbr,acronym,del,ins,attribs,nonbreaking,|,charmap,exemath,|,styleprops",
	theme_advanced_buttons3 : "template,|,tablecontrols,|,code,help",
	theme_advanced_toolbar_location : "top",
	theme_advanced_toolbar_align : "left",
	theme_advanced_statusbar_location : "bottom",
	theme_advanced_resizing : true,	
	
    template_external_list_url : "/scripts/tinymce_templates/lang/"+tinyMCE_language+".js",
    // Spell check
    init_instance_callback : function() {
        if (tinyMCE.activeEditor.execCommands.mceSpellCheck) tinymce.execCommand('mceSpellCheck', true);
    },   
    // Image & media
	file_browser_callback : "exe_tinymce.chooseImage",
	media_types: "flash=swf,mp3,mp4,flv;qt=mov,qt,mpg,mpeg;wmp=avi,wmv,wm,asf;rmp=rm,ra,ram",		
	flash_video_player_url: "../templates/flowPlayer.swf"	

});
