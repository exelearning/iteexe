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

Ext.define('eXe.view.ui.LeftPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.leftpanel',
    requires: [
        'eXe.view.ui.OutlineToolbar1',
        'eXe.view.ui.OutlineToolbar2',
        'Ext.ux.CheckColumn'
    ],

    layout: {
        type: 'border'
    },

    initComponent: function() {
        var me = this;
        var leftOutlinePanel = {
            xtype: 'panel',
            layout: {
                type: 'border'
            },
            region: 'center',
            items: [
                {
                    xtype: 'outlinetoolbar1',
                    region: 'north'
                },
                {
                    xtype: 'treepanel',
                    itemId: 'outline_treepanel',
                    autoScroll: true,
                    title: _('Outline'),
                    store: 'OutlineXmlTreeStore',
                    rootVisible: false,
                    region: 'center',
                    animate: false,
                    viewConfig: {

                    }
                },
                {
                    xtype: 'outlinetoolbar2',
                    region: 'south'
                }
            ]
        };
        
        var leftIdevicePanel = {
            xtype: 'gridpanel',
            itemId: 'idevice_panel',
            height: 150,
            autoScroll: true,
            store: 'IdeviceXmlStore',
            flex: 1,
            plugins: [{ptype: 'cellediting', clicksToEdit: 1}],
            features: [{
               ftype: 'grouping',
        	   startCollapsed: true,
        	   groupHeaderTpl: '{name}',
        	   
            }],
     	    tbar: [
     	        {
     	        	xtype: 'button',
     	        	text: _('Ungroup iDevices'),
     	        	handler: function(button) {
     	        		var panel = button.up("#idevice_panel");
     	        		if (button.getText() == _('Ungroup iDevices')) {
     	        			panel.view.features[0].disable();
     	        			button.setText(_('Group iDevices'));
     	        		}
     	        		else {
     	        			panel.view.features[0].enable();
     	        			button.setText(_('Ungroup iDevices'));
     	        		}
     	        	}
     	        },
     	        {
     	        	xtype: 'button',
     	        	text: _('Edit iDevices'),
     	        	handler: function(button) {
     	        		var panel = button.up("#idevice_panel"),
         	        		leftpanel = panel.up("leftpanel"),
      	        			gbutton = button.prev("button");
      	        		if (button.getText() == _('Edit iDevices')) {
     	        			button.leftPanelSize = leftpanel.getWidth();
     	        			if (button.leftPanelSize < 350)
     	        				leftpanel.setWidth(350);
     	        			panel.editing = true;
     	        			panel.columns[1].show();
     	        			panel.columns[2].show();
     	        			panel.store.clearFilter();
     	        			button.setText(_('Save iDevices'));
     	        			panel.view.features[0].disable();
     	        			gbutton.disable();
     	        		}
     	        		else {
     	        			var restore = function() {
     	        				panel.editing = false;
     	        				panel.columns[1].hide();
     	        				panel.columns[2].hide();
     	        				leftpanel.setWidth(button.leftPanelSize);
     	        				button.setText(_('Edit iDevices'));
     	        				gbutton.enable();
     	        				if (gbutton.getText() == _('Ungroup iDevices'))
     	        					panel.view.features[0].enable();
     	        				panel.store.filter('visible', true);
     	        			};
     	        			if (panel.store.getModifiedRecords().length) {
     	        				panel.store.sync({
     	        					callback: restore
     	        				});
     	        			}
     	        			else {
     	        				restore();
     	        			}
     	        		}
     	        	}
     	        }
     	    ],
			selModel: {
			    selType: 'cellmodel'
			},
            region: 'south',
            split: true,
            columns: [
                {
                    xtype: 'gridcolumn',
                    sortable: false,
                    dataIndex: 'label',
                    fixed: true,
                    flex: 1,
                    hideable: false,
                    menuDisabled: true,
                    text: _('iDevices')
                },
                {
                    xtype: 'gridcolumn',
                    hidden: true,
                    sortable: false,
                    dataIndex: 'category',
                    fixed: true,
                    flex: 1,
                    hideable: false,
                    menuDisabled: true,
                    text: _('Category')
                },
                {
                    xtype: 'checkcolumn',
                    width: 50,
                    hidden: true,
                    sortable: false,
                    dataIndex: 'visible',
                    fixed: true,
                    flex: 0,
                    hideable: false,
                    menuDisabled: true,
                    text: _('Visible'),
                    editor: {
                        xtype: 'checkbox'
                    }
                }
            ]
        };
        
        
        Ext.applyIf(me, {
            items: [
                leftOutlinePanel,
                leftIdevicePanel
            ]
        });

        me.callParent(arguments);
    }
});