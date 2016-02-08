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

Ext.define('eXe.view.ui.eXeViewport', {
    extend: 'Ext.container.Viewport',
    requires: [
        'eXe.view.ui.eXeToolbar',
        'eXe.view.ui.MainTabPanel',
        'eXe.view.ui.LeftPanel'
    ],

    layout: {
        type: 'border'
    },

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'exetoolbar',
                    region: 'north'
                },
                {
                    xtype: 'maintabpanel',
                    region: 'center'
                },
                {
                    xtype: 'leftpanel',
                    region: 'west',
                    split: true,
                    width: 250
                },
                {
                    xtype: 'uxNotification',
                    region: 'south',
                    itemId: 'eXeNotification',
                    closeAction: 'hide',
                    autoClose: false,
                    position: 'b',
                    useXAxis: false,
                    cls: 'ux-notification-light',
                    iconCls: 'ux-notification-icon-information'
                }
            ],
            itemId: 'eXeViewport',
            autoScroll: true
        });

        me.callParent(arguments);
    }
});