/*******************************************/	
/********** Available languages **********/
/***************************************/
var tinyMCE_languages=["es","eu"];
//Example: var tinyMCE_languages=["es","fr","de"];

/*******************************************/	
/*****************************************/
/****************************************/

tinyMCE.init({
	// General options
	mode : "textareas",
	theme : "advanced",
	convert_urls : false,
	language : getTinyMCELang(document.getElementsByTagName("HTML")[0].lang),
	content_css : "/css/extra.css",
	plugins : "autolink,lists,pagebreak,style,layer,table,advhr,advimage,advlink,emotions,iespell,insertdatetime,preview,media,exemath,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,wordcount,advlist,autosave,visualblocks,pastecode,inlinepopups",
	extended_valid_elements : "img[*]", //Required for the exemath plugin (it uses this attribute: exe_math_latex)

	// Theme options
	theme_advanced_buttons1 : "newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,bullist,numlist,|,outdent,indent,blockquote,|,formatselect,fontsizeselect,fontselect,|,forecolor,backcolor,|,sub,sup,|,fullscreen",
	theme_advanced_buttons2 : "undo,redo,|,cut,copy,paste,pastetext,pasteword,|,pastehtml,pastecode,|,search,replace,|,link,unlink,anchor,|,image,media,|,removeformat,cleanup,|,insertdate,inserttime,advhr,cite,abbr,acronym,del,ins,attribs,nonbreaking,|,charmap,exemath,|,styleprops",
	theme_advanced_buttons3 : "tablecontrols,|,code,help",
	theme_advanced_toolbar_location : "top",
	theme_advanced_toolbar_align : "left",
	theme_advanced_statusbar_location : "bottom",
	theme_advanced_resizing : true,	
	
	// Image & media
	file_browser_callback : "chooseImage_viaTinyMCE_3",
	media_types: "flash=swf,mp3,mp4,flv;qt=mov,qt,mpg,mpeg;wmp=avi,wmv,wm,asf;rmp=rm,ra,ram",		
	flash_video_player_url: "../templates/flowPlayer.swf"	

});
