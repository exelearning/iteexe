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

function doProperties(styleDirname) {
	var theForm = document.getElementById('contentForm');
	var style = document.getElementById('style');
	style.value = styleDirname;
	theForm.action.value = "doProperties";
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

function doExport(styleDirname){
	var theForm = document.getElementById('contentForm');
	var style = document.getElementById('style');
	style.value = styleDirname;
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

function doDelete(styleDirname){
	var theForm = document.getElementById('contentForm');
	var style = document.getElementById('style');
	style.value = styleDirname;
	Ext.Msg.show({
		title: _("Delete style?"),
		msg: _("Do you want to delete the selected style?"),
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

