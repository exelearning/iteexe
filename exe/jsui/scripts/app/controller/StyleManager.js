// ===========================================================================
// eXe
Ext.define('eXe.controller.StyleManager', {
    extend: 'Ext.app.Controller',
    
    requires: ['eXe.view.forms.StyleManagerPanel'],
    
    init: function() {
        this.control({
            '#return_styles_list': {
                click:  function (element, record, item, index, e, eOpts) {
                    this.triggerAction(element, 'doList');
                },
            },
            '#styles_repository': {
                click:  function (element, record, item, index, e, eOpts) {
                    this.triggerAction(element, 'doStylesRepository');
                },
            },
            '#style_import_from_url': {
                click:  function (element, record, item, index, e, eOpts) {
                    this.triggerAction(element, 'doStyleImportURL');
                },
            },
            '#import_style' : {
                click: function(element, record, item, index, e, eOpts) {
                    this.triggerImportStyle(element);
                }
            },
            // Actions performed on styles can be triggered by multiple buttons (one for each style), 
            // so they cannot be selected by id, but by the custom attribute 'button_class'
            'button[button_class=properties_style]': {
                click:  function(element, record, item, index, e, eOpts) {
                    this.triggerActionOnStyle(element, 'doProperties');
                },
            },
            'button[button_class=pre_export_style]': {
                click:  function (element, record, item, index, e, eOpts) {
                    this.triggerActionOnStyle(element, 'doPreExport');
                },
            },
            'button[button_class=export_style]': {
                click: function(element, record, item, index, e, eOpts) {
                    this.triggerExportStyle(element);
                }
            },
            'button[button_class=delete_style]': {
                click:  function(element, record, item, index, e, eOpts) {
                    this.triggerDeleteStyle(element);
                }
            },
            // There is an 'Import style' button for each style in the repository styles list
            'button[button_class=repository_style_import]' : {
                click: function(element, record, item, index, e, eOpts) {
                    this.triggerImportRepositoryStyle(element);
                }
            },
        });
    },
    
    /**
     * Set the value of the hidden field 'action' and submit form to server
     * 
     * @param element        Clicked element of the WebUI
     * @param actionString   Value to be set on the 'action' hidden field.
     *                       Determines the action to be performed in the server side
     */
    triggerAction: function(element, actionString) {
        var formpanel = element.up('form');
        var form, action;
        
        form = formpanel.getForm();
        action = form.findField('action');
        action.setValue(actionString);
        form.submit({
            success: function() {
                //formpanel.reload();
            },
            failure: function(form, action) {
                Ext.Msg.alert(_('Error'), action.result.errorMessage);
            },
        });
    },

    /**
     * Set the value of the hidden fields 'action' and 'style', and submit form to server
     * 
     * @param element        Clicked element of the WebUI
     * @param actionString   Value to be set on the 'action' hidden field.
     *                       Determines the action to be performed in the server side
     */
    triggerActionOnStyle: function(element, actionString) {
        var formpanel = element.up('form');
        var form, action, style;
        
        form = formpanel.getForm();
        action = form.findField('action');
        style = form.findField('style');
        
        action.setValue(actionString);
        style.setValue(element.value);
        form.submit({
            success: function() {
                //formpanel.reload();
            },
            failure: function(form, action) {
                Ext.Msg.alert(_('Error'), action.result.errorMessage);
            }
        });
    },
    
    /**
     * Open FilePicker window to select ZIP file, set 'action', and 'style' fields and submit form
     * 
     * @param button  Clicked button
     */
    triggerImportStyle: function(button) {
        var formpanel = button.up('form'),
            form = formpanel.getForm(),
            action = form.findField('action'),
            filename = form.findField('filename');
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
        
        action.setValue('doImport');
        fp.appendFilters([
            { "typename": _("ZIP Style"), "extension": "*.zip", "regex": /.*\.zip$/ },
            { "typename": _("All Files"), "extension": "*.*", "regex": /.*$/ }
        ]);
        fp.show();
    },

    /**
     * Open FilePicker window to select ZIP file, set 'action', 'filename' and 'style' fields and submit form
     * 
     * @param button  Clicked button, its value is the name of the selected style
     */
    triggerExportStyle: function(button) {
        // Open a File Picker window, to let the user chose the target ZIP file
        // set 'action' field value to 'doImport', 'filename' to the selected file path,
        // 'style' to the clicked style and submit form to server
        var formpanel = button.up('form'),
            form = formpanel.getForm(),
            action = form.findField('action'),
            filename = form.findField('filename'),
            style = form.findField('style'),
            namefilexport = button.value;
        
        action.setValue('doExport');
        style.setValue(button.value);
        
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
    },

    /**
     * Set 'action' and 'style' fields values and submit form
     * 
     * @param button  Clicked button, its value is the name of the selected style
     */
    triggerDeleteStyle: function(button) {
        // Open a confirmation window. If user confirms the deletion,
        // set 'action' field value to 'doDelete', 'style' to the clicked style
        // and submit form to server
        var formpanel = button.up('form'),
            form = formpanel.getForm(),
            action = form.findField('action'),
            style = form.findField('style');
        
        action.setValue('doDelete');
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
    },

    /**
     * Set 'action' and 'style' fields values and submit form
     * 
     * @param button  Clicked button, its value is the name of the repository style to be imported
     */
    triggerImportRepositoryStyle: function(button) {
        // Set 'action' field value to 'doStyleImportRepository',
        // 'style_name' to the clicked style and submit form to server
        var formpanel = button.up('form');
        var form = formpanel.getForm();
        console.log(form);
        var action = form.findField('action');
        console.log(action);
        var style_name = form.findField('style_name');
        console.log(style_name);
        
        action.setValue('doStyleImportRepository');
        style_name.setValue(button.value);
        form.submit({
            success: function() {
                //formpanel.reload();
            },
            failure: function(form, action) {
                Ext.Msg.alert(_('Error'), action.result.errorMessage);
            }
        });
    },
});