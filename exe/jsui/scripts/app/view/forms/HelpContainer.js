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

Ext.define('eXe.view.forms.HelpContainer', {
    extend: 'Ext.container.Container',
    alias: 'widget.helpcontainer',
    
    initComponent: function() {
        var me = this,
            items;

        this.item.flex = this.flex !== undefined? this.flex : 1;

        items = [
            {
                xtype: 'container',
                layout: 'hbox',
                anchor: '100%',
                defaults: {
                    flex: 0
                },
                items: [
                    this.item,
                    {
                        xtype: 'image',
                        src: '/images/info.png',
                        margin: '2 0 0 2',
                        height: 20,
                        width: 20,
                        listeners: {
                            afterrender: function(c) {
                                c.el.on('click', function(a) {
                                    var help = this.items.items[1],
                                        formpanel;
                                    formpanel = this.up();
                                    while (! formpanel.form)
                                        formpanel = formpanel.up();
                                    var restoreScroll = formpanel.el.cacheScrollValues();
                                    if (help.isVisible())
                                        help.hide();
                                    else
                                        help.show();
                                    restoreScroll();
                                }, me);
                            }
                        }
                    }
                ]
            },{
                xtype: 'component',
                html: this.help,
                margin: this.helpmargin !== undefined? this.helpmargin : '0 0 20 120',
                hidden: true,
                anchor: '100%'
            }
        ];

        Ext.applyIf(me, {
            xtype: 'container',
            layout: 'anchor',
            items: items
        });
        
        me.callParent(arguments);
    }
});

