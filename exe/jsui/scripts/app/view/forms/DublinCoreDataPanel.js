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

Ext.define('eXe.view.forms.DublinCoreDataPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.dublincoredata',

    requires: ['eXe.view.forms.HelpContainer'],
    
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            autoScroll: true,
            items: [
                {
                    xtype: 'fieldset',
                    title: _('Dublin Core Metadata'),
                    margin: 10,
                    items: [
                        {
                            xtype: 'textfield',
                            inputId: 'dc_title',
                            fieldLabel: _('Title'),
                            tooltip: _('The name given to the resource.'),
                            anchor: '100%'
                        },
                        {
                            xtype: 'textfield',
                            inputId: 'dc_creator',
                            fieldLabel: _('Creator'),
                            tooltip: _('An entity primarily responsible for making the content of the resource.'),
                            anchor: '100%'
                        },
                        {
                            xtype: 'helpcontainer',
                            item: {
                                xtype: 'textfield',
                                inputId: 'dc_subject',
                                fieldLabel: _('Subject'),
                                tooltip: _('The topic of the content of the resource.'),
                                anchor: '100%'
                            },
                            help: _('Typically, Subject will be expressed as keywords, key phrases or classification codes that describe a topic of the resource. Recommended best practice is to select a value from a controlled vocabulary or formal classification scheme.')
                        },
                        {
                            xtype: 'textarea',
                            inputId: 'dc_description',
                            fieldLabel: _('Description'),
                            tooltip: _('An account of the content of the resource.'),
                            height: 80,
                            anchor: '100%'
                        },
                        {
                            xtype: 'textfield',
                            inputId: 'dc_publisher',
                            fieldLabel: _('Publisher'),
                            tooltip: _('An entity responsible for making the resource available.'),
                            anchor: '100%'
                        },
                        {
                            xtype: 'textarea',
                            inputId: 'dc_contributors',
                            fieldLabel: _('Contributors'),
                            tooltip: _('An entity responsible for making contributions to the content of the resource.'),
                            height: 80,
                            anchor: '100%'
                        },
                        {
                            xtype: 'helpcontainer',
                            item: {
                                xtype: 'datefield',
                                format: 'Y-m-d',
                                validateOnBlur: false,
                                validateOnChange: false,
                                pickerAlign: 'tr-br',
                                inputId: 'dc_date',
                                fieldLabel: _('Date'),
                                tooltip: _('A date of an event in the lifecycle of the resource.'),
                                anchor: '100%'
                            },
                            help: _('Typically, Date will be associated with the creation or availability of the resource. Recommended best practice for encoding the date value is defined in a profile called <em>ISO 8601</em> <a href="/docs/W3C-NOTE-datetime.html" target="_blank">W3C Date and Time Formats</a> and includes (among others) dates of the form YYYY-MM-DD.')
                        },
                        {
                            xtype: 'helpcontainer',
                            item: {
                                xtype: 'textfield',
                                inputId: 'dc_type',
                                fieldLabel: _('Type'),
                                tooltip: _('The nature or genre of the content of the resource.'),
                                anchor: '100%'
                            },
                            help: _('Type includes terms describing general categories, functions, or genres, for content. Recommended best practice is to select a value from a controlled vocabulary or controlled classification scheme. To describe the physical or digital manifestation of the resource, use the FORMAT element.')
                        },
                        {
                            xtype: 'combobox',
                            inputId: 'dc_format',
                            fieldLabel: _('Format'),
                            store: [
                                ['XHTML', 'XHTML'],
                                ['SCORM 1.2', 'SCORM 1.2'],
                                ['IMS-CP', 'IMS Content Package 1.1.3'],
                                ['Web Site', 'Web Site']
                            ],
                            tooltip: _('Select a Format.'),
                            anchor: '100%'
                        },
                        {
                            xtype: 'textfield',
                            inputId: 'dc_identifier',
                            fieldLabel: _('Identifier'),
                            tooltip: _('An unambiguous reference to the resource within a given context.'),
                            anchor: '100%'
                        },
                        {
                            xtype: 'textfield',
                            inputId: 'dc_source',
                            fieldLabel: _('Source'),
                            tooltip: _('A Reference to a resource from which the present resource is derived.'),
                            anchor: '100%'
                        },
                        {
                            xtype: 'combobox',
                            inputId: 'dc_language',
                            fieldLabel: _('Language'),
                            store: langsStore,
                            tooltip: _('Select a language.'),
                            anchor: '100%'
                        },
                        {
                            xtype: 'textfield',
                            inputId: 'dc_relation',
                            fieldLabel: _('Relation'),
                            tooltip: _('A reference to a related resource.'),
                            anchor: '100%'
                        },
                        {
                            xtype: 'textfield',
                            inputId: 'dc_coverage',
                            fieldLabel: _('Coverage'),
                            tooltip: _('The extent or scope of the content of the resource.'),
                            anchor: '100%'
                        },
                        {
                            xtype: 'helpcontainer',
                            item: {
                                xtype: 'textfield',
                                inputId: 'dc_rights',
                                fieldLabel: _('Rights'),
                                tooltip: _('Information about rights held in and over the resource.'),
                                anchor: '100%'
                            },
                            help: _('Typically, a Rights element will contain a rights management statement for the resource, or reference a service providing such information. Rights information often encompasses Intellectual Property Rights (IPR), Copyright, and various Property Rights. If the Rights element is absent, no assumptions can be made about the status of these and other rights with respect to the resource.')
                        }
                    ]
                },
                {
                    xtype: 'button',
                    text: _('Apply'),
                    margin: 10,
                    itemId: 'apply'
                }
            ]
        });

        me.callParent(arguments);
    }

});