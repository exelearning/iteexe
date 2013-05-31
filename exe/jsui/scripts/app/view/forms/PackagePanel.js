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

Ext.define('eXe.view.forms.PackagePanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.package',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            autoScroll: true,
            trackResetOnLoad: true,
            items: [
                {
                    xtype: 'fieldset',
                    title: _('Cataloguing'),
                    margin: 10,
                    defaults: {
                        dirtyCls: 'property-form-dirty'
                    },
                    items: [
                        {
                            xtype: 'helpcontainer',
                            margin: '0 0 10 0',
                            item: {
                                xtype: 'textfield',
                                inputId: 'pp_title',
                                dirtyCls: 'property-form-dirty',
                                fieldLabel: _('Title'),
                                tooltip: _('The name given to the resource.'),
                                anchor: '100%'
                            },
                            help: _('The name given to the resource.')
                        },
                        {
                            xtype: 'helpcontainer',
                            margin: '0 0 10 0',
                            item: {
                                xtype: 'combobox',
                                inputId: 'dc_language',
                                dirtyCls: 'property-form-dirty',
                                fieldLabel: _('Language'),
                                store: langsStore,
                                tooltip: _('Select a language.'),
                                anchor: '100%'
                            },
                            help: _('Select a language.')
                        },
                        {
                            xtype: 'fieldset',
		                    title: _('Description'),
                            items: [
                                {
                                    xtype: 'helpcontainer',
		                            margin: '0 0 10 0',
		                            item: {
			                            xtype: 'textarea',
			                            inputId: 'pp_description',
			                            fieldLabel: _('General'),
			                            tooltip: _('An account of the content of the resource.'),
			                            height: 60,
			                            anchor: '100%'
                                    },
                                    help: _('An account of the content of the resource.')
                                },
                                {
                                    xtype: 'helpcontainer',
                                    margin: '0 0 10 0',
                                    item: {
                                        xtype: 'textarea',
                                        inputId: 'pp_objectives',
                                        fieldLabel: _('Objectives'),
                                        tooltip: _('Objectives.'),
                                        height: 60,
                                        anchor: '100%'
                                    },
                                    help: _('Objectives.')
                                },
                                {
                                    xtype: 'helpcontainer',
                                    margin: '0 0 10 0',
                                    item: {
                                        xtype: 'textarea',
                                        inputId: 'pp_preknowledge',
                                        fieldLabel: _('Preknowledge'),
                                        tooltip: _('Preknowledge.'),
                                        height: 60,
                                        anchor: '100%'
                                    },
                                    help: _('Preknowledge.')
                                }
                            ]
                        },
                        {
                            xtype: 'helpcontainer',
                            margin: '0 0 10 0',
                            item: {
	                            xtype: 'textfield',
	                            inputId: 'pp_author',
	                            fieldLabel: _('Author'),
	                            tooltip: _('Primary author of the resource.'),
	                            anchor: '100%'
                            },
                            help: _('Primary author of the resource.')
                        },
                        {
                            xtype: 'helpcontainer',
                            margin: '0 0 10 0',
                            item: {
                                xtype: 'combobox',
                                inputId: 'cat_learningResourceType',
                                dirtyCls: 'property-form-dirty',
                                fieldLabel: _('Learning Resource Type'),
                                store: lomesVocab.learningResourceTypeValues,
                                tooltip: _('Learning Resource Type'),
                                anchor: '100%'
                            },
                            help: _('Learning Resource Type')
                        },
                        {
                            xtype: 'helpcontainer',
                            margin: '0 0 10 0',
                            item: {
	                            xtype: 'fieldcontainer',
	                            fieldLabel: _('Intended End User Role'),
	                            tooltip: _('Intended End User Role'),
	                            defaults: {
	                                defaults: {
	                                    width: 150
	                                }
	                            },
	                            items: [
	                                {
	                                    xtype: 'container',
	                                    layout: 'hbox',
	                                    items: [
			                                {
				                                xtype: 'radio',
			                                    boxLabel: 'Aprendiz: Alumno',
				                                name: 'cat_intendedEndUserRole'
			                                },
			                                {
			                                    xtype: 'checkbox',
			                                    boxLabel: 'NEE',
			                                    inputId: 'cat_intendedEndUserRole_1_1'
			                                },
			                                {
			                                    xtype: 'checkbox',
			                                    boxLabel: 'Altas capacidades',
			                                    inputId: 'cat_intendedEndUserRole_1_2'
			                                }
	                                    ]
	                                },
	                                {
	                                    xtype: 'container',
	                                    layout: 'hbox',
	                                    items: [
	                                        {
			                                    xtype: 'radio',
			                                    boxLabel: 'Agrupación: Individual',
			                                    name: 'cat_intendedEndUserRole'
			                                },
			                                {
			                                    xtype: 'checkbox',
			                                    boxLabel: 'Grupo',
			                                    inputId: 'cat_intendedEndUserRole_2'
			                                }
	                                    ]
	                                },
	                                {
	                                    xtype: 'container',
	                                    layout: 'hbox',
	                                    items: [
	                                        {
			                                    xtype: 'radio',
			                                    boxLabel: 'Educador: Docente',
			                                    name: 'cat_intendedEndUserRole'
			                                },
			                                {
			                                    xtype: 'checkbox',
			                                    boxLabel: 'Tutor',
			                                    inputId: 'cat_intendedEndUserRole_3'
			                                }
	                                    ]
	                                }
	                            ]
	                        },
                            help: _('Intended End User Role')
                        },
                        {
                            xtype: 'helpcontainer',
                            margin: '0 0 10 0',
                            item: {
                                xtype: 'fieldcontainer',
                                fieldLabel: _('Context'),
                                tooltip: _('Context'),
                                defaults: {
                                    defaults: {
                                        width: 150
                                    }
                                },
                                items: [
                                    {
                                        xtype: 'container',
                                        layout: 'hbox',
                                        items: [
                                            {
                                                xtype: 'radio',
                                                boxLabel: 'Lugar: Aula',
                                                name: 'cat_context'
                                            },
                                            {
                                                xtype: 'checkbox',
                                                boxLabel: 'Fuera del centro',
                                                inputId: 'cat_context_1'
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'container',
                                        layout: 'hbox',
                                        items: [
                                            {
                                                xtype: 'radio',
                                                boxLabel: 'Modalidad: Presencial',
                                                name: 'cat_context'
                                            },
                                            {
                                                xtype: 'checkbox',
                                                boxLabel: 'Distancia',
                                                inputId: 'cat_context_2_1'
                                            },
                                            {
                                                xtype: 'checkbox',
                                                boxLabel: 'Semipresencial',
                                                inputId: 'cat_context_2_2'
                                            }
                                        ]
                                    }
                                ]
                            },
                            help: _('Context')
                        },
                        {
                            xtype: 'helpcontainer',
                            margin: '0 0 10 0',
                            item: {
	                            xtype: 'combobox',
	                            inputId: 'pp_license',
	                            fieldLabel: _('License'),
	                            store: [
	                                  ["None", "None"],
	                                  ["GNU Free Documentation License", _("GNU Free Documentation License")],
	                                  ["Creative Commons Attribution 3.0 License", _("Creative Commons Attribution 3.0 License")],
	                                  ["Creative Commons Attribution Share Alike 3.0 License", _("Creative Commons Attribution Share Alike 3.0 License")],
	                                  ["Creative Commons Attribution No Derivatives 3.0 License", _("Creative Commons Attribution No Derivatives 3.0 License")],
	                                  ["Creative Commons Attribution Non-commercial 3.0 License", _("Creative Commons Attribution Non-commercial 3.0 License")],
	                                  ["Creative Commons Attribution Non-commercial Share Alike 3.0 License", _("Creative Commons Attribution Non-commercial Share Alike 3.0 License")],
	                                  ["Creative Commons Attribution Non-commercial No Derivatives 3.0 License", _("Creative Commons Attribution Non-commercial No Derivatives 3.0 License")],
	                                  ["Creative Commons Attribution 2.5 License", _("Creative Commons Attribution 2.5 License")],
	                                  ["Creative Commons Attribution-ShareAlike 2.5 License", _("Creative Commons Attribution-ShareAlike 2.5 License")],
	                                  ["Creative Commons Attribution-NoDerivs 2.5 License", _("Creative Commons Attribution-NoDerivs 2.5 License")],
	                                  ["Creative Commons Attribution-NonCommercial 2.5 License", _("Creative Commons Attribution-NonCommercial 2.5 License")],
	                                  ["Creative Commons Attribution-NonCommercial-ShareAlike 2.5 License", _("Creative Commons Attribution-NonCommercial-ShareAlike 2.5 License")],
	                                  ["Creative Commons Attribution-NonCommercial-NoDerivs 2.5 License", _("Creative Commons Attribution-NonCommercial-NoDerivs 2.5 License")],
	                                  ["Developing Nations 2.0", _("Developing Nations 2.0")]
	                            ],
	                            tooltip: _('Select a license.'),
	                            anchor: '100%'
	                        },
                            help: _('Select a license.')
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: _('Project Properties'),
                    margin: 10,
                    defaults: {
                        dirtyCls: 'property-form-dirty'
                    },
                    items: [
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            anchor: '100%',
                            items: [
                                {
                                    xtype: 'hiddenfield',
                                    inputId: 'pp_backgroundImg',
                                    fieldLabel: _('Header Background'),
                                    hideLabel: false,
                                    labelWidth: 150,
                                    dirtyCls: 'property-form-dirty',
                                    tooltip: _('Background image for a header (an image 100px high is recommended).')
                                },
                                {
                                    xtype: 'container',
                                    layout: 'vbox',
                                    items: [
                                        {
                                            xtype: 'image',
                                            hidden: true,
                                            itemId: 'header_background_img'
                                        },
                                        {
                                            xtype: 'container',
                                            layout: 'hbox',
                                            margin: '0 0 5 0',
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    text: _('Load Image'),
                                                    itemId: 'header_background_load',
                                                    margin: '0 5 0 0'
                                                },
                                                {
                                                    xtype: 'button',
                                                    hidden: true,
                                                    text: _('Show Image'),
                                                    itemId: 'header_background_show',
                                                    margin: '0 5 0 0'
                                                },
                                                {
                                                    xtype: 'button',
                                                    text: _('Clear Image'),
                                                    itemId: 'header_background_clear',
                                                    margin: '0 5 0 0'
                                                },
                                                {
                                                    xtype: 'checkbox',
                                                    inputId: 'pp_backgroundImgTile',
                                                    boxLabel: _('Tile background image?'),
                                                    inputValue: true,
                                                    dirtyCls: 'property-form-dirty',
                                                    uncheckedValue: false
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'textarea',
                            inputId: 'pp_footer',
                            fieldLabel: _('Footer'),
                            tooltip: _('Web pages footer.'),
                            height: 80,
                            anchor: '100%'
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: _('Taxonomy'),
                    margin: 10,
                    defaults: {
                        dirtyCls: 'property-form-dirty'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            inputId: 'pp_level1',
                            fieldLabel: _('Level 1'),
                            tooltip: _('Default name for level 1 nodes'),
                            anchor: '100%'
                        },
                        {
                            xtype: 'textfield',
                            inputId: 'pp_level2',
                            fieldLabel: _('Level 2'),
                            tooltip: _('Default name for level 2 nodes'),
                            anchor: '100%'
                        },
                        {
                            xtype: 'textfield',
                            inputId: 'pp_level3',
                            fieldLabel: _('Level 3'),
                            tooltip: _('Default name for level 3 nodes'),
                            anchor: '100%'
                        },
                        {
                            xtype: 'button',
                            text: _('Update Tree'),
                            itemId: 'update_tree'
                        }
                    ]
                },
                {
                    xtype: 'button',
                    text: _('Save'),
                    itemId: 'save_properties',
                    margin: 10
                }
            ]
        });

        me.callParent(arguments);
    }

});