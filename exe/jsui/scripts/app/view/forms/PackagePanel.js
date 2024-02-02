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
    statics: { eXeLicenses: [
                         [
                             "None",
                             "(" + _("void") + ")"
                         ],
                         [
                             "propietary license",
                             _("propietary license")
                         ],
                         [
                             "free software license EUPL",
                             _("free software license EUPL")
                         ],
                         [
                             "free software license GPL",
                             _("free software license GPL")
                         ],
                         [
                             "dual free content license GPL and EUPL",
                             _("dual free content license GPL and EUPL")
                         ],
                         [
                             "other free software licenses",
                             _("other free software licenses")
                         ],
                         [
                             "public domain",
                             _("public domain")
                         ],
                         [
                             "not appropriate",
                             _("not appropriate")
                         ],
                         [
                             "intellectual property license",
                             _("intellectual property license")
                         ],
                         [
                             "creative commons: attribution 4.0",
                             _("creative commons: attribution 4.0")
                         ],
                         [
                             "creative commons: attribution - non derived work 4.0",
                             _("creative commons: attribution - non derived work 4.0")
                         ],
                         [
                             "creative commons: attribution - non derived work - non commercial 4.0",
                             _("creative commons: attribution - non derived work - non commercial 4.0")
                         ],
                         [
                             "creative commons: attribution - non commercial 4.0",
                             _("creative commons: attribution - non commercial 4.0")
                         ],
                         [
                             "creative commons: attribution - non commercial - share alike 4.0",
                             _("creative commons: attribution - non commercial - share alike 4.0")
                         ],
                         [
                             "creative commons: attribution - share alike 4.0",
                             _("creative commons: attribution - share alike 4.0")
                         ],
                         [
                             "creative commons: attribution 3.0",
                             _("creative commons: attribution 3.0")
                         ],
                         [
                             "creative commons: attribution - non derived work 3.0",
                             _("creative commons: attribution - non derived work 3.0")
                         ],
                         [
                             "creative commons: attribution - non derived work - non commercial 3.0",
                             _("creative commons: attribution - non derived work - non commercial 3.0")
                         ],
                         [
                             "creative commons: attribution - non commercial 3.0",
                             _("creative commons: attribution - non commercial 3.0")
                         ],
                         [
                             "creative commons: attribution - non commercial - share alike 3.0",
                             _("creative commons: attribution - non commercial - share alike 3.0")
                         ],
                         [
                             "creative commons: attribution - share alike 3.0",
                             _("creative commons: attribution - share alike 3.0")
                         ],
                         [
                             "creative commons: attribution 2.5",
                             _("creative commons: attribution 2.5")
                         ],
                         [
                             "creative commons: attribution - non derived work 2.5",
                             _("creative commons: attribution - non derived work 2.5")
                         ],
                         [
                             "creative commons: attribution - non derived work - non commercial 2.5",
                             _("creative commons: attribution - non derived work - non commercial 2.5")
                         ],
                         [
                             "creative commons: attribution - non commercial 2.5",
                             _("creative commons: attribution - non commercial 2.5")
                         ],
                         [
                             "creative commons: attribution - non commercial - share alike 2.5",
                             _("creative commons: attribution - non commercial - share alike 2.5")
                         ],
                         [
                             "creative commons: attribution - share alike 2.5",
                             _("creative commons: attribution - share alike 2.5")
                         ],
                         [
                             "license GFDL",
                             _("license GFDL")
                         ]
                     ]},

    onChange: function(me, newValue) {
        if (newValue === null) {
            me.setValue('');
        }
    },

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
                                itemId: 'pp_lang',
                                dirtyCls: 'property-form-dirty',
                                fieldLabel: _('Language'),
                                store: langsStore,
                                tooltip: _('Select a language.'),
                                anchor: '100%',
                                forceSelection: true,
                                listeners: {
                                    'change': me.onChange
                                }
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
			                            fieldLabel: _('General description'),
			                            tooltip: _('An account of the content of the resource.'),
			                            height: 60,
			                            anchor: '100%'
                                    },
                                    help: _('An account of the content of the resource.')
                                },
                                {
                                    cls: 'exe-advanced',
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
                                    cls: 'exe-advanced',
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
	                            fieldLabel: _('Authorship'),
	                            labelWidth: '180px',
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
                                labelWidth: '180px',
                                store: eXe.view.forms.PackagePanel.eXeLicenses,
                                tooltip: _('Select a license.'),
                                anchor: '100%',
                                forceSelection: false,
                                listeners: {
                                    'change': me.onChange
                                }
                            },
                            help: _('Select a license or write your own one.') + ' <a href="https://creativecommons.org/faq/" target="_blank" title="'+_('New Window')+'" rel="noopener" style="color:inherit;opacity:.7">'+_('Creative Commons licenses information page')+'</a>'
                        },
                        {
                            xtype: 'helpcontainer',
                            margin: '0 0 10 0',
                            item: {
                                xtype: 'combobox',
                                inputId: 'pp_learningResourceType',
                                dirtyCls: 'property-form-dirty',
                                fieldLabel: _('Learning Resource Type'),
                                labelWidth: '180px',
                                store: lomesVocab.learningResourceTypeValues.slice(38),
                                tooltip: _('Learning Resource Type'),
                                anchor: '100%',
                                forceSelection: true,
                                listeners: {
                                    'change': me.onChange
                                }
                            },
                            help: _('Learning Resource Type')
                        },
                        {
                            cls: 'exe-advanced',
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
					                            labelWidth: '250px',
					                            tooltip: _('Intended End User'),
		                                        columns: [150, 225, 225],
					                            items: [
					                                {
						                                xtype: 'radio',
					                                    boxLabel: _('Ordinary Learner'),
                                                        dirtyCls: 'property-form-dirty',
						                                name: 'pp_intendedEndUserRoleType',
		                                                inputValue: 'learner',
		                                                checked: true
					                                },
					                                {
					                                    xtype: 'radio',
					                                    boxLabel: _('Special Needs Learner'),
                                                        dirtyCls: 'property-form-dirty',
		                                                name: 'pp_intendedEndUserRoleType',
		                                                inputValue: 'special needs learner'
					                                },
					                                {
					                                    xtype: 'radio',
					                                    boxLabel: _('Gifted Learner'),
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
                                        labelWidth: '250px',
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
                                        labelWidth: '250px',
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
		                                        labelWidth: '250px',
		                                        tooltip: _('Context'),
		                                        columns: [150, 225, 225],
		                                        items: [
		                                            {
		                                                xtype: 'radio',
		                                                boxLabel: _('Classroom'),
		                                                name: 'pp_contextPlace',
		                                                inputValue: 'classroom',
                                                        dirtyCls: 'property-form-dirty',
		                                                checked: true
		                                            },
		                                            {
		                                                xtype: 'radio',
		                                                boxLabel: _('Real Environment'),
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
                                                labelWidth: '250px',
                                                tooltip: _('Modality'),
		                                        columns: [150, 225, 225],
		                                        items: [
		                                            {
		                                                xtype: 'radio',
		                                                boxLabel: _('Face to Face'),
		                                                name: 'pp_contextMode',
		                                                inputValue: 'presencial',
                                                        dirtyCls: 'property-form-dirty',
		                                                checked: true
		                                            },
		                                            {
		                                                xtype: 'radio',
		                                                boxLabel: _('Blended'),
		                                                name: 'pp_contextMode',
		                                                inputValue: 'face to face',
                                                        dirtyCls: 'property-form-dirty'
		                                            },
		                                            {
		                                                xtype: 'radio',
		                                                boxLabel: _('Distance'),
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
                    cls: 'exe-advanced',
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
                            // anchor: '100%',
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
                            xtype: 'container',
                            layout: 'fit',
                            items: [
								{
									xtype: 'textarea',
									inputId: 'pp_footer',
									fieldLabel: _('Footer'),
									tooltip: _('Web pages footer.'),
									height: 80,
									anchor: '100%',
									resizable: true
								}
							]
						}
                    ]
                },
                {
                    cls: 'exe-advanced',
                    xtype: 'fieldset',
					title: _('Format'),
                    margin: 10,
                    items: [
                         {
                            xtype: 'helpcontainer',
                            item: {
	                            xtype: 'combobox',
	                            inputId: 'pp_docType',
	                            labelWidth: 100,
	                            fieldLabel: _('Doctype'),
	                            store: [
	                                  ["XHTML", "XHTML"],
	                                  ["HTML5", "HTML5"]
	                            ],
                                dirtyCls: 'property-form-dirty',
	                            tooltip: _('Doctype'),
	                            anchor: '100%',
                                forceSelection: true,
								listeners : {
									select : function(){
										var is= document.getElementsByTagName("IFRAME");
										if(is.length==1) {
											var i = is[0];
											var ed = i.contentWindow.tinyMCE;
											if(typeof(ed)!='undefined' && ed.activeEditor) {
												Ext.Msg.alert(_('Warning'), _("Save the changes of your iDevice before changing the DOCTYPE"));
											}
										}
									}
								}
                            },
                            flex: 0,
                            help: _('This overrides for this Package the "Default format for the new documents" set in Tools - Preferences')
                        }
					]
                },
                {
                    cls: 'exe-advanced',
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
					cls: 'exe-advanced',
					xtype: 'preservescrollfieldset',
					title: _('Advanced Options'),
					margin: 10,
                    defaults: {
                        dirtyCls: 'property-form-dirty'
                    },
                    collapsible: true,
                    collapsed: true,
                    layout: 'fit',
                    items: [
                        {
                            xtype: 'textarea',
                            inputId: 'pp_extraHeadContent',
                            fieldLabel: _('Custom HEAD'),
                            tooltip: _('Any code you enter here (STYLE, META, SCRIPT...) will be added in the HEAD section to every page.').replace(" HEAD "," &lt;HEAD&gt; "),
                            height: 80,
                            anchor: '100%',
                            resizable: true
                        }
                    ]
                },
                {
                	xtype: 'button',
                	text: _('Save'),
                	itemId: 'save_properties',
                	margin: 10
                },
                {
                    xtype: 'button',
                    text: _('Clear'),
                    itemId: 'clear_properties',
                    margin: 10
                },
                {
                    xtype: 'button',
                    text: _('Reset'),
                    itemId: 'reset_properties',
                    margin: 10
                }
            ]
        });

        me.callParent(arguments);
    }

});
