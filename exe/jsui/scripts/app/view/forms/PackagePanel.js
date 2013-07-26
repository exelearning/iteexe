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
                                        dirtyCls: 'property-form-dirty',
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
                                        dirtyCls: 'property-form-dirty',
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
                                        dirtyCls: 'property-form-dirty',
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
                                dirtyCls: 'property-form-dirty',
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
                                dirtyCls: 'property-form-dirty',
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
                            title: _('Usage'),
                            items: [
                                {
		                            xtype: 'helpcontainer',
		                            margin: '0 0 10 0',
		                            item: {
                                        xtype: 'fieldcontainer',
                                        items: [
                                            {
					                            xtype: 'radiogroup',
					                            fieldLabel: _('Intended End User'),
					                            tooltip: _('Intended End User'),
		                                        columns: [150, 150, 150],
					                            items: [
					                                {
						                                xtype: 'radio',
					                                    boxLabel: 'Ordinary Learner',
                                                        dirtyCls: 'property-form-dirty',
						                                name: 'pp_intendedEndUserRoleType',
		                                                inputValue: 'learner',
		                                                checked: true
					                                },
					                                {
					                                    xtype: 'radio',
					                                    boxLabel: 'Special Needs Learner',
                                                        dirtyCls: 'property-form-dirty',
		                                                name: 'pp_intendedEndUserRoleType',
		                                                inputValue: 'special needs learner'
					                                },
					                                {
					                                    xtype: 'radio',
					                                    boxLabel: 'Gifted Learner',
                                                        dirtyCls: 'property-form-dirty',
		                                                name: 'pp_intendedEndUserRoleType',
		                                                inputValue: 'gifted learner'
					                                }
			                                    ]
                                            }
                                        ]
	                                },
	                                help: _('Intended End User')
                                },
                                {
                                    xtype: 'helpcontainer',
                                    margin: '0 0 10 0',
                                    item: {
                                        xtype: 'fieldcontainer',
                                        fieldLabel: _('For Group Work'),
                                        tooltip: _('For Group Work'),
                                        items: [
                                            {
                                                xtype: 'container',
                                                layout: 'hbox',
                                                items: [
                                                    {
                                                        xtype: 'checkbox',
                                                        inputId: 'pp_intendedEndUserRoleGroup',
                                                        dirtyCls: 'property-form-dirty',
                                                        inputValue: true,
                                                        uncheckedValue: false
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    help: _('For Group Work')
                                },
                                {
                                    xtype: 'helpcontainer',
                                    margin: '0 0 10 0',
                                    item: {
                                        xtype: 'fieldcontainer',
                                        fieldLabel: _('For Individual Tuition'),
                                        tooltip: _('For Individual Tuition'),
                                        items: [
                                            {
                                                xtype: 'container',
                                                layout: 'hbox',
                                                items: [
                                                    {
                                                        xtype: 'checkbox',
                                                        inputId: 'pp_intendedEndUserRoleTutor',
                                                        dirtyCls: 'property-form-dirty',
                                                        inputValue: true,
                                                        uncheckedValue: false
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    help: _('For Individual Tuition')
                                },
                                {
                                    xtype: 'helpcontainer',
                                    margin: '0 0 10 0',
                                    item: {
                                        xtype: 'fieldcontainer',
                                        items: [
                                            {
		                                        xtype: 'radiogroup',
		                                        fieldLabel: _('Context'),
		                                        tooltip: _('Context'),
		                                        columns: [150, 150, 150],
		                                        items: [
		                                            {
		                                                xtype: 'radio',
		                                                boxLabel: 'Classroom',
		                                                name: 'pp_contextPlace',
		                                                inputValue: 'classroom',
                                                        dirtyCls: 'property-form-dirty',
		                                                checked: true
		                                            },
		                                            {
		                                                xtype: 'radio',
		                                                boxLabel: 'Real Environment',
		                                                name: 'pp_contextPlace',
		                                                inputValue: 'real environment',
                                                        dirtyCls: 'property-form-dirty'
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
                                        xtype: 'fieldcontainer',
                                        items: [
                                            {
		                                        xtype: 'radiogroup',
		                                        fieldLabel: _('Modality'),
		                                        tooltip: _('Modality'),
		                                        columns: [150, 150, 150],
		                                        items: [
		                                            {
		                                                xtype: 'radio',
		                                                boxLabel: 'Face to Face',
		                                                name: 'pp_contextMode',
		                                                inputValue: 'face to face',
                                                        dirtyCls: 'property-form-dirty',
		                                                checked: true
		                                            },
		                                            {
		                                                xtype: 'radio',
		                                                boxLabel: 'Blended',
		                                                name: 'pp_contextMode',
		                                                inputValue: 'blended',
                                                        dirtyCls: 'property-form-dirty'
		                                            },
		                                            {
		                                                xtype: 'radio',
		                                                boxLabel: 'Distance',
		                                                name: 'pp_contextMode',
		                                                inputValue: 'distance',
                                                        dirtyCls: 'property-form-dirty'
		                                            }
		                                        ]
                                            }
                                        ]
                                    },
                                    help: _('Modality')
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
