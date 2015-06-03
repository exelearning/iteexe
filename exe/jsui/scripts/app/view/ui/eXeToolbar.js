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
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA
//===========================================================================

Ext.define('eXe.view.ui.button', {
    extend: 'Ext.button.Button',
    alias: 'widget.accesskey_button',

    accesskey: null,

    beforeRender: function() {
        var me = this, pat, rep, key;

        if (me.accesskey) {
            pat = new RegExp(me.accesskey,'i');
            key = pat.exec(me.text);
            if (key) {
                rep = "<u>" + key + "</u>";
                me.text = me.text.replace(pat, rep);
            }
        }

        me.callParent();
    }
});

Ext.define('eXe.view.ui.menuitem', {
    extend: 'Ext.menu.Item',
    alias: 'widget.accesskey_menuitem',

    accesskey: null,

    beforeRender: function() {
        var me = this, pat, rep, key, keymap;

        if (me.accesskey) {
            pat = new RegExp(me.accesskey,'i');
            key = pat.exec(me.text);
            if (key) {
	            rep = "<u>" + key + "</u>";
	            me.text = me.text.replace(pat, rep);
            }
	        keymap = new Ext.util.KeyMap({
	            target: me.up().el,
	            binding: {
	                key: me.accesskey,
	                fn: function() {
                        if (me.menu) {
                            me.activate();
                            me.expandMenu(0);
                            me.up().on({'beforeshow': function () { me.deactivate(); } });
                        }
                        else
                            me.onClick(Ext.EventObject);
                    },
	                defaultEventAction: 'stopEvent'
	            }
	        });
        }
        me.callParent();
    }
});

Ext.define('eXe.view.ui.eXeToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.exetoolbar',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'accesskey_button',
                    text: _('File'),
                    itemId: 'file',
                    accesskey: 'f',
                    menu: {
                        xtype: 'menu',
                        items: [
                            {
                                xtype: 'accesskey_menuitem',
                                text: _('New'),
                                accesskey: 'n',
                                tooltip: 'Ctrl+Alt+N',
                                itemId: 'file_new'
                            },
                            {
                                xtype: 'accesskey_menuitem',
                                text: _('New Window'),
                                accesskey: 'w',
                                tooltip: 'Ctrl+Alt+W',
                                itemId: 'file_new_window'
                            },
                            {
                                xtype: 'accesskey_menuitem',
                                text: _('Open'),
                                accesskey: 'o',
                                tooltip: 'Ctrl+O',
                                itemId: 'file_open'
                            },
                            {
                                xtype: 'accesskey_menuitem',
                                text: _('Recent Projects...'),
                                accesskey: 'r',
                                menu: {
                                    xtype: 'menu',
	                                itemId: 'file_recent_menu',
                                    items: [
                                        {
                                            xtype: 'menuseparator'
                                        },
                                        {
                                            xtype: 'accesskey_menuitem',
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
                                xtype: 'accesskey_menuitem',
                                text: _('Save'),
                                accesskey: 's',
                                tooltip: 'Ctrl+S',
                                itemId: 'file_save'
                            },
                            {
                                xtype: 'accesskey_menuitem',
                                text: _('Save As...'),
                                accesskey: 'a',
                                itemId: 'file_save_as'
                            },
                            {
                                xtype: 'menuseparator'
                            },
                            {
                                xtype: 'accesskey_menuitem',
                                text: _('Print'),
                                accesskey: 'p',
                                tooltip: 'Ctrl+P',
                                itemId: 'file_print'
                            },
                            {
                                xtype: 'menuseparator'
                            },
                            {
                                xtype: 'accesskey_menuitem',
                                text: _('Import'),
                                accesskey: 'i',
                                menu: {
                                    xtype: 'menu',
                                    items: [
                                        {
                                            xtype: 'accesskey_menuitem',
                                            itemId: 'file_import_html',
                                            accesskey: 'h',
                                            text: _('HTML Course')
                                        },
                                        {
                                            xtype: 'accesskey_menuitem',
                                            itemId: 'file_import_xliff',
                                            accesskey: 'x',
                                            text: _('XLIFF File')
                                        },
                                        {
                                            xtype: 'accesskey_menuitem',
			                                text: _('Metadata'),
			                                accesskey: 'm',
                                            menu: {
                                                xtype: 'menu',
                                                items: [
			                                        {
			                                            xtype: 'accesskey_menuitem',
			                                            itemId: 'file_import_lom',
			                                            accesskey: 'l',
			                                            text: _('LOM')
			                                        },
                                                    {
                                                        xtype: 'accesskey_menuitem',
                                                        itemId: 'file_import_lomes',
                                                        accesskey: 'e',
                                                        text: _('LOM-ES')
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                xtype: 'menuseparator'
                            },
                            {
                                xtype: 'accesskey_menuitem',
                                text: _('Publish'),
                                itemId: 'publish',
                                accesskey: 'l',
                                menu: {
                                    xtype: 'menu',
                                    items: 
                                    [
                                        {
                                        	xtype: 'accesskey_menuitem',
                                        	text: _('Google Drive'),
                                        	accesskey: 'G',
                                        	itemId: 'file_export_googledrive'
                                         },
                                    ]
                                },
                            },
                            {
                                xtype: 'accesskey_menuitem',
                                text: _('Export'),
                                accesskey: 'e',
                                menu: {
                                    xtype: 'menu',
                                    items: [
                                        {
                                	    xtype: 'accesskey_menuitem',
                                            text: _('Educational Standard'),
                                            accesskey: 'e',
                                            menu: {
                                                xtype: 'menu',
                                                items: [ 
                                                    {
                                                        xtype: 'accesskey_menuitem',
                                                        text: _('Common Cartridge'),
                                                        accesskey: 'c',
                                                        itemId: 'file_export_cc'
                                                    },
                                                    {
                                                        xtype: 'accesskey_menuitem',
                                                        text: _('SCORM1.2'),
                                                        accesskey: 's',
                                                        itemId: 'file_export_scorm12'
                                                    },
                                                    {
                                                        xtype: 'accesskey_menuitem',
                                                        text: _('SCORM2004'),
                                                        accesskey: 'o',
                                                        itemId: 'file_export_scorm2004'
                                                    },
                                                    {
                                                        xtype: 'accesskey_menuitem',
                                                        text: _('IMS Content Package'),
                                                        accesskey: 'i',
                                                        itemId: 'file_export_ims'
                                                    },
                                                ]
                                            }
                                        },
                                        {
                                            xtype: 'accesskey_menuitem',
                                            text: _('Web Site'),
                                            accesskey: 'w',
                                            menu: {
                                                xtype: 'menu',
                                                items: [
                                                    {
                                                        xtype: 'accesskey_menuitem',
                                                        text: _('Self-contained Folder'),
                                                        accesskey: 'f',
                                                        itemId: 'file_export_website'
                                                    },
                                                    {
                                                        xtype: 'accesskey_menuitem',
                                                        text: _('Zip File'),
                                                        accesskey: 'z',
                                                        itemId: 'file_export_zip'
                                                    },
                                                    {
                                                		xtype: 'accesskey_menuitem',
                                                		text: _('Single Page'),
                                                		accesskey: 'p',
                                                		itemId: 'file_export_singlepage'
                                            	    },
                                                ]
                                            }
                                        },
                                        {
                                            xtype: 'accesskey_menuitem',
                                            text: _('Text File'),
                                            accesskey: 't',
                                            itemId: 'file_export_text'
                                        },
                                        {
                                            xtype: 'accesskey_menuitem',
                                            text: _('Ustad Mobile'),
                                            accesskey: 'x',
                                            itemId: 'file_export_mxml'
                                        },
                                        {
                                            xtype: 'accesskey_menuitem',
                                            text: _('XLIFF'),
                                            accesskey: 'x',
                                            itemId: 'file_export_xliff'
                                        },
                                        {
                                            xtype: 'accesskey_menuitem',
                                            text: _('EPUB3'),
                                            accesskey: '3',
                                            itemId: 'file_export_epub3'
                                        }
                                    ]
                                }
                            },
                            {
                                xtype: 'accesskey_menuitem',
                                text: _('Merging'),
                                accesskey: 'm',
                                menu: {
                                    xtype: 'menu',
                                    items: [
                                        {
                                            xtype: 'accesskey_menuitem',
                                            itemId: 'file_insert',
                                            accesskey: 'i',
                                            text: _('Insert Package')
                                        },
                                        {
                                            xtype: 'accesskey_menuitem',
                                            itemId: 'file_extract',
                                            accesskey: 'e',
                                            text: _('Extract Package')
                                        }
                                    ]
                                }
                            },
                            {
                                xtype: 'menuseparator'
                            },
                            {
                                xtype: 'accesskey_menuitem',
                                itemId: 'file_quit',
                                accesskey: 'q',
                                tooltip: 'Ctrl+Q',
                                text: _('Quit')
                            }
                        ]
                    }
                },
                {
                    xtype: 'accesskey_button',
                    text: _('Tools'),
                    itemId: 'tools',
                    accesskey: 't',
                    menu: {
                        xtype: 'menu',
                        items: [
                            {
                                xtype: 'accesskey_menuitem',
                                itemId: 'tools_idevice',
                                accesskey: 'i',
                                text: _('iDevice Editor')
                            },
                            {
                                xtype: 'accesskey_menuitem',
                                itemId: 'tools_stylemanager',
                                accesskey: 's',
                                text: _('Style Manager')
                            },
                            // Style designer
                            {
                                xtype: 'accesskey_menuitem',
                                text: _('Style Designer'),
                                menu: {
                                    xtype: 'menu',
                                    items: [
                                        {
                                            xtype: 'accesskey_menuitem',
                                            itemId: 'style_designer_new_style',
                                            accesskey: 'i',
                                            text: _('Create new Style')
                                        },
                                        {
                                            xtype: 'accesskey_menuitem',
                                            itemId: 'style_designer_edit_style',
                                            text: _('Edit current Style')
                                        }
                                    ]
                                }
                            },
                            // / Style designer							
                            {
                                xtype: 'accesskey_menuitem',
                                itemId: 'tools_preferences',
                                accesskey: 'p',
                                text: _('Preferences')
                            },
                            {
                                xtype: 'accesskey_menuitem',
                                itemId: 'tools_resourcesreport',
                                accesskey: 'r',
                                text: _('Resources Report')
                            },
                            {
                                xtype: 'accesskey_menuitem',
                                itemId: 'tools_preview',
                                accesskey: 'v',
                                text: _('Preview')
                            },
                            {
                                xtype: 'menuseparator'
                            },
                            {
                                xtype: 'accesskey_menuitem',
                                itemId: 'tools_refresh',
                                accesskey: 'r',
                                text: _('Refresh Display')
                            }
							
                        ]
                    }
                },
                {
                    xtype: 'accesskey_button',
                    text: _('Styles'),
                    accesskey: 's',
                    itemId: 'styles_button',
                    menu: {
                        xtype: 'menu',
	                    itemId: 'styles_menu'
                    }
                },
                {
                    xtype: 'accesskey_button',
                    text: _('Help'),
                    itemId: 'help',
                    accesskey: 'h',
                    menu: {
                        xtype: 'menu',
                        items: [
                            {
                                xtype: 'accesskey_menuitem',
                                itemId: 'help_tutorial',
                                accesskey: 't',
                                text: _('eXe Tutorial')
                            },
                            // Task 1080, item 1, jrf
                            // {
                            //    xtype: 'accesskey_menuitem',
                            //    itemId: 'help_manual',
                            //    accesskey: 'm',
                            //    text: _('eXe Manual')
                            // },
                            {
                                xtype: 'accesskey_menuitem',
                                itemId: 'help_notes',
                                accesskey: 'n',
                                text: _('Release Notes')
                            },
                            // jrf - legal notes
                            {
                                xtype: 'accesskey_menuitem',
                                itemId: 'help_legal',
                                accesskey: 'l',
                                text: _('Legal Notes')
                            },
                            {
                                xtype: 'menuseparator'
                            },
                            {
                                xtype: 'accesskey_menuitem',
                                itemId: 'help_website',
                                accesskey: 'w',
                                text: _('eXe Web Site')
                            },
                            {
                                xtype: 'accesskey_menuitem',
                                itemId: 'help_issue',
                                accesskey: 'r',
                                text: _('Report an Issue')
                            },
                            {
                                xtype: 'accesskey_menuitem',
                                itemId: 'help_forums',
                                accesskey: 'f',
                                text: _('eXe Forums')
                            },
                            {
                                xtype: 'menuseparator'
                            },
                            {
                                xtype: 'accesskey_menuitem',
                                itemId: 'help_about',
                                accesskey: 'a',
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
