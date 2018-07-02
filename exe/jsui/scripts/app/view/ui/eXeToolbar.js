// ===========================================================================
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
        var me = this, pat, rep, key, keymap, html, parts, txt, instructions;
		
		html = me.text;
		parts = html.split('<span ');
		txt = parts[0];
		instructions = "";
		if (parts.length==2) instructions = '<span '+parts[1];

        if (me.accesskey) {
            pat = new RegExp(me.accesskey,'i');
            key = pat.exec(txt);
            if (key) {
	            rep = "<u>" + key + "</u>";
	            me.text = txt.replace(pat, rep) + instructions;
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

        function getSRhelp(str){
            if (!str) var str = _("use the right arrow key");
            return '<span class="exe-sr-only"> ('+str+')</span>'
        }

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
                                text: _('New') + getSRhelp(),
                                accesskey: 'n',
                                menu: {
                                    xtype: 'menu',
	                                itemId: 'file_new_menu',
                                    items: [
                                        {
                                            xtype: 'accesskey_menuitem',
                                            text: _('Project'),
                                            accesskey: 'd',
                                            tooltip: 'Ctrl+Alt+D',
                                            itemId: 'file_new'
                                        },
                                        {
                                            cls: 'exe-advanced',
                                            xtype: 'accesskey_menuitem',
                                            text: _('Window'),
                                            accesskey: 'w',
                                            tooltip: 'Ctrl+Alt+W',
                                            itemId: 'file_new_window'
                                        },
                                        {
                                            xtype: 'accesskey_menuitem',
                                            text: _('Templates') + getSRhelp(),
                                            itemId: 'templates_button',
                                            menu: {
                                                xtype: 'menu',
                                                itemId: 'templates_menu'
                                            }
                                        }
                                    ]
                                }
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
                                text: _('Recent Projects...') + getSRhelp(),
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
                                text: _('Templates') + getSRhelp(),
                                menu: {
                                    xtype: 'menu',
	                                itemId: 'templates_options_menu',
                                    items: [
                                        {
                                            xtype: 'accesskey_menuitem',
                                            text: _('Save as template'),
                                            itemId: 'template_save'
                                        },
                                        {
                                            xtype: 'accesskey_menuitem',
                                            itemId: 'tools_templatemanager',
                                            text: _('Manage')
                                        }
                                    ]
                                }
                            },
                            {
								xtype: 'menuseparator'
                            },
                            {
                                xtype: 'accesskey_menuitem',
                                text: _('Export') + getSRhelp(),
                                accesskey: 'e',
                                menu: {
                                    xtype: 'menu',
                                    items: [
                                        {
                                	    xtype: 'accesskey_menuitem',
                                            cls: 'exe-advanced',
                                            text: _('Educational Standard') + getSRhelp(),
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
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            cls: 'exe-advanced',
                                            xtype: 'accesskey_menuitem',
                                            text: _('Web Site') + getSRhelp(),
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
                                            	    }
                                                ]
                                            }
                                        },
                                        {
                                            cls: 'exe-advanced',
                                            xtype: 'accesskey_menuitem',
                                            text: _('Text File'),
                                            accesskey: 't',
                                            itemId: 'file_export_text'
                                        },
                                        {
                                            cls: 'exe-advanced',
                                            xtype: 'accesskey_menuitem',
                                            text: _('XLIFF'),
                                            accesskey: 'x',
                                            itemId: 'file_export_xliff'
                                        },
                                        {
                                            cls: 'exe-simplified',
                                            xtype: 'accesskey_menuitem',
                                            text: _('Web Site'),
                                            accesskey: 't',
                                            itemId: 'file_export_website_b'
                                        },
                                        {
                                            cls: 'exe-simplified',
                                            xtype: 'accesskey_menuitem',
                                            text: _('Single Page'),
                                            accesskey: 't',
                                            itemId: 'file_export_singlepage_b'
                                        },
                                        {
                                            xtype: 'accesskey_menuitem',
                                            text: _('EPUB3'),
                                            accesskey: '3',
                                            itemId: 'file_export_epub3'
                                        },
                                        {
                                            cls: 'exe-simplified',
                                            xtype: 'accesskey_menuitem',
                                            text: _('SCORM'),
                                            accesskey: 't',
                                            itemId: 'file_export_scorm'
                                        },
                                        {
                                            cls: 'exe-simplified',
                                            xtype: 'accesskey_menuitem',
                                            text: _('IMS'),
                                            accesskey: 'i',
                                            itemId: 'file_export_ims'
                                        }
                                    ]
                                }
                            },
                            {
                                cls: 'exe-advanced',
                                xtype: 'accesskey_menuitem',
                                text: _('Publish') + getSRhelp(),
                                itemId: 'publish',
                                accesskey: 'l',
                                menu: {
                                    xtype: 'menu',
                                    items:
                                    [
                                        {
                                            xtype: 'accesskey_menuitem',
                                            text: _('Procomún'),
                                            accesskey: 'P',
                                            itemId: 'file_export_procomun'
                                        },
                                    ]
                                },
                            },
                            {
                                cls: 'exe-advanced',
                                xtype: 'menuseparator'
                            },
                            {
                                cls: 'exe-advanced',
                                xtype: 'accesskey_menuitem',
                                text: _('Import') + getSRhelp(),
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
			                                text: _('Metadata') + getSRhelp(),
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
                                cls: 'exe-advanced',
                                xtype: 'accesskey_menuitem',
                                text: _('Merging') + getSRhelp(),
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
                                itemId: 'tools_preferences',
                                accesskey: 'p',
                                text: _('Preferences')
                            },
                            {
                                xtype: 'accesskey_menuitem',
                                itemId: 'tools_preview',
                                accesskey: 'v',
                                text: _('Preview')
                            },
                            {
                                cls: 'exe-advanced',
                                xtype: 'menuseparator'
                            },
                            {
                            	cls: 'exe-advanced',
                                xtype: 'accesskey_menuitem',
                                itemId: 'tools_stylemanager',
                                accesskey: 's',
                                text: _('Style Manager')
                            },
                            // Style designer
                            {
                                cls: 'exe-advanced',
                                xtype: 'accesskey_menuitem',
                                text: _('Style Designer') + getSRhelp(),
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
                                cls: 'exe-advanced',
                                xtype: 'accesskey_menuitem',
                                itemId: 'tools_idevice',
                                accesskey: 'i',
                                text: _('iDevice Editor')
                            },
                            {
                                cls: 'exe-advanced',
                                xtype: 'accesskey_menuitem',
                                itemId: 'tools_resourcesreport',
                                accesskey: 'r',
                                text: _('Resources Report')
                            },
                            {
                                cls: 'exe-advanced',
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
                    cls: 'exe-simplified',
                    xtype: 'accesskey_button',
                    text: _('Help'),
                    accesskey: 'h',
                    itemId: 'help_assistant_simplified'
                },
                {
                    cls: 'exe-advanced',
                    xtype: 'accesskey_button',
                    text: _('Help'),
                    itemId: 'help',
                    accesskey: 'h',
                    menu: {
                        xtype: 'menu',
                        items: [
                            {
                                xtype: 'accesskey_menuitem',
                                itemId: 'help_assistant',
                                accesskey: 'a',
                                text: _('Assistant')
                            },
                            {
                                xtype: 'menuseparator'
                            },
                            {
                                xtype: 'accesskey_menuitem',
                                itemId: 'help_tutorial',
                                id: 'help_tutorial_link',
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
                                id: 'help_notes_link',
                                accesskey: 'n',
                                text: _('Release Notes')
                            },
                            // jrf - legal notes
                            {
                                xtype: 'accesskey_menuitem',
                                itemId: 'help_legal',
                                id: 'help_legal_link',
                                accesskey: 'l',
                                text: _('Legal Notes')
                            },
                            {
                                xtype: 'menuseparator'
                            },
                            {
                                xtype: 'accesskey_menuitem',
                                itemId: 'help_website',
                                id: 'help_website_link',
                                accesskey: 'w',
                                text: _('eXe Web Site')
                            },
                            {
                                xtype: 'accesskey_menuitem',
                                itemId: 'help_issue',
                                id: 'help_issue_link',
                                accesskey: 'r',
                                text: _('Report an Issue')
                            },
                            {
                                xtype: 'accesskey_menuitem',
                                itemId: 'help_forums',
                                id: 'help_forums_link',
                                accesskey: 'f',
                                text: _('eXe Forums')
                            },
                            {
                                xtype: 'menuseparator'
                            },
                            {
                                xtype: 'accesskey_menuitem',
                                itemId: 'help_about',
                                id: 'help_about_link',
                                accesskey: 'a',
                                text: _('About eXe')
                            }
                        ]
                    }
                },
                // Advanced user
                {
                    xtype: 'fieldcontainer',
					defaultType: 'checkboxfield',
					margin: '0 0 0 30',
					items: [
                        {
                            boxLabel: _('Advanced user'),
                            tooltip: _('Checking this option will show more elements in the menus (File, Tools...) and the Properties tab.'),
                            name: 'advanced_toggler',
                            inputValue: '1',
                            id: 'advanced_toggler',
                            // checked: true,
							listeners : {
                                change: function(e, newValue) {

									var descriptionLabel = Ext.DomQuery.select("label[for=pp_description]");

									if (newValue==true) {
										if (!Ext.util.Cookies.get('eXeUIversion')) {
											Ext.Msg.alert(
												_('Info'),
												_('Checking this option will show more elements in the menus (File, Tools...) and the Properties tab.')
											);
										}
										Ext.util.Cookies.set('eXeUIversion', 'advanced');
										Ext.select("BODY").removeCls('exe-simplified');
										Ext.select("BODY").addCls('exe-advanced');
										// Change some strings:
										if (descriptionLabel && descriptionLabel.length==1) descriptionLabel[0].innerHTML = _("General") + ":";
                                    } else {
										Ext.util.Cookies.set('eXeUIversion', 'simplified');
                                        Ext.select("BODY").removeCls('exe-advanced');
										Ext.select("BODY").addCls('exe-simplified');
										// Change some strings:
										if (descriptionLabel && descriptionLabel.length==1) descriptionLabel[0].innerHTML = _("General description") + ":";
										// Show Properties - Package
										var e1 = document.getElementById("eXePropertiesTab");
										if (e1) {
											var e2 = e1.getElementsByTagName("button");
											for (var i=0;i<e2.length;i++){
												if (e2[i].className=="x-tab-center") {
													var span = e2[i].getElementsByTagName("span");
													if (span.length==2 && span[0].innerHTML==_("Package")) e2[i].click();
												}
											}
										}
                                    }
									// Refresh some components
									try {
										Ext.getCmp("exe-viewport").doLayout();
									} catch(e) {}
                                }
                            }
                        }
                    ]
                }
                // / Advanced user
            ]
        });

        me.callParent(arguments);

		// Advanced user
		// Get the cookie or set the default value (simplified)
		var eXeUIversion = Ext.util.Cookies.get('eXeUIversion');
		if (!eXeUIversion) eXeUIversion = 'simplified';
		// Check the Advanced option or add the simplified class to the BODY tag
		if (eXeUIversion=='advanced') {
			Ext.getCmp("advanced_toggler").setValue(true);
		} else {
			Ext.select("BODY").addCls('exe-simplified');
		}
		// / Advanced user
    }
});


// Save reminder (#287)
Ext.define('eXeSaveReminder', {
    singleton: true,
	delay: eXe.app.config.autosaveTime, // Minutes
    isOpen: false,    
	init: function() {
        Ext.util.Cookies.clear('eXeSaveReminderPreference');
        if (eXeSaveReminder.delay == 0) {
            Ext.util.Cookies.set('eXeSaveReminderPreference', 'doNotWarn');
        }
        var eXeSaveReminderCookie = Ext.util.Cookies.get('eXeSaveReminderPreference');
		if (eXeSaveReminderCookie && eXeSaveReminderCookie=='doNotWarn') return;

		if (!eXeSaveReminderCookie) Ext.util.Cookies.set('eXeSaveReminderPreference', 'warn');
        eXeSaveReminder.checkDirty();
    },
    checkDirty: function (dirty){
        setTimeout(function(){
            eXe.app.getController('Toolbar').checkDirty('eXeSaveReminder.checkDirty()', 'eXeSaveReminder.showWarnWindow()');
        }, 5000);

    },
    showWarnWindow: function () {
        setTimeout(function() {eXeSaveReminder.warn()}, (eXeSaveReminder.delay * 60 * 1000));
    },
	warn: function() {     
		
		if (eXeSaveReminder.isOpen == true) return;
		
		var hasWindow = false;
		var allWindows = Ext.ComponentQuery.query('window');	    	

	    Ext.each(allWindows, function(win) {
	    	if (win.isVisible() && !win.collapsed) {
	    		hasWindow = true;
	    		return false;
	    	}
	    });
	    
	    if(!hasWindow){			
                
	    	var eXeSaveReminderCookie = Ext.util.Cookies.get('eXeSaveReminderPreference');
	    	if (eXeSaveReminderCookie && eXeSaveReminderCookie=='doNotWarn') return;

	    	eXeSaveReminder.isOpen = true;

	    	Ext.MessageBox.show({
	    		title: _("Warning!"),
	    		msg: _("You've been working for a long time without saving.") + '<br /><br />' + _("Do you want to save now?") + '<br /><br /><label for="hide_eXeSaveReminder"><input type="checkbox" id="hide_eXeSaveReminder" /> '+_("Hide until the application is closed")+'</label>',
	    		buttons: Ext.MessageBox.OKCANCEL,
	    		fn: function(btn) {
	    			if( btn == 'ok') {
	    				if (document.getElementById("hide_eXeSaveReminder").checked){
	    					Ext.util.Cookies.set('eXeSaveReminderPreference', 'doNotWarn');
	    				}
	    				// Save
	    				eXe.app.getController('Toolbar').fileSave();
	    			}
	    			eXeSaveReminder.isOpen = false;
	    			eXeSaveReminder.checkDirty();
	    		}
	    	});
	    }
	    else{
	    	
	    	eXeSaveReminder.isOpen = false;
			eXeSaveReminder.checkDirty();	    
	    }
	    	
	}
});
Ext.onReady(eXeSaveReminder.init, eXeSaveReminder);