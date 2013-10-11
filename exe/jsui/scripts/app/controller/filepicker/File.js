// ===========================================================================
// eXe
// Copyright 2012, Pedro Peña Pérez, Open Phoenix IT
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
//===========================================================================

Ext.define('eXe.controller.filepicker.File', {
    extend: 'Ext.app.Controller',
	stores: ['filepicker.File'],
	views: ['filepicker.FileList', 'filepicker.DirectoryTree', 'filepicker.FilePicker'],
	requires: [
		'eXe.view.filepicker.FileList',
		'eXe.view.filepicker.DirectoryTree',
		'eXe.view.filepicker.FilePicker'
	],
	refs: [{
        ref: 'filesList',
        selector: 'filelist'
    },{
        ref: 'dirTree',
        selector: 'dirtree'
    },{
    	ref: 'placeField',
    	selector: '#file_place_field'
    },{
    	ref: 'filetypeCombo',
    	selector: '#file_type_combo'
    },{
    	ref: 'filePicker',
    	selector: '#filepicker'
    }
    ],
	sendWhat: 'both',
    currentDir: "",
    init: function() {
		this.control({
			'filelist': {
				itemclick: { fn: this.onHandleRowClick 	},
				itemdblclick: { fn: this.onHandleRowDblClick }
			},
			'#filepicker': {
				show: { fn: this.onFilePickerShow, scope: this }
			},
			'#filepicker_cancel': {
				click: { fn: this.onCancel }
			},
			'#filepicker_open': {
				click: { fn: this.onOpen }
			},
			'#filepicker_save': {
				click: { fn: this.onSave }
			},
			'#filepicker_createdir': {
				click: { fn: this.onCreateDir }
			},
			'button[location]': {
				click: { fn: this.onLocationClick }
			},
			'#file_type_combo': {
				change: { fn: this.onFilterChange }
			},
            '#file_place_field': {
                specialkey: { fn: this.onSpecialKey, scope: this }
            }
		});

		this.application.on({
			dirchange: this.onLoadFileList,
            error: this.onError,
			scope: this
		});
	},
    onSpecialKey: function(field, e) {
        if (e.getKey() == e.ENTER) {
            if (this.getFilePicker().type == eXe.view.filepicker.FilePicker.modeSave)
                this.onSave();
            else if (this.getFilePicker().type == eXe.view.filepicker.FilePicker.modeGetFolder || field.rawValue) {
	        	if (!field.isExpanded || field.getPicker().getNodes().length == 0) {
               		this.onOpen();
	        	}
            }
        }
        else if (e.getKey() == e.ESC) {
        	if (field.rawValue || field.isExpanded)
        		field.clearValue();
        	else
	            this.onCancel();
        }
    },
	onLoadFileList: function(directory, clear) {
		if ( !directory ) {
			directory = this.currentDir;
		}
		var fileStore = this.getFilepickerFileStore();
		fileStore.load({
			callback: function() {
                if (clear === true)
				    this.getPlaceField().clearValue();
				this.getPlaceField().focus();
			},
			params: {
				sendWhat: this.sendWhat,
				dir: directory
			},
			scope: this
		});
		this.currentDir = directory;
		Ext.state.Manager.set("filepicker-currentDir", directory);
		fileStore.currentDir = directory;
	},
    onError: function ( msg ) {
        new Ext.util.DelayedTask().delay(300, function() {
	        Ext.Msg.show({
		        msg: msg,
		        icon: Ext.Msg.ERROR,
		        buttons: Ext.Msg.OK,
		        closable: true,
		        modal: true
		    });
        });
    },
    rowClickTask: new Ext.util.DelayedTask(this.onHandleRowClick2),
	onHandleRowClick: function ( grid, record, el, rowIndex, e ) {
        this.rowClickTask.delay(200, this.onHandleRowClick2, this, [record]);
    },
    onHandleRowClick2: function ( record ) {
        var fp = this.getFilePicker();
        if (fp.type == eXe.view.filepicker.FilePicker.modeGetFolder) {
            if( record.get('type') == "directory" )
                this.getPlaceField().setValue(record.get('name'));
        }
        else {
            if( record.get('type') != "directory" )
			    this.getPlaceField().setValue(record.get('name'));
        }
        this.getPlaceField().focus();
        
    },
    validatePerms: function(mode, record, explore) {
        var readable = record.get('is_readable'),
            writable = record.get('is_writable'),
            dir = record.get('type') == 'directory',
            msg;

        if (mode == eXe.view.filepicker.FilePicker.modeGetFolder && !explore) {
            if (!writable) {
                msg = _('You do not have the permissions to write into folder') + ' ' + record.get('realname');
                this.application.fireEvent('error', msg);
            }
            return writable;
        }
        else {
	        if (!readable) {
		        if (dir)
		            msg = _('You do not have the permissions to open folder') + ' ' + record.get('realname');
		        else
		            msg = _('You do not have the permissions to open the file') + ' ' + record.get('realname');
		        this.application.fireEvent('error', msg);
	        }
	        return readable;
        }
    },
    onHandleRowDblClick: function( grid, record, el, rowIndex, e ) { 
		var fp = this.getFilePicker();
        this.rowClickTask.cancel();
        if (fp.type == eXe.view.filepicker.FilePicker.modeGetFolder) {
	        if (!this.validatePerms(fp.type, record, true))
	            return;
            if( record.get('type') == "directory" )
                this.application.fireEvent( "dirchange" , record.get('realname'), true );
        }
        else {
            if (!this.validatePerms(fp.type, record))
                return;
			if( record.get('type') == "directory" )
				this.application.fireEvent( "dirchange" , record.get('realname') );
			else {
				fp.status = eXe.view.filepicker.FilePicker.returnOk;
				fp.file = { 'path': record.get('realname') };
				var filelist = this.getFilesList();
				var selected = filelist.getSelectionModel().getSelection(), record;
                if (selected.length) {
                    fp.files = []
                    for (record in selected) {
                        if (selected[record].get('type') != "directory") {
		                    fp.files.push({ 'path': selected[record].get('realname') });
		                }
                    }
                }
				fp.destroy();
		    }
        }
	},
	onCancel: function() {
		var fp = this.getFilePicker();
		fp.status = eXe.view.filepicker.FilePicker.returnCancel;
		fp.file = {};
		fp.destroy();
	},
	onOpen: function() {
		var fp = this.getFilePicker(),
            store = this.getFilepickerFileStore(),
			place = this.getPlaceField(),
            record;
        if (fp.type == eXe.view.filepicker.FilePicker.modeGetFolder) {
            if (place.rawValue) {
                record = store.findRecord("name", place.rawValue, 0, false, true, true);
                if (record && record.get('type') == "directory" && this.validatePerms(fp.type, record)) {
                	fp.status = eXe.view.filepicker.FilePicker.returnOk;
	                fp.file = { 'path': record.get('realname') };
	                fp.destroy();
                }
                if (!record) {
                	record = store.findRecord("name", ".", 0, false, true, true);
                	if (this.validatePerms(fp.type, record)) {
						fp.status = eXe.view.filepicker.FilePicker.returnOk;
					    fp.file = { 'path': this.currentDir + '/' + place.rawValue };
					    fp.destroy();
					}
                }
            }
            else {
                var filelist = this.getFilesList(),
                    selected = filelist.getSelectionModel().getSelection(),
                    record = store.findRecord("name", ".", 0, false, true, true);
                if ((!selected.length && this.validatePerms(fp.type, record)) ||
                    (selected.length && selected[0].get('type') != "directory" && this.validatePerms(fp.type, selected[0]))) {
	                fp.status = eXe.view.filepicker.FilePicker.returnOk;
	                fp.file = { 'path': this.currentDir };
	                fp.destroy();
                }
            }
        }
        else if (fp.type == eXe.view.filepicker.FilePicker.modeOpenMultiple) {
                var filelist = this.getFilesList();
				if (place.rawValue) {
	                record = store.findRecord("name", place.rawValue, 0, false, true, true);
	                if (record) {
		                if (record.get('type') == "directory") {
                            if (this.validatePerms(fp.type, record))
                               this.application.fireEvent( "dirchange" , record.get('realname') );
		                }
		                else {
			                var selected = filelist.getSelectionModel().getSelection(), record;
			                if (selected.length) {
			                    fp.files = []
			                    for (record in selected) {
			                        if (selected[record].get('type') != "directory") {
                                        if (!this.validatePerms(fp.type, selected[record])) {
                                            fp.status = eXe.view.filepicker.FilePicker.returnCancel;
                                            break;
                                        }
					                    fp.status = eXe.view.filepicker.FilePicker.returnOk;
					                    fp.files.push({ 'path': selected[record].get('realname') });
					                }
			                    }
                                if (fp.files.length)
                                    fp.destroy();
			                }
                        }
                    }
				}
        }
        else {
			if (place.rawValue) {
                record = store.findRecord("name", place.rawValue, 0, false, true, true);
                if (record && this.validatePerms(fp.type, record))
	                if (record.get('type') == "directory") {
                        this.application.fireEvent( "dirchange" , record.get('realname'), true );
	                }
	                else {
		                fp.status = eXe.view.filepicker.FilePicker.returnOk;
						fp.file = { 'path': record.get('realname') };
						fp.destroy();
	                }
			}
			else {
				var filelist = this.getFilesList();
				var	selected = filelist.getSelectionModel().getSelection();
				if (selected.length && selected[0].get('type') == "directory")
                    if (this.validatePerms(fp.type, selected[0]))
                        this.application.fireEvent( "dirchange" , selected[0].get('realname') );
			}
        }
	},
	onSave: function() {
		var fp = this.getFilePicker(),
			place = this.getPlaceField(),
			store = this.getFilepickerFileStore(),
            record,
			onReplaceOk = function(status) {
				fp.status = status;
				fp.file = { 'path': this.currentDir + '/' + place.rawValue };
				fp.destroy();
			};
		if (place.rawValue) {
            record = store.findRecord("name", place.rawValue, 0, false, true, true);
            if (record) {
                if (this.validatePerms(fp.type, record)) {
	                if (record.get('type') != "directory")
                        this.confirmReplace( onReplaceOk );
	                else
	                    this.application.fireEvent( "dirchange" , record.get('realname'), true );
                }
            }
			else {
                record = store.findRecord("name", ".", 0, false, true, true);
                if (record.get('is_writable'))
				    onReplaceOk( eXe.view.filepicker.FilePicker.returnOk );
                else {
                    msg = _('You do not have the permissions to  save into folder') + ' ' + record.get('realname');
                    this.application.fireEvent('error', msg);
                }
            }
		}
	},
	onCreateDir: function() {
        var store = this.getFilepickerFileStore(),
            record = store.findRecord("name", ".", 0, false, true, true);
        if (record.get('is_writable')) {
			Ext.Msg.show({
				prompt: true,
				title: _('Create Folder'),
				msg: _('Enter the new folder name:'),
				buttons: Ext.Msg.OKCANCEL,
				multiline: false,
				scope: this,
				fn: function(button, text) {
					if (button == "ok")	{
						if (text) {
							nevow_clientToServerEvent('CreateDir', this, '', this.currentDir, text);
						}
			        }
			    }
			});
        }
        else {
            msg = _('You do not have the permissions to create a folder in folder') + ' ' + record.get('realname');
            this.application.fireEvent('error', msg);
        }
	},
	confirmReplace: function(onReplaceOk) {
		Ext.Msg.show({
			title: _("Confirm?"),
			msg: _("The file already exists. Do you want to replace it?"),
			scope: this,
			modal: true,
			buttons: Ext.Msg.YESNO,
			fn: function(button) {
				if (button == "yes")
					onReplaceOk(eXe.view.filepicker.FilePicker.returnReplace);
			}
		});
	},
	onFilePickerShow: function() {
		var fp = this.getFilePicker(),
			combo = this.getFiletypeCombo(),
            place = this.getPlaceField();

        fp.status = eXe.view.filepicker.FilePicker.returnCancel;
        place.setValue("");
        place.focus();
        if (combo)
		  combo.setValue(fp.filetypes.getAt(0).get('regex'));
		this.currentDir = Ext.state.Manager.get('filepicker-currentDir', '/');
		this.application.fireEvent( "dirchange", this.currentDir );
	},
	onFilterChange: function(field, newValue, oldValue, eOpts) {
		var store = this.getFilepickerFileStore();
		
		store.filterBy( function(record, id) {
			if (record.get("type") == "directory")
				return true;
			return record.get("name").match(newValue);
		});
	},
	onLocationClick: function(button) {
		this.application.fireEvent("dirchange", button.location);
	}
});
