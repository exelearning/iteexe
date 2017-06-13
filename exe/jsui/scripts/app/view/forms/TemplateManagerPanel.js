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
function createButtonPreExportTemplate(name, template) {
    var buttonExport = {
        xtype: 'button',
        tooltip: _('Export template: ') + name,
        icon: '/images/stock-export.png',
        itemId: 'export_template' + template,
        button_class: 'pre_export_template',
        name: 'export_template' + template,
        style: "margin-right:4px;",
        value: template,
    };
    return buttonExport;
}

function createButtonExportTemplate(name, templaten) {
    var buttonExport = {
        xtype: 'button',
        tooltip: _('Export'),
        icon: '/images/stock-export.png',
        itemId: 'export_template',
        name: 'export_template',
        button_class: 'export_template',
        style: "margin-left:54px;",
        text: _('Export'),
        value: templaten,
    };
    return buttonExport;
}

function createButtonDeleteTemplate(name, template) {
    var buttonDelete = {
        xtype: 'button',
        tooltip: _('Delete template: ') + name,
        icon: '/images/stock-delete.png',
        itemId: 'delete_template' + template,
        name: 'delete_template' + template,
        button_class: 'delete_template',
        style: "margin-right:4px;",
        value: template,
    };
    return buttonDelete;
}

function createButtonPropertiesTemplate(name, template) {
    var buttonProperties = {
        xtype: 'button',
        tooltip: _('Show properties of template: ') + name,
        icon: '/images/info.png',
        itemId: 'properties_template' + template,
        name: 'properties_template' + template,
        button_class: 'properties_template',
        style: "margin-right:4px;",
        value: template,
    };
    return buttonProperties;
}

function createButtonEditTemplate(name, template) {
    var buttonEdit = {
        xtype: 'button',
        tooltip: _('Edit template: ') + name,
        icon: '/images/stock-edit.png',
        itemId: 'edit_template' + template,
        name: 'edit_template' + template,
        button_class: 'edit_template',
        style: "margin-right:4px;",
        value: template,
    };
    return buttonEdit;
}


function createPanelTemplateTemplates(templates) {
    var i;
    var itemsShow = [];
    var panel = [];
    for (i = templates.length - 1; i >= 0; i--) {
        var template = [];
        template[0] = {
            xtype: 'label',
            width: 320,
            margin: '5 5 5 20',
            style: "font-size:105%",
            text: templates[i].name
        };
        if (templates[i].exportButton) {
            template.push(createButtonPreExportTemplate(templates[i].name,
                templates[i].template));
        }
        if (templates[i].deleteButton) {
            template.push(createButtonDeleteTemplate(templates[i].name,
                templates[i].template));
        }
        if (templates[i].propertiesButton) {
            template.push(createButtonPropertiesTemplate(templates[i].name,
                templates[i].template));
        }
        if (templates[i].editButton) {
            template.push(createButtonEditTemplate(templates[i].name,
                templates[i].template));
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
            items: template
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
    var template = {
        xtype: 'field',
        hidden: true,
        itemId: 'template',
        name: 'template'
    };
    itemsShow.push(template);
    panel = [{
        xtype: 'button',
        tooltip: _('Import template to the system '),
        icon: '/images/stock-import.png',
        itemId: 'import_template',
        name: 'import_template',
        text: _('Import template'),
        style: 'float:right;',
        margin: 10,
    }, {
        xtype: 'fieldset',
        title: _("List of templates in your system"),
        margin: 10,
        items: itemsShow
    }];
    return panel;
}

function createPanelTemplateProperties(properties, templaten, mode,
    withbutton) {
    var i;
    var itemsShow = [];
    var txcss = '';
    var ptitle = _("Properties of template: ");
    if (mode) {
        ptitle = ptitle + templaten;
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
        var template = {
            xtype: 'field',
            hidden: true,
            itemId: 'template',
            name: 'template'
        };
        itemsShow.push(template);
    }
    panel = [{
        xtype: 'fieldset',
        title: ptitle,
        margin: 10,
        items: itemsShow
    }, {
        xtype: 'button',
        tooltip: _('Return to template manager'),
        icon: '/images/stock-go-back.png',
        itemId: 'return',
        name: 'return',
        value: 'return',
        margin: 10,
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
        panel.push(createButtonExportTemplate(name, templaten));
    }

    return panel;
}

function createPanelTemplate() {
    var panel = [];

    // The JSON response to this request must have an 'action' field,
    // that determines de panel to be displayed
    Ext.Ajax.request({
        url: 'templatemanager',
        scope: this,
        async: false,
        success: function(response) {
            var json = Ext.JSON.decode(response.responseText);

            if (json.action == 'List') {
                panel = createPanelTemplateTemplates(json.templates);
            } else if (json.action == 'Init') {
                panel = createPanelTemplateTemplates(json.templates);
            } else if (json.action == 'Properties') {
                panel = createPanelTemplateProperties(json.properties,
                    json.template, true, false);
            } else if (json.action == 'PreExport') {
                panel = createPanelTemplateProperties(json.properties,
                    json.template, true, true);
            } else {
                panel = createPanelTemplateTemplates(json.templates);
            }
        }
    });

    // Every panel has an 'action' hidden field, wich value determines
    // the action to be performed in server side on submitting the form.
    // That value should be set by the handler function of the clicked button
    // (see eXe.controller.TemplateManager)
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

Ext.define('eXe.view.forms.TemplateManagerPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.templatemanager',
    initComponent: function() {
        var me = this;
        var panel = createPanelTemplate();
        Ext.applyIf(me, {
            autoScroll: true,
            trackResetOnLoad: true,
            url: 'templatemanager',
            items: panel
        });
        me.callParent(arguments);
        me.doLayout();
    },

    reload: function(action) {
        var panel = {};
        var me = Ext.getCmp("templatemanagerwin").down("form");
        var templatemanager = Ext.getCmp("templatemanagerwin");
        var formpanel = templatemanager.down('form');
        formpanel.removeAll(false);
        panel = createPanelTemplate();
        formpanel.add(panel);
        me.doLayout();
    }

});