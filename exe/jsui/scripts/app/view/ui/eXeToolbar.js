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


    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'button',
                    text: 'File',
                    menu: {
                        xtype: 'menu',
                        items: [
                            {
                                xtype: 'menuitem',
                                text: 'New'
                            },
                            {
                                xtype: 'menuitem',
                                text: 'Open'
                            },
                            {
                                xtype: 'menuitem',
                                text: 'Recent Projects...',
                                menu: {
                                    xtype: 'menu',
                                    items: [
                                        {
                                            xtype: 'menuseparator'
                                        },
                                        {
                                            xtype: 'menuitem',
                                            text: 'Clear Recent Projects List'
                                        }
                                    ]
                                }
                            },
                            {
                                xtype: 'menuseparator'
                            },
                            {
                                xtype: 'menuitem',
                                text: 'Save'
                            },
                            {
                                xtype: 'menuitem',
                                text: 'Save As...'
                            },
                            {
                                xtype: 'menuseparator'
                            },
                            {
                                xtype: 'menuitem',
                                text: 'Print'
                            },
                            {
                                xtype: 'menuseparator'
                            },
                            {
                                xtype: 'menuitem',
                                text: 'Import',
                                menu: {
                                    xtype: 'menu',
                                    items: [
                                        {
                                            xtype: 'menuitem',
                                            text: 'HTML Course'
                                        },
                                        {
                                            xtype: 'menuitem',
                                            text: 'XLIFF File'
                                        }
                                    ]
                                }
                            },
                            {
                                xtype: 'menuseparator'
                            },
                            {
                                xtype: 'menuitem',
                                text: 'Export',
                                menu: {
                                    xtype: 'menu',
                                    items: [
                                        {
                                            xtype: 'menuitem',
                                            text: 'Common Cartridge'
                                        },
                                        {
                                            xtype: 'menuitem',
                                            text: 'SCORM 1.2'
                                        },
                                        {
                                            xtype: 'menuitem',
                                            text: 'IMS Content Package'
                                        },
                                        {
                                            xtype: 'menuitem',
                                            text: 'Web Site',
                                            menu: {
                                                xtype: 'menu',
                                                items: [
                                                    {
                                                        xtype: 'menuitem',
                                                        text: 'Self-contained Folder'
                                                    },
                                                    {
                                                        xtype: 'menuitem',
                                                        text: 'Zip File'
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            xtype: 'menuitem',
                                            text: 'Single Page'
                                        },
                                        {
                                            xtype: 'menuitem',
                                            text: 'Text File'
                                        },
                                        {
                                            xtype: 'menuitem',
                                            text: 'iPod Notes'
                                        },
                                        {
                                            xtype: 'menuitem',
                                            text: 'XLIFF'
                                        }
                                    ]
                                }
                            },
                            {
                                xtype: 'menuitem',
                                text: 'Merging',
                                menu: {
                                    xtype: 'menu',
                                    items: [
                                        {
                                            xtype: 'menuitem',
                                            text: 'Insert Package'
                                        },
                                        {
                                            xtype: 'menuitem',
                                            text: 'Extract Package'
                                        }
                                    ]
                                }
                            },
                            {
                                xtype: 'menuseparator'
                            },
                            {
                                xtype: 'menuitem',
                                text: 'Quit'
                            }
                        ]
                    }
                },
                {
                    xtype: 'button',
                    text: 'Tools',
                    menu: {
                        xtype: 'menu',
                        items: [
                            {
                                xtype: 'menuitem',
                                text: 'iDevice Editor'
                            },
                            {
                                xtype: 'menuitem',
                                text: 'Preferences'
                            },
                            {
                                xtype: 'menuseparator'
                            },
                            {
                                xtype: 'menuitem',
                                text: 'Refresh Display'
                            }
                        ]
                    }
                },
                {
                    xtype: 'button',
                    text: 'Styles',
                    menu: {
                        xtype: 'menu',
                        width: 120
                    }
                },
                {
                    xtype: 'button',
                    text: 'Help',
                    menu: {
                        xtype: 'menu',
                        items: [
                            {
                                xtype: 'menuitem',
                                text: 'eXe Tutorial'
                            },
                            {
                                xtype: 'menuitem',
                                text: 'eXe Manual'
                            },
                            {
                                xtype: 'menuitem',
                                text: 'Release Notes'
                            },
                            {
                                xtype: 'menuseparator'
                            },
                            {
                                xtype: 'menuitem',
                                text: 'eXe Web Site'
                            },
                            {
                                xtype: 'menuitem',
                                text: 'Report an Issue'
                            },
                            {
                                xtype: 'menuitem',
                                text: 'eXe Live Chat'
                            },
                            {
                                xtype: 'menuseparator'
                            },
                            {
                                xtype: 'menuitem',
                                text: 'About eXe'
                            }
                        ]
                    }
                }
            ]
        });

        me.callParent(arguments);
    }
});