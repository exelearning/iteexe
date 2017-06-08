// ===========================================================================
// eXeLearning
// Copyright 2017, CeDeC
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
function createButtonPreExportJsIdevice(name, jsidevice) {
    var buttonExport = {
        xtype: 'button',
        tooltip: _('Export jsidevice: ') + name,
        icon: '/images/stock-export.png',
        itemId: 'export_jsidevice' + jsidevice,
        button_class: 'pre_export_jsidevice',
        name: 'export_jsidevice' + jsidevice,
        style: "margin-right:4px;",
        value: jsidevice,
    };
    return buttonExport;
}

function createButtonExportJsIdevice(name, jsidevicen) {
    var buttonExport = {
        xtype: 'button',
        tooltip: _('Export'),
        icon: '/images/stock-export.png',
        itemId: 'export_jsidevice',
        name: 'export_jsidevice',
        button_class: 'export_jsidevice',
        style: "margin-left:54px;",
        text: _('Export'),
        value: jsidevicen,
    };
    return buttonExport;
}

function createButtonDeleteJsIdevice(name, jsidevice) {
    var buttonDelete = {
        xtype: 'button',
        tooltip: _('Delete jsidevice: ') + name,
        icon: '/images/stock-delete.png',
        itemId: 'delete_jsidevice' + jsidevice,
        name: 'delete_jsidevice' + jsidevice,
        button_class: 'delete_jsidevice',
        style: "margin-right:4px;",
        value: jsidevice,
    };
    return buttonDelete;
}

function createButtonPropertiesJsIdevice(name, jsidevice) {
    var buttonProperties = {
        xtype: 'button',
        tooltip: _('Show properties of jsidevice: ') + name,
        icon: '/images/info.png',
        itemId: 'properties_jsidevice' + jsidevice,
        name: 'properties_jsidevice' + jsidevice,
        button_class: 'properties_jsidevice',
        value: jsidevice,
    };
    return buttonProperties;
}

function createPanelJsIdeviceJsIdevices(jsidevices) {
    var i;
    var itemsShow = [];
    var panel = [];
    for (i = jsidevices.length - 1; i >= 0; i--) {
        var jsidevice = [];
        jsidevice[0] = {
            xtype: 'label',
            width: 320,
            margin: '5 5 5 20',
            style: "font-size:105%",
            text: jsidevices[i].name
        };
        if (jsidevices[i].exportButton) {
            jsidevice.push(createButtonPreExportJsIdevice(jsidevices[i].name,
                jsidevices[i].jsidevice));
        }
        if (jsidevices[i].deleteButton) {
            jsidevice.push(createButtonDeleteJsIdevice(jsidevices[i].name,
                jsidevices[i].jsidevice));
        }
        if (jsidevices[i].propertiesButton) {
            jsidevice.push(createButtonPropertiesJsIdevice(jsidevices[i].name,
                jsidevices[i].jsidevice));
        }
        var estilo = "";
        if (i % 2 == 0) {
            estilo = 'padding-top:5px; background-color: #FFF;';
        } else {
            estilo = 'padding-top:5px; background-color: #FAFAFA; border-top-color: #B5B8C8; border-bottom-color: #B5B8C8; border-top-style:solid; border-bottom-style: solid; border-top-width:1px; border-bottom-width: 1px;';
        }

        var item = {
            xtype: 'container',
            layout: 'hbox',
            margin: '0 0 5 0',
            style: estilo,
            items: jsidevice
        };
        itemsShow[i] = item;
    }
    var filename = {
        xtype: 'field',
        hidden: true,
        itemId: 'filename',
        name: 'filename'
    };
    itemsShow.push(filename);
    var jsidevice = {
        xtype: 'field',
        hidden: true,
        itemId: 'jsidevice',
        name: 'jsidevice'
    };
    itemsShow.push(jsidevice);
    panel = [{
        xtype: 'button',
        tooltip: _('Import jsidevice to the system '),
        icon: '/images/stock-import.png',
        itemId: 'import_jsidevice',
        name: 'import_jsidevice',
        text: _('Import jsidevice'),
        style: 'float:right;',
        margin: 10,
    }, {
        xtype: 'fieldset',
        title: _("List of jsidevices in your system"),
        margin: 10,
        items: itemsShow
    }];
    return panel;
}

function createPanelJsIdeviceProperties(properties, jsidevicen, mode,
    withbutton) {
    var i;
    var itemsShow = [];
    var txcss = '';
    var ptitle = _("Properties of jsidevice: ");
    if (mode) {
        ptitle = ptitle + jsidevicen;
        txcss = "border:solid 1px #C0C0C0;box-shadow:none;background-image:none;background-color:#CCFFFF;";
    } else {
        ptitle = ptitle + '(' + properties[0].value + ')';
    }
    for (i = 0; i < properties.length; i++) {
        var valueProperty = {};
        if (properties[i].value != '') {
            if (properties[i].format == 1) {
                valueProperty = {
                    xtype: 'textarea',
                    fieldLabel: properties[i].name,
                    name: properties[i].nxml,
                    value: properties[i].value,
                    grow: true,
                    growMax: 200,
                    growMin: 10,
                    width: 420,
                    maxHeight: 80,
                    readOnly: mode,
                    fieldStyle: txcss,
                    anchor: "100%"
                };
            } else {
                valueProperty = {
                    xtype: 'textfield',
                    fieldLabel: properties[i].name,
                    name: properties[i].nxml,
                    value: properties[i].value,
                    grow: true,
                    width: 420,
                    readOnly: mode,
                    fieldStyle: txcss,
                    anchor: "100%"
                };
            }

            var row = {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                labelWidth: 100,
                items: valueProperty
            };
            itemsShow.push(row);
        }
        var filename = {
            xtype: 'field',
            hidden: true,
            itemId: 'filename',
            name: 'filename'
        };
        itemsShow.push(filename);
        var jsidevice = {
            xtype: 'field',
            hidden: true,
            itemId: 'jsidevice',
            name: 'jsidevice'
        };
        itemsShow.push(jsidevice);
    }
    panel = [{
        xtype: 'fieldset',
        title: ptitle,
        margin: 10,
        items: itemsShow
    }, {
        xtype: 'button',
        tooltip: _('Return to jsidevice manager'),
        icon: '/images/stock-go-back.png',
        itemId: 'return',
        name: 'return',
        value: 'return',
        margin: 10,
        // cls: 'x-btn-text-icon',
        text: _('Return'),
        handler: function(button) {
            var formpanel = button.up('form'),
                form = formpanel.getForm();
            var action = form.findField('action');
            action.setValue('doList');
            form.submit({
                success: function() {
                    // formpanel.reload();
                },
                failure: function(form, action) {
                    Ext.Msg.alert(_('Error'), action.result.errorMessage);
                }
            });
        }
    }];
    if (withbutton) {
        panel.push(createButtonExportJsIdevice(name, jsidevicen));
    }

    return panel;
}

function createPanelJsIdevice() {
    var panel = [];

    // The JSON response to this request must have an 'action' field,
    // that determines de panel to be displayed
    Ext.Ajax.request({
        url: 'jsidevicemanager',
        scope: this,
        async: false,
        success: function(response) {
            var json = Ext.JSON.decode(response.responseText);

            if (json.action == 'List') {
                panel = createPanelJsIdeviceJsIdevices(json.jsidevices);
            } else if (json.action == 'Init') {
                panel = createPanelJsIdeviceJsIdevices(json.jsidevices);
            } else if (json.action == 'Properties') {
                panel = createPanelJsIdeviceProperties(json.properties,
                    json.jsidevice, true, false);
            } else if (json.action == 'PreExport') {
                panel = createPanelJsIdeviceProperties(json.properties,
                    json.jsidevice, true, true);
            } else {
                panel = createPanelJsIdeviceJsIdevices(json.jsidevices);
            }
        }
    });

    // Every panel has an 'action' hidden field, wich value determines
    // the action to be performed in server side on submitting the form.
    // That value should be set by the handler function of the clicked button
    // (see eXe.controller.JsIdeviceManager)
    // This is NOT the value that would be returned in the JSON response
    // * 'action' hidden field in form: client --> server
    // * 'action' field in JSON response: server --> client
    var action = {
        xtype: 'field',
        hidden: true,
        itemId: 'action',
        name: 'action',
        value: '',
    };
    panel.push(action);
    return panel;
};

Ext.define('eXe.view.forms.JsIdeviceManagerPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.jsidevicemanager',
    initComponent: function() {
        var me = this;
        var panel = createPanelJsIdevice();
        Ext.applyIf(me, {
            autoScroll: true,
            trackResetOnLoad: true,
            url: 'jsidevicemanager',
            items: panel
        });
        me.callParent(arguments);
        me.doLayout();
    },

    reload: function(action) {
        var panel = {};
        var me = Ext.getCmp("jsidevicemanagerwin").down("form");
        var jsidevicemanager = Ext.getCmp("jsidevicemanagerwin");
        var formpanel = jsidevicemanager.down('form');
        formpanel.removeAll(false);
        panel = createPanelJsIdevice();
        formpanel.add(panel);
        me.doLayout();
    }

});