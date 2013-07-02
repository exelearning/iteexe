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
        'eXe.view.forms.LomWidgets'
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
                comp.expand();
            }
            comp = comp.up();
        }
        return true;
    },

    needsExtend: true,

    extendForm: function(form, action){
        if (!this.needsExtend)
            return;
//        console.log('EXTENDFORM');
//        var lform = form.owner;
//        var vp = Ext.ComponentQuery.query('#eXeViewport')[0];
//        lform.suspendLayouts(true);
        Ext.suspendLayouts();
        var field, fields = [], r, v, key, but, rLayout, lasttaxons = {}, k, vid, nv, finaltaxonKeys = {};
        for (key in action.result.data){
            fields.push(key);
            if(/_taxon[0-9]*_entry_string1$/.exec(key)){
                vid =key.split('_');
                k = vid[0] + '_' + vid[1] + '_' + vid[2]
                nv = parseInt(/[0-9]*$/.exec(key.split('_')[3])[0]);
                if (!lasttaxons[k]){
                    lasttaxons[k] = nv;
                }else if (nv > lasttaxons[k]){
                    lasttaxons[k] = nv;
                }
            }
        }
        Ext.define('taxonModel', {
            extend: 'Ext.data.Model',
            fields: [ 'identifier', 'text']
        });

        Ext.iterate(lasttaxons, function(key, value){
            finaltaxonKeys[key + '_taxon' + String(value) + '_entry_string1'] = true;
        });
        fields.sort();

        for (var i = 0, len = fields.length; i < len; i++){
            key = fields[i];
            //console.log(key);
            rLayout = false;
            field = form.findField(key);
            v = action.result.data[key];
            r = false;
            if (field){
                field.setValue(v);
                field.resetOriginalValue();
                this.expandParents(field);
                r = field;
                field = this.getInsertDelField(key);
//              console.log('OK:      ' + key );
            }else{
                //console.log('PROCESS: ' + key );
                if (action.result.data[key] !== ''){//
                    if (! this.existSection(form, key)){
//                      console.log('ADD Section: ' + key);
                        but = this.getAddSectionButton(key);
                        but.fireEvent('click', but);
                        r = form.findField(key);
                        if (r){
                            if (r){
//                              console.log('Set Field for key ' + key);
                                r.setValue(v);
                                r.resetOriginalValue();
                            }
                        }else{
                            console.log('ERROR: Set Field for key ' + key);
                        }
                    }else{
//                      console.log('ADD New Field for key: ' + key);
                        field = this.getInsertDelField(key);
                        if (field){
                            field.expand();
                            if (/contribute$/.exec(field.getItemId())){
                                but = Ext.ComponentQuery.query('#' + field.getItemId() + ' #addbutton')[1];
                            }
                            else{
                                if (field.addButtonObj){
                                    but = field.addButtonObj;
                                }else{
                                    console.log('Can not get de button: ' + key);
                                }
                            }
                            if (but){
                                if (! but.el){
                                    Ext.resumeLayouts(true);
                                    rLayout = true;
//                                  console.log(key);
                                }
                                but.el.dom.click();

                                r = form.findField(key);
                                if (r){
//                                      console.log('Set Field for key ' + key);
                                        r.setValue(v);
                                        r.resetOriginalValue();
                                }else{
                                    console.log('ERROR: Set Field for key ' + key);
                                }
                                if (rLayout){
                                    Ext.suspendLayouts();
                                }
                            }
                        }
                        else{
                            console.log('ERROR: Field not found: ' + key);
                        }
                    }
                }
            }
            if(/_taxon[0-9]*_entry_string1$/.exec(key)){
                if (finaltaxonKeys[key]){
                    if (field.addButtonObj.el)
                        field.addButtonObj.el.dom.click();
                    else
                        console.log('ERROR: no element for field ' + field.itemId);
                    finaltaxonKeys[key] = r;
                }
            }
        }
        Ext.resumeLayouts(true);
        Ext.suspendLayouts();
        Ext.iterate(finaltaxonKeys, function(key, r){
            if (r){
                var scp, nextCombo, nextbutdel;
                nextCombo = r.nextNode('combo');
                nextbutdel = nextCombo.nextNode('image#delbutton');
                scp= {'scope': eXe.view.forms.LomWidgets, 'combo': nextCombo},
                nextbutdel.getEl().removeAllListeners();
                nextbutdel.getEl().addListener( 'click', eXe.view.forms.LomWidgets.addDelEvent, scp);
            }
        });
        Ext.resumeLayouts(true);
//      msg.close();
//      vp.setLoading(true);
//      vp.doLayout();
//      vp.setLoading(false);
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
                }
            ]
        });

        me.callParent(arguments);
    }
});
