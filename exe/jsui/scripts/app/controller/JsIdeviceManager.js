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
        'eXe.controller.JsIdeviceManager', {
            extend: 'Ext.app.Controller',

            requires: ['eXe.view.forms.JsIdeviceManagerPanel'],

            init: function() {
                this
                    .control({
                        '#return_jsidevices_list': {
                            click: function(element, record, item,
                                index, e, eOpts) {
                                this.triggerActionJsIdevice(
                                    element, 'doList');
                            },
                        },

                        '#import_jsidevice': {
                            click: function(element, record, item,
                                index, e, eOpts) {
                                this
                                    .triggerImportJsIdevice(element);
                            }
                        },
                        // Actions performed on jsidevices can be
                        // triggered by multiple buttons (one for
                        // each jsidevice),
                        // so they cannot be selected by id, but by
                        // the custom attribute 'button_class'
                        'button[button_class=properties_jsidevice]': {
                            click: function(element, record, item,
                                index, e, eOpts) {
                                this.triggerActionOnJsIdevice(
                                    element, 'doProperties');
                            },
                        },
                        'button[button_class=pre_export_jsidevice]': {
                            click: function(element, record, item,
                                index, e, eOpts) {
                                this.triggerActionOnJsIdevice(
                                    element, 'doPreExport');
                            },
                        },
                        'button[button_class=export_jsidevice]': {
                            click: function(element, record, item,
                                index, e, eOpts) {
                                this
                                    .triggerExportJsIdevice(element);
                            }
                        },
                        'button[button_class=delete_jsidevice]': {
                            click: function(element, record, item,
                                index, e, eOpts) {

                                if (typeof(element.itemId) != 'undefined' &&
                                    typeof(exe_jsidevice) != 'undefined') {
                                    var currentjsidevice = exe_jsidevice
                                        .split("/");
                                    if (currentjsidevice.length == 4) {
                                        currentjsidevice = currentjsidevice[2];
                                        var selectedjsidevice = element.itemId
                                            .replace(
                                                "delete_jsidevice",
                                                "");
                                        if (currentjsidevice == selectedjsidevice) {
                                            Ext.Msg
                                                .alert(
                                                    _('Error'),
                                                    _('Cannot access directory named '));
                                            return;
                                        }
                                    }
                                }

                                this
                                    .triggerDeleteJsIdevice(element);
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
            triggerActionJsIdevice: function(element, actionString) {
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
             * 'jsidevice', and submit form to server
             * 
             * @param element
             *            Clicked element of the WebUI
             * @param actionString
             *            Value to be set on the 'action' hidden field.
             *            Determines the action to be performed in the
             *            server side
             */
            triggerActionOnJsIdevice: function(element, actionString) {

                var formpanel = element.up('form');
                var form, action, jsidevice;

                form = formpanel.getForm();

                action = form.findField('action');
                jsidevice = form.findField('jsidevice');

                action.setValue(actionString);
                jsidevice.setValue(element.value);
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
             * Open FilePicker window to select ZIP file, set 'action',
             * and 'jsidevice' fields and submit form
             * 
             * @param button
             *            Clicked button
             */
            triggerImportJsIdevice: function(button) {
                var formpanel = button.up('form'),
                    form = formpanel.getForm(),
                    action = form.findField('action'),
                    filename = form.findField('filename');
                var fp = Ext
                    .create(
                        "eXe.view.filepicker.FilePicker", {
                            type: eXe.view.filepicker.FilePicker.modeOpen,
                            title: _("Select ZIP jsidevice file to import."),
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
                    "typename": _("ZIP jsidevice"),
                    "extension": "*.zip",
                    "regex": /.*\.zip$/
                }, {
                    "typename": _("All Files"),
                    "extension": "*.*",
                    "regex": /.*$/
                }]);
                fp.show();
            },

            /**
             * Open FilePicker window to select ZIP file, set 'action',
             * 'filename' and 'jsidevice' fields and submit form
             * 
             * @param button
             *            Clicked button, its value is the name of the
             *            selected jsidevice
             */
            triggerExportJsIdevice: function(button) {

                // Open a File Picker window, to let the user chose the
                // target ZIP file
                // set 'action' field value to 'doImport', 'filename' to
                // the selected file path,
                // 'jsidevice' to the clicked jsidevice and submit form
                // to server
                var formpanel = button.up('form'),
                    form = formpanel
                    .getForm(),
                    action = form.findField('action'),
                    filename = form
                    .findField('filename'),
                    jsidevice = form
                    .findField('jsidevice'),
                    namefilexport = button.value;

                action.setValue('doExport');
                jsidevice.setValue(button.value);

                if (namefilexport != '')
                    namefilexport += '.zip';
                var fp = Ext
                    .create(
                        "eXe.view.filepicker.FilePicker", {
                            type: eXe.view.filepicker.FilePicker.modeSave,
                            title: _("Export to ZIP jsidevice as"),
                            modal: true,
                            scope: this,
                            prefilename: namefilexport,
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
                    "typename": _("ZipFile"),
                    "extension": "*.zip",
                    "regex": /.*\.zip$/
                }, {
                    "typename": _("All Files"),
                    "extension": "*.*",
                    "regex": /.*$/
                }]);
                fp.show();
            },

            /**
             * Set 'action' and 'jsidevice' fields values and submit
             * form
             * 
             * @param button
             *            Clicked button, its value is the name of the
             *            selected jsidevice
             */
            triggerDeleteJsIdevice: function(button) {
                // Open a confirmation window. If user confirms the
                // deletion,
                // set 'action' field value to 'doDelete', 'jsidevice'
                // to the clicked jsidevice
                // and submit form to server
                var formpanel = button.up('form'),
                    form = formpanel
                    .getForm(),
                    action = form.findField('action'),
                    jsidevice = form
                    .findField('jsidevice');

                action.setValue('doDelete');
                jsidevice.setValue(button.value);
                Ext.Msg
                    .show({
                        title: _("Delete jsidevice?"),
                        msg: _("Do you want to delete this jsidevice?"),
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

        });