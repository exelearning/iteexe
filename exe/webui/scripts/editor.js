_ = parent._;
Ext = parent.Ext;
eXe = parent.eXe;

function ideviceExists(ideviceName) {
    var ele = document.getElementById('ideviceSelect');
    var ideviceNameLower = ideviceName.toLowerCase();
    
    for (var i = 0; i < ele.options.length; i++) {
        if (ele.options.item(i).value.toLowerCase() == ideviceNameLower) {
            return true;
        }
    }
    return false;
}
  
function quitDialog() {
	var theForm = document.getElementById('contentForm')
        Ext.Msg.show( {
            title: _('Confirm'),
            msg: _('Do you really want to exit without saving?'),
            scope: this,
            modal: true,
            buttons: Ext.Msg.YESNO,
            fn: function(button) {
                if (button == "yes")    {
                	Ext.getCmp("ideviceeditorwin").close();    	
                }
                else
		    return;
            }
        });
}

function saveIdevice(title) {
    var title1;
    //JR: Anadimos la comprobacion de que no sea null y ya sabemos que estamos hablando de saveSH
    var theForm = document.getElementById('contentForm');
	if (document.getElementById('title') == null) {
		theForm.action.value="saveSH";
		theForm.submit();
	}
	else {
		if (title == "none")
	   		title1 = document.getElementById('title').value;
	    else
	        title1 = title.replace("+", " ");
	    if (ideviceExists(title1)){
	        var msg = new Ext.Template(_('Do you want to overwrite the existing idevice {idevice}?')).apply({idevice: title1});
	        Ext.Msg.show( {
	            title: _('Confirm'),
	            msg: msg,
	            scope: this,
	            modal: true,
	            buttons: Ext.Msg.YESNO,
	            fn: function(button) {
	                if (button == "yes")    {
	                    theForm.action.value = "save";
	                    theForm.submit();
	                }
	                else
	                    return;
	            }
	        });
	    }
	    else {
	        theForm.action.value = "new";
	        theForm.submit();
	    }
	}
    
}

// Called by the user to provide a file name to add to the package
function importPackage(blockId) {
    var fp = Ext.create("eXe.view.filepicker.FilePicker", {
        type: eXe.view.filepicker.FilePicker.modeOpen,
        title: _("Select a file"),
        modal: true,
        scope: this,
        callback: function(fp) {
            if (fp.status == eXe.view.filepicker.FilePicker.returnOk || fp.status == eXe.view.filepicker.FilePicker.returnReplace) {
                var path  = document.getElementById('path'+blockId);
                path.type  = 'eXe';
                path.value = fp.file.path;
                var theForm = document.getElementById('contentForm')
                theForm.action.value = "import";
                theForm.submit();
            }
        }
    });
    fp.appendFilters([
        { "typename": _("eXe Idevices"), "extension": "*.idp", "regex": /.*\.idp$/ },
        { "typename": _("All Files"), "extension": "*.*", "regex": /.*$/ }
    ]);
    fp.show();    
}

function exportPackage(blockId, isNew) {
    if (isNew == 1)
        Ext.Msg.alert("",_("Please save the idevice first, then try to export it."));
    else{
	    var fp = Ext.create("eXe.view.filepicker.FilePicker", {
	        type: eXe.view.filepicker.FilePicker.modeSave,
	        title: _("Select a file"),
	        modal: true,
	        scope: this,
	        callback: function(fp) {
	            if (fp.status == eXe.view.filepicker.FilePicker.returnOk || fp.status == eXe.view.filepicker.FilePicker.returnReplace) {
		            var path  = document.getElementById('path'+blockId);
		            path.type  = 'eXe';
		            path.value = fp.file.path;
		            var theForm = document.getElementById('contentForm')
		            theForm.action.value = "export";
		            theForm.submit();
	            }
	        }
	    });
	    fp.appendFilters([
	        { "typename": _("eXe Idevices"), "extension": "*.idp", "regex": /.*\.idp$/ },
	        { "typename": _("All Files"), "extension": "*.*", "regex": /.*$/ }
	    ]);
	    fp.show();            
    }
}
