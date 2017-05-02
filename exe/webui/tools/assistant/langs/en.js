if (typeof(_)=='undefined') {
    if (top) _ = top._
    else _ = function(str) {
        return str;
    }
}
var $i18n = {
    Menu : _("Menu"),
    Previous : _("Previous"),
    Next : _("Next")
}