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
		                    xtype: 'combobox',
		                    inputId: 'browser',
		                    dirtyCls: 'property-form-dirty',
		                    fieldLabel: _("Select Browser"),
			                queryModel: 'local',
	                        displayField: 'text',
	                        valueField: 'browser',
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
            	        				nevow_clientToServerEvent('reload');
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