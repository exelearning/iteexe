// ===========================================================================
// eXe
// JR: Panel del gestor de estilos
// FM: Export with new config.xml
//===========================================================================
function prexml(title,value,mode) {
    var datt = '';
    if (title != '') {
        if ((value != 'undefined')&&(value!='')) {
            value = subcom(value);
            if (mode) {
                datt='<'+ title + '><![CDATA[' + value + ']]></' + title + '>\n';
            }
            else {
                datt='<'+ title + '>' + value + '</' + title + '>\n';
            }
        }
    }
    return datt;
}
function htmlxml(text) {
    return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function subcom(text) {
    return text
    .replace(/'/g, '"');
}
function parseXML(val) {
    if (document.implementation && document.implementation.createDocument) {
        xmlDoc = new DOMParser().parseFromString(val, 'text/xml');
    }
    else if (window.ActiveXObject) {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.loadXML(val);
    }
    else {
        return null;
    }
    return xmlDoc;
}

function xmlcreate(items,types) {
    var l = items.length;
    var valxml = '<?xml version="1.0"?>\n';
    valxml += '<theme>\n\r';
    for (var a = 0; a < l; a++){
        if (types[a] == 1) {
            valxml += prexml(items[a],document.getElementsByName(items[a])[0].value,true);
        }
        else {
            valxml += prexml(items[a],htmlxml(document.getElementsByName(items[a])[0].value),false);
        }
    }
    valxml += '</theme>';
    
    return valxml;
}
function createButtonPreExport(name, style) {
    var buttonExport = 
    {
        xtype: 'button',
        tooltip: _('Export style: ')+name,
        icon: '/images/stock-export.png',
        itemId: 'export_style'+style,
        button_class: 'pre_export_style',
        name: 'export_style'+style,
        style:"margin-right:4px;",
        value: style,
    };
    return buttonExport;
}
function createButtonExport(name, stylen, xmlitems, lngitems) {
    var buttonExport = 
    {
        xtype: 'button',
        tooltip: _('Export'),
        icon: '/images/stock-export.png',
        itemId: 'export_style',
        name: 'export_style',
        button_class: 'export_style',
        style:"margin-left:54px;",
        text: _('Export'),
        value: stylen,
    };
    return buttonExport;
}
function createButtonDelete(name, style) {
    var buttonDelete =
    {
        xtype: 'button',
        tooltip: _('Delete style: ')+name,
        icon: '/images/stock-delete.png',
        itemId: 'delete_style'+style,
        name: 'delete_style'+style,
        button_class: 'delete_style',
        style:"margin-right:4px;",
        value: style,
    };
    return buttonDelete;
}

function createButtonProperties(name, style) {
    var buttonProperties =
    {
        xtype: 'button',
        tooltip: _('Show properties of style: ')+name,
        icon: '/images/info.png',
        itemId: 'properties_style'+style,
        name: 'properties_style'+style,
        button_class: 'properties_style',
        value: style,
    };
    return buttonProperties;
}

function createPanelStyles(styles) {
    var i;
    var itemsShow = [];
    var panel = {};
    for (i = styles.length-1; i >= 0; i--) {
        //item = Ext.create('Ext.menu.CheckItem', { text: styles[i].label, itemId: styles[i].style, checked: styles[i].selected });
        var style=[];
        style[0] = 
        { 
            xtype: 'label',
            width: 320,
            margin: '5 5 5 20',
            style:"font-size:105%",
            text: styles[i].name
        };
        if (styles[i].exportButton) {
            style.push(createButtonPreExport(styles[i].name, styles[i].style));
        }
        if (styles[i].deleteButton) {
            style.push(createButtonDelete(styles[i].name, styles[i].style));
        }
        if (styles[i].propertiesButton) {
            style.push(createButtonProperties(styles[i].name, styles[i].style));
        }
        var estilo = "";
        if (i%2 == 0) {
            estilo = 'padding-top:5px; background-color: #FFF;';
        } 
        else {
            estilo = 'padding-top:5px; background-color: #FAFAFA; border-top-color: #B5B8C8; border-bottom-color: #B5B8C8; border-top-style:solid; border-bottom-style: solid; border-top-width:1px; border-bottom-width: 1px;';
        }
        
        var item =
        { 
            xtype: 'container',
            layout: 'hbox',
            margin: '0 0 5 0',
            style: estilo,
            items: style
        };
        itemsShow[i] = item;
    }
    var filename =
    { 
        xtype: 'field',
        hidden: true,
        itemId: 'filename',
        name: 'filename'
    };
    itemsShow.push(filename);
    var style =
    { 
        xtype: 'field',
        hidden: true,
        itemId: 'style',
        name: 'style'
    };
    itemsShow.push(style);
    panel = [
        {
            xtype: 'button',
            tooltip: _('Import style to the system '),
            icon: '/images/stock-import.png',
            itemId: 'import_style',
            name: 'import_style',
            text: _('Import style'),
            style:'float:right;',
            margin: 10,
        },
        {
            xtype: 'button',
            text: _('Styles repository'),
            tooltip: _('Search and download new styles from the styles repository'),
            icon: '/images/stock-import.png',
            itemId: 'styles_repository',
            name: 'styles_repository',
            style:'float:right;',
            margin: 10,
        },
        {
            xtype: 'fieldset',
            title: _("List of styles in your system"),
            margin: 10,
            items: itemsShow
        } 
    ];
    return panel;
}

function createPanelProperties(properties, stylen,mode,withbutton) {
    var i;
    var itemsShow = [];
    var xmlitems=[];
    var lngitems=[];
    var txcss='';
    var ptitle=_("Properties of style: ");
    if (mode) {
        ptitle=ptitle+stylen;
        txcss="border:solid 1px #C0C0C0;box-shadow:none;background-image:none;background-color:#CCFFFF;";
    }
    else {
        ptitle=ptitle+'('+properties[0].value+')';
    }
    for (i = 0; i < properties.length; i++) {
        var valueProperty = {};
        xmlitems.push(properties[i].nxml);
        lngitems.push(properties[i].format);
        if (properties[i].value!='') {
            if (properties[i].format==1) {        
                valueProperty = {
                    xtype: 'textarea',
                    fieldLabel: properties[i].name,
                    name: properties[i].nxml,
                    value: properties[i].value,
                    grow : true,
                    growMax: 200,
                    growMin: 10,
                    width: 420,
                    maxHeight:80,
                    readOnly: mode,
                    fieldStyle:txcss,
                    anchor: "100%"
                };
            }
            else {
                valueProperty = {
                    xtype: 'textfield',
                    fieldLabel: properties[i].name,
                    name: properties[i].nxml,
                    value: properties[i].value,
                    grow : true,
                    width: 420,
                    readOnly: mode,
                    fieldStyle:txcss,
                    anchor: "100%"
                 };
            }
            
            var row =
            { 
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 5 0',
                labelWidth: 100,
                items: valueProperty         
            };
            itemsShow.push(row);
        }
        var xdata =
        { 
            xtype: 'field',
            hidden: true,
            itemId: 'xdata',
            name: 'xdata',
            value:'',
        };
        itemsShow.push(xdata);
        var filename =
        { 
            xtype: 'field',
            hidden: true,
            itemId: 'filename',
            name: 'filename'
        };
        itemsShow.push(filename);
        var style =
        { 
            xtype: 'field',
            hidden: true,
            itemId: 'style',
            name: 'style'
        };
        itemsShow.push(style);
    }
    panel = [
        {
            xtype: 'fieldset',
            title: ptitle,
            margin: 10,
            items: itemsShow
        },
        {
            xtype: 'button',
            tooltip: _('Return to style manager'),
            icon: '/images/stock-go-back.png',
            itemId: 'return',
            name: 'return',
            value: 'return',
            margin: 10,
            //cls: 'x-btn-text-icon',
            text: _('Return'),
            handler: function(button) {
                var formpanel = button.up('form'),
                form = formpanel.getForm();
                var action = form.findField('action');
                action.setValue('doList');
                form.submit({
                    success: function() {
                        //formpanel.reload();
                    },
                    failure: function(form, action) {
                        Ext.Msg.alert(_('Error'), action.result.errorMessage);
                    }
                });
            }
        }
    ];
    if (withbutton){
        panel.push(createButtonExport(name, stylen,xmlitems,lngitems));
    }
    
    return panel;
}

function createPanelStylesRepository() {
    var title=_("Download style from URL");
    var itemsImportStyle = [
        { 
            xtype: 'textfield',
            itemId: 'style_import_url',
            name: 'style_import_url',
            fieldLabel: _('URL'),
            tooltip: _('URL to download the style from.'),
        },
        {
            xtype: 'button',
            text: _('Import Style from URL'),
            tooltip: _('Download style from URL and import into system.'),
            itemId: 'style_import_from_url',
            name: 'style_import_from_url',
            icon: '/images/stock-import.png',
            style:'float:left;',
            margin: 10,
        },
    ];
    panel = [
        {
            xtype: 'fieldset',
            title: title,
            margin: 10,
            items: itemsImportStyle,
        },
        {
            xtype: 'button',
            text: _('Return'),
            tooltip: _('Return to style manager'),
            icon: '/images/stock-go-back.png',
            itemId: 'return_styles_list',
            name: 'return_styles_list',
            margin: 10,
        }
    ];
    
    return panel;
}

function createPanel() {
    var panel = {};
    
    // The JSON response to this request must have an 'action' field,
    // that determines de panel to be displayed
    Ext.Ajax.request({
        url: 'stylemanager',
        scope: this,
        async: false,
        success: function(response) {
            var json = Ext.JSON.decode(response.responseText);
            if (json.action == 'List') {
                panel = createPanelStyles(json.styles);
            }
            else if (json.action == 'Init') {
                panel = createPanelStyles(json.styles);
            }
            else if (json.action == 'Properties') {
                //createPanelProperties(json.properties, json.style,read only,with button export)
                panel = createPanelProperties(json.properties, json.style,true,false);
            }
            else if (json.action == 'PreExport') {
                panel = createPanelProperties(json.properties, json.style,true,true);
            }
            else if (json.action == 'StylesRepository') {
                panel = createPanelStylesRepository();
            }
            else {
                panel = createPanelStyles(json.styles);
            }
        }
    });

    // Every panel has an 'action' hidden field, wich value determines
    // the action to be performed in server side on submitting the form.
    // That value should be set by the handler function of the clicked button
    // (see eXe.controller.StyleManager)
    // This is NOT the value that would be returned in the JSON response
    //    * 'action' hidden field in form:      client --> server
    //    * 'action' field in JSON response:    server --> client
    var action =
    { 
        xtype: 'field',
        hidden: true,
        itemId: 'action',
        name: 'action',
        value: '',
    };
    panel.push(action);
    return panel;
};


Ext.define('eXe.view.forms.StyleManagerPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.stylemanager',
    initComponent: function() {    
        var me = this;
        var panel=createPanel();
        Ext.applyIf(me, {
            autoScroll: true,
            trackResetOnLoad: true,
            url: 'stylemanager',
            items: panel        
        });
        me.callParent(arguments);
        me.doLayout();        
    },
    
    reload: function(action) {
        var panel={};
        var me = Ext.getCmp("stylemanagerwin").down("form");
        var stylemanager = Ext.getCmp("stylemanagerwin");
        var formpanel = stylemanager.down('form');
        formpanel.removeAll(false);
        panel =  createPanel();
        formpanel.add(panel);
        me.doLayout();
    }
});
