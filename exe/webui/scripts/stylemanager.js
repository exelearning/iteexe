_ = parent._;
Ext = parent.Ext;
eXe = parent.eXe;

function quitDialog() {
    Ext.getCmp("stylemanagerwin").close();
}

function doCancel() {
	var theForm = document.getElementById('contentForm');
	theForm.action.value = "doCancel";
    theForm.submit();
}

function importStyle(){
	var theForm = document.getElementById('contentForm');
	var fp = Ext.create("eXe.view.filepicker.FilePicker", {
        type: eXe.view.filepicker.FilePicker.modeOpen,
        title: _("Select ZIP Style file to import."),
        modal: true,
        scope: this,
        callback: function(fp) {
        	 if (fp.status == eXe.view.filepicker.FilePicker.returnOk || fp.status == eXe.view.filepicker.FilePicker.returnReplace) {
        		var path  = document.getElementById('filename');
                path.value = fp.file.path;
     	    	theForm.action.value = "importStyle";
     	        theForm.submit();
             }
        }
    });
    fp.appendFilters([
       { "typename": _("ZIP Style"), "extension": "*.zip", "regex": /.*\.zip$/ },
       { "typename": _("All Files"), "extension": "*.*", "regex": /.*$/ }
    ]);
    fp.show();		
}

function exportStyle(){
	var theForm = document.getElementById('contentForm');
	theForm.action.value = "exportStyle";
    theForm.submit();
}

function doExport(){
	var theForm = document.getElementById('contentForm');
	var stylesExport = document.getElementsByName('styleExport');
	var style = document.getElementById('styleExport');
	for (var i = 0; i < stylesExport.length; i++) {
	    if (stylesExport[i].checked) {
	        style = stylesExport[i].value;  
	    }
	}
	var fp = Ext.create("eXe.view.filepicker.FilePicker", {
		type: eXe.view.filepicker.FilePicker.modeSave,
		title: _("Export to ZIP Style as"),
		modal: true,
		scope: this,
		callback: function(fp) {
		    if (fp.status == eXe.view.filepicker.FilePicker.returnOk || fp.status == eXe.view.filepicker.FilePicker.returnReplace)
		        var path  = document.getElementById('filename');
	            path.value = fp.file.path;
		    	theForm.action.value = "doExport";
		        theForm.submit();
		    }
	});
	fp.appendFilters([
	    { "typename": _("ZipFile"), "extension": "*.zip", "regex": /.*\.zip$/ },
	    { "typename": _("All Files"), "extension": "*.*", "regex": /.*$/ }
	]);
	fp.show();

}

function deleteStyles(){
	var theForm = document.getElementById('contentForm');
	theForm.action.value = "deleteStyles";
    theForm.submit();
}

function doDelete(){
	var theForm = document.getElementById('contentForm');
	var styles = document.getElementsByTagName('input');
	var empty = true;
	for (var i = 0; i < styles.length; i++) {
	    if (styles[i].type == "checkbox" && styles[i].checked) {
	    	empty = false;
	    	break;
	    }
	}
	if (empty) {
		Ext.Msg.alert(_('Error'), _('You must select at least one style'));
		theForm.action.value = "";
		theForm.submit();
	}
	else {
		Ext.Msg.show({
			title: _("Delete styles?"),
			msg: _("Do you want to delete the selected styles?"),
			scope: this,
			modal: true,
			buttons: Ext.Msg.YESNOCANCEL,
			fn: function(button, text, opt) {
				if (button == "yes") {
			    	theForm.action.value = "doDelete";
			        theForm.submit();
			    }
			    else {
			    	theForm.action.value = "";
			    	theForm.submit();
			    }
			}
		});
	}
}

