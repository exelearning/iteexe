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

Ext.define('eXe.view.forms.PreferencesPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.preferences',

    initComponent: function() {
        var me = this;
		var lngsel=_("Select Browser");
        Ext.applyIf(me, {
            autoScroll: true,
            trackResetOnLoad: true,
            url: 'preferences',
            items: [
                {
                    xtype: 'fieldset',
                    defaults: {
                        labelWidth: 200,
                        anchor: '100%'
                    },
                    margin: 10,
                    items: [
                        {
		                    xtype: 'combobox',
		                    inputId: 'locale',
		                    dirtyCls: 'property-form-dirty',
		                    fieldLabel: _("Select Language"),
                            queryModel: 'local',
                            displayField: 'text',
                            valueField: 'locale',
		                    store: {
                                fields: ['locale', 'text'],
                                proxy: {
	                                type: 'ajax',
							        url: 'preferences',
                                    reader: {
										type: 'json',
										root: 'locales'
									}
							    },
                                autoLoad: true
                            }
		                },{
		                    xtype: 'combobox',
		                    inputId: 'internalAnchors',
		                    dirtyCls: 'property-form-dirty',
		                    fieldLabel: _("Internal Linking (for Web Site Exports only)"),
		                    store: [
                                ["enable_all", _("Enable All Internal Linking")],
                                ["disable_autotop", _("Disable Auto-Top Internal Linking")],
                                ["disable_all", _("Disable All Internal Linking")]
                           ]
						   
		                },{
						
                        xtype: 'container',
                        layout: 'hbox',
						//layout:'column',
						border:1,
						width: '100%',
                        items: [{
                                xtype: 'combobox',
                                inputId: 'browser',
                                id: 'browsersel',
                                dirtyCls: 'property-form-dirty',
								labelWidth: 200,
                                fieldLabel: lngsel,
                                queryModel: 'local',
                                displayField: 'text',
                                valueField: 'browser',
								width:'94%',
                                store: {
                                    fields: ['browser', 'text'],
                                    proxy: {
                                        type: 'ajax',
                                        url: 'preferences',
                                        reader: {
                                            type: 'json',
                                            root: 'browsers'
                                        }
                                    },
                                    autoLoad: true
                                }

                            },{ xtype: 'tbfill' },
							{
                                xtype: 'button',
                                text: '...',
								tooltip: lngsel,
                                margins: {
                                    left: 5
                                },
                                handler: function (button) {
                                    var formpanel = button.up('form'),
                                        form = formpanel.getForm();
                                    var action = form.findField('action');
                                    var filename = form.findField('filename');
                                    var fp = Ext.create("eXe.view.filepicker.FilePicker", {
                                        type: eXe.view.filepicker.FilePicker.modeLoad,
                                        title: lngsel,
                                        modal: true,
                                        scope: this,
                                        callback: function (fp) {
                                            if (fp.status == eXe.view.filepicker.FilePicker.returnOk || fp.status == eXe.view.filepicker.FilePicker.returnReplace)
                                                form.submit({
                                                    success: function () {
                                                        var datnew = {
                                                            browser: fp.file.path,
                                                            text: fp.file.path
                                                        };
                                                        var objbrw = Ext.getCmp('browsersel');
                                                        var numdat = objbrw.store.getCount();
                                                        objbrw.store.insert(numdat, datnew);
                                                        objbrw.select(objbrw.store.getAt(numdat));
                                                        objbrw.doQuery();
                                                    },
                                                    failure: function (form, action) {
                                                        Ext.Msg.alert(_('Error'), action.result.errorMessage);
                                                    }
                                                });
                                        }
                                    });
                                    fp.appendFilters([{
                                        "typename": _("All Files"),
                                        "extension": "*.*",
                                        "regex": /.*$/
                                    }]);
                                    fp.show();
                                },
                                itemId: 'openbrowser'
                            }

                        ]
                    }
                    ]
                },{
                    xtype: 'fieldset',
					title: _('Format'),
                    margin: 10,
                    items: [
                         {
                            xtype: 'helpcontainer',
                            item: {
							xtype: 'combobox',
		                    inputId: 'docType',
		                    dirtyCls: 'property-form-dirty',
		                    fieldLabel: _('Doctype'),
		                    store: [
                                ["XHTML", ("XHTML")],
                                ["HTML5", ("HTML5")]
                           ]						   
                            },
                            flex: 0,
                            help: _('Doctype')+" (DOCTYPE: XHTML/HTML5)"
                        }
						]
                },
                {
                	xtype: 'container',
                	layout: 'hbox',
                	margin: 10,
                	items: [
            	        {
            	        	xtype: 'button',
            	        	text: _('Save'),
            	        	margin: 10,
            	        	handler: function(button) {
            	        		var formpanel = button.up('form'),
            	        		form = formpanel.getForm();
            	        		form.submit({
            	        			success: function() {
            	        		        eXe.app.reload();
            	        			},
            	        			failure: function(form, action) {
            	        				Ext.Msg.alert(_('Error'), action.result.errorMessage);
            	        			}
            	        		});
            	        	},
            	        	itemId: 'save_preferences'
            	        },
            	        {
            	        	xtype: 'component',
            	        	flex: 1
            	        },
            	        {
            	        	xtype: 'checkboxfield',
            	        	margin: 10,
            	        	inputId: 'showPreferencesOnStart',
            	        	inputValue: '1',
                            uncheckedValue: '0',
                            dirtyCls: 'property-form-dirty',
            	        	boxLabelAlign: 'before',
            	        	boxLabel: _('Show this window on eXe start')
            	        }
        	        ]
                }
            ]
        });

        me.callParent(arguments);
    }

});