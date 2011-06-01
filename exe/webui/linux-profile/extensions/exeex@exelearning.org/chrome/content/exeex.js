// Need to set window.* methods after window is loaded apparently

window.addEventListener("load", eXeexInit, true);

function eXeWindowIsClosing() {
  // try to prevent closing the main window
  if (content.document.getElementById('mainWindow').id == 'mainWindow') {
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

