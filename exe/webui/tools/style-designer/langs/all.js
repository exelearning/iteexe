if (typeof(_)=='undefined') {
	if (opener) _ = opener._
	else _ = function(str) {
		return str;
	}
}
var $i18n = {
	// Style Designer
	Style_Designer : _("Style Designer"),
	// #1
	General : _("General"),
	General_settings : _("General settings"),
	Page_width : _("Page width"),
	Percentage : _("Percentage"),
	Pixels : _("Pixels"),
	Page_position : _("Page position"),
	Center : _("Center"),
	Left : _("Left"),
	Shadow_color : _("Shadow color"),
	Border_width : _("Border width"),
	Border_color : _("Border color"),
	Text_and_Links : _("Text and Links"),
	Font : _("Font"),
	Text_color : _("Text"),
	Text_color_FULL : _("Text color"),
	Text_size : _("Size"),
	Links_color : _("Links"),
	Links_color_FULL : _("Links color"),
	// Description
	Style_Description : _("Style description"),
	Author : _("Author"),
	Author_URL : _("Author URL"),
	Style_Name : _("Style name"),
	Save_to_name : _("Save to name the new Style."),
	Style_Version : _("Style version"),
	Style_Version_Instructions : _("Style version number is automatically increased when you save, use this selector to reset it."),
	License : _("License"),
	Original_License : _("(license of the original Style)"),
	// #2
	Page : _("Page"),
	Page_background : _("Page background (only Web Site)"),
	Background_color : _("Color"),
	Background_color_FULL : _("Background color"),
	Select_image : _("Select image"),
	Browse : _("Browse"),
	Background_image : _("Image"),
	Background_position : _("Position"),
	_Left_Top : _("Left - Top"),
	_Left_Center : _("Left - Center"),
	_Left_Bottom : _("Left - Bottom"),
	_Center : _("Center - Center"),
	_Center_Top : _("Center - Top"),
	_Center_Bottom : _("Center - Bottom"),
	_Right_Top : _("Right - Top"),
	_Right_Center : _("Right - Center"),
	_Right_Bottom : _("Right - Bottom"),
	Background_repeat : _("Repeat"),
	OK : _("OK"),
	Yes : _("Yes"),
	No : _("No"),
	_Only_vertical : _("Only vertical"),
	_Only_horizontal : _("Only horizontal"),
	Contents_area_background : _("Contents area background"),
	Search_bar : _("Search bar"),
	Button_background_color : _("Button color"),
	Button_text_color : _("Button text"),
	Background_instructions_1 : _('The "Page background" will only be used when exporting as Web Site.'),
	Background_instructions_2 : _('The "Contents area background" will also be used when exporting as IMS, SCORM or ePub3.'),
	Background_instructions_3 : _('The "Search bar" will only be seen when exporting as Web Site and enabling that option (Properties → Export).'),
	// #3	
	Header_and_Footer : _("Header and Footer"),
	Header : _("Header"),
	Footer : _("Footer"),
	Height : _("Height"),
	Project_title : _("Project title"),
	Hide_the_title : _("Hide the title"),
	Default_font : _("Default"),
	use_the_page_font : _("same font as the page"),
	Alignment : _("Alignment"),
	Right : _("Right"),
	Top_margin : _("Top margin"),
	Font_size : _("Font size"),
	// #4
	Navigation : _("Navigation"),
	Main_menu : _("Main menu"),
	Hide_the_menu : _("Hide the menu"),
	Horizontal_navigation : _("Horizontal navigation"),
	Width : _("Width"),
	Active_background : _("Active background"),
	Active_link_color : _("Active link color"),
	Other_navigation_options : _("Other navigation options"),
	Use_icons : _("Use icons"),
	Icons_color : _("Color"),
	Icons_color_FULL : _("Icons color"),
	Grey : _("Grey"),
	White : _("White"),
	Black : _("Black"),
	// #5
	With_emphasis : _("With emphasis"),
	Title_color : _("Title color"),
	Title_background : _("Title background"),
	No_emphasis : _("No emphasis (Free Text...)"),
	Show_box : _("Show box"),
	Toggler_icon_color : _("Icon to hide/show the iDevice"),
	// #6
	Advanced : _("Advanced"),
	content_css_1 : _("This code will be included at the end of content.css"),
	content_css_2 : _("content.css is included any time you export, and always after base.css."),
	nav_css_1 : _("This code will be included at the end of nav.css"),
	nav_css_2 : _("nav.css is only included when you export as Web Site, and always after content.css."),
	content_css_content : _("content.css content"),
	nav_css_content : _("nav.css content"),
	css3_warning : _("The shadows won't work in browsers with no CSS3 support (IE6, IE7...)."),
	// Common
	Reset : _("Reset"),
	Finish : _("Finish"),
	Save : _("Save"),
	Use_Save_as : _("This is one of eXe's default Styles. Please click on %s. You will find the new Style in the Styles menu when you finish."),
	Save_as : _("Save as"),
	Confirm : _("Confirm"),
	Finish_confirmation : _("Save the current design and close the Style Designer?"),
	Save_confirmation : _("Save all changes? This cannot be undone."),
	Save_as_dialog_instructions : _("Style name:"),
	Browser_Incompatible : _("Your browser is not compatible with this tool."),
	Hide_Show_Menu_Disabled : _("The Hide/Show menu option is disabled in the Style Designer"),
	Not_Enough_Resolution : _("Please, make your browser bigger. The Style Designer requires at least a 1024x768 screen resolution"),
	No_Opener_Error : _("The Style Designer window is not open."),
	Quit_Warning : _("This window will be closed. Please restart the tool."),
	Information : _("Information"),
	Error : _("Error"),
	Restore_Instructions : _("Undo changes since last time you saved? This cannot be undone. "),
	OK : _("OK"),
	Cancel : _("Cancel")
}