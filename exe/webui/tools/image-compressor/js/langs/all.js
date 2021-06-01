if (typeof(_)=='undefined') {
	if (top) _ = top._
	else _ = function(str) { return str; }
}
var $i18n = {
	imageOptimizer : _("Image optimizer"),
	uploadInstructions : _("Drop image here or $browse...$"),
	size : _('Size'),
	maxWidth : _("Max width"),
	maxHeight : _("Max height"),
	width : _("Width"),
	height : _("Height"),
	quality : _("Quality"),
	name : _("Name"),
	originalSize : _("Before"),
	resultSize : _("After"),
	finish : _("Finish"),
	newImageWarning : _("You just added that image. Save the iDevice or select the image again to update it."),
	backupWarning : _("$Save the current image$ before overwriting it.")
}