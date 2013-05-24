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
		        inputId: id.replace(/\{1\}/, '1'),
                templateId: id,
		        validateOnBlur: false,
		        validateOnChange: false,
		        anchor: '100%'
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
		helpcombo: function(label, id, tooltip, help, optional, margin, helpmargin) {
		    var combo = this.helpfield(label, id, tooltip, help, optional, margin, helpmargin),
		        storeName = id, ids = id.split('_');
            storeName = storeName.replace(/\{1\}/g, '');
	        storeName = storeName.replace(/[1-9]*/g, '');
	        storeName = storeName.replace(/_string$/, '');
	        storeName = storeName.replace(/_value$/, '');
	        storeName = storeName.slice(storeName.lastIndexOf('_') + 1) + 'Values';
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
		helpdate: function(label, id, tooltip, help, optional, margin, helpmargin) {
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
		    return {
		        xtype: 'helpcontainer',
		        item: {
		            xtype: 'datefield',
		            fieldLabel: label,
		            allowBlank: optional,
		            format: 'Y-m-d',
		            validateOnBlur: false,
		            validateOnChange: false,
		            pickerAlign: 'tr-br',
		            inputId: id.replace(/\{1\}/, '1'),
                    templateId: id,
		            tooltip: tooltip,
		            margin: margin,
		            anchor: '100%'
		        },
		        help: help,
		        helpmargin: helpmargin
		    }
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
		        collapsed: !mandatory,
		        title: title
		    }
		    if (appendable)
		        field.item = item;
		    else
		        field.items = item;
		    return field
		},
		durationfield: function(label, appendable, mandatory, id) {
		    return this.field( label, appendable, mandatory, [
		        {
		            xtype: 'container',
		            layout: 'hbox',
		            items: [
		                { xtype: 'container', layout: 'anchor', flex: 1, items: this.textfield( _('Years'), id + '_years', null, true, '0 20 0 0')},
		                { xtype: 'container', layout: 'anchor', flex: 1, items: this.textfield( _('Months'), id + '_months', null, true, '0 20 0 0')},
		                { xtype: 'container', layout: 'anchor', flex: 1, items: this.textfield( _('Days'), id + '_days', null, true)}
		            ]
		        },
		        {
		            xtype: 'container',
		            layout: 'hbox',
		            items: [
		                { xtype: 'container', layout: 'anchor', flex: 1, items: this.textfield( _('Hours'), id + '_hours', null, true, '0 20 0 0')},
		                { xtype: 'container', layout: 'anchor', flex: 1, items: this.textfield( _('Minutes'), id + '_minutes', null, true, '0 20 0 0')},
		                { xtype: 'container', layout: 'anchor', flex: 1, items: this.textfield( _('Seconds'), id + '_seconds', null, true)}
		            ]
		        },
		        this.field( _('Description'), true, false, this.langfield( this.helparea( null, id + '_description_string1', _('Description'), null, true)))
		    ])
		},
		langfield: function(item) {
            item.listeners = {
                change: {
                    fn: function(event, input, eOpts) {
                        var field = Ext.ComponentQuery.query('field[inputId=' + input.name + '_language]')[0];
						if (Ext.String.trim(input.value) == '') {
						  field.forceSelection = false;
                          field.allowBlank = true;
						}
						else {
						  field.forceSelection = true;
                          field.allowBlank = false;
                          if (!field.getValue())
                            field.setValue(lang);
						}
                    },
                    element: 'el'
                }
            };
		    return {
		        xtype: 'langcontainer',
		        item: item
		    }
		},
        lastId: 1,
        updated: function(items, label) {
            var newitems = Ext.clone(items),
                id = this.lastId++;

            function updater(key, value, object) {
                if (key === 'inputId') {
                    object.inputId = object.inputId.replace(new RegExp(label + '.*?_'), label + id + '_');
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
	        var title, field, items, ids = id.split('_');

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
                field.items.items = this.updated(items, id);
	            field.items.items.push({
	                xtype: 'container',
	                layout: 'hbox',
	                margin: '0 0 20 0',
	                items: [
	                    {
	                        xtype: 'button',
	                        text: _('Append Section'),
	                        listeners: {
	                            click: function(button) {
	                                var fieldset = button.up().up().up();
	                                fieldset.preserveScroll();
	                                fieldset.add({
	                                    xtype: 'container',
	                                    items: this.updated(field.items.items, id)
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
