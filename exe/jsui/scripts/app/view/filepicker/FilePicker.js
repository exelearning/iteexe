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
		modeGetFolder: 2
	},
	
	status: null,

	file: {},
	
    initComponent: function() {
        var me = this;
		
        var ft = Ext.create("Ext.data.Store",{ fields: ['typename', 'extension', 'regex'] });

		buttons = [
    		{ xtype: 'component', flex: 1 },
			{ xtype: 'button', text: 'Cancel', itemId: 'filepicker_cancel' },
			{ xtype: 'button', text: 'Open', itemId: 'filepicker_open' }
    	];
	    filter = [
	    		{ xtype: 'component', flex: 1 },
	    		{
	    			xtype: 'combo',
	    			itemId: 'file_type_combo',
	    			queryMode: 'local',
	            	store: ft,
	            	displayField: 'typename',
	            	valueField: 'regex',
	            	forceSelection: true,
                    allowBlank: false
	    		}
    	];

        switch (me.type) {
        	case eXe.view.filepicker.FilePicker.modeSave:
        		buttons[2] = { xtype: 'button', text: _('Save'), itemId: 'filepicker_save' };
        		break;
        	case eXe.view.filepicker.FilePicker.modeGetFolder:
        		filter = [];
        		break;
        }
        
        Ext.applyIf(me, {
        	width: 800,
        	height: 600,
            layout:'border',
			filetypes: ft,
			dockedItems: [
				{
	        		xtype: 'textfield',
	        		name: 'name',
	        		fieldLabel: _('Place'),
	        		dock: 'top',
	        		id: 'file_place_field',
                    padding: '5px 0px 5px 0px'
				},{
	            	xtype: 'container',
	            	layout: 'hbox',
	            	dock: 'bottom',
	            	ui: 'footer',
	            	items: buttons
	            },{
	            	xtype: 'container',
	            	layout: 'hbox',
	            	dock: 'bottom',
	            	ui: 'footer',
	            	items: filter,
                    padding: '0px 0px 5px 0px'
	            }
	            
			],
            fbar: [
			],
			items: [
				{
					xtype: "dirtree",
					region: "west"			
				},{
						
					region: "center",
					xtype: "tabpanel",
					itemId: "mainpanel",
					enableTabScroll: true,
					activeTab: 0,
					layout: {
			            type: 'border',
			            padding: 5
	       			},
					items: [{
						xtype: "filelist",
						region: "center"
					}]
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