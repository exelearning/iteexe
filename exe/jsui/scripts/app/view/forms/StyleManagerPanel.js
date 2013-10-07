// ===========================================================================
// eXe
// JR: Panel del gestor de estilos
//===========================================================================

function createButtonExport(name, style) {
	var buttonExport = 
	{
    	xtype: 'button',
    	tooltip: _('Export style: ')+name,
    	icon: '/images/stock-export.png',
        itemId: 'export_style'+style,
        name: 'export_style'+style,
        value: style,
        handler: function(button) {
			var formpanel = button.up('form'),
            form = formpanel.getForm();
            var action = form.findField('action');
            action.setValue('doExport')
            var filename = form.findField('filename');
            var style = form.findField('style');
            style.setValue(button.value);
            var fp = Ext.create("eXe.view.filepicker.FilePicker", {
        		type: eXe.view.filepicker.FilePicker.modeSave,
        		title: _("Export to ZIP Style as"),
        		modal: true,
        		scope: this,
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
	}
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
        value: style,
        handler: function(button) {
			var formpanel = button.up('form'),
            form = formpanel.getForm();
            var action = form.findField('action');
            action.setValue('doDelete')
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
    }
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
            action.setValue('doProperties')
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
    }
	return buttonProperties;
}

function createPanelStyles(styles) {
	var itemsShow = [];
	var panel = {};
	for (i = styles.length-1; i >= 0; i--) {
        //item = Ext.create('Ext.menu.CheckItem', { text: styles[i].label, itemId: styles[i].style, checked: styles[i].selected });
		var style=[];
		style[0] = 
		{ 
        	xtype: 'label', 
        	labelWidth: 'auto',
        	margin: '5 5 5 5',
        	text: styles[i].name
		};
		if (styles[i].exportButton) {
			style.push(createButtonExport(styles[i].name, styles[i].style));
		}
		if (styles[i].deleteButton) {
			style.push(createButtonDelete(styles[i].name, styles[i].style));
		}
		if (styles[i].propertiesButton) {
			style.push(createButtonProperties(styles[i].name, styles[i].style));
		}
		var item =
		{ 
           	xtype: 'container',
            layout: 'hbox',
            margin: '0 0 5 0',
            items: style         
        }
		itemsShow[i] = item;
	}
	var action =
	{ 
       	xtype: 'field',
        hidden: true,
        itemId: 'action',
        name: 'action'
    }
	itemsShow.push(action);
	var filename =
	{ 
       	xtype: 'field',
        hidden: true,
        itemId: 'filename',
        name: 'filename'
	}
	itemsShow.push(filename);
	var style =
	{ 
       	xtype: 'field',
        hidden: true,
        itemId: 'style',
        name: 'style'
	}
	itemsShow.push(style);
	panel = [{
		xtype: 'fieldset',
		title: _("List of styles in your system"),
		margin: 10,
		width: 450,
		items: itemsShow
	} ,	{
    	xtype: 'button',
		tooltip: _('Import style to the system '),
		icon: '/images/stock-import.png',
	    itemId: 'import_style',
		name: 'import_style',
	    text: 'Import style',
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
	}];
	return panel
}

function createPanelProperties(properties, style) {
	var itemsShow = [];
	for (i = 0; i < properties.length; i++) {
		var valueProperty = {}
		//if (properties[i].value.length > 50 || properties[i].value.indexOf('\n') != -1) {
		if (properties[i].value.length > 50) {		
			valueProperty = {
		        xtype: 'textarea',
		        fieldLabel: properties[i].name,
		        name: properties[i].value,
		        value: properties[i].value,
		        grow : true,
		        growMax: 200,
		        growMin: 10,
		        width: 430,
		        readOnly: true,
		        anchor: "100%"
		    }
		}
		else {
			valueProperty = {
 		        xtype: 'textfield',
 		        fieldLabel: properties[i].name,
 		        name: properties[i].value,
 		        value: properties[i].value,
 		        grow : true,
 		        readOnly: true,
 		        anchor: "100%"
 		    }
		}
		var row =
		{ 
           	xtype: 'container',
            layout: 'hbox',
            margin: '0 0 5 0',
            labelWidth: 100,
            items: valueProperty         
        }
		itemsShow.push(row);
		var action =
		{ 
	       	xtype: 'field',
	        hidden: true,
	        itemId: 'action',
	        name: 'action'
	    }
		itemsShow.push(action);
	}
	panel = [{
 		xtype: 'fieldset',
 		title: _("Properties of style: ")+style,
 		margin: 10,
 		items: itemsShow
	} ,	{
    	xtype: 'button',
    	tooltip: _('Return to style manager'),
    	icon: '/images/stock-go-back.png',
        itemId: 'return',
		name: 'return',
		value: 'return',
		margin: 10,
		//cls: 'x-btn-text-icon',
        text: 'Return',
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
    }]
 	return panel
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
			if (json.action == 'Properties') {
				panel = createPanelProperties(json.properties, json.style)
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
        panel = createPanel();
        Ext.applyIf(me, {
            autoScroll: true,
            trackResetOnLoad: true,
            url: 'stylemanager',
            items: panel
        });
        me.callParent(arguments);
        me.doLayout();
    },
    
	reload: function() {
    	var me = Ext.getCmp("stylemanagerwin").down("form");
    	var stylemanager = Ext.getCmp("stylemanagerwin");
    	formpanel = stylemanager.down('form');
	    formpanel.removeAll();
	    panel = createPanel();
	    formpanel.add({
	        autoScroll: true,
	        trackResetOnLoad: true,
	        url: 'stylemanager',
	        items: panel
	    });
	    me.doLayout();
    }
});