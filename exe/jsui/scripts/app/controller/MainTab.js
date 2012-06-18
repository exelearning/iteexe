// ===========================================================================
// eXe
// Copyright 2012, Pedro Peña Pérez, Open Phoenix IT
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

Ext.define('eXe.controller.MainTab', {
    extend: 'Ext.app.Controller',
    refs: [
        {
            selector: '#header_background_img',
            ref: 'headerBackgroundImg'
        },
        {
            selector: '#package_properties',
            ref: 'packagePropertiesPanel'
        },
        {
            selector: '#header_background_show',
            ref: 'headerBackgroundShowButton'
        }
    ],

    init: function() {
        this.control({
            '#package_properties': {
                render: this.onRender,
                beforeaction: this.beforeAction,
                scope: this
            },
            '#metadata_properties': {
                render: this.onRender,
                beforeaction: this.beforeAction
            },
            '#export_properties': {
                render: this.onRender,
                beforeaction: this.beforeAction
            },
            '#apply': {
                click: this.onClickApply
            },
            '#header_background_show': {
                click: this.showHeaderBackground,
                scope: this
            },
            '#header_background_load': {
                click: this.loadHeaderBackground,
                scope: this
            },
            '#header_background_clear': {
                click: this.clearHeaderBackground,
                scope: this
            },
            '#header_background_img': {
                beforerender: this.beforeRenderImg,
                scope: this
            },
            '#update_tree': {
                click: this.updateTree,
                scope: this
            }
        });
    },
    
    updateTree: function() {
        var formpanel = this.getPackagePropertiesPanel(),
            form;
        form = formpanel.getForm();
        form.submit({
            success: function(f, action) {
                this.getController('Outline').reload();
            },
            scope: this
        });
    },
    
    clearHeaderBackground: function() {
        var formpanel = this.getPackagePropertiesPanel(),
            form, field;
        form = formpanel.getForm();
        field = form.findField('pp_backgroundImg');
        field.setValue(null);
        form.submit({
            success: function(f, action) {
                var img = this.getHeaderBackgroundImg(), json,
                    showbutton = this.getHeaderBackgroundShowButton();
                img.setSrc(null);
                img.hide();
                showbutton.setText(_('Show Image'));
                showbutton.hide();
            },
            scope: this
        });
    },
    
    loadHeaderBackground: function() {
        var fp = Ext.create("eXe.view.filepicker.FilePicker", {
            type: eXe.view.filepicker.FilePicker.modeOpen,
            title: _("Select an image"),
            modal: true,
            scope: this,
            callback: function(fp) {
                if (fp.status == eXe.view.filepicker.FilePicker.returnOk) {
                    var formpanel = this.getPackagePropertiesPanel(),
                        form, field;
                    form = formpanel.getForm();
                    field = form.findField('pp_backgroundImg');
                    field.setValue(fp.file.path);
                    form.submit({
                        success: function(f, action) {
                            var img = this.getHeaderBackgroundImg(), json,
                                showbutton = this.getHeaderBackgroundShowButton();
                            json = Ext.JSON.decode(action.response.responseText);
		                    img.setSrc(location.pathname + '/resources/' + json.data.pp_backgroundImg);
		                    img.show();
                            showbutton.setText(_('Hide Image'));
                            showbutton.show();
                        },
                        scope: this
                    });
                }
            }
        });
        fp.appendFilters([
            { "typename": _("Image Files"), "extension": "*.png", "regex": /.*\.(jpg|jpeg|png|gif)$/i },
            { "typename": _("All Files"), "extension": "*.*", "regex": /.*$/ }
        ]);
        fp.show();        
    },
    
    beforeRenderImg: function(img) {
        img.on({
            load: function() {
                this.getPackagePropertiesPanel().doLayout();
            },
            click: this.loadHeaderBackground,
            scope: this,
            element: 'el'
        });
    },
    
    showHeaderBackground: function(button) {
        var img = this.getHeaderBackgroundImg();
        
        if (img.isVisible()) {
            button.setText(_('Show Image'));
            img.hide();
        }
        else {
            button.setText(_('Hide Image'));
            img.show();
        }
    },
    
    onClickApply: function(button) {
	    var form = button.up('form').getForm();
	    if (form.isValid()) {
	        form.submit({ 
	            failure: function(form, action) {
	                Ext.Msg.alert(_('Error'), action.result.errorMessage);
	            }
	        });
	    }
    },
    
    onRender: function(formpanel) {
        formpanel.load({ 
            method: "GET", 
            params: formpanel.getForm().getFieldValues(),
            scope: this,
            success: function(form, action) {
                var imgfield = form.findField('pp_backgroundImg'),
                    showbutton = this.getHeaderBackgroundShowButton();
                if (imgfield && imgfield.value) {
                    var img = this.getHeaderBackgroundImg();
                    img.setSrc(location.pathname + '/resources/' + imgfield.value);
                    img.show();
                    showbutton.setText(_('Hide Image'));
                    showbutton.show();
                }
                else
                    showbutton.hide();
            },
            failure: function(form, action) {
                Ext.Msg.alert(_('Error'), action.result.errorMessage);
            }
        });
    },
    
    beforeAction: function(form, action, eOpts) {
        form.url = location.pathname + "/properties";
    }
});