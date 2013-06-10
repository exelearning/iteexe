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
    
    lastId: 2,

    initComponent: function() {
        var me = this,
            items,
            addButton = null;

        this.item.flex = this.flex !== undefined? this.flex : 1;

        if (this.addButton != false) {
            addButton = {
                xtype: 'image',
                src: '/images/plusbutton.png',
                height: 24,
                width: 24,
                itemId: 'addbutton',
                listeners: {
                    afterrender: function(c) {
                        function updater(key, value, object) {
                            if (key === 'inputId') {
                                var sid = object.templateId;
                                sid = value;
                                vid = sid.split('_');
                                //console.log(sid);
                                if (! me.itemId){
                                    if (/contribute[0-9]$/.exec(vid[2]) && /.*date_description_string[0-9]*/.exec(sid)){
                                        me.itemId = vid[0] +  '_' + vid[1] + '_' + vid[2] +'_date';
                                    }else{
                                        me.itemId = vid[0] +  '_' + vid[1] +  '_' + vid[2].replace(/[0-9]+/g, '');
                                    }
                                    //console.log('ADD ITEMID  ' +me.itemId);
                                }
                            }
                            if (key === 'item') {
                                Ext.iterate(object.item, updater);
                                return false;
                            }
                            if (key === 'items') {
                                Ext.iterate(object.items, updater);
                                return false;
                            }
                            if (Ext.isObject(key))
                                Ext.iterate(key, updater);
                        }
                        Ext.iterate(me.item, updater);

                        c.el.on('click', function(a) {
                            var i,
                                re,
                                id = [],
                                item = this,
                                depth = 0;

                            while (item.xtype != 'lomdata') {
                                if (item.xtype == 'insertdelfieldset') {
                                    id[depth] = item.lastId-1;
                                    depth++;
                                }
                                item = item.up();
                            }
                            id[0] = this.lastId++;


                            function updater(key, value, object) {
                                if (key === 'inputId') {
                                    object.inputId = object.templateId;
                                    for (i = 0; i < depth; i++) {
                                        re = new RegExp('\\{' + (depth-i) + '\\}');
                                        object.inputId = object.inputId.replace(re, String(id[i]));
                                    }
                                    object.inputId = object.inputId.replace(/\{[1-9]\}/g, '1');
                                }
                                if (key === 'item') {
                                    Ext.iterate(object.item, updater);
                                    return false;
                                }
                                if (key === 'items') {
                                    Ext.iterate(object.items, updater);
                                    return false;
                                }
                                if (Ext.isObject(key))
                                    Ext.iterate(key, updater);
                            }
                            Ext.iterate(this.item, updater);
                            this.preserveScroll();
                            this.add(items);
                            this.restoreScroll();
                        }, me);
                    }
                }
            }
        }
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
                    addButton,
                    {
                        xtype: 'image',
                        src: '/images/minusbutton.png',
                        height: 24,
                        width: 24,
                        listeners: {
                            afterrender: function(c) {
                                c.el.on('click', function(a) {
                                    var items = this.up(),
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
        ];
        
        Ext.applyIf(me, {
            layout: 'anchor',
            items: items
        });
        
        me.callParent(arguments);
    }
});