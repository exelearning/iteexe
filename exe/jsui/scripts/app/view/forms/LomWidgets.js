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

Ext.define("Ext.locale.en.ux.picker.DateTimePicker", {
	  override: "Ext.ux.DateTimePicker",
	  todayText: _("Now"),
	  timeLabel: _('Time')
});

Ext.define('eXe.view.forms.LomWidgets', {
    statics: {
		required: function(msg) {
		    return '*' + msg + ' (' + _('Required') + ')';
		},
		optional: function(msg) {
		    return msg + ' (' + _('Optional') + ')';
		},
		checkTextValidity: function(v) {
			if (this.inputId.indexOf('contribute') !== -1) {
				if (this.inputId.indexOf('date') == this.inputId.length - 4) {
					var role = this.up().up().up().up().down('combobox');
					return !role.value || !!v || this.blankText;
				}
				if (this.inputId.indexOf('description') !== -1) {
					var date = this.up('insertdelfieldset').up().down('datefield');
					return !date.value || !!v || this.blankText;
				}
			}
			return true;
		},
        textfield: function(label, id, tooltip, optional, margin, value, hidden) {
            var item;
		    if (!tooltip)
		        tooltip = label;
		    if (!margin)
		        margin = '0 0 0 0';
		    if (!hidden)
		    	hidden = false;
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
                dirtyCls: 'property-form-dirty',
                hidden: hidden,
                validator: eXe.view.forms.LomWidgets.checkTextValidity
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
        onSelectSource: function(combo, records, eOpts){
        	if (!combo.custom) {
        		var val = combo.getValue()
        		combo.nextNode('textfield').setValue(val.substr(val.length-2));
        	}
		},
		beforeSelectSource: function(combo, eOpts){
			//console.log("Before Select Source");
			var purposeCombo = combo.up().up().up().up().up().up().up().down('combobox'),
			    store = combo.getStore();
            store.clearFilter(true);
			store.filter('purpose', purposeCombo.getValue());
			combo.custom = !store.getCount();
		},
		deleteTaxonChilds: function(combo, newValue, oldValue){
			//console.log("Delete Taxon Childs");
			var taxonset = combo.nextNode('insertdelfieldset'), taxon;
				taxonset.preserveScroll();
				Ext.suspendLayouts();
				for (var i = 0, len = taxonset.items.length; i < len; i++){
					taxon = taxonset.items.items[0];
					if (taxonset.items.length > 1 ) {	                     
	                     taxonset.remove(taxon,true);	            
	                 }					
				}		        
				Ext.resumeLayouts(true);
				taxonset.restoreScroll();
				var nextCombo = combo.nextNode('combo');
				var scp = {'scope': this, 'combo': nextCombo};
				var sourcev = nextCombo.up('preservescrollfieldset').up('preservescrollfieldset').down('combo').getValue();
				nextCombo.setValue('');
				nextCombo.nextNode('textfield[cls=taxon-entry-language]').setValue('');
				nextCombo.nextNode('textfield[cls=taxon-id]').setValue('');
				nextButdel = nextCombo.nextNode('image#delbutton');
				nextButdel.getEl().removeAllListeners();
				nextButdel.getEl().addListener( 'click', this.addDelEvent, scp);			
		},
		changeSelectSource: function (combo, newValue, oldValue, options) {
			//console.log('Change Select Source');
			var purposeCombo = combo.up().up().up().up().up().up().up().down('combobox'),
		    	store = combo.getStore();
	        store.clearFilter(true);
			store.filter('purpose', purposeCombo.getValue());
			combo.custom = !store.getCount();
			if (oldValue && oldValue != newValue){
				if (newValue === ''){
					this.deleteTaxonChilds(combo, newValue, oldValue);
					combo.nextNode('textfield').setValue('');
				}else{
					if (!combo.custom) {
						var taxons = combo.up().up().up().up().query('combobox[fieldLabel=' + _('Taxon') + ']'),
						taxons_empty = taxons.filter(function(taxon){
							return taxon.getValue();
						});
						if (taxons_empty.length) {
							combo.suspendEvents(true);
							Ext.Msg.show({
								title:_('Warning!'),
								msg: _('You will loss all taxon config for this source. Would you like to continue?'),
								buttons: Ext.Msg.YESNO,
								icon: Ext.Msg.QUESTION,
								closable: false,
								modal: true,
								fn: function(btn, text, opt){
									if (btn == 'yes'){
										eXe.view.forms.LomWidgets.deleteTaxonChilds(combo, newValue, oldValue);
									}else{
										combo.suspendEvents(false);
										combo.setValue(oldValue);
									}
									combo.resumeEvents();
								},
							});
						}
					}
				}
			}
        },
        changePurpose: function (combo, newValue, oldValue, options) {
        	//console.log("Change Purpose");
        	if (oldValue && oldValue != newValue){
        		var sources = combo.up().up().up().up().query('combobox[cls=taxonpath-source]'),
        			sources_empty = sources.filter(function(source){
            			return source.getValue();
            		});
        		if (sources_empty.length) {
        			combo.suspendEvents(true);
        			Ext.Msg.show({
        				title:_('Warning!'),
        				msg: _('You will loss all taxon config in this section. Would you like to continue?'),
        				buttons: Ext.Msg.YESNO,
        				icon: Ext.Msg.QUESTION,
        				closable: false,
        				modal: true,
        				fn: function(btn, text, opt){
        					if (btn == 'yes'){
        						sources.forEach(function(source){
        							source.setValue('');
        						});
        					}else{
        						combo.suspendEvents(false);
        						combo.setValue(oldValue);
        					}
        					combo.resumeEvents();
        				},
        			});
        		}
        	}
        },
		helpcombo: function(label, id, tooltip, help, optional, margin, helpmargin) {
		    var combo = this.helpfield(label, id, tooltip, help, optional, margin, helpmargin),
		        storeName = id, ids = id.split('_'), selectOp;
		    storeName = storeName.replace(/\{[1-9]\}/g, '');
	        storeName = storeName.replace(/[1-9]*/g, '');
	        storeName = storeName.replace(/_string$/, '');
	        storeName = storeName.replace(/_value$/, '');
	        storeName = storeName.slice(storeName.lastIndexOf('_') + 1) + 'Values';
	        if (storeName == 'roleValues' && id.indexOf('metaMetadata') !== -1)
	        	storeName = 'roleMetaValues';
		    if (/^(lom|lomes)+_classification[0-9]*/.exec(id)){
		    	if (/_source_string1$/.exec(id)){
		    		combo.item.listeners = {
			            	 scope: this,
                            'select': this.onSelectSource,
			                'focus': this.beforeSelectSource,
			                'change': this.changeSelectSource
			           };		    		
                    storeName = "taxonpathSourceValues";
		    		combo.item.cls = 'taxonpath-source';
                    combo.item.valueField = 'id';
                    combo.item.displayField = 'text';
                    combo.item.getSubmitValue = function() {
                        var value = this.processRawValue(this.getRawValue());
                        if (this.custom)
                        	return value;
                        else
                        	return value.substr(0, value.length-3);
                    }
		    	}else if (/_purpose_value$/.exec(id)){
		    		combo.item.listeners = {
			            	 scope: this,			                
			                'change': this.changePurpose
			           };
		    	}
			}
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
		        collapsible: true,
		        collapsed: !mandatory,
		        title: title
		    };
		    if (appendable)
		        field.item = item;
		    else
		        field.items = item;
		    return field;
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
			            xtype: 'datetimefield',
			            allowBlank: optional,
			            format: 'Y-m-d\\TH:i:s.00P',
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
			            validator: eXe.view.forms.LomWidgets.checkTextValidity
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
			//console.log('NewClic Event');
			var scp = {'scope': scope, 'combo': preCombo},			
				preButdel = preCombo.nextNode('image#delbutton'),
				el = preButdel.getEl();
			el.removeAllListeners();
			el.addListener( 'click', scope.addDelEvent, scp);
		},
		
		selectTaxon: function(combo, records, eOpts){
			var source = combo.previousNode('combobox[cls=taxonpath-source]'),
				identifier = records[0].data.identifier;
			if (!source.custom) {
				combo.nextNode('textfield[cls=taxon-entry-language]').setValue(source.getValue().substr(source.getValue().length-2));
				combo.nextNode('textfield[cls=taxon-id]').setValue(identifier);
			}
			var nextTaxon = combo.nextNode('combobox[fieldLabel=' + _('Taxon') + ']');
			if (!nextTaxon || nextTaxon.up('insertdelfieldset') != combo.up('insertdelfieldset')) {
				//console.log('Last taxon');
				var butadd = combo.nextNode('image#addbutton');
				butadd.getEl().dom.click();
				var nextCombo = combo.nextNode('combo');			
				var butdel = combo.nextNode('image#delbutton');
				var scp = {'scope': this, 'combo': nextCombo};
				butdel.getEl().removeAllListeners();
				nextButdel = nextCombo.nextNode('image#delbutton');
				nextButdel.getEl().removeAllListeners();
				nextButdel.getEl().addListener( 'click', this.addDelEvent, scp);
			}
			else {
				while (nextTaxon.up('insertdelfieldset') == combo.up('insertdelfieldset')) {
					nextTaxon.setValue('');
					nextTaxon.nextNode('textfield[cls=taxon-entry-language]').setValue('');
					nextTaxon.nextNode('textfield[cls=taxon-id]').setValue('');
					nextTaxon = nextTaxon.nextNode('combobox[fieldLabel=' + _('Taxon') + ']');
				}
			}
			
		},
		changeTaxon: function(combo, newValue, oldValue, options){
			//console.log('Change Taxon');
			var nextTaxon = combo.nextNode('combobox[fieldLabel=' + _('Taxon') + ']'),
				lang = combo.nextNode('textfield[cls=taxon-entry-language]'),
				id = combo.nextNode('textfield[cls=taxon-id]'),
				source = combo.previousNode('combobox[cls=taxonpath-source]');
			if (source.custom) {
				lang.setReadOnly(false);
				id.setReadOnly(false)
				if (newValue !== '' ){
					if (!nextTaxon || nextTaxon.up('insertdelfieldset') != combo.up('insertdelfieldset')) {
						//console.log('Last taxon');
						var butadd = combo.nextNode('image#addbutton');
						if (butadd.getEl()) {
							butadd.getEl().dom.click();
							var nextCombo = combo.nextNode('combo');			
							var butdel = combo.nextNode('image#delbutton');
							var scp = {'scope': this, 'combo': nextCombo};
							if (butdel.getEl())
								butdel.getEl().removeAllListeners();
							nextButdel = nextCombo.nextNode('image#delbutton');
							if (nextButdel.getEl()) {
								nextButdel.getEl().removeAllListeners();
								nextButdel.getEl().addListener( 'click', this.addDelEvent, scp);
							}
						}
					}
				}
			}
			else {
				lang.setReadOnly(true);
				id.setReadOnly(true);
			}
		},
		beforeSelectTaxon: function(combo, eOpts){
			//console.log('Before select taxon');
			var source = combo.previousNode('combobox[cls=taxonpath-source]');
			if (!source.custom) {
				var identifier,
					prevTaxonId = combo.previousNode('textfield[cls=taxon-id]');
				if (prevTaxonId.up('insertdelfieldset') == combo.up('insertdelfieldset'))
					identifier = combo.previousNode('textfield[cls=taxon-id]').getValue();
				else
					identifier = false;
				combo.getStore().load({params: {source: source.getValue(), identifier: identifier}});
			}
		},
        taxonfield: function(label, id, tooltip, help, optional, margin, helpmargin) {
        	var taxonEntryCombo = this.helpcombo( label, id, tooltip, help, optional, margin, helpmargin);
        	var taxonEntryLanguage = this.textfield( _('Language'), id.replace(/_entry_string1$/, '_entry_string1_language'), tooltip, optional, margin, helpmargin);
        	var taxonId = this.textfield( _('Id'), id.replace(/_entry_string1$/, '_id'), tooltip, optional, margin, helpmargin);
        	taxonEntryLanguage.cls = 'taxon-entry-language';
        	taxonId.cls = 'taxon-id';
        	taxonId.labelWidth = 50;
        	taxonEntryLanguage.labelAlign = taxonId.labelAlign = 'right';
        	
        	taxonEntryCombo.item.listeners = {
               	 scope: this,
                 'select': this.selectTaxon,
                 'focus': this.beforeSelectTaxon,
	             'change': this.changeTaxon,
             };
        	var store = {			    
			    proxy: {
			        type: 'ajax',
			        url: location.pathname + '/taxon',
			        reader: {
			        	idProperty: 'identifier',
			        	successProperty: 'success',
			            rootProperty: 'data',
			            type: 'json'
			        }
			    },
			    sorters: ['text'],
			    autoLoad: false,
			    autoSync: false,
			    fields: [ 'identifier', 'text' ]
			};
        	taxonEntryCombo.item.store = store;
        	taxonEntryCombo.item.displayField = 'text';
        	taxonEntryCombo.item.valueField = 'text';
        	taxonEntryCombo.item.queryMode = 'local';         
        	
            var field = this.field( null, true, true, {
	            xtype: 'container',
	            layout: 'hbox',
	            items: [
	                { xtype: 'container', layout: 'anchor', flex: 4, items: taxonEntryCombo},
	                { xtype: 'container', layout: 'anchor', flex: 1, items: taxonEntryLanguage},
	                { xtype: 'container', layout: 'anchor', flex: 1, items: taxonId}
	            ]
	        });
            //var field = this.field( null, true, true, [taxonEntryCombo, ]);
            field.border = false;
            field.collapsible = false;
            field.checkboxToggle = false;
            field.collapsed = false;
            field.addButtonHide = true;
            field.margin = -10;
            field.cls = 'taxon';
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

            if (field && field.nextSibling())
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
						    object.setValue(eXe.app.config.lang);
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
	            collapsible: true,
	            collapsed: !mandatory,
	            title: title,
	            itemId: id,
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
