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
        name: 'export_style'+style,
        style:"margin-right:4px;",
        value: style,
        handler: function(button) {
            var formpanel = button.up('form'),
                form = formpanel.getForm();
            var action = form.findField('action');
                action.setValue('doPreExport');
            var style = form.findField('style');
                style.setValue(button.value);
            form.submit({
                success: function() {
                    //formpanel.reload();
                },
                failure: function(form, action) {
                    Ext.Msg.alert(_('Error'), action.result.errorMessage);
                }
            });
            
        }
    };
    return buttonExport;
}
function createButtonExport(name, stylen,xmlitems,lngitems) {
    var buttonExport = 
    {
        xtype: 'button',
        tooltip: _('Export'),
        icon: '/images/stock-export.png',
        itemId: 'export_style',
        name: 'export_style',
        style:"margin-left:54px;",
        text: _('Export'),
        value: stylen,
        handler: function(button) {
            var formpanel = button.up('form'),
            form = formpanel.getForm();
            var action = form.findField('action');
            action.setValue('doExport');
            var filename = form.findField('filename');
            var style = form.findField('style');
            style.setValue(stylen);
            /* for export with new xonfig.xml
            var xdata = form.findField('xdata');
            xdata.setValue(xmlcreate(xmlitems,lngitems));
            */
            var namefilexport=stylen;
            if (namefilexport!='') namefilexport+='.zip';            
            var fp = Ext.create("eXe.view.filepicker.FilePicker", {
                type: eXe.view.filepicker.FilePicker.modeSave,
                title: _("Export to ZIP Style as"),
                modal: true,
                scope: this,
                prefilename:namefilexport,
                callback: function(fp) {
                    if (fp.status == eXe.view.filepicker.FilePicker.returnOk || fp.status == eXe.view.filepicker.FilePicker.returnReplace)
                        filename.setValue(fp.file.path);
                        form.submit({
                            success: function() {
                                //formpanel.reload();
                            },
                            failure: function(form, action) {
                                Ext.Msg.alert(_('Error'), action.result.errorMessage);
                            }
                        });
                    }
            });
            fp.appendFilters([
                { "typename": _("ZipFile"), "extension": "*.zip", "regex": /.*\.zip$/ },
                { "typename": _("All Files"), "extension": "*.*", "regex": /.*$/ }
            ]);
            fp.show();
           
           
        }
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
        style:"margin-right:4px;",
        value: style,
        handler: function(button) {
            var formpanel = button.up('form'),
            form = formpanel.getForm();
            var action = form.findField('action');
            action.setValue('doDelete');
            var style = form.findField('style');
            style.setValue(button.value);
            Ext.Msg.show({
                title: _("Delete style?"),
                msg: _("Do you want to delete this style?"),
                scope: this,
                modal: true,
                buttons: Ext.Msg.YESNOCANCEL,
                fn: function(button, text, opt) {
                    if (button == "yes") {
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
            });
        }
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
        value: style,
        handler: function(button) {
            var formpanel = button.up('form'),
            form = formpanel.getForm();
            var action = form.findField('action');
            action.setValue('doProperties');
            var style = form.findField('style');
            style.setValue(button.value);
            form.submit({
                success: function() {
                    //formpanel.reload();
                },
                failure: function(form, action) {
                    Ext.Msg.alert(_('Error'), action.result.errorMessage);
                }
            });
        }
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
    var action =
    { 
        xtype: 'field',
        hidden: true,
        itemId: 'action',
        name: 'action'
    };
    itemsShow.push(action);
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
             xtype: 'textfield',
             itemId: 'style_download_url',
             name: 'style_download_url',
             fieldLabel: _('URL'),
             tooltip: _('URL to download the style from.'),
         },
         {
              xtype: 'button',
              itemId: 'style_download',
              text: _('Download Style'),
              tooltip: _('Download style from URL and import into system.'),
              icon: '/images/stock-import.png',
              style:'float:left;',
              margin: 10,
        },
        {
            xtype: 'button',
            tooltip: _('Import style to the system '),
            icon: '/images/stock-import.png',
            itemId: 'import_style',
            name: 'import_style',
            text: _('Import style'),
            style:'float:right;',
            margin: 10,
            handler: function(button) {
                var formpanel = button.up('form'),
                form = formpanel.getForm();
                var action = form.findField('action');
                action.setValue('doImport');
                var filename = form.findField('filename');
                var fp = Ext.create("eXe.view.filepicker.FilePicker", {
                    type: eXe.view.filepicker.FilePicker.modeOpen,
                    title: _("Select ZIP Style file to import."),
                    modal: true,
                    scope: this,
                    callback: function(fp) {
                        if (fp.status == eXe.view.filepicker.FilePicker.returnOk || fp.status == eXe.view.filepicker.FilePicker.returnReplace) {
                            filename.setValue(fp.file.path);
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
                });
                fp.appendFilters([
                   { "typename": _("ZIP Style"), "extension": "*.zip", "regex": /.*\.zip$/ },
                   { "typename": _("All Files"), "extension": "*.*", "regex": /.*$/ }
                ]);
                fp.show();
            }
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
        var action =
        { 
            xtype: 'field',
            hidden: true,
            itemId: 'action',
            name: 'action',
            value:'',
        };
        itemsShow.push(action);
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

function createPanel() {
    var panel = {};
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
            //createPanelProperties(json.properties, json.style,read only,with button export)
                panel = createPanelProperties(json.properties, json.style,true,true);
            }
            else {
                panel = createPanelStyles(json.styles);
            }
        }
    });            
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
    
    reload: function(n) {
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
