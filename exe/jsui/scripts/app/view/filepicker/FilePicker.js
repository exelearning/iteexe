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

Ext.define('eXe.view.filepicker.FilePicker', {
	extend: 'Ext.Window',
	id: 'filepicker',
	
	requires: [
		'eXe.view.filepicker.FileList',
		'eXe.view.filepicker.DirectoryTree'
	],
	
	statics: {
		returnOk: 0,
		returnCancel: 1,
		returnReplace: 2,
		modeOpen: 0,
		modeSave: 1,
		modeGetFolder: 2,
        modeOpenMultiple: 3
	},
	
	status: null,

	file: {},

	remote: false,

	show: function() {
		eXe.app.filepicker = this;
		if (this.remote) {
			Ext.Ajax.request({
				url: window.location.href + '/temp_file',
				params: { filetype: this.filetypes.getAt(0).get('extension') },
				success: function (response) {
					this.status = eXe.view.filepicker.FilePicker.returnOk;
					this.file = JSON.parse(response.responseText);
					this.callback.call(this.scope, this);
				},
				scope: this
			});
		} else {
			this.callParent();
		}
	},

	alert: function(title, message, func) {
		if (this.remote) {
			eXe.app.browseURL(window.location.href + '/temp/' + this.file.name, _('Download'), 'download_tab');
			if (func) {
				func();
			} else {
				try {
					Ext.Msg.close();
				} catch (err) {

				}

				setTimeout(function(){
					var tab_panel = Ext.ComponentQuery.query('#main_tab')[0],
                		tab = tab_panel.down('#download_tab');

					if (tab) {
						tab_panel.remove(tab);
						tab = null;
					}
				}, 3000);
			}
		} else {
			Ext.Msg.alert(title, message, func);
		}
	},

    initComponent: function() {
        var me = this,
            ft = Ext.create("Ext.data.Store",{ fields: ['typename', 'extension', 'regex'] }),
            top_buttons = eXe.app.config.locationButtons.concat([
                { xtype: 'component', flex: 1 }
	        ]),
    		buttons = [
	    		{ xtype: 'component', flex: 1 },
				{ xtype: 'button', text: _('Cancel'), itemId: 'filepicker_cancel' },
				{ xtype: 'button', text: _('Open'), itemId: 'filepicker_open' }
	    	],
            fieldlabel = _('Name'),
            filter =
	    		{
	                xtype: 'combo',
	                itemId: 'file_type_combo',
	                queryMode: 'local',
	                store: ft,
	                displayField: 'typename',
                    fieldLabel: _('Type'),
                    labelAlign: 'right',
	            	valueField: 'regex',
                    dock: 'bottom',
                    ui: 'footer',
	            	forceSelection: true,
                    allowBlank: false,
                    padding: '0px 0px 10px 0px'
	           }
            ;

        me.files = [];

        switch (me.type) {
        	case eXe.view.filepicker.FilePicker.modeSave:
        		buttons[2] = { xtype: 'button', text: _('Save'), itemId: 'filepicker_save' };
                top_buttons[eXe.app.config.locationButtons.length + 1] = { xtype: 'button', text: _('Create Directory'), itemId: 'filepicker_createdir' };
		        top_buttons.unshift({
		            xtype: 'text',
		            text: _('Save in:'),
		            padding: '2px 15px 0px 0px'
		        });
        		break;
        	case eXe.view.filepicker.FilePicker.modeGetFolder:
        		filter = [];
                fieldlabel = _('Folder');
                buttons[2] = { xtype: 'button', text: _('Select Folder'), itemId: 'filepicker_open' };
                top_buttons[eXe.app.config.locationButtons.length + 1] = { xtype: 'button', text: _('Create Directory'), itemId: 'filepicker_createdir' };
        		break;
        	case eXe.view.filepicker.FilePicker.modeOpen:
        		if(eXe.app.config.server) {
					top_buttons[eXe.app.config.locationButtons.length + 1] = { xtype: 'button', text: _('Create Directory'), itemId: 'filepicker_createdir' };
        			top_buttons[eXe.app.config.locationButtons.length + 2] =
        			{
    					xtype: "form",
    					layout: {
    						type: "hbox"
    					},
                        border: false,
    					items: [
                            {
                                xtype: 'filefield',
                                name: 'upload_content',
                                itemId: "upload_filefield",
                                buttonOnly: true,
                                hideLabel: true,
                                buttonText: _('Upload File')
                            },
                            {
                                xtype: "hidden",
                                name: "upload_filename",
                                itemId: "upload_filename"
                            },
                            {
                                xtype: "hidden",
                                name: "upload_currentdir",
                                itemId: "upload_currentdir"
                            }
                        ]
        			};
        		}
                break;
        }
        
        Ext.applyIf(me, {
        	width: 800,
            height: eXe.app.getMaxHeight(600),
            layout:'border',
			filetypes: ft,
			dockedItems: [
                {
	                xtype: 'container',
	                layout: 'hbox',
	                dock: 'top',
	                items: top_buttons,
                    padding: '0px 0px 5px 0px'
                },{
	                xtype: 'container',
	                layout: 'hbox',
	                dock: 'bottom',
	                ui: 'footer',
	                items: buttons
				},  filter
                ,{
	        		xtype: 'combo',
	        		name: 'name',
                    hideTrigger:true,
                    store: Ext.create('eXe.store.filepicker.File'),
                    displayField: "name",
                    valueField: "realname",
                    typeAhead: true,
                    typeAheadDelay: 100,
                    minChars: 2,
                    queryMode: 'remote',
                    queryDelay: 200,
	                fieldLabel: fieldlabel,
                    labelAlign: 'right',
	                dock: 'bottom',
                    ui: 'footer',
	        		itemId: 'file_place_field',
                    padding: '5px 0px 5px 0px',
                    listeners: {
                    	beforequery: function(qe) {
                    		if (qe.query.length < qe.combo.minChars) {
                    			delete qe.combo.prevqe;
                    			return false;
                    		}
                    		if (qe.combo.prevqe) {
                    			qe.cancel = true;
                    		}
                    		qe.combo.prevqe = qe;
                    	}
                    }
                }
			],
            fbar: [
			],
			items: [
				{
					xtype: "dirtree",
					region: "west"			
				},{
					xtype: "filelist",
                    multiSelect: me.type == eXe.view.filepicker.FilePicker.modeOpenMultiple? true : false,
					region: "center"
				}
			],
			listeners: {
				destroy: me.callback,
				scope: me.scope
			}
        });
        
        me.callParent(arguments);
    },
    
    appendFilters: function(filters) {
    	this.filetypes.add(filters);
    }
});