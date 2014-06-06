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

Ext.define('eXe.view.forms.LomDataPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.lomdata',

    requires: [
        'eXe.view.forms.HelpContainer',
        'eXe.view.forms.InsertDeleteFieldSet',
        'eXe.view.forms.LangContainer',
        'eXe.view.forms.LomSections',
        'eXe.view.forms.LomWidgets',
        'Ext.ux.DateTimeField'
    ],

    getInsertDelField: function(key){
        var vid = key.split('_'),
            field = false, fieldkey = false;
        if (/contribute[0-9]$/.exec(vid[2]) && /.*date_description_string[0-9]*/.exec(key)){
            fieldkey = vid[0] +  '_' + vid[1] + '_' + vid[2] +'_date';
        }else if (/taxon[0-9]*_entry_string[0-9]*$/.exec(key)){
            fieldkey = vid[0] +  '_' + vid[1] +  '_' + vid[2] + '_' + vid[3].replace(/[0-9]+/g, '');
        }
        else{
            fieldkey = vid[0] +  '_' + vid[1] +  '_' + vid[2].replace(/[0-9]+/g, '');
        }
        field = Ext.ComponentQuery.query('#' + fieldkey)[0];
        return field;
    },
    getAddSectionButton: function(key){
        var vid = key.split('_'), s;
        s = vid[0] + '_' + vid[1].replace(/[0-9]+/g, '');
        return Ext.ComponentQuery.query('#button_' + s )[0];
    },
    getAddFieldButton: function(key){
        var field = this.getInsertDelField(key);
        if  (field){
            return field.down('#addbutton');
        }
        return false;
    },
    getSection: function(key){
        var vid = key.split('_');
        return vid[0] + '_'+ vid[1];
    },
    existSection: function(form, key){
        var section = this.getSection(key), fsection, fk ;
        for(var i=0, items = form.getFields().items; i< items.length; i++){
            //console.log(items[i].getName())
            fk = items[i].getName();
            fsection = this.getSection(fk);
            if (section == fsection){
                return true;
            }
        };
        return false;
    },
    expandParents: function(field){
        var comp = field;
        while (comp.xtype !== 'lomdata'){
            if ((comp.xtype == 'insertdelfieldset' || comp.xtype == 'preservescrollfieldset') && comp.collapsed){
                comp.addCls('collapsed-with-data');
            }
            comp = comp.up();
        }
        return true;
    },

    needsExtend: true,

    extendForm: function(form, action){
        if (!this.needsExtend)
            return;
        Ext.suspendLayouts();
        var field, fields = [], keys_not_found = [], v, key, but;
        for (key in action.result.data){
            fields.push(key);
        }

        fields.sort();

        for (var i = 0, len = fields.length; i < len; i++){
            key = fields[i];
            field = form.findField(key);
//            console.log(key + ': ' + v);
            if (!field){
//                console.log('PROCESS: ' + key );
                if (action.result.data[key] !== ''){//
                    if (! this.existSection(form, key)){
//                      console.log('ADD Section: ' + key);
                        but = this.getAddSectionButton(key);
                        but.fireEvent('click', but);
                    }else{
                        field = this.getInsertDelField(key);
                        if (field){
                        		if (/contribute$/.exec(field.getItemId())){
                        			but = Ext.ComponentQuery.query('#' + field.getItemId() + ' #addbutton')[1];
                        		}
                        		else{
                        			if (field.addButtonObj){
                        				but = field.addButtonObj;
                        			}else{
                        				console.log('ERROR: Can not get the button: ' + key);
                        			}
                        		}
                        		if (but){
                    				Ext.bind(but.addFieldSetItems, field)();
                        		}
                        		else
                        			console.log('ERROR: no button for key: ' + key);
                        }
                    }
                }
            }
        }
        Ext.iterate(Ext.ComponentQuery.query('lomdata combobox[fieldLabel=' + _('Taxon') + ']'), function(taxon) {
          var scp, nextbutdel, el, nextTaxon = taxon.nextNode('combobox[fieldLabel=' + _('Taxon') + ']');

          nextbutdel = taxon.nextNode('image#delbutton');
          scp= {'scope': eXe.view.forms.LomWidgets, 'combo': taxon},
          el = nextbutdel.getEl()
          if (el) {
          	el.removeAllListeners();
          	el.addListener( 'click', eXe.view.forms.LomWidgets.addDelEvent, scp);
          }
          if (!nextTaxon || nextTaxon.up('insertdelfieldset') != taxon.up('insertdelfieldset')) {
        	  var field = taxon.up('insertdelfieldset');
        	  Ext.bind(field.addButtonObj.addFieldSetItems, field)();
          }
        });
        for (var i = 0, len = fields.length; i < len; i++){
            key = fields[i];
            field = form.findField(key);
            v = action.result.data[key];
            if (field){
                field.setValue(v);
                field.resetOriginalValue();
                this.expandParents(field);
            }
            else {
            	keys_not_found.push(key);
            	console.log('ERROR: Field not found: ' + key);
            }
        }
        Ext.resumeLayouts(true);
        while (key = keys_not_found.pop()) {
        	field = form.findField(key);
        	v = action.result.data[key];
        	if (field){
        		field.setValue(v);
        		field.resetOriginalValue();
        		this.expandParents(field);
        	}
        	else {
        		console.log('ERROR: Field not found: ' + key);
        	}
        }
        this.needsExtend = false;
    },

    clear: function() {
        if (this.needsExtend)
            return;

        var widgets = eXe.view.forms.LomWidgets, removed;

        Ext.suspendLayouts();
        this.removeAll(true);
        this.add([
            widgets.section(_('General'), this.prefix + 'general', false, true, true ),
            widgets.section(_('Life Cycle'), this.prefix + 'lifeCycle', false, false, true),
            widgets.section(_('Meta-Metadata'), this.prefix + 'metaMetadata', false, true, true),
            widgets.section(_('Technical'), this.prefix + 'technical', false, false, true),
            widgets.section(_('Educational'), this.prefix + 'educational', true, true, false),
            widgets.section(_('Rights'), this.prefix + 'rights', false, true, true),
            widgets.section(_('Relation'), this.prefix + 'relation', true, false, false),
            widgets.section(_('Annotation'), this.prefix + 'annotation', true, false, false),
            widgets.section(_('Classification'), this.prefix + 'classification', true, false, false),
            {
                xtype: 'button',
                text: _('Save'),
                itemId: 'save_properties'
            },
            {
                xtype: 'button',
                text: _('Clear'),
                itemId: 'clear_properties'
            },
            {
                xtype: 'button',
                text: _('Reset'),
                itemId: 'reset_properties'
            }
        ]);
        Ext.resumeLayouts(true);
        this.needsExtend = true;
    },

    initComponent: function() {
        var me = this,
            widgets = eXe.view.forms.LomWidgets;

        Ext.applyIf(me, {
            autoScroll: true,
            trackResetOnLoad: true,
            defaults: {
                margin: 20
            },
            items: [
                widgets.section(_('General'), this.prefix + 'general', false, true, true ),
                widgets.section(_('Life Cycle'), this.prefix + 'lifeCycle', false, false, true),
                widgets.section(_('Meta-Metadata'), this.prefix + 'metaMetadata', false, true, true),
                widgets.section(_('Technical'), this.prefix + 'technical', false, false, true),
                widgets.section(_('Educational'), this.prefix + 'educational', true, true, false),
                widgets.section(_('Rights'), this.prefix + 'rights', false, true, true),
                widgets.section(_('Relation'), this.prefix + 'relation', true, false, false),
                widgets.section(_('Annotation'), this.prefix + 'annotation', true, false, false),
                widgets.section(_('Classification'), this.prefix + 'classification', true, false, false),
                {
                    xtype: 'button',
                    text: _('Save'),
                    itemId: 'save_properties'
                },
                {
                    xtype: 'button',
                    text: _('Clear'),
                    itemId: 'clear_properties'
                },
                {
                    xtype: 'button',
                    text: _('Reset'),
                    itemId: 'reset_properties'
                }
            ]
        });

        me.callParent(arguments);
    }
});
