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
            items: [
                {
                    xtype: 'fieldset',
                    title: _('Project Properties'),
                    margin: 10,
                    items: [
                        {
                            xtype: 'textfield',
                            inputId: 'pp_title',
                            fieldLabel: _('Project Title'),
                            tooltip: _("The project's title."),
                            anchor: '100%'
                        },
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
					                                uncheckedValue: false
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'textfield',
                            inputId: 'pp_author',
                            fieldLabel: _('Author'),
                            tooltip: _('Primary author of the resource.'),
                            anchor: '100%'
                        },
                        {
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
                        {
                            xtype: 'textarea',
                            inputId: 'pp_footer',
                            fieldLabel: _('Footer'),
                            tooltip: _('Web pages footer.'),
                            height: 80,
                            anchor: '100%'
                        },
                        {
                            xtype: 'textarea',
                            inputId: 'pp_description',
                            fieldLabel: _('Description'),
                            tooltip: _('An account of the content of the resource.'),
                            height: 80,
                            anchor: '100%'
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: _('Taxonomy'),
                    margin: 10,
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
                    text: _('Apply'),
                    itemId: 'apply',
                    margin: 10
                }
            ]
        });

        me.callParent(arguments);
    }

});