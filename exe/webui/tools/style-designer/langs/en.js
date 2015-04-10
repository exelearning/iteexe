function _(str){
	return str;
}
var $i18n = {
	// Style Designer
	Style_Designer : _("Style Designer"),
	General : _("General"),
	Page : _("Page"),
	Advanced : _("Advanced"),
	Help : _("Help"),
	Reset : _("Reset"),
	Finish : _("Finish"),
	Browser_Incompatible : _("Your browser is not compatible with this tool."),
	Hide_Show_Menu_Disabled : _("The Hide/Show menu option is disabled in the Style Designer"),
	Not_Enough_Resolution : _("Please, make your browser bigger. The Style Designer requires at least a 1024x768 screen resolution"),
	No_Opener_Error : _("The Style Designer window is not open."),
	Quit_Warning : _("This window will be closed. Please restart the tool."),
	Restore_Instructions : _("Just close this window and your design preview without clicking on Finish."),
	// Color Picker
	Color_Picker : _("Color Picker"),
	Color_Picker_Strings : {
		text : {
			title : _('Drag markers to pick a color'),
			newColor : _('New'),
			currentColor : _('Current'),
			ok : _('OK'),
			cancel : _('Cancel')
		},
		tooltips:{
			colors :{
				newColor : _('New Color - Press OK to Commit'),
				currentColor : _('Click to revert to original color')
			},
			buttons : {
				ok : _('Commit to this color selection'),
				cancel : _('Cancel and revert to original color')
			},
			hue:{
				radio : _('Set to Hue color mode'),
				textbox : _('Enter a Hue value (0-360º)')
			},
			saturation :{
				radio : _('Set to Saturation color mode'),
				textbox : _('Enter a Saturation value (0-100%)')
			},
			value :{
				radio : _('Set to Value color mode'),
				textbox : _('Enter a Value (0-100%)')
			},
			red :{
				radio : _('Set to Red color mode'),
				textbox : _('Enter a Red value (0-255)')
			},
			green :{
				radio : _('Set to Green color mode'),
				textbox : _('Enter a Green value (0-255)')
			},
			blue :{
				radio : _('Set to Blue color mode'),
				textbox : _('Enter a Blue value (0-255)')
			},
			alpha :{
				radio : _('Set to Alpha color mode'),
				textbox : _('Enter an Alpha value (0-100)')
			},
			hex :{
				textbox : _('Enter an Hex color value (#000000-#ffffff)'),
				alpha : _('Enter an Alpha value (0-100)')
			}
		}			
	}
	// / Color Picker
}