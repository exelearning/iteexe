// Strings to be translated
DO_YOU_WANT_TO_OVERWRITE_THE_EXISTING_IDEVICE = 'Do you want to overwrite the existing iDevice ';
SELECT_A_FILE = "Select a file";
EXE_IDEVICES = "eXe idevices";

function ideviceExists(ideviceName) {
    var ele = document.getElementById('ideviceSelect');
    var ideviceNameLower = ideviceName.toLowerCase()
    for (var i = 0; i < ele.options.length; i++) {
        if (ele.options.item(i).value.toLowerCase() == ideviceNameLower) {
            return true;
        }
    }
    return false;
}
  
function saveIdevice(title){
    var title1
    if (title == "none")
        title1 = document.getElementById('title').value
    else
        title1 = title
    
    var theForm = document.getElementById('contentForm')
    
    if (ideviceExists(title1)){
        if (confirm(DO_YOU_WANT_TO_OVERWRITE_THE_EXISTING_IDEVICE + title1 + '?')){
            theForm.action.value = "save"
        }else
            return
    }else 
        theForm.action.value = "new";
    theForm.submit()
    
}

// Called by the user to provide a file name to add to the package
function importPackage(blockId) {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, SELECT_A_FILE, nsIFilePicker.modeOpen);
    fp.appendFilter(EXE_IDEVICES, "*.idp");
    fp.appendFilters(nsIFilePicker.filterAll);
    var res = fp.show();
    if (res == nsIFilePicker.returnOK) {
        var path  = document.getElementById('path'+blockId);
        path.type  = 'eXe';
        path.value = fp.file.path;
        var theForm = document.getElementById('contentForm')
        theForm.action.value = "import";
        theForm.submit()
    }
}

function exportPackage(blockId) {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, SELECT_A_FILE, nsIFilePicker.modeSave);
    fp.appendFilter(EXE_IDEVICES, "*.idp");
    fp.appendFilters(nsIFilePicker.filterAll);
    var res = fp.show();
    if (res == nsIFilePicker.returnOK) {
        var path  = document.getElementById('path'+blockId);
        path.type  = 'eXe';
        path.value = fp.file.path;
        var theForm = document.getElementById('contentForm')
        theForm.action.value = "export";
        theForm.submit()
    }
}
