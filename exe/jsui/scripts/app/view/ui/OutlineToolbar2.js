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

Ext.define('eXe.view.ui.OutlineToolbar2', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.outlinetoolbar2',


    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'button',
                    icon: '/images/stock-goto-first.png',
                    tooltip: _('Promote node up in hierarchy') + '. Ctrl+↑',
                    itemId: 'outline_promote_node'
                },
                {
                    xtype: 'button',
                    icon: '/images/stock-goto-last.png',
                    tooltip: _('Demote node down in hierarchy') + '. Ctrl+↓',
                    itemId: 'outline_demote_node'
                },
                {
                    xtype: 'button',
                    icon: '/images/stock-go-up.png',
                    tooltip: _('Move node up') + '. Ctrl+U',
                    itemId: 'outline_up_node'
                },
                {
                    xtype: 'button',
                    icon: '/images/stock-go-down.png',
                    tooltip: _('Move node down') + '. Ctrl+D',
                    itemId: 'outline_down_node'
                }
            ]
        });

        me.callParent(arguments);
    }
});