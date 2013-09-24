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
            if (formpanel.el)
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
    listeners: {
       	    scope: this,
           'add': function(container, component, index, eOpts ){
//        	   console.log('ADD EVENT, componet: '+ component.getId());        	   
        	   if (container.getXType() == 'insertdelfieldset'){
        		   var me = container;
        		   var sid = component.inputId, sid;
        		   while (component){
        			  if (component.inputId){
        				   sid = component.inputId,
        				   vid = sid.split('_');
		                  if (! me.itemId){
		                      if (/contribute[0-9]$/.exec(vid[2]) && /.*date_description_string[0-9]*/.exec(sid)){
		                          me.itemId = vid[0] +  '_' + vid[1] + '_' + vid[2] +'_date';
		                      }else if (/taxon[0-9]*_entry_string[0-9]*$/.exec(sid)){
		                      	me.itemId = vid[0] +  '_' + vid[1] +  '_' + vid[2] + '_' + vid[3].replace(/[0-9]+/g, '');
		                      }
		                      else{
		                          me.itemId = vid[0] +  '_' + vid[1] +  '_' + vid[2].replace(/[0-9]+/g, '');                                        
		                      }
		                      me.addButtonObj = me.items.items[0].items.items[1];
//		                      console.log(me.itemId);
		                  }        				   
        			   }
        			   if (component.down){
        				   component = component.down();   
        			   }else{
        				   component = false;
        			   }        			   
        		   }
        	   }         	     
           },           
     },
    initComponent: function() {
        var me = this,
            items,
            addButton = null;
        	addButtonHide = false;

        this.item.flex = this.flex !== undefined? this.flex : 1;
        if (this.addButton != false) {
            addButton = {
                xtype: 'image',
                src: '/images/plusbutton.png',
                height: 24,
                width: 24,
                hidden: this.addButtonHide,
                itemId: 'addbutton',
                listeners: {
                    afterrender: function(c) {
                        c.up().actualId = me.lastId-1;
                        c.el.on('click', function(a) {
                            var i,
                                re,
                                id = [],
                                item = this,
                                depth = 1;

                            while (item.xtype != 'lomdata') {
                                if (item.actualId) {
                                    id[depth] = item.actualId;
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
                        itemId: 'delbutton',
                        height: 24,
                        width: 24,
                        listeners: {
                            afterrender: function(c) {
                                c.el.on('click', function(a) {
                                    var items = this.up(),
                                        fieldset = items.up()
                                        readonly = items.down("[readOnly=true]");
//                                        readonly = false
//                                    if (fieldset.addButton === false) {
//                                        readonly = items.items.items[0].items.items[0].items.items[0].readOnly;
//                                    }
                                    
                                    if (fieldset.items.length > 1 && !readonly) {
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
