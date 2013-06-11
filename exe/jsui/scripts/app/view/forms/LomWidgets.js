// ===========================================================================
// eXe
// Copyright 2013, Pedro Peña Pérez, Open Phoenix IT
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


Ext.define('eXe.view.forms.LomWidgets', {
    statics: {
		required: function(msg) {
		    return '*' + msg + ' (' + _('Required') + ')';
		},
		optional: function(msg) {
		    return msg + ' (' + _('Optional') + ')';
		},
        textfield: function(label, id, tooltip, optional, margin, value) {
            var item;
		    if (!tooltip)
		        tooltip = label;
		    if (!margin)
		        margin = '0 0 0 0';
		    item = {
		        xtype: 'textfield',
		        allowBlank: optional,
		        margin: margin,
		        fieldLabel: label,
		        tooltip: tooltip,
		        inputId: id.replace(/\{[1-9]\}/g, '1'),
                templateId: id,
		        validateOnBlur: false,
		        validateOnChange: false,
                hideEmptyLabel: false,
                labelWidth: label? 100: 0,
                dirtyCls: 'property-form-dirty'
		    }
            if (value) {
                item.value = value;
                item.readOnly = true;
            }
            return item;
		},
		helpfield: function(label, id, tooltip, help, optional, margin, helpmargin, value) {
		    if (!help)
		        if (label)
		            help = label;
		        else
		            help = tooltip;
		    if (!helpmargin)
		        helpmargin = '0 0 20 20';
		    return {
		        xtype: 'helpcontainer',
		        flex: 1,
		        item: this.textfield(label, id, tooltip, optional, margin, value),
		        help: help,
		        helpmargin: helpmargin
		    }
		},
		selectSelectionPurpose: function(combo, records, eOpts){
			console.log('Select Purpose');
		},
		selectSelectionSource: function(combo, records, eOpts){
			console.log('Select Source');			
			var nextCombo = combo.nextNode('combo[name='+combo.getName().replace(/source$/, 'taxon')+']');
			var store = Ext.create('Ext.data.Store', {			    
			    proxy: {
			        type: 'ajax',
			        url: location.pathname + '/taxon',			        
			        reader: {
			        	idProperty: 'identifier',
			        	successProperty: 'success',
			            root: 'data',
			            type: 'json'
			        }
			    },
			    autoLoad: false,
			    autoSync: false,			    
			    fields: [ 'identifier', 'text' ]
			});
			store.load({params: {source: combo.getValue(), identifier: false}});					
			nextCombo.bindStore(store);
			//combo.disable();		 
		},
		helpcombo: function(label, id, tooltip, help, optional, margin, helpmargin) {
		    var combo = this.helpfield(label, id, tooltip, help, optional, margin, helpmargin),
		        storeName = id, ids = id.split('_'), selectOp;
		    storeName = storeName.replace(/\{[1-9]\}/g, '');
	        storeName = storeName.replace(/[1-9]*/g, '');
	        storeName = storeName.replace(/_string$/, '');
	        storeName = storeName.replace(/_value$/, '');
	        storeName = storeName.slice(storeName.lastIndexOf('_') + 1) + 'Values';
		    if (/^(lom|lomes)+_classification[0-9]*/.exec(id)){
		    	//console.log('HelpCombo: ' + storeName);
		    	if (/purpose_value$/.exec(id)){
		    		combo.item.listeners = {
			            	 scope: this,
			                'select': this.selectSelectionPurpose
			           };		    		
		    	}else if (/_source$/.exec(id)){
		    		combo.item.listeners = {
			            	 scope: this,
			                'select': this.selectSelectionSource
			           };
		    		storeName = "taxonpathSourceValues";
		    	}		    	
			}            
            
	        //console.log('POST: ' + storeName);
		    combo.item.xtype = 'combobox';
		    combo.item.store = Ext.ClassManager.getByAlias(ids[0]).vocab[storeName];
            combo.item.forceSelection = !optional;
            combo.item.queryMode = 'local';
		    return combo;
		},
		helparea: function(label, id, tooltip, help, optional, margin, helpmargin) {
		    var area = this.helpfield(label, id, tooltip, help, optional, margin, helpmargin);

		    area.item.xtype = 'textarea';
		    area.item.height = 60
		    return area;
		},
		field: function(label, appendable, mandatory, item) {
		    var title, field, xtype = 'preservescrollfieldset';

            if (label) {
			    if (mandatory)
			        title = this.required(label);
			    else
			        title = this.optional(label);
            }
            else
                title = label;
		    if (appendable)
		        xtype = 'insertdelfieldset';
		    field = {
		        xtype: xtype,
		        defaults: {
		            collapsible: true,
		            validateOnBlur: false,
		            validateOnChange: false
		        },
		        collapsible: mandatory,
		        checkboxToggle: !mandatory,
		        //checkboxName: 
		        collapsed: !mandatory,
		        title: title
		    }
		    if (appendable)
		        field.item = item;
		    else
		        field.items = item;
		    return field
		},
		datefield: function(embedded, label, id, tooltip, help, optional, margin, helpmargin) {
		    if (!tooltip)
		        tooltip = label;
		    if (!help)
		        if (label)
		            help = label;
		        else
		            help = tooltip;
		    if (!margin)
		        margin = '0 0 0 0';
		    if (!helpmargin)
		        helpmargin = '0 0 20 20';
            var descriptionfield = null, fieldLabel, field;

            descriptionfield = this.field( null, true, true, this.langfield( this.helparea( _('Description'), id + '_description_string{2}', _('Description'), null, true)));
            descriptionfield.border = false;
            descriptionfield.collapsible = false;
            if (!embedded) {
                fieldLabel = null
            }
            else {
                fieldLabel = label;
                label = null;
            }
		    field = this.field( label, false, !optional, [
	            {
			        xtype: 'helpcontainer',
			        item: {
			            xtype: 'datefield',
			            allowBlank: optional,
			            format: 'Y-m-d',
                        fieldLabel: fieldLabel,
			            validateOnBlur: false,
			            validateOnChange: false,
			            pickerAlign: 'tr-br',
			            inputId: id.replace(/\{[1-9]\}/g, '1'),
	                    templateId: id,
			            tooltip: tooltip,
			            margin: margin,
                        hideEmptyLabel: false,
                        labelWidth: fieldLabel? 100: 0,
			            dirtyCls: 'property-form-dirty',
                        listeners: {
                            blur: {
                                fn: this.updateMandatoryField
                            }
                        }
			        },
			        help: help,
			        helpmargin: helpmargin
	            },
                descriptionfield
	        ])
            if (embedded) {
                field.border = false;
                field.collapsible = false;
                field.checkboxToggle = false;
                field.collapsed = false;
                field.margin = -10;
            }
            return field;
		},
		durationfield: function(label, appendable, mandatory, id) {
            var descriptionfield = this.field( null, true, true, this.langfield( this.helparea( _('Description'), id + '_description_string{1}', _('Description'), null, true)));
            descriptionfield.border = false;
            descriptionfield.collapsible = false;

		    return this.field( label, appendable, mandatory, [
		        {
		            xtype: 'container',
		            layout: 'hbox',
                    defaults: {
                        listeners: {
                            change: {
                                fn: this.updateMandatoryField,
                                element: 'el'
                            }
                        }
                    },
		            items: [
		                { xtype: 'container', layout: 'anchor', flex: 1, items: this.textfield( _('Years'), id + '_years', null, true, '0 20 0 0')},
		                { xtype: 'container', layout: 'anchor', flex: 1, items: this.textfield( _('Months'), id + '_months', null, true, '0 20 0 0')},
		                { xtype: 'container', layout: 'anchor', flex: 1, items: this.textfield( _('Days'), id + '_days', null, true)}
		            ]
		        },
		        {
		            xtype: 'container',
		            layout: 'hbox',
                    defaults: {
                        listeners: {
			                change: {
			                    fn: this.updateMandatoryField,
			                    element: 'el'
                            }
                        }
                    },
		            items: [
		                { xtype: 'container', layout: 'anchor', flex: 1, items: this.textfield( _('Hours'), id + '_hours', null, true, '0 20 0 0')},
		                { xtype: 'container', layout: 'anchor', flex: 1, items: this.textfield( _('Minutes'), id + '_minutes', null, true, '0 20 0 0')},
		                { xtype: 'container', layout: 'anchor', flex: 1, items: this.textfield( _('Seconds'), id + '_seconds', null, true)}
		            ]
		        },
		        descriptionfield
		    ])
		},
		addDelEvent: function (e, t, eOpts){
			var	scope = this.scope, 
				combo = this.combo;		    
			var items = combo.nextNode('image#delbutton').up(),
				fieldset = items.up();
			var preCombo = combo.previousNode('combo');
			if (fieldset.items.length > 1) {
				fieldset.preserveScroll();
				fieldset.remove(items,true);
				fieldset.restoreScroll();
			}
			var v = preCombo.getValue();
			preCombo.setReadOnly(false);				
			//console.log('NewClic Event');
			var scp = {'scope': scope, 'combo': preCombo};			
			var preButdel = preCombo.nextNode('image#delbutton');			
			preButdel.getEl().addListener( 'click', scope.addDelEvent, scp);
		},
		selectTaxon: function(combo, records, eOpts){
			console.log('Select Taxon');
			var butadd = combo.nextNode('image#addbutton');
			butadd.getEl().dom.click();
			var nextCombo = combo.nextNode('combo');
			//var store = ['Menu 1.1', 'Menu 1.2','Menu 1.3','Menu 1.4']
			var store = Ext.create('Ext.data.Store', {			    
			    proxy: {
			        type: 'ajax',
			        url: location.pathname + '/taxon',
			        reader: {
			        	idProperty: 'identifier',
			        	successProperty: 'success',
			            root: 'data',
			            type: 'json'
			        }
			    },
			    autoLoad: false,
			    autoSync: false,
			    fields: [ 'identifier', 'text' ]
			});
			var sourcev = combo.up('preservescrollfieldset').up('preservescrollfieldset').down('combo').getValue();
			store.load({params: {source: sourcev, identifier: records[0].data.identifier}});					
			nextCombo.bindStore(store);
			combo.setReadOnly(true);
			var butdel = combo.nextNode('image#delbutton');
			var scp = {'scope': this, 'combo': nextCombo};
			butdel.getEl().removeAllListeners();
			nextButdel = nextCombo.nextNode('image#delbutton');
			nextButdel.getEl().removeAllListeners();
			nextButdel.getEl().addListener( 'click', this.addDelEvent, scp);
			
		},
        taxonfield: function(label, id, tooltip, help, optional, margin, helpmargin) {
            var field = this.field( null, true, true, this.helpcombo( label, id, tooltip, help, optional, margin, helpmargin));

            field.border = false;
            field.collapsible = false;
            field.checkboxToggle = false;
            field.collapsed = false;
            field.addButton = false;
            field.margin = -10;
            field.cls = 'taxon';
            console.log('TaxonField: ' + id);
            field.item.item.listeners = {
            	 scope: this,
                'select': this.selectTaxon
            };
            field.item.item.displayField = 'text';
            field.item.item.valueField = 'text';
            //field.item.item.queryMode = 'remote';            
            return field;
        },
        updateMandatoryField: function(event, input, eOpts) {
            var field;
            if (!input) {
                field = event;
                input = { value: field.rawValue };
            }
            else
                field = Ext.ComponentQuery.query('field[inputId=' + input.name + ']')[0];
            field = field.up().up().nextSibling();

            if (field.nextSibling())
                field = field.nextSibling();

            function updater(key, value, object) {
                if (key === 'inputId') {
                    if (Ext.String.trim(input.value) == '') {
					  object.forceSelection = false;
					  object.allowBlank = true;
					}
					else {
					  object.forceSelection = true;
					  object.allowBlank = false;
                      if (value.indexOf('_language', value.length - 9) !== -1)
						  if (!object.getValue())
						    object.setValue(lang);
					}
                }
                if (key === 'items') {
                    Ext.iterate(object.items.items, updater);
                }
                if (Ext.isObject(key)) {
                    Ext.iterate(key, updater);
                    return false;
                }
            }
            Ext.iterate(field, updater);
        },
		langfield: function(item) {
            item.listeners = {
                change: {
                    fn: this.updateMandatoryField,
                    element: 'el'
                }
            };
		    return {
		        xtype: 'langcontainer',
		        item: item
		    }
		},
        updated: function(items, label, id) {
            var newitems = Ext.clone(items);

            function updater(key, value, object) {
                if (key === 'inputId') {
                    object.inputId = object.inputId.replace(/[0-9]+/g, '1').replace(new RegExp(label + '.*?_'), label + id + '_');
                }
                if (key === 'templateId') {
                    object.templateId = object.templateId.replace(new RegExp(label + '.*?_'), label + id + '_');
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
            Ext.iterate(newitems, updater);
            return newitems;
        },
	    section: function(label, id, appendable, mandatory, onlyone) {
	        var title, field, items, ids = id.split('_'), lastId = 1;

            items = Ext.ClassManager.getByAlias(ids[0]).items()[ids[1]];

	        if (mandatory)
	            title = this.required(label);
	        else
	            title = '<i>' + this.optional(label) + '</i>';
            title = '<bold>' + title + '</bold>';
	        field = {
	            xtype: 'preservescrollfieldset',
                border: 3,
	            defaults: {
	                collapsible: true,
	                validateOnBlur: false,
	                validateOnChange: false
	            },
	            collapsible: mandatory,
	            checkboxToggle: !mandatory,
	            collapsed: !mandatory,
	            title: title,
	            items: {
	                xtype: 'container',
	                layout: 'anchor'
	            }
	        }
	        if (appendable && !onlyone) {
                field.items.items = this.updated(items, id, lastId);
	            field.items.items.push({
	                xtype: 'container',
	                layout: 'hbox',
	                margin: '0 0 20 0',
	                items: [
	                    {
	                        xtype: 'button',
	                        text: _('Append Section'),
	                        itemId: 'button_' + id,
	                        listeners: {
	                            click: function(button) {
	                                var fieldset = button.up().up().up();
	                                fieldset.preserveScroll();
	                                fieldset.add({
	                                    xtype: 'container',
	                                    items: this.updated(field.items.items, id, ++lastId)
	                                });
	                                fieldset.restoreScroll();
	                            },
                                scope: this
	                        }
	                    },
	                    {
	                        xtype: 'button',
	                        text: _('Delete Section'),
	                        listeners: {
	                            click: function(button) {
	                                var item = button.up().up(),
	                                    fieldset = item.up();
	                                if (fieldset.items.length > 1) {
	                                    fieldset.preserveScroll();
	                                    fieldset.remove(item, true);
	                                    fieldset.restoreScroll();
	                                }
	                                else {
	                                    if (fieldset.checkboxToggle)
	                                        fieldset.collapse();
	                                    else
	                                        Ext.Msg.alert(_('Notice'), _('Should be at least one section of this type'));
	                                }
	                            }
	                        }
	                    }
	                ]
	            });
            }
            else
                field.items.items = items;
	        return field
	    }
    }
});
