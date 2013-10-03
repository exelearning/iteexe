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
        'eXe.view.ui.OutlineToolbar2'
    ],

    layout: {
        type: 'border'
    },

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
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
                },
                {
                    xtype: 'gridpanel',
                    itemId: 'idevice_panel',
                    height: 150,
                    autoScroll: true,
                    store: 'IdeviceXmlStore',
                    flex: 1,
                    features: [{
                       ftype: 'grouping',
                	   startCollapsed: true,
                	   groupHeaderTpl: '{name}',
                	   
                    }],
                    listeners: {
             		   mouseover: {
             			   fn: function(e, target) {
             				   var feature = Ext.ComponentQuery.query("#idevice_panel gridview")[0].features[0];
             				   feature.collapseAll();
             				   feature.expand(Ext.fly(target).down('div').dom.textContent);
             			   },
             			   delegate: '.x-grid-group-hd',
             			   element: 'body'
             		   }
             	    },
             	    tbar: [
             	        {
             	        	xtype: 'button',
             	        	text: _('Ungroup'),
             	        	handler: function(button) {
             	        		if (button.getText() == _('Ungroup')) {
             	        			button.up("#idevice_panel").view.features[0].disable();
             	        			button.setText(_('Group'));
             	        		}
             	        		else {
             	        			button.up("#idevice_panel").view.features[0].enable();
             	        			button.setText(_('Ungroup'));
             	        		}
             	        	}
             	        },
             	        {
             	        	xtype: 'button',
             	        	text: _('Edit')
             	        }
             	    ],
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
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }
});