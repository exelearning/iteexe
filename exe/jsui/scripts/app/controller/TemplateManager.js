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
Ext
    .define(
        'eXe.controller.TemplateManager', {
            extend: 'Ext.app.Controller',

            requires: ['eXe.view.forms.TemplateManagerPanel'],

            init: function() {
                this
                    .control({
                        '#return_templates_list': {
                            click: function(element, record, item,
                                index, e, eOpts) {
                                this.triggerActionTemplate(
                                    element, 'doList');
                            },
                        },

                        '#import_template': {
                            click: function(element, record, item,
                                index, e, eOpts) {
                                this
                                    .triggerImportTemplate(element);
                            }
                        },
                        'button[button_class=properties_template]': {
                            click: function(element, record, item,
                                index, e, eOpts) {
                                this.triggerActionOnTemplate(
                                    element, 'doProperties');
                            },
                        },
                        'button[button_class=pre_export_template]': {
                            click: function(element, record, item,
                                index, e, eOpts) {
                                this.triggerActionOnTemplate(
                                    element, 'doPreExport');
                            },
                        },
                        'button[button_class=export_template]': {
                            click: function(element, record, item,
                                index, e, eOpts) {
                                this
                                    .triggerExportTemplate(element);
                            }
                        },
                        'button[button_class=delete_template]': {
                            click: function(element, record, item,
                                index, e, eOpts) {

                                if (typeof(element.itemId) != 'undefined' &&
                                    typeof(exe_template) != 'undefined') {
                                    var currenttemplate = exe_template
                                        .split("/");
                                    if (currenttemplate.length == 4) {
                                        currenttemplate = currenttemplate[2];
                                        var selectedtemplate = element.itemId
                                            .replace(
                                                "delete_template",
                                                "");
                                        if (currenttemplate == selectedtemplate) {
                                            Ext.Msg
                                                .alert(
                                                    _('Error'),
                                                    _('Cannot access directory named '));
                                            return;
                                        }
                                    }
                                }

                                this
                                    .triggerDeleteTemplate(element);
                            }
                        },
                        
                        'button[button_class=edit_template]': {
                            click: function(element, record, item,
                                index, e, eOpts) {
                                this
                                    .triggerEditTemplate(element);
                            }
                        },

                    });
            },

            
            
            /**
             * Set the value of the hidden field 'action' and submit
             * form to server
             * 
             * @param element
             *            Clicked element of the WebUI
             * @param actionString
             *            Value to be set on the 'action' hidden field.
             *            Determines the action to be performed in the
             *            server side
             */
            triggerActionTemplate: function(element, actionString) {
                var formpanel = element.up('form');
                var form, action;

                form = formpanel.getForm();
                action = form.findField('action');
                action.setValue(actionString);
                form.submit({
                    success: function() {
                        // formpanel.reload();
                    },
                    failure: function(form, action) {
                        Ext.Msg.alert(_('Error'),
                            action.result.errorMessage);
                    },
                });
            },

            
            
            /**
             * Set the value of the hidden fields 'action' and
             * 'template', and submit form to server
             * 
             * @param element
             *            Clicked element of the WebUI
             * @param actionString
             *            Value to be set on the 'action' hidden field.
             *            Determines the action to be performed in the
             *            server side
             */
            triggerActionOnTemplate: function(element, actionString) {

                var formpanel = element.up('form');
                var form, action, template;

                form = formpanel.getForm();

                action = form.findField('action');
                template = form.findField('template');

                action.setValue(actionString);
                template.setValue(element.value);
                form.submit({
                    success: function() {
                        // formpanel.reload();
                    },
                    failure: function(form, action) {
                        Ext.Msg.alert(_('Error'),
                            action.result.errorMessage);
                    }
                });
            },

            
            
            /**
             * Open FilePicker window to select ELT file, set 'action',
             * and 'template' fields and submit form
             * 
             * @param button
             *            Clicked button
             */
            triggerImportTemplate: function(button) {
                var formpanel = button.up('form'),
                    form = formpanel.getForm(),
                    action = form.findField('action'),
                    filename = form.findField('filename');
                var fp = Ext
                    .create(
                        "eXe.view.filepicker.FilePicker", {
                            type: eXe.view.filepicker.FilePicker.modeOpen,
                            title: _("Select ELT template file to import."),
                            modal: true,
                            scope: this,
                            callback: function(fp) {
                                if (fp.status == eXe.view.filepicker.FilePicker.returnOk ||
                                    fp.status == eXe.view.filepicker.FilePicker.returnReplace) {
                                    filename.setValue(fp.file.path);
                                    form
                                        .submit({
                                            success: function() {
                                                // formpanel.reload();
                                            },
                                            failure: function(
                                                form,
                                                action) {
                                                Ext.Msg
                                                    .alert(
                                                        _('Error'),
                                                        action.result.errorMessage);
                                            }
                                        });
                                }
                            }
                        });

                action.setValue('doImport');
                fp.appendFilters([{
                    "typename": _("ELT template"),
                    "extension": "*.elt",
                    "regex": /.*\.elt$/
                }, {
                    "typename": _("All Files"),
                    "extension": "*.*",
                    "regex": /.*$/
                }]);
                fp.show();
            },

            
            
            /**
             * Open FilePicker window to select ZIP file, set 'action',
             * 'filename' and 'template' fields and submit form
             * 
             * @param button
             *            Clicked button, its value is the name of the
             *            selected template
             */
            triggerExportTemplate: function(button) {

                // Open a File Picker window, to let the user chose the
                // target ELT file
                // set 'action' field value to 'doImport', 'filename' to
                // the selected file path,
                // 'template' to the clicked template and submit form
                // to server
                var formpanel = button.up('form'),
                    form = formpanel.getForm(),
                    action = form.findField('action'),
                    filename = form.findField('filename'),
                    template = form.findField('template'),
                    namefilexport = button.value;

                action.setValue('doExport');
                template.setValue(button.value);

                var fp = Ext
                    .create(
                        "eXe.view.filepicker.FilePicker", {
                            type: eXe.view.filepicker.FilePicker.modeSave,
                            title: _("Export to ZIP template as"),
                            modal: true,
                            scope: this,
                            prefilename: '',
                            callback: function(fp) {
                                if (fp.status == eXe.view.filepicker.FilePicker.returnOk ||
                                    fp.status == eXe.view.filepicker.FilePicker.returnReplace)
                                    filename
                                    .setValue(fp.file.path);
                                form
                                    .submit({
                                        success: function() {
                                            // formpanel.reload();
                                        },
                                        failure: function(
                                            form,
                                            action) {
                                            Ext.Msg
                                                .alert(
                                                    _('Error'),
                                                    action.result.errorMessage);
                                        }
                                    });
                            }
                        });
                fp.appendFilters([{
                    "typename": _("ELT template"),
                    "extension": "*.elt",
                    "regex": /.*\.elt$/
                }, {
                    "typename": _("All Files"),
                    "extension": "*.*",
                    "regex": /.*$/
                }]);
                fp.show();
            },

            
            
            /**
             * Set 'action' and 'template' fields values and submit
             * form
             * 
             * @param button
             *            Clicked button, its value is the name of the
             *            selected template
             */
            triggerDeleteTemplate: function(button) {
                // Open a confirmation window. If user confirms the
                // deletion,
                // set 'action' field value to 'doDelete', 'template'
                // to the clicked template
                // and submit form to server
                var formpanel = button.up('form'),
                    form = formpanel.getForm(),
                    action = form.findField('action'),
                    template = form.findField('template');

                action.setValue('doDelete');
                template.setValue(button.value);
                Ext.Msg
                    .show({
                        title: _("Delete template?"),
                        msg: _("Do you want to delete this template?"),
                        scope: this,
                        modal: true,
                        buttons: Ext.Msg.YESNOCANCEL,
                        fn: function(button, text, opt) {
                            if (button == "yes") {
                                form
                                    .submit({
                                        success: function() {
                                            // formpanel.reload();
                                        },
                                        failure: function(
                                            form, action) {
                                            Ext.Msg
                                                .alert(
                                                    _('Error'),
                                                    action.result.errorMessage);
                                        }
                                    });
                            }
                        }
                    });
            },
            
            triggerEditTemplate: function(button) {
            	
                var formpanel = button.up('form'),
                    form = formpanel.getForm(),
                    action = form.findField('action'),
                    filename = form.findField('filename'),
                    template = form.findField('template'),
                    namefilexport = button.value;

                action.setValue('doEdit');
                template.setValue(button.value);
                
                form.submit({
                    success: function() {
                        // formpanel.reload();
                    },
                    failure: function(form, action) {
                        Ext.Msg.alert(_('Error'),
                            action.result.errorMessage);
                    },
                });

            },

        });