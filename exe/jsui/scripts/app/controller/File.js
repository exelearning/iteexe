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

Ext.define('eXe.controller.File', {
    extend: 'Ext.app.Controller',
	stores: ['File'],
	views: ['ui.FileList', 'ui.DirectoryTree', 'ui.FilePicker'],
	requires: [
		'eXe.view.ui.FileList',
		'eXe.view.ui.DirectoryTree',
		'eXe.view.ui.FilePicker'
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
			'#file_type_combo': {
				change: { fn: this.onFilterChange }
			}
		});

		this.application.on({
			dirchange: this.onLoadFileList,
			scope: this
		});
	},
	//TODO Review what comes in directory
	onLoadFileList: function(directory) {
		if ( !directory ) {
			directory = this.currentDir;
		}
		if ( directory.id ) {
			directory = directory.id;
		}
		directory = this.getFullClearPath( directory );
		if (directory[0] != '/')
			directory = '/';
		var fileStore = this.getFileStore();
		fileStore.load({
			callback: function() {
				var combo = this.getFiletypeCombo();
				fileStore.filterBy( function(record, id) {
					if (record.get("type") == "directory")
						return true;
					return record.get("name").match(combo.value);
				});
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
	getFullClearPath: function(path) {
		return path.replace( /_RRR_/g, '/' ).replace(/Ext\.data\.Store\.ImplicitModel-DirectoryTree-/, '')
		.replace(/\/\//, '/' );
	},
	onHandleRowClick: function ( grid, record, el, rowIndex, e ) {
		if( record.get('type') != "directory" )
			this.getPlaceField().setValue(record.get('name'));
    },
    onHandleRowDblClick: function( grid, record, el, rowIndex, e ) { 
		if( record.get('type') == "directory" )
			this.application.fireEvent( "dirchange" , this.currentDir + '/' + record.get('name') );
		else {
			var fp = this.getFilePicker();
			fp.status = eXe.view.ui.FilePicker.returnOk;
			fp.file = { 'path': this.currentDir + '/' + record.get('name') };
			fp.destroy();
		}
	},
	onCancel: function() {
		var fp = this.getFilePicker();
		fp.status = eXe.view.ui.FilePicker.returnCancel;
		fp.file = {};
		fp.destroy();
	},
	onOpen: function() {
		var fp = this.getFilePicker(),
			place = this.getPlaceField();
		fp.status = eXe.view.ui.FilePicker.returnOk;
		if (place.value) {
			fp.file = { 'path': this.currentDir + '/' + place.value };
			fp.destroy();
		}
		else {
			var filelist = this.getFilesList();
			var	selected = filelist.getSelectionModel().getSelection();
			if (selected.length)
				this.application.fireEvent( "dirchange" , this.currentDir + '/' + selected[0].get('name') );
		}
	},
	onSave: function() {
		var fp = this.getFilePicker(),
			place = this.getPlaceField(),
			store = this.getFileStore(),
			onReplaceOk = function(status) {
				fp.status = status;
				fp.file = { 'path': this.currentDir + '/' + place.value };
				fp.destroy();
			};
		fp.status = eXe.view.ui.FilePicker.returnOk;
		if (place.value) {
			if (store.findExact("name", place.value) >= 0)
				this.confirmReplace( onReplaceOk );
			else 
				onReplaceOk( eXe.view.ui.FilePicker.returnOk );
		}
		else {
			var filelist = this.getFilesList();
			var	selected = filelist.getSelectionModel().getSelection();
			if (selected.length)
				if ( selected[0].get('type') != "directory" )
					this.confirmReplace( onReplaceOk );
		}
	},
	confirmReplace: function(onReplaceOk) {
		Ext.Msg.show({
			title: "Confirm?",
			msg: "El fichero ya existe. Desea reemplazarlo?",
			scope: this,
			modal: true,
			buttons: Ext.Msg.YESNO,
			fn: function(button) {
				if (button == "yes")
					onReplaceOk(eXe.view.ui.FilePicker.returnReplace);
			}
		});
	},
	onFilePickerShow: function() {
		var fp = this.getFilePicker(),
			combo = this.getFiletypeCombo();

		combo.setValue(fp.filetypes.getAt(0).get('regex'));
		this.currentDir = Ext.state.Manager.get('filepicker-currentDir', '/');
		this.application.fireEvent( "dirchange", this.currentDir );
	},
	onFilterChange: function(field, newValue, oldValue, eOpts) {
		var store = this.getFileStore();
		
		store.filterBy( function(record, id) {
			if (record.get("type") == "directory")
				return true;
			return record.get("name").match(newValue);
		});
	}
});