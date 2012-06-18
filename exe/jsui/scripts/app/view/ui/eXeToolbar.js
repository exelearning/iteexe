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

Ext.define('eXe.view.ui.eXeToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.exetoolbar',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'button',
                    text: _('File'),
                    menu: {
                        xtype: 'menu',
                        items: [
                            {
                                xtype: 'menuitem',
                                text: _('New'),
                                itemId: 'file_new'
                            },
                            {
                                xtype: 'menuitem',
                                text: _('Open'),
                                itemId: 'file_open'
                            },
                            {
                                xtype: 'menuitem',
                                text: _('Recent Projects...'),
                                menu: {
                                    xtype: 'menu',
	                                itemId: 'file_recent_menu',
                                    items: [
                                        {
                                            xtype: 'menuseparator'
                                        },
                                        {
                                            xtype: 'menuitem',
                                            itemId: 'file_clear_recent',
                                            text: _('Clear Recent Projects List')
                                        }
                                    ]
                                }
                            },
                            {
                                xtype: 'menuseparator'
                            },
                            {
                                xtype: 'menuitem',
                                text: _('Save'),
                                itemId: 'file_save'
                            },
                            {
                                xtype: 'menuitem',
                                text: _('Save As...'),
                                itemId: 'file_save_as'
                            },
                            {
                                xtype: 'menuseparator'
                            },
                            {
                                xtype: 'menuitem',
                                text: _('Print'),
                                itemId: 'file_print'
                            },
                            {
                                xtype: 'menuseparator'
                            },
                            {
                                xtype: 'menuitem',
                                text: _('Import'),
                                menu: {
                                    xtype: 'menu',
                                    items: [
                                        {
                                            xtype: 'menuitem',
                                            itemId: 'file_import_html',
                                            text: _('HTML Course')
                                        },
                                        {
                                            xtype: 'menuitem',
                                            itemId: 'file_import_xliff',
                                            text: _('XLIFF File')
                                        }
                                    ]
                                }
                            },
                            {
                                xtype: 'menuseparator'
                            },
                            {
                                xtype: 'menuitem',
                                text: _('Export'),
                                menu: {
                                    xtype: 'menu',
                                    items: [
                                        {
                                            xtype: 'menuitem',
                                            text: _('Common Cartridge'),
                                            itemId: 'file_export_cc'
                                        },
                                        {
                                            xtype: 'menuitem',
                                            text: _('SCORM 1.2'),
                                            itemId: 'file_export_scorm'
                                        },
                                        {
                                            xtype: 'menuitem',
                                            text: _('IMS Content Package'),
                                            itemId: 'file_export_ims'
                                        },
                                        {
                                            xtype: 'menuitem',
                                            text: _('Web Site'),
                                            menu: {
                                                xtype: 'menu',
                                                items: [
                                                    {
                                                        xtype: 'menuitem',
                                                        text: _('Self-contained Folder'),
                                                        itemId: 'file_export_website'
                                                    },
                                                    {
                                                        xtype: 'menuitem',
                                                        text: _('Zip File'),
                                                        itemId: 'file_export_zip'
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            xtype: 'menuitem',
                                            text: _('Single Page'),
                                            itemId: 'file_export_singlepage'
                                        },
                                        {
                                            xtype: 'menuitem',
                                            text: _('Text File'),
                                            itemId: 'file_export_text'
                                        },
                                        {
                                            xtype: 'menuitem',
                                            text: _('iPod Notes'),
                                            itemId: 'file_export_ipod'
                                        },
                                        {
                                            xtype: 'menuitem',
                                            text: _('XLIFF'),
                                            itemId: 'file_export_xliff'
                                        }
                                    ]
                                }
                            },
                            {
                                xtype: 'menuitem',
                                text: _('Merging'),
                                menu: {
                                    xtype: 'menu',
                                    items: [
                                        {
                                            xtype: 'menuitem',
                                            text: _('Insert Package')
                                        },
                                        {
                                            xtype: 'menuitem',
                                            text: _('Extract Package')
                                        }
                                    ]
                                }
                            },
                            {
                                xtype: 'menuseparator'
                            },
                            {
                                xtype: 'menuitem',
                                text: _('Quit')
                            }
                        ]
                    }
                },
                {
                    xtype: 'button',
                    text: _('Tools'),
                    menu: {
                        xtype: 'menu',
                        items: [
                            {
                                xtype: 'menuitem',
                                text: _('iDevice Editor')
                            },
                            {
                                xtype: 'menuitem',
                                text: _('Preferences')
                            },
                            {
                                xtype: 'menuseparator'
                            },
                            {
                                xtype: 'menuitem',
                                text: _('Refresh Display')
                            }
                        ]
                    }
                },
                {
                    xtype: 'button',
                    text: _('Styles'),
                    itemId: 'styles_button',
                    menu: {
                        xtype: 'menu',
	                    itemId: 'styles_menu'
                    }
                },
                {
                    xtype: 'button',
                    text: _('Help'),
                    menu: {
                        xtype: 'menu',
                        items: [
                            {
                                xtype: 'menuitem',
                                text: _('eXe Tutorial')
                            },
                            {
                                xtype: 'menuitem',
                                text: _('eXe Manual')
                            },
                            {
                                xtype: 'menuitem',
                                text: _('Release Notes')
                            },
                            {
                                xtype: 'menuseparator'
                            },
                            {
                                xtype: 'menuitem',
                                text: _('eXe Web Site')
                            },
                            {
                                xtype: 'menuitem',
                                text: _('Report an Issue')
                            },
                            {
                                xtype: 'menuitem',
                                text: _('eXe Live Chat')
                            },
                            {
                                xtype: 'menuseparator'
                            },
                            {
                                xtype: 'menuitem',
                                text: _('About eXe')
                            }
                        ]
                    }
                }
            ]
        });

        me.callParent(arguments);
    }
});