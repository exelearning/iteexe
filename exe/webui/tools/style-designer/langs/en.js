function _(str){
	return str;
}
var $i18n = {
	// Style Designer
	Style_Designer : _("Style Designer"),
	General : _("General"),
	Advanced : _("Advanced"),
	Help : _("Help"),
	Reset : _("Reset"),
	Finish : _("Finish"),
	Browser_Incompatible : _("Your browser is not compatible with this tool."),
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