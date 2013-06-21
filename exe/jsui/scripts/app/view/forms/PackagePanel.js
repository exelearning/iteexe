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
                                inputId: 'pp_lang',
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
                                inputId: 'pp_newlicense',
                                fieldLabel: _('License'),
                                store: lomesVocab.copyrightAndOtherRestrictionsValues,
                                tooltip: _('Select a license.'),
                                anchor: '100%'
                            },
                            help: _('Select a license.')
                        },
                        {
                            xtype: 'helpcontainer',
                            margin: '0 0 10 0',
                            item: {
                                xtype: 'combobox',
                                inputId: 'pp_learningResourceType',
                                dirtyCls: 'property-form-dirty',
                                fieldLabel: _('Learning Resource Type'),
                                store: lomesVocab.learningResourceTypeValues.slice(39),
                                tooltip: _('Learning Resource Type'),
                                anchor: '100%'
                            },
                            help: _('Learning Resource Type')
                        },
                        {
                            xtype: 'fieldset',
                            title: _('Especificaciones de utilización'),
                            items: [
                                {
		                            xtype: 'helpcontainer',
		                            margin: '0 0 10 0',
		                            item: {
                                        xtype: 'fieldcontainer',
                                        items: [
                                            {
					                            xtype: 'radiogroup',
					                            fieldLabel: _('Tipo de alumno'),
					                            tooltip: _('Tipo de alumno'),
		                                        columns: [150, 150, 150],
					                            items: [
					                                {
						                                xtype: 'radio',
					                                    boxLabel: 'Alumno Estándar',
						                                name: 'pp_intendedEndUserRole',
		                                                inputValue: 'learner',
		                                                checked: true
					                                },
					                                {
					                                    xtype: 'radio',
					                                    boxLabel: 'Necesidades (NEAE)',
		                                                name: 'pp_intendedEndUserRole',
		                                                inputValue: 'special needs learner'
					                                },
					                                {
					                                    xtype: 'radio',
					                                    boxLabel: 'Altas capacidades',
		                                                name: 'pp_intendedEndUserRole',
		                                                inputValue: 'gifted learner'
					                                }
			                                    ]
                                            }
                                        ]
	                                },
	                                help: _('Tipo de alumno')
                                },
                                {
                                    xtype: 'helpcontainer',
                                    margin: '0 0 10 0',
                                    item: {
                                        xtype: 'fieldcontainer',
                                        fieldLabel: _('Para trabajar en grupo'),
                                        tooltip: _('Para trabajar en grupo'),
                                        items: [
                                            {
                                                xtype: 'container',
                                                layout: 'hbox',
                                                items: [
                                                    {
                                                        xtype: 'checkbox',
                                                        inputId: 'pp_intendedEndUserRoleGroup',
                                                        inputValue: 'group'
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    help: _('Para trabajar en grupo')
                                },
                                {
                                    xtype: 'helpcontainer',
                                    margin: '0 0 10 0',
                                    item: {
                                        xtype: 'fieldcontainer',
                                        fieldLabel: _('Para trabajar en tutoría'),
                                        tooltip: _('Para trabajar en tutoría'),
                                        items: [
                                            {
                                                xtype: 'container',
                                                layout: 'hbox',
                                                items: [
                                                    {
                                                        xtype: 'checkbox',
                                                        inputId: 'pp_intendedEndUserRoleTutor',
                                                        inputValue: 'tutor'
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    help: _('Para trabajar en tutoría')
                                },
                                {
                                    xtype: 'helpcontainer',
                                    margin: '0 0 10 0',
                                    item: {
                                        xtype: 'fieldcontainer',
                                        items: [
                                            {
		                                        xtype: 'radiogroup',
		                                        fieldLabel: _('Lugar de utilización'),
		                                        tooltip: _('Lugar de utilización'),
		                                        columns: [150, 150, 150],
		                                        items: [
		                                            {
		                                                xtype: 'radio',
		                                                boxLabel: 'Aula',
		                                                name: 'pp_context1',
		                                                inputValue: 'classroom',
		                                                checked: true
		                                            },
		                                            {
		                                                xtype: 'radio',
		                                                boxLabel: 'Fuera del centro',
		                                                name: 'pp_context1',
		                                                inputValue: 'real environment'
		                                            }
		                                        ]
                                            }
                                        ]
                                    },
                                    help: _('Lugar de utilización')
                                },
                                {
                                    xtype: 'helpcontainer',
                                    margin: '0 0 10 0',
                                    item: {
                                        xtype: 'fieldcontainer',
                                        items: [
                                            {
		                                        xtype: 'radiogroup',
		                                        fieldLabel: _('Modalidad de uso'),
		                                        tooltip: _('Modalidad de uso'),
		                                        columns: [150, 150, 150],
		                                        items: [
		                                            {
		                                                xtype: 'radio',
		                                                boxLabel: 'Presencial',
		                                                name: 'pp_context2',
		                                                inputValue: 'face to face',
		                                                checked: true
		                                            },
		                                            {
		                                                xtype: 'radio',
		                                                boxLabel: 'Semipresencial',
		                                                name: 'pp_context2',
		                                                inputValue: 'blended'
		                                            },
		                                            {
		                                                xtype: 'radio',
		                                                boxLabel: 'Distancia',
		                                                name: 'pp_context2',
		                                                inputValue: 'distance'
		                                            }
		                                        ]
                                            }
                                        ]
                                    },
                                    help: _('Modalidad de uso')
                                }
                            ]
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