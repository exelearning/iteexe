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
                    title: _('iDevices'),
                    store: 'IdeviceXmlStore',
                    flex: 1,
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
                            text: _('Name')
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }
});