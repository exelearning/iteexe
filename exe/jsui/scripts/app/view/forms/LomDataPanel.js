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

function required(msg) {
    return '*' + msg + ' (' + _('Required') + ')';
}

function optional(msg) {
    return msg + ' (' + _('Optional') + ')';
}

function textfield(label, id, tooltip, optional, margin) {
    if (!tooltip)
        tooltip = label;
    if (!margin)
        margin = '0 0 0 0';
    return {
        xtype: 'textfield',
        allowBlank: optional,
        margin: margin,
        fieldLabel: label,
        tooltip: tooltip,
        inputId: id,
        validateOnBlur: false,
        validateOnChange: false,
        anchor: '100%'
    }
}

function helpfield(label, id, tooltip, help, optional, margin, helpmargin) {
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
        item: textfield(label, id, tooltip, optional, margin),
        help: help,
        helpmargin: helpmargin
    }
}

lomVocab['languageValues'] = langsStore;

lomVocab['aggregationLevelValues'] = [
    ['1', _('smallest level of aggregation')],
    ['2', _('collection of atoms, e.g. an HTML document with some embedded pictures or a lesson')],
    ['3', _('collection of level 1 resources')],
    ['4', _('largest level of granularity, e.g. a course')]
]

function helpcombo(label, id, tooltip, help, optional, margin, helpmargin) {
    var combo = helpfield(label, id, tooltip, help, optional, margin, helpmargin),
        storeName = id;    	
    	storeName = storeName.replace(/[1-9]/g, '');
    	storeName = storeName.replace(/_string$/, '');
    	storeName = storeName.replace(/_value$/, '');
    	storeName = storeName.slice(storeName.lastIndexOf('_') + 1) + 'Values';    	
    combo.item.xtype = 'combobox';
    combo.item.store = lomVocab[storeName];
    return combo;
}

function helparea(label, id, tooltip, help, optional, margin, helpmargin) {
    var area = helpfield(label, id, tooltip, help, optional, margin, helpmargin);

    area.item.xtype = 'textarea';
    area.item.height = 60
    return area;
}

function helpdate(label, id, tooltip, help, optional, margin, helpmargin) {
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
            inputId: id,
            tooltip: tooltip,
            margin: margin,
            anchor: '100%'
        },
        help: help,
        helpmargin: helpmargin
    }
}

function field(label, appendable, mandatory, item) {
    var title, field, xtype = 'preservescrollfieldset';

    if (mandatory)
        title = required(label);
    else
        title = optional(label);
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
}

function durationfield(label, appendable, mandatory, id) {
    return field( label, appendable, mandatory, [
        {
            xtype: 'container',
            layout: 'hbox',
            items: [
                { xtype: 'container', layout: 'anchor', flex: 1, items: textfield( _('Years'), id + '_years', null, true, '0 20 0 0')},
                { xtype: 'container', layout: 'anchor', flex: 1, items: textfield( _('Months'), id + '_months', null, true, '0 20 0 0')},
                { xtype: 'container', layout: 'anchor', flex: 1, items: textfield( _('Days'), id + '_days', null, true)}
            ]
        },
        {
            xtype: 'container',
            layout: 'hbox',
            items: [
                { xtype: 'container', layout: 'anchor', flex: 1, items: textfield( _('Hours'), id + '_hours', null, true, '0 20 0 0')},
                { xtype: 'container', layout: 'anchor', flex: 1, items: textfield( _('Minutes'), id + '_minutes', null, true, '0 20 0 0')},
                { xtype: 'container', layout: 'anchor', flex: 1, items: textfield( _('Seconds'), id + '_seconds', null, true)}
            ]
        },
        field( _('Description'), true, false, langfield( helparea( null, id + '_description_string1', _('Description'), null, true)))
    ])
}

function langfield(item) {
    return {
        xtype: 'langcontainer',
        item: item
    }
}

general_section_items = [
    field( _('Identifier'), true, true, {
        xtype: 'container',
        layout: 'hbox',
        items: [
            helpfield( _('Catalog'), 'lom_general_identifier1_catalog'),
            helpfield( _('Entry'), 'lom_general_identifier1_entry', null, null, false, '0 0 0 20', '0 0 20 40')
        ]
    }),
    field(_('Title'), true, true, langfield( helpfield( null, 'lom_general_title_string1', _('Title') ) ) ),
    field(_('Language'), true, true, helpcombo( null, 'lom_general_language1', _('Language') ) ),
    field(_('Description'), true, true, langfield( helparea( null, 'lom_general_description1_string1', _('Description') ) ) ),
    field(_('Keyword'), true, false, langfield( helpfield( null, 'lom_general_keyword1_string1', _('Keyword'), null, true) ) ),
    field(_('Coverage'), true, false, langfield( helpfield( null, 'lom_general_coverage_string1', _('Coverage'), null, true) ) ),
    field(_('Structure'), false, false, helpcombo( null, 'lom_general_structure_value', _('Structure'), null, true) ),
    field(_('Agregation Level'), false, true, helpcombo( null, 'lom_general_aggregationLevel_value', _('Agregation Level')) )
];

lifecycle_section_items = [
    field(_('Version'), true, false, langfield( helpfield( null, 'lom_lifeCycle_version_string1', _('Version'), null, true) ) ),
    field(_('Status'), false, false, helpcombo( null, 'lom_lifeCycle_status_value', _('Status'), null, true) ),
    field(_('Contribution'), true, true, [
	    helpcombo( _('Role'), 'lom_lifeCycle_contribute1_role_value', null, null, true ),
	    helpfield( _('Name'), 'lom_lifeCycle_contribute1_entity1_name', null, null, true ),
	    helpfield( _('Organization'), 'lom_lifeCycle_contribute1_entity1_organization', null, null, true ),
	    helpfield( _('Email'), 'lom_lifeCycle_contribute1_entity1_email', null, null, true ),
	    helpdate( _('Date'), 'lom_lifeCycle_contribute1_date', null, null, true)
    ])
];

metadata_section_items = [
    field( _('Identifier'), true, false, {
        xtype: 'container',
        layout: 'hbox',
        items: [
            helpfield( _('Catalog'), 'lom_metaMetadata_identifier1_catalog', null, null, true),
            helpfield( _('Entry'), 'lom_metaMetadata_identifier1_entry', null, null, true, '0 0 0 20', '0 0 20 40')
        ]
    }),
    field(_('Metadata Schema'), false, true, helpfield( null, 'lom_metaMetadata_metadataSchema1', _('Metadata Schema') ) ),
    field(_('Language'), false, true, helpcombo( null, 'lom_metaMetadata_language', _('Language') ) ),
    field(_('Contribution'), true, false, [
        helpcombo( _('Role'), 'lom_metaMetadata_contribute1_role_value', null, null, true ),
        helpfield( _('Name'), 'lom_metaMetadata_contribute1_entity1_name', null, null, true ),
        helpfield( _('Organization'), 'lom_metaMetadata_contribute1_entity1_organization', null, null, true ),
        helpfield( _('Email'), 'lom_metaMetadata_contribute1_entity1_email', null, null, true ),
        helpdate( _('Date'), 'lom_metaMetadata_contribute1_date', null, null, true)
    ])
]

technical_section_items = [
    field( _('Format'), true, false, helpfield( null, 'lom_technical_format1', _('Format'), null, true)),
    field( _('Size'), false, false, helpfield( null, 'lom_technical_size', _('Size'), null, true)),
    field( _('Location'), true, false, helpfield( null, 'lom_technical_location1', _('Location'), null, true)),
    field( _('Requirement'), true, false, [
        helpcombo( _('Type'), 'lom_technical_requirement1_orComposite1_type_value', null, null, true),
        helpcombo( _('Name'), 'lom_technical_requirement1_orComposite1_name_value', null, null, true),
        helpfield( _('Minimum Version'), 'lom_technical_requirement1_orComposite1_minimumVersion', null, null, true),
        helpfield( _('Maximum Version'), 'lom_technical_requirement1_orComposite1_maximumVersion', null, null, true)
    ]),
    field( _('Installation Remarks'), true, false, langfield( helpfield( null, 'lom_technical_installationRemarks_string1', _('Installation Remarks'), null, true))),
    field( _('Other Platform Requirements'), true, false, langfield( helpfield( null, 'lom_technical_otherPlatformRequirements_string1', _('Other Platform Requirements'), null, true))),
    durationfield(_('Duration'), false, false, 'lom_technical_duration')
]

educational_section_items = [
    field( _('Interactivity Type'), false, false, helpcombo( null, 'lom_educational1_interactivityType_value', _('Interactivity Type'), null, true)),
    field( _('Learning Resource Type'), true, true, helpcombo( null, 'lom_educational1_learningResourceType1_value', _('Learning Resource Type'))),
    field( _('Interactivity Level'), false, false, helpcombo( null, 'lom_educational1_interactivityLevel_value', _('Interactivity Level'), null, true)),
    field( _('Semantic Density'), false, false, helpcombo( null, 'lom_educational1_semanticDensity_value', _('Semantic Density'), null, true)),
    field( _('Intended End User Role'), true, false, helpcombo( null, 'lom_educational1_intendedEndUserRole1_value', _('Intended End User Role'), null, true)),
    field( _('Context'), true, false, helpcombo( null, 'lom_educational1_context1_value', _('Context'), null, true)),
    field( _('Typical Age Range'), true, false, langfield( helpfield( null, 'lom_educational1_typicalAgeRange1_string1', _('Typical Age Range'), null, true))),
    field( _('Difficulty'), false, false, helpcombo( null, 'lom_educational1_difficulty_value', _('Difficulty'), null, true)),
    durationfield(_('Typical Learning Time'), false, false, 'lom_educational1_typicalLearningTime'),
    field( _('Description'), true, false, langfield( helpfield( null, 'lom_educational1_description_string1', _('Description'), null, true))),
    field( _('Language'), true, true, helpcombo( null, 'lom_educational1_language1', _('Language'))),
    field( _('Cognitive Process'), true, false, helpcombo( null, 'lom_educational1_cognitiveProcess1_value', _('Cognitive Process'), null, true))
]

rights_section_items = [
    field( _('Cost'), false, false, helpcombo( null, 'lom_rights_cost_value', _('Cost'), null, true)),
    field( _('Copyright And Other Restrictions'), false, true, helpcombo( null, 'lom_rights_copyrightAndOtherRestrictions_value', _('Copyright And Other Restrictions'))),
    field( _('Description'), false, false, langfield( helparea( null, 'lom_rights_description_string1', _('Description'), null, true))),
    field( _('Access'), false, false, [
        helpcombo( _('Access Type'), 'lom_rights_access_accessType_value', _('Access Type'), null, true),
        langfield( textfield( _('Description'), 'lom_rights_access_description_string1', _('Description'), true))
    ])
]

relation_section_items = [
    field( _('Kind'), false, false, helpcombo( null, 'lom_relation1_kind', _('Kind'), null, true)),
    field( _('Resource'), false, false, langfield( helparea( null, 'lom_relation1_resource_description1_string1', _('Resource'), null, true)))
]

annotation_section_items = [
    field( _('Entity'), false, false, [
        helpfield( _('Name'), 'lom_annotation1_entity_name', null, null, true ),
        helpfield( _('Organization'), 'lom_annotation1_entity_organization', null, null, true ),
        helpfield( _('Email'), 'lom_annotation1_entity_email', null, null, true )
    ]),
    field( _('Date'), false, false, helpdate( null, 'lom_annotation1_date', _('Date'), null, true)),
    field( _('Description'), false, false, langfield( helparea( null, 'lom_annotation1_description_string1', _('Description'), null, true)))
]

classification_section_items = [
    field( _('Purpose'), false, true, helpcombo( null, 'lom_classification1_purpose_value', _('Purpose'), null, true)),
    field( _('Taxon Path'), true, true, helpcombo( null, 'lom_classification1_taxonPath1', _('Taxon Path'), null, true)),
    field( _('Description'), false, false, langfield( helparea( null, 'lom_classification1_description_string1', _('Description'), null, true))),
    field( _('Keyword'), true, false, langfield( helpfield( null, 'lom_classification1_keyword1_string1', _('Keyword'), null, true)))
]

Ext.define('eXe.view.forms.LomDataPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.lomdata',

    requires: [
        'eXe.view.forms.HelpContainer',
        'eXe.view.forms.InsertDeleteFieldSet',
        'eXe.view.forms.LangContainer'
    ],

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            autoScroll: true,
            defaults: {
                margin: 10
            },
            items: [
                field(_('General'), false, true, general_section_items ),
                field(_('Life Cycle'), false, false, lifecycle_section_items),
                field(_('Meta-Metadata'), false, true, metadata_section_items),
                field(_('Technical'), false, false, technical_section_items),
                field(_('Educational'), false, true, educational_section_items),
                field(_('Rights'), false, true, rights_section_items),
                field(_('Relation'), false, false, relation_section_items),
                field(_('Annotation'), false, false, annotation_section_items),
                field(_('Classification'), false, false, classification_section_items),
                {
                    xtype: 'button',
                    text: _('Apply'),
                    itemId: 'save_properties'
                }
            ]
        });

        me.callParent(arguments);
    }
});