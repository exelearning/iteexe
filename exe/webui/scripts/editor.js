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
        title1 = title.replace("+", " ")
    
    var theForm = document.getElementById('contentForm')
    
    if (ideviceExists(title1)){
        if (confirm('Do you want to overwrite the exsiting idevice ' + title1 + '?')){
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
    fp.init(window, "Select a file", nsIFilePicker.modeOpen);
    fp.appendFilter("eXe idevices", "*.idp");
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

function exportPackage(blockId, isNew) {
    if (isNew == 1)
        alert("Please save the idevice first, then try to export it.")
    else{
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
        var nsIFilePicker = Components.interfaces.nsIFilePicker;
        var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
        fp.init(window, "Select a file", nsIFilePicker.modeSave);
        fp.appendFilter("eXe idevices", "*.idp");
        fp.appendFilters(nsIFilePicker.filterAll);
        var res = fp.show();
        if (res == nsIFilePicker.returnOK || res == nsIFilePicker.returnReplace) {
            var path  = document.getElementById('path'+blockId);
            path.type  = 'eXe';
            path.value = fp.file.path;
            var theForm = document.getElementById('contentForm')
            theForm.action.value = "export";
            theForm.submit()
        }
    }
}
