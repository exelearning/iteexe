/*******************************************/	
/********** Available languages **********/
/***************************************/
var tinyMCE_languages=["es","eu"];
//Example: var tinyMCE_languages=["es","fr","de"];

/*******************************************/	
/*********** Common functions ************/
/***************************************/

function getTinyMCELang(lang){
	var defaultLang = "en"	;	
	if (tinyMCE_languages.inArray(lang)) defaultLang=lang;
	return defaultLang;
}
Array.prototype.inArray = function (value) {
	var i;
	for (i=0; i < this.length; i++) {
		if (this[i] === value) return true;
	}
	return false;
};

/*******************************************/	
/*****************************************/
/****************************************/

tinyMCE.init({
	content_css : "/css/extra.css", 
	language : getTinyMCELang(document.getElementsByTagName("HTML")[0].lang),
	verify_html : true, 
	apply_source_formatting : true, 
	//testing TinyMCE's escaping/quoting of HTML:
	cleanup_on_startup : false, 
	//cleanup : false, 
	entity_encoding : "raw", 
	gecko_spellcheck : true, 
	mode : "textareas",
	editor_selector : "mceEditor",
	plugins : "table,save,advhr,advimage,advlink,emotions,media,contextmenu,paste,directionality,exemath,searchreplace,pastecode",
	theme : "advanced",
	theme_advanced_layout_manager : "SimpleLayout",
	theme_advanced_toolbar_location : "top",  
	theme_advanced_buttons1 : "newdocument,separator,bold,italic,underline,formatselect,fontsizeselect,fontselect,forecolor,backcolor,separator,sub,sup,separator,justifyleft,justifycenter,justifyright,justifyfull,separator,bullist,numlist,outdent,indent,separator,help",
	theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,separator,pastehtml,pastecode,separator,search,replace,separator,image,media,exemath,advhr,tablecontrols,separator,anchor,link,unlink,separator,undo,redo,separator,charmap,code,removeformat,cleanup",
	theme_advanced_buttons3 : "",
	//the image-handling callback function for tinyMCE's image button:
	advimage_image_browser_callback : "chooseImage_viaTinyMCE",
	//and manually entered filenames as well, via image2insert w/o file browser:
	advimage_image2insert_browser_callback : "chooseImage_viaTinyMCE",
	//the media-handling callback function for tinyMCE's media button:
	media_media_browser_callback : "chooseImage_viaTinyMCE",
	//and manually entered filenames as well, via media2insert w/o file browser:
	media_media2insert_browser_callback : "chooseImage_viaTinyMCE",
	
	//the link-handling callback function for tinyMCE's media button:
	advlink_file_browser_callback : "chooseImage_viaTinyMCE",
	//and manually entered filenames as well, via media2insert w/o file browser:
	advlink_file2insert_browser_callback : "chooseImage_viaTinyMCE",
	
	//and the callback to generate exemath's LaTeX images via mimetex:
	exemath_image_browser_callback : "makeMathImage_viaTinyMCE",
	
	//to override any browser plugin checks, and allow media to be added:
	exe_assume_media_plugins : function(){
		var a=false;
		if (exe_assume_media_plugins) a=true;//if G.application.config.assumeMediaPlugins in authoringpage.py 
		return a;		
	},	
        inline_styles : true,
        convert_urls : false,
        accessibility_warnings : true,
        convert_fonts_to_spans : true,
        convert_newlines_to_brs : false,
        element_format : "xhtml",
        fix_list_elements : false,
        force_p_newlines : true,
        apply_source_formatting : true,
        theme_advanced_blockformats : "p,blockquote,div,h1,h2,h3,h4,h5,h6",

	theme_advanced_statusbar_location : "bottom",
	theme_advanced_resize_horizontal : false,
	theme_advanced_resizing : true,
	valid_elements : "*[*]",
	extended_valid_elements : "#td[*],strong/b,script[src|type]"	
});