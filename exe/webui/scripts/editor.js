function ideviceExists(ideviceName) {
    var ele = document.getElementByName('ideviceSelect');
    var ideviceNameLower = ideviceName.toLowerCase()
    for (var i = 0; i < ele.options.length; i++) {
        if (ele.options.item(i).value.toLowerCase() == ideviceNameLower) {
            return true;
        }
    }
    return false;
}
