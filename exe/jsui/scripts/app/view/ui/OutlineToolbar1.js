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

Ext.define('eXe.view.ui.OutlineToolbar1', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.outlinetoolbar1',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'button',
                    text: _('Add Page'),
                    itemId: 'outline_add_node',
                    tooltip: 'Ctrl+Insert',
                    disabled: true
                },
                {
                    xtype: 'button',
                    text: _('Delete'),
                    itemId: 'outline_del_node',
                    tooltip: 'Ctrl+Supr',
                    disabled: true
                },
                {
                    xtype: 'button',
                    text: _('Rename'),
                    itemId: 'outline_ren_node',
                    tooltip: 'Ctrl+R',
                    disabled: true
                },
                // Hide left panel
                '->',
                // Left panel toggler
                {
                    xtype: 'text',
                    margin: '0 5 0 0',
                    html : '<a href="#" id="hide_exe_leftpanel" title="'+_("Minify this panel")+'"><img width="16" height="16" src="/images/stock-go-back-off.png" alt="'+_("Minify this panel")+'" /></a>',
                    listeners: {
                        afterrender: function(c) {
                            var l = document.getElementById("hide_exe_leftpanel");
                            if (l) {
                                l.onclick = function(){
                                    var panel = Ext.ComponentQuery.query('#exe_leftpanel')[0];
                                    panel.hide();
                                    eXe.app.createLeftPanelToggler();
                                    return false;
                                }
                            }
                        }                    
                    },
                    height: 16,
                    width: 16
                }
            ]
        });

        me.callParent(arguments);
    },
});