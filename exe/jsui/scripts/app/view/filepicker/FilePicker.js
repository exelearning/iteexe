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

    initComponent: function() {
    	var fakeStore = Ext.create('Ext.data.Store', {
    	    fields: ['abbr', 'name'],
    	    data : [
    	        {"typename":"ELP", "extension":"elp", "regex" : "\*.elp"},
    	        {"typename":"All", "extension":"*", "regex" : "\*.\*"},
    	    ]
    	});
    	
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
            	forceSelection: true,
                allowBlank: false,
                style: {
                	padding: '0px 0px 10px 0px'
                }
           }
        ;

        me.files = [];

        switch (me.type) {
        	case eXe.view.filepicker.FilePicker.modeSave:
        		buttons[2] = { xtype: 'button', text: _('Save'), itemId: 'filepicker_save' };
                top_buttons[eXe.app.config.locationButtons.length + 1] = { xtype: 'button', text: _('Create Directory'), itemId: 'filepicker_createdir' };
		        top_buttons.unshift({
		            xtype: 'label',
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
        }
        
        Ext.apply(me, {
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
            /*fbar: [
			],*/
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