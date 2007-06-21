// Need to set window.* methods after window is loaded apparently

window.addEventListener("load", eXeexInit, true);

function eXeWindowIsClosing() {
  // get a string containing the window location (not a property)
  var loc = content.document.location + '';
  // currently difficult to identify top window by title or location
  // so try to identify things that AREN'T the top window
  if ((loc.search(/^http:\/\/[^:]+:\d+\/editor$/) == -1) && (loc.search(/\/resources\//) == -1) {
    alert("Please use eXe's\n   File... Quit\nmenu to close eXe.");
    return false;
  }
  return true;
}

function eXeTryToClose(arg) {
  alert("Please use eXe's\n   File... Quit\nmenu to close eXe.");
  // don't let him close!  :-)
  return false;
}

function eXeexInit() {
  window.WindowIsClosing = eXeWindowIsClosing;
  window.tryToClose = eXeTryToClose;
}

