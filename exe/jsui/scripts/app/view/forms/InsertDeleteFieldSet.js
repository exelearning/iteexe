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

Ext.define('eXe.view.forms.PreserveScrollFieldSet', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.preservescrollfieldset',

    restoreScroll: function() {
        if (this.restoreScrollFunction)
            this.restoreScrollFunction();
    },

    preserveScroll: function() {
        var formpanel = this.up();
        if (formpanel) {
            while (!formpanel.form)
                formpanel = formpanel.up();
            this.restoreScrollFunction = formpanel.el.cacheScrollValues();
        }
    },

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            listeners: {
                beforecollapse: this.preserveScroll,
                collapse: this.restoreScroll,
                beforeexpand: this.preserveScroll,
                expand: this.restoreScroll
            }
        });
        
        me.callParent(arguments);
    }
});

Ext.define('eXe.view.forms.InsertDeleteFieldSet', {
    extend: 'eXe.view.forms.PreserveScrollFieldSet',
    alias: 'widget.insertdelfieldset',
    
    lastId: 1,

    initComponent: function() {
        var me = this,
            items = [
                {
                    xtype: 'container',
                    layout: 'anchor',
                    items: [
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            anchor: '100%',
                            items: [
                                {
                                    xtype: 'container',
                                    layout: 'anchor',
                                    flex: this.flex !== undefined? this.flex : 1,
                                    items: this.item
                                },
                                {
                                    xtype: 'container',
                                    layout: 'anchor',
                                    flex: 0,
                                    items: [
                                        {
                                            xtype: 'image',
                                            src: '/images/plusbutton.png',
                                            height: 24,
                                            width: 24,
                                            anchor: '100%',
                                            listeners: {
                                                afterrender: function(c) {
                                                    c.el.on('click', function(a) {
                                                        var item = this.item, i;
                                                        if (item.xtype === "container") {
                                                            for (i = 0; i < item.items.length; i++)
                                                                item.items[i].item.inputId = item.items[i].item.inputId + String(this.lastId++);
                                                        }
                                                        else if (Ext.isArray(item)) {
                                                            for (i = 0; i<item.length; i++)
                                                                item[i].item.inputId = item[i].item.inputId + String(this.lastId++);
                                                        }
                                                        else
                                                            item.item.inputId = item.item.inputId + String(this.lastId++);
                                                        items[0].items[0].items[0].items = item;
                                                        this.preserveScroll();
                                                        this.add(items);
                                                        this.restoreScroll();
                                                    }, me);
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'image',
                                            src: '/images/minusbutton.png',
                                            height: 24,
                                            width: 24,
                                            anchor: '100%',
                                            listeners: {
                                                afterrender: function(c) {
                                                    c.el.on('click', function(a) {
                                                        var items = this.up().up().up(),
                                                            fieldset = items.up();
                                                        if (fieldset.items.length > 1) {
                                                            fieldset.preserveScroll();
                                                            fieldset.remove(items,true);
                                                            fieldset.restoreScroll();
                                                        }
                                                    }, c);
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ];
        
        Ext.applyIf(me, {
            items: items
        });
        
        me.callParent(arguments);
    }
});