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

    initComponent: function () {
        var me = this;
        var lngsel = _("Select Browser");
        Ext.applyIf(me, {
            autoScroll: true,
            trackResetOnLoad: true,
            url: 'preferences',
            bodyPadding: 4,
            items: [{
                xtype: 'tabpanel',
                height: 250,
                activeTab: 0,
                plain: true,
                items: [
					// Tab 0
					{
						title: _('General Settings'),
						bodyPadding: 10,
						items: [{
							xtype: 'combobox',
							inputId: 'locale',
							dirtyCls: 'property-form-dirty',
							fieldLabel: _("Select Language"),
							labelWidth: 130,
							margin: 10,
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
						}, {

							xtype: 'container',
							layout: 'hbox',
                            hidden: eXe.app.config.server,
							//layout:'column',
							border: 1,
							margin: 10,
							width: '94%',
							items: [{
									xtype: 'combobox',
									inputId: 'browser',
									id: 'browsersel',
									dirtyCls: 'property-form-dirty',
									labelWidth: 130,
									fieldLabel: lngsel,
									queryModel: 'local',
									displayField: 'text',
									valueField: 'browser',
									width: '92%',
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

								}, {
									xtype: 'tbfill'
								}, {
									xtype: 'button',
									text: '...',
									tooltip: lngsel,
									margins: {
										//left: 5,
										right: 10
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
						}]
					}, 
					// /Tab0
					//Tab1
					{
						title: _('Advanced'),
						bodyPadding: 10,
						items: [
							// Document Format
							{
								xtype: 'helpcontainer',
								item: {
									xtype: 'combobox',
									inputId: 'docType',
									dirtyCls: 'property-form-dirty',
									labelWidth: 250,
									fieldLabel: _('Default format for the new documents'),
									store: [
										["XHTML", ("XHTML")],
										["HTML5", ("HTML5")]
									],
									style: {
										//marginBottom: '10px'
									}								
								},
								margin: 10,
								help: _('The current document format can be modified in the Properties tab')
							},
							// TinyMCE mode
							{
								xtype: 'helpcontainer',
								item: {
									xtype: 'combobox',
									inputId: 'editorMode',
									dirtyCls: 'property-form-dirty',
									labelWidth: 250,
									fieldLabel: _('Editor mode'),
									store: [
										["permissive", _("Permissive")],
										["strict", _("Strict")]
									],
									style: {
										//marginBottom: '10px'
									}
								},
								margin: 10,
								help: _('"Permissive" will allow any markup. "Strict" will allow only valid markup: It will remove any invalid code, even HTML5 tags (except VIDEO and AUDIO) when using XHTML format.')
							},
							// TinyMCE version
							{
								xtype: 'helpcontainer',
								item: {
									xtype: 'combobox',
									inputId: 'editorVersion',
									dirtyCls: 'property-form-dirty',
									labelWidth: 250,
									fieldLabel: _('Editor version'),
									store: [
										["3", "TinyMCE 3" ],
										["4", "TinyMCE 4 (" + _("recommended") + ")" ]
									],
									style: {
										//marginBottom: '10px'
									}
								},
								margin: 10,
								help: _('We recommend you to use the latest available version. An old one could be useful to edit some old contents.')
							},
							// Internal anchors
							{
								xtype: 'combobox',
								inputId: 'internalAnchors',
								dirtyCls: 'property-form-dirty',
								fieldLabel: _("Internal Linking (for Web Site Exports only)"),
								labelWidth: 250,
								width:465,
								store: [
									["enable_all", _("Enable All Internal Linking")],
									["disable_autotop", _("Disable Auto-Top Internal Linking")],
									["disable_all", _("Disable All Internal Linking")]
								],
								margin: 10
							},
							{
								xtype: 'helpcontainer',
								item: {
									xtype: 'combobox',
									inputId: 'defaultLicense',
									dirtyCls: 'property-form-dirty',
									fieldLabel: _("Default license for the new documents"),
									labelWidth: 350,
									labelAlign:'top',
									queryModel: 'local',
									displayField: 'text',
									valueField: 'licenseName',
									store: {
										fields: ['licenseName','text'],
										proxy: {
											type: 'ajax',
											url: 'preferences',
											reader: {
												type: 'json',
												root: 'licensesNames'
											}
										},
										autoLoad: true
									},
								},
								margin: 10,
								help: _('The current document license can be modified in the Properties tab.')								
							}
						]
					},
					// /Tab1
				],
            }, {
                xtype: 'container',
                layout: 'hbox',
                style: {
					marginTop: '10px'
				},			
                items: [{
                    xtype: 'button',
                    text: _('Save'),
                    handler: function (button) {
                        var formpanel = button.up('form'),
                            form = formpanel.getForm();
                        form.submit({
                            success: function () {
                                nevow_clientToServerEvent('reload');
                            },
                            failure: function (form, action) {
                                Ext.Msg.alert(_('Error'), action.result.errorMessage);
                            }
                        });
                    },
                    itemId: 'save_preferences'
                }, {
                    xtype: 'component',
                    flex: 1
                }, {
                    xtype: 'checkboxfield',
                    //margin: 10,
                    inputId: 'showPreferencesOnStart',
                    inputValue: '1',
                    uncheckedValue: '0',
                    dirtyCls: 'property-form-dirty',
                    boxLabelAlign: 'before',
                    boxLabel: _('Show this window on eXe start')
                }]
            }]


        });

        me.callParent(arguments);
    }

});
