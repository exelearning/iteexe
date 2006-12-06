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
        if (confirm('Do you want to overwrite the exsiting idevice ' + title1 + '?')){
            theForm.action.value = "save"
        }else
            return
    }else 
        theForm.action.value = "new";
    theForm.submit()
    
}

