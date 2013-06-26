_ = parent._;
Ext = parent.Ext;
eXe = parent.eXe;

function quitDialog() {
    Ext.getCmp("stylemanagerwin").close();
}

function importStyle(){
	var fp = Ext.create("eXe.view.filepicker.FilePicker", {
        type: eXe.view.filepicker.FilePicker.modeOpen,
        title: _("Select ZIP Style file to import."),
        modal: true,
        scope: this,
        callback: function(fp) {
        	 if (fp.status == eXe.view.filepicker.FilePicker.returnOk || fp.status == eXe.view.filepicker.FilePicker.returnReplace) {
                nevow_clientToServerEvent('ImportStyle', this,'', 'zip', fp.file.path, fp.status == eXe.view.filepicker.FilePicker.returnReplace)
                
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
	 var fp = Ext.create("eXe.view.filepicker.FilePicker", {
            type: eXe.view.filepicker.FilePicker.modeSave,
            title: _("Export to ZIP Style as"),
            modal: true,
            scope: this,
            callback: function(fp) {
                if (fp.status == eXe.view.filepicker.FilePicker.returnOk || fp.status == eXe.view.filepicker.FilePicker.returnReplace)
                    nevow_clientToServerEvent('ExportStyle', this, '', 'zip', fp.file.path)
            }
        });
        fp.appendFilters([
            { "typename": _("ZipFile"), "extension": "*.zip", "regex": /.*\.zip$/ },
            { "typename": _("All Files"), "extension": "*.*", "regex": /.*$/ }
            ]
        );
        fp.show();
}

function deleteStyle(){
	Ext.Msg.show({
		title: _("Delete style?"),
		msg: _("Would you like delete selected style?"),
		scope: this,
		modal: true,
		buttons: Ext.Msg.YESNOCANCEL,
		fn: function(button, text, opt) {
			if (button == "yes")
				this.doDeletestyle();
			
		}
	});
}

