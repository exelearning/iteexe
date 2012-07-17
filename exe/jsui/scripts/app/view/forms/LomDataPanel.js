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
        'eXe.view.forms.LangContainer'
    ],

    required: function(msg) {
        return '*' + msg + ' (' + _('Required') + ')';
    },
    optional: function(msg) {
        return msg + ' (' + _('Optional') + ')';
    },
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            autoScroll: true,
            defaults: {
                margin: 10,
                collapsible: true
            },
            items: [
                {
                    xtype: 'preservescrollfieldset',
                    title: this.required(_('General')),
                    defaults: {
                        margin: 10,
                        collapsible: true
                    },
                    items: [
                        {
                            xtype: 'insertdelfieldset',
                            title: this.optional(_('Identifier')),
                            collapsed: true,
                            item: {
                                xtype: 'container',
                                layout: 'hbox',
                                items: [
                                    {
                                        xtype: 'helpcontainer',
                                        flex: 1,
                                        item: {
                                            xtype: 'textfield',
                                            fieldLabel: _('Catalog'),
                                            inputId: 'lom_catalog',
                                            tooltip: _('Catalog'),
                                            anchor: '100%'
                                        },
                                        help: _('Catalog'),
                                        helpmargin: '0 0 20 20'
                                    },
                                    {
                                        xtype: 'helpcontainer',
                                        flex: 1,
                                        item: {
                                            xtype: 'textfield',
                                            margin: '0 0 0 20',
                                            fieldLabel: _('Entry'),
                                            inputId: 'lom_entry',
                                            tooltip: _('Entry'),
                                            anchor: '100%'
                                        },
                                        help: _('Entry'),
                                        helpmargin: '0 0 20 40'
                                    }
                                ]
                            }
                        },
                        {
                            xtype: 'insertdelfieldset',
                            title: this.required(_('Title')),
                            item: {
                                xtype: 'langcontainer',
                                item: {
                                    xtype: 'helpcontainer',
                                    item: {
                                        xtype: 'textfield',
                                        allowBlank: false,
                                        inputId: 'lom_title',
                                        tooltip: _('Title'),
                                        anchor: '100%'
                                    },
                                    help: _('Title'),
                                    helpmargin: '0 0 20 20'
                                }
                            }
                        },
                        {
                            xtype: 'insertdelfieldset',
                            title: this.required(_('Language')),
                            item: {
                                xtype: 'helpcontainer',
                                item: {
                                    xtype: 'textfield',
                                    allowBlank: false,
                                    inputId: 'lom_language',
                                    tooltip: _('Language'),
                                    anchor: '100%'
                                },
                                help: _('Language'),
                                helpmargin: '0 0 20 20'
                            }
                        },
                        {
                            xtype: 'insertdelfieldset',
                            title: this.required(_('Description')),
                            item: {
                                xtype: 'langcontainer',
                                item: {
                                    xtype: 'helpcontainer',
                                    item: {
                                        xtype: 'textarea',
                                        allowBlank: false,
                                        height: 60,
                                        inputId: 'lom_description',
                                        tooltip: _('Description'),
                                        anchor: '100%'
                                    },
                                    help: _('Description'),
                                    helpmargin: '0 0 20 20'
                                }
                            }
                        },
                        {
                            xtype: 'insertdelfieldset',
                            title: this.optional(_('Keyword')),
                            collapsed: true,
                            item: {
                                xtype: 'langcontainer',
                                item: {
                                    xtype: 'helpcontainer',
                                    item: {
                                        xtype: 'textfield',
                                        inputId: 'lom_keyword',
                                        tooltip: _('Keyword'),
                                        anchor: '100%'
                                    },
                                    help: _('Keyword'),
                                    helpmargin: '0 0 20 20'
                                }
                            }
                        },
                        {
                            xtype: 'insertdelfieldset',
                            title: this.optional(_('Coverage')),
                            collapsed: true,
                            item: {
                                xtype: 'langcontainer',
                                item: {
                                    xtype: 'helpcontainer',
                                    item: {
                                        xtype: 'textfield',
                                        inputId: 'lom_coverage',
                                        tooltip: _('Coverage'),
                                        anchor: '100%'
                                    },
                                    help: _('Coverage'),
                                    helpmargin: '0 0 20 20'
                                }
                            }
                        },
                        {
                            xtype: 'insertdelfieldset',
                            title: this.optional(_('Structure')),
                            collapsed: true,
                            item: {
                                xtype: 'helpcontainer',
                                item: {
                                    xtype: 'combobox',
                                    inputId: 'lom_structure',
                                    tooltip: _('Structure'),
                                    anchor: '100%',
                                    store: [
                                        ['atomic', _('atomic')],
                                        ['collection', _('collection')],
                                        ['networked', _('networked')],
                                        ['hierarchical', _('hierarchical')],
                                        ['linear', _('linear')]
                                    ]
                                },
                                help: _('Structure'),
                                helpmargin: '0 0 20 20'
                            }
                        },
                        {
                            xtype: 'insertdelfieldset',
                            title: this.required(_('Agregation Level')),
                            item: {
                                xtype: 'helpcontainer',
                                item: {
                                    xtype: 'combobox',
                                    allowBlank: false,
                                    inputId: 'lom_agregationlevel',
                                    tooltip: _('Agregation Level'),
                                    anchor: '100%',
                                    store: [
                                        ['1', _('smallest level of aggregation')],
                                        ['2', _('collection of atoms, e.g. an HTML document with some embedded pictures or a lesson')],
                                        ['3', _('collection of level 1 resources')],
                                        ['4', _('largest level of granularity, e.g. a course')]
                                    ]
                                },
                                help: _('Agregation Level'),
                                helpmargin: '0 0 20 20'
                            }
                        }
                    ]
                },
                {
                    xtype: 'preservescrollfieldset',
                    collapsed: true,
                    title: this.optional(_('Life Cycle')),
                    defaults: {
                        margin: 10,
                        collapsible: true
                    },
                    items: [
                        {
                            xtype: 'insertdelfieldset',
                            title: this.optional(_('Version')),
                            collapsed: true,
                            item: {
                                xtype: 'langcontainer',
                                item: {
                                    xtype: 'helpcontainer',
                                    item: {
                                        xtype: 'textfield',
                                        allowBlank: false,
                                        inputId: 'lom_version',
                                        tooltip: _('Version'),
                                        anchor: '100%'
                                    },
                                    help: _('Version'),
                                    helpmargin: '0 0 20 20'
                                }
                            }
                        },
                        {
                            xtype: 'insertdelfieldset',
                            title: this.optional(_('Status')),
                            collapsed: true,
                            item: {
                                xtype: 'helpcontainer',
                                item: {
                                    xtype: 'combobox',
                                    inputId: 'lom_status',
                                    tooltip: _('Status'),
                                    anchor: '100%',
                                    store: [
                                        ['draft', _('draft')],
                                        ['final', _('final')],
                                        ['unavailable', _('unavailable')],
                                        ['revised', _('revised')]
                                    ]
                                },
                                help: _('Status'),
                                helpmargin: '0 0 20 20'
                            }
                        },{
                            xtype: 'insertdelfieldset',
                            title: this.required(_('Contribution')),
                            item: [
                                {
                                    xtype: 'helpcontainer',
                                    item: {
                                        xtype: 'textfield',
                                        fieldLabel: _('Role'),
                                        inputId: 'lom_role',
                                        tooltip: _('Role'),
                                        anchor: '100%'
                                    },
                                    help: _('Role')
                                },
                                {
                                    xtype: 'helpcontainer',
                                    item: {
                                        xtype: 'textfield',
                                        fieldLabel: _('Name'),
                                        inputId: 'lom_name',
                                        tooltip: _('Name'),
                                        anchor: '100%'
                                    },
                                    help: _('Name')
                                },
                                {
                                    xtype: 'helpcontainer',
                                    item: {
                                        xtype: 'textfield',
                                        fieldLabel: _('Organization'),
                                        inputId: 'lom_organization',
                                        tooltip: _('Organization'),
                                        anchor: '100%'
                                    },
                                    help: _('Organization')
                                },
                                {
                                    xtype: 'helpcontainer',
                                    item: {
                                        xtype: 'textfield',
                                        fieldLabel: _('Email'),
                                        inputId: 'lom_email',
                                        tooltip: _('Email'),
                                        anchor: '100%'
                                    },
                                    help: _('Email')
                                },
                                {
                                    xtype: 'helpcontainer',
                                    item: {
                                        xtype: 'datefield',
                                        fieldLabel: _('Date'),
                                        format: 'Y-m-d',
                                        validateOnBlur: false,
                                        validateOnChange: false,
                                        pickerAlign: 'tr-br',
                                        inputId: 'lom_date',
                                        tooltip: _('Date'),
                                        margin: '0 0 20 0',
                                        anchor: '100%'
                                    },
                                    help: _('Date')
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'preservescrollfieldset',
                    title: _('Meta-Metadata')
                },
                {
                    xtype: 'preservescrollfieldset',
                    collapsed: true,
                    title: _('Technical')
                },
                {
                    xtype: 'preservescrollfieldset',
                    title: _('Educational')
                },
                {
                    xtype: 'preservescrollfieldset',
                    title: _('Rights')
                },
                {
                    xtype: 'preservescrollfieldset',
                    collapsed: true,
                    title: _('Relation')
                },
                {
                    xtype: 'preservescrollfieldset',
                    collapsed: true,
                    title: _('Annotation')
                },
                {
                    xtype: 'preservescrollfieldset',
                    collapsed: true,
                    title: _('Classification')
                },
                {
                    xtype: 'button',
                    text: _('Apply'),
                    itemId: 'apply'
                }
            ]
        });

        me.callParent(arguments);
    }
});