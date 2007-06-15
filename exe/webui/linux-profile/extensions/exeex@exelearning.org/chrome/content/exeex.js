// Need to set window.* methods after window is loaded apparently

window.addEventListener("load", eXeexInit, true);

function eXeWindowIsClosing() {
  if (content.document.title == 'exelearning') {
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

