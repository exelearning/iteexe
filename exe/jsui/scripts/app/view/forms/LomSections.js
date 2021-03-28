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

lomVocab['languageValues'] = langsStore;

lomVocab['aggregationLevelValues'] = [
    ['1', _('resources and integrated resources')],
    ['2', _('learning objects')],
    ['3', _('teaching sequences')],
    ['4', _('training programmes, courses and plans')]
]

Ext.require('eXe.view.forms.LomWidgets');

Ext.define('eXe.view.forms.LomSections', {
    alias: 'lom',
    statics: {
        vocab: lomVocab,
        prefix: 'lom_',
        metaname: 'LOMv1.0',
        items: function() {
            return {
	        'general': [
	            eXe.view.forms.LomWidgets.field( _('Identifier'), true, true, {
	                xtype: 'container',
	                layout: 'hbox',
	                items: [
	                    eXe.view.forms.LomWidgets.helpfield( _('Catalog'), this.prefix + 'general_identifier{1}_catalog'),
	                    eXe.view.forms.LomWidgets.helpfield( _('Entry'), this.prefix + 'general_identifier{1}_entry', null, null, false, '0 0 0 20', '0 0 20 40')
	                ]
	            }),
	            eXe.view.forms.LomWidgets.field(_('Title'), true, true, eXe.view.forms.LomWidgets.langfield( eXe.view.forms.LomWidgets.helpfield( null, this.prefix + 'general_title_string{1}', _('Title') ) ) ),
	            eXe.view.forms.LomWidgets.field(_('Language'), true, true, eXe.view.forms.LomWidgets.helpcombo( null, this.prefix + 'general_language{1}', _('Language') ) ),
	            eXe.view.forms.LomWidgets.field(_('Description'), true, true, eXe.view.forms.LomWidgets.langfield( eXe.view.forms.LomWidgets.helparea( null, this.prefix + 'general_description{1}_string1', _('Description') ) ) ),
	            eXe.view.forms.LomWidgets.field(_('Keyword'), true, false, eXe.view.forms.LomWidgets.langfield( eXe.view.forms.LomWidgets.helpfield( null, this.prefix + 'general_keyword{1}_string1', _('Keyword'), null, true) ) ),
	            eXe.view.forms.LomWidgets.field(_('Coverage'), true, false, eXe.view.forms.LomWidgets.langfield( eXe.view.forms.LomWidgets.helpfield( null, this.prefix + 'general_coverage{1}_string1', _('Coverage'), null, true) ) ),
	            eXe.view.forms.LomWidgets.field(_('Structure'), false, false, eXe.view.forms.LomWidgets.helpcombo( null, this.prefix + 'general_structure_value', _('Structure'), null, true) ),
	            eXe.view.forms.LomWidgets.field(_('Aggregation Level'), false, true, eXe.view.forms.LomWidgets.helpcombo( null, this.prefix + 'general_aggregationLevel_value', _('Aggregation Level')) )
	        ],
	        'lifeCycle': [
	            eXe.view.forms.LomWidgets.field(_('Version'), true, false, eXe.view.forms.LomWidgets.langfield( eXe.view.forms.LomWidgets.helpfield( null, this.prefix + 'lifeCycle_version_string{1}', _('Version'), null, true) ) ),
	            eXe.view.forms.LomWidgets.field(_('Status'), false, false, eXe.view.forms.LomWidgets.helpcombo( null, this.prefix + 'lifeCycle_status_value', _('Status'), null, true) ),
	            eXe.view.forms.LomWidgets.field(_('Contribution'), true, true, {
                    xtype: 'container',
                    layout: 'anchor',
                    items: [
		                eXe.view.forms.LomWidgets.helpcombo( _('Role'), this.prefix + 'lifeCycle_contribute{1}_role_value', null, null, true ),
		                eXe.view.forms.LomWidgets.helpfield( _('Name'), this.prefix + 'lifeCycle_contribute{1}_entity1_name', null, null, true ),
		                eXe.view.forms.LomWidgets.helpfield( _('Organization'), this.prefix + 'lifeCycle_contribute{1}_entity1_organization', null, null, true ),
		                eXe.view.forms.LomWidgets.helpfield( _('Email'), this.prefix + 'lifeCycle_contribute{1}_entity1_email', null, null, true ),
		                eXe.view.forms.LomWidgets.datefield( true, _('Date'), this.prefix + 'lifeCycle_contribute{1}_date', null, null, true)
		            ]
                })
	        ],
	        'metaMetadata': [
	            eXe.view.forms.LomWidgets.field( _('Identifier'), true, false, {
	                xtype: 'container',
	                layout: 'hbox',
	                items: [
	                    eXe.view.forms.LomWidgets.helpfield( _('Catalog'), this.prefix + 'metaMetadata_identifier{1}_catalog', null, null, true),
	                    eXe.view.forms.LomWidgets.helpfield( _('Entry'), this.prefix + 'metaMetadata_identifier{1}_entry', null, null, true, '0 0 0 20', '0 0 20 40')
	                ]
	            }),
	            eXe.view.forms.LomWidgets.field(_('Metadata Schema'), false, true, eXe.view.forms.LomWidgets.helpfield( null, this.prefix + 'metaMetadata_metadataSchema{1}', _('Metadata Schema'), null, null, null, null, this.metaname ) ),
	            eXe.view.forms.LomWidgets.field(_('Language'), false, true, eXe.view.forms.LomWidgets.helpcombo( null, this.prefix + 'metaMetadata_language', _('Language') ) ),
	            eXe.view.forms.LomWidgets.field(_('Contribution'), true, false, {
                    xtype: 'container',
                    layout: 'anchor',
                    items: [
		                eXe.view.forms.LomWidgets.helpcombo( _('Role'), this.prefix + 'metaMetadata_contribute{1}_role_value', null, null, true ),
		                eXe.view.forms.LomWidgets.helpfield( _('Name'), this.prefix + 'metaMetadata_contribute{1}_entity1_name', null, null, true ),
		                eXe.view.forms.LomWidgets.helpfield( _('Organization'), this.prefix + 'metaMetadata_contribute{1}_entity1_organization', null, null, true ),
		                eXe.view.forms.LomWidgets.helpfield( _('Email'), this.prefix + 'metaMetadata_contribute{1}_entity1_email', null, null, true ),
		                eXe.view.forms.LomWidgets.datefield( true, _('Date'), this.prefix + 'metaMetadata_contribute{1}_date', null, null, true)
                    ]
                })
	        ],
	        'technical': [
	            eXe.view.forms.LomWidgets.field( _('Format'), true, false, eXe.view.forms.LomWidgets.helpfield( null, this.prefix + 'technical_format{1}', _('Format'), null, true)),
	            eXe.view.forms.LomWidgets.field( _('Size'), false, false, eXe.view.forms.LomWidgets.helpfield( null, this.prefix + 'technical_size', _('Size'), null, true)),
	            eXe.view.forms.LomWidgets.field( _('Location'), true, false, eXe.view.forms.LomWidgets.helpfield( null, this.prefix + 'technical_location{1}', _('Location'), null, true)),
	            eXe.view.forms.LomWidgets.field( _('Requirement'), true, false, {
                    xtype: 'container',
                    layout: 'anchor',
                    items: [
		                eXe.view.forms.LomWidgets.helpcombo( _('Type'), this.prefix + 'technical_requirement{1}_orComposite1_type_value', null, null, true),
		                eXe.view.forms.LomWidgets.helpcombo( _('Name'), this.prefix + 'technical_requirement{1}_orComposite1_name_value', null, null, true),
		                eXe.view.forms.LomWidgets.helpfield( _('Minimum Version'), this.prefix + 'technical_requirement{1}_orComposite1_minimumVersion', null, null, true),
		                eXe.view.forms.LomWidgets.helpfield( _('Maximum Version'), this.prefix + 'technical_requirement{1}_orComposite1_maximumVersion', null, null, true)
                    ]
                }),
	            eXe.view.forms.LomWidgets.field( _('Installation Remarks'), true, false, eXe.view.forms.LomWidgets.langfield( eXe.view.forms.LomWidgets.helpfield( null, this.prefix + 'technical_installationRemarks_string{1}', _('Installation Remarks'), null, true))),
	            eXe.view.forms.LomWidgets.field( _('Other Platform Requirements'), true, false, eXe.view.forms.LomWidgets.langfield( eXe.view.forms.LomWidgets.helpfield( null, this.prefix + 'technical_otherPlatformRequirements_string{1}', _('Other Platform Requirements'), null, true))),
	            eXe.view.forms.LomWidgets.durationfield(_('Duration'), false, false, this.prefix + 'technical_duration')
	        ],
	        'educational': [
	            eXe.view.forms.LomWidgets.field( _('Interactivity Type'), false, false, eXe.view.forms.LomWidgets.helpcombo( null, this.prefix + 'educational_interactivityType_value', _('Interactivity Type'), null, true)),
	            eXe.view.forms.LomWidgets.field( _('Learning Resource Type'), true, true, eXe.view.forms.LomWidgets.helpcombo( null, this.prefix + 'educational_learningResourceType{1}_value', _('Learning Resource Type'))),
	            eXe.view.forms.LomWidgets.field( _('Interactivity Level'), false, false, eXe.view.forms.LomWidgets.helpcombo( null, this.prefix + 'educational_interactivityLevel_value', _('Interactivity Level'), null, true)),
	            eXe.view.forms.LomWidgets.field( _('Semantic Density'), false, false, eXe.view.forms.LomWidgets.helpcombo( null, this.prefix + 'educational_semanticDensity_value', _('Semantic Density'), null, true)),
	            eXe.view.forms.LomWidgets.field( _('Intended End User Role'), true, false, eXe.view.forms.LomWidgets.helpcombo( null, this.prefix + 'educational_intendedEndUserRole{1}_value', _('Intended End User Role'), null, true)),
	            eXe.view.forms.LomWidgets.field( _('Context'), true, false, eXe.view.forms.LomWidgets.helpcombo( null, this.prefix + 'educational_context{1}_value', _('Context'), null, true)),
	            eXe.view.forms.LomWidgets.field( _('Typical Age Range'), true, false, eXe.view.forms.LomWidgets.langfield( eXe.view.forms.LomWidgets.helpfield( null, this.prefix + 'educational_typicalAgeRange{1}_string1', _('Typical Age Range'), null, true))),
	            eXe.view.forms.LomWidgets.field( _('Difficulty'), false, false, eXe.view.forms.LomWidgets.helpcombo( null, this.prefix + 'educational_difficulty_value', _('Difficulty'), null, true)),
	            eXe.view.forms.LomWidgets.durationfield(_('Typical Learning Time'), false, false, this.prefix + 'educational_typicalLearningTime'),
	            eXe.view.forms.LomWidgets.field( _('Description'), true, false, eXe.view.forms.LomWidgets.langfield( eXe.view.forms.LomWidgets.helparea( null, this.prefix + 'educational_description{1}_string1', _('Description'), null, true))),
	            eXe.view.forms.LomWidgets.field( _('Language'), true, true, eXe.view.forms.LomWidgets.helpcombo( null, this.prefix + 'educational_language{1}', _('Language')))
	        ],
	        'rights': [
	            eXe.view.forms.LomWidgets.field( _('Cost'), false, false, eXe.view.forms.LomWidgets.helpcombo( null, this.prefix + 'rights_cost_value', _('Cost'), null, true)),
	            eXe.view.forms.LomWidgets.field( _('Copyright And Other Restrictions'), false, true, eXe.view.forms.LomWidgets.helpcombo( null, this.prefix + 'rights_copyrightAndOtherRestrictions_value', _('Copyright And Other Restrictions'))),
	            eXe.view.forms.LomWidgets.field( _('Description'), false, false, eXe.view.forms.LomWidgets.langfield( eXe.view.forms.LomWidgets.helparea( null, this.prefix + 'rights_description_string{1}', _('Description'), null, true)))
	        ],
	        'relation': [
	            eXe.view.forms.LomWidgets.field( _('Kind'), false, false, eXe.view.forms.LomWidgets.helpcombo( null, this.prefix + 'relation_kind_value', _('Kind'), null, true)),
	            eXe.view.forms.LomWidgets.field( _('Resource'), false, false, {
	            	xtype: 'container',
                    layout: 'anchor',
                    items: [
						{
						    xtype: 'container',
						    layout: 'hbox',
						    items: [
						        eXe.view.forms.LomWidgets.helpfield( _('Catalog'), this.prefix + 'relation_resource_identifier_catalog', null, null, true),
						        eXe.view.forms.LomWidgets.helpfield( _('Entry'), this.prefix + 'relation_resource_identifier_entry', null, null, true, '0 0 20 20', '0 0 20 40')
						    ]
						},
                        eXe.view.forms.LomWidgets.langfield( eXe.view.forms.LomWidgets.helparea( null, this.prefix + 'relation_resource_description{1}_string1', _('Resource'), null, true))
                    ]
	            })
	        ],
	        'annotation': [
	            eXe.view.forms.LomWidgets.field( _('Entity'), false, false, {
                    xtype: 'container',
                    layout: 'anchor',
                    items: [
		                eXe.view.forms.LomWidgets.helpfield( _('Name'), this.prefix + 'annotation_entity_name', null, null, true ),
		                eXe.view.forms.LomWidgets.helpfield( _('Organization'), this.prefix + 'annotation_entity_organization', null, null, true ),
		                eXe.view.forms.LomWidgets.helpfield( _('Email'), this.prefix + 'annotation_entity_email', null, null, true )
                    ]
                }),
	            eXe.view.forms.LomWidgets.datefield( false, _('Date'), this.prefix + 'annotation_date', _('Date'), null, true),
	            eXe.view.forms.LomWidgets.field( _('Description'), false, false, eXe.view.forms.LomWidgets.langfield( eXe.view.forms.LomWidgets.helparea( null, this.prefix + 'annotation_description_string{1}', _('Description'), null, true)))
	        ],
	        'classification': [
	            eXe.view.forms.LomWidgets.field( _('Purpose'), false, true, eXe.view.forms.LomWidgets.helpcombo( null, this.prefix + 'classification_purpose_value', _('Purpose'), null, true)),
                {
                    xtype: 'button',
                    itemId: 'sources_download',
                    text: _('Download Classification Sources'),
                    margin: '0 10 10 10'
                },
	            eXe.view.forms.LomWidgets.field( _('Taxon Path'), true, true, {
                    xtype: 'container',
                    layout: 'anchor',
                    items: [{
                    		xtype: 'container',
                    		layout: 'hbox',
                    		items: [ eXe.view.forms.LomWidgets.helpcombo( _('Source'), this.prefix + 'classification_taxonPath{1}_source_string1', _('Source'), null, true),
                                     eXe.view.forms.LomWidgets.textfield(false , this.prefix + 'classification_taxonPath{1}_source_string1_language', null, true, null, null, true)]
                    		},
                        
                    		eXe.view.forms.LomWidgets.taxonfield( _('Taxon'), this.prefix + 'classification_taxonPath{1}_taxon{2}_entry_string1', _('Taxon'), null, true),                                                
                    ]
                }),
	            eXe.view.forms.LomWidgets.field( _('Description'), false, false, eXe.view.forms.LomWidgets.langfield( eXe.view.forms.LomWidgets.helparea( null, this.prefix + 'classification_description_string{1}', _('Description'), null, true))),
	            eXe.view.forms.LomWidgets.field( _('Keyword'), true, false, eXe.view.forms.LomWidgets.langfield( eXe.view.forms.LomWidgets.helpfield( null, this.prefix + 'classification_keyword{1}_string1', _('Keyword'), null, true)))
	        ]
            }
        }
    }
});

lomesVocab['languageValues'] = langsStore;

lomesVocab['aggregationLevelValues'] = [
    ['1', _('resources and integrated resources')],
    ['2', _('learning objects')],
    ['3', _('teaching sequences')],
    ['4', _('training programmes, courses and plans')]
]

Ext.define('eXe.view.forms.LomesSections', {
    extend: 'eXe.view.forms.LomSections',
    alias: 'lomes',
    statics: {
        vocab: lomesVocab,
        prefix: 'lomes_',
        metaname: 'LOM-ESv1.0',
        items: function() {
            var items = this.callParent();

            items.educational.push(eXe.view.forms.LomWidgets.field( _('Cognitive Process'), true, false, eXe.view.forms.LomWidgets.helpcombo( null, this.prefix + 'educational_cognitiveProcess{1}_value', _('Cognitive Process'), null, true)));
            items.rights.push(eXe.view.forms.LomWidgets.field( _('Access'), false, true, {
                    xtype: 'container',
                    layout: 'anchor',
                    items: [
                        eXe.view.forms.LomWidgets.helpcombo( _('Access Type'), this.prefix + 'rights_access_accessType_value', _('Access Type')),
                        eXe.view.forms.LomWidgets.langfield( eXe.view.forms.LomWidgets.textfield( _('Description'), this.prefix + 'rights_access_description_string{1}', _('Description')))
                    ]
                }));
            return items;
        }
    }
});
