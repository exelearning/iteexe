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
        },
        {
            selector: '#outline_treepanel',
            ref: 'outlineTreePanel'
        }
    ],

    init: function() {
        this.control({
            '#main_tab': {
                tabchange: this.onTabChange
            },
            '#metadata_tab': {
                tabchange: this.onTabChange
            },
            '#properties_tab': {
                tabchange: this.onTabChange
            },
            '#package_properties': {
                beforeaction: this.beforeAction,
                actioncomplete: this.actionComplete,
                scope: this
            },
            '#dublincoredata_properties': {
                beforeaction: this.beforeAction,
                actioncomplete: this.actionComplete
            },
            '#export_properties': {
                beforeaction: this.beforeAction,
                actioncomplete: this.actionComplete
            },
            '#lomdata_properties': {
                beforeaction: this.beforeAction,
                actioncomplete: this.actionComplete
            },
            '#lomesdata_properties': {
                beforeaction: this.beforeAction,
                actioncomplete: this.actionComplete
            },
            '#save_properties': {
                click: this.onClickSave
            },
            '#clear_properties': {
                click: this.onClickClear
            },
            '#reset_properties': {
                click: this.onClickReset
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
            },
            '#sources_download': {
                click: this.sourcesDownload
            }
        });
    },
//    msg: false,
//    onAfterRender: function(a, b){
//      	console.log('afterRender');
//      	if (this.msg){
//            this.msg.close();
//      	}

//    },
//    onBeforeRender: function(a, b){
//    	//this.msg = Ext.Msg.alert('Status', 'Loading data ...');
//    	console.log('beforeRender');
//    },
//    onBeforeShow: function(a, b){
//    	console.log('beforeShow');
//    },
//    onAfterLayout: function(a, b){
//    	console.log('afterLayout');
//    },
//    beforeAction: function(a, b){
//    	console.log('beforeaction');
//    },
    actionComplete: function(form, action) {
        if (action.method != "GET") {
        	form.setValues(form.getFieldValues(true));
//        }else{
//        	console.log('actioncomplete');
//        	var lom = action.result.data.lom_general_title_string1;
//            if (lom){
//            	//this.on('afterrender', this.extendForm, this, [form, action]);
//            	this.extendForm(form, action);            
//            }
        }
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
        if (field) {
        	field.setValue(null);
        	form.submit({
        		success: function(f, action) {
        			var img = this.getHeaderBackgroundImg(),
        				showbutton = this.getHeaderBackgroundShowButton();
        			img.setSrc(null);
        			img.hide();
        			showbutton.setText(_('Show Image'));
        			showbutton.hide();
        		},
        		scope: this
        	});
        }
    },
    
    loadHeaderBackground: function() {
        var fp = Ext.create("eXe.view.filepicker.FilePicker", {
            type: eXe.view.filepicker.FilePicker.modeOpen,
            title: _("Select an image"),
            remote: true,
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
    
    onClickSave: function(button) {
	    var formpanel = button.up('form'),
            form = formpanel.getForm();
	    if (form.isValid()) {
	        Ext.Msg.wait(_('Please wait...'));       
	        form.submit({ 
                success: function(form, action) {
                    Ext.MessageBox.hide();
                    Ext.MessageBox.alert("", _('Settings Saved'));
                    if (formpanel.itemId == 'package_properties') {
                        var formclear = function(formpanel) {
                            formpanel.clear();
                        };
                        Ext.iterate(formpanel.up().query('lomdata'), formclear);
                        if ((form.getFieldValues(true).pp_lang)||(form.getFieldValues(true).pp_newlicense)) {
                            var authoring = Ext.ComponentQuery.query('#authoring')[0].getWin();
                            if (authoring && authoring.submitLink) {
                            	var outlineTreePanel = eXe.app.getController("Outline").getOutlineTreePanel(),
                                	selected = outlineTreePanel.getSelectionModel().getSelection();
                    	        authoring.submitLink("changeNode", selected !== 0? selected[0].data.id : '0');
                            }
                        }
                    }
                },
	            failure: function(form, action) {
	                Ext.MessageBox.hide();
                    Ext.Msg.alert(_('Error'), action.result.errorMessage);
	            }
	        });
	    }
        else {
        	Ext.Msg.alert(_('Error'), _('The form contains invalid fields. Please check back.'));
        	if (formpanel.expandParents) {
        		form.getFields().each(function(field){
        			if (!field.validate())
        				formpanel.expandParents(field, true);
        		});
        	}
        }
    },
    
    onClickClear: function(cbutton) {
    	Ext.Msg.show( {
			title: _('Confirm'),
			msg: _('Are you sure you want clear all form fields?'),
			scope: this,
			modal: true,
			buttons: Ext.Msg.YESNO,
			fn: function(button) {
				if (button == "yes") {
					var formpanel = cbutton.up('form'),
				    	form = formpanel.getForm();
					
					if (formpanel.xtype != 'lomdata' &&
						formpanel.xtype != 'lomesdata') {
						form.getFields().each( function(field) {
							if (field.xtype == 'radiogroup')
								field.down('radio').setValue(true);
							else if (field.inputId == 'pp_lang')
								field.setValue(eXe.app.config.lang);
							else
								field.setValue('');
						});
					}
					form.submit({
						clientValidation: false,
						params: {
							clear: true
						},
						success: function() {
							var formclear = function(formpanel) {
								formpanel.clear();
							};
							if (formpanel == this.getPackagePropertiesPanel()) {
								var img = this.getHeaderBackgroundImg(),
			        				showbutton = this.getHeaderBackgroundShowButton();
			        			img.setSrc(null);
			        			img.hide();
			        			showbutton.setText(_('Show Image'));
			        			showbutton.hide();
							}
	                        Ext.iterate(formpanel.up().query('lomdata'), formclear);
	                        this.loadForm(formpanel);
						},
						failure: function(form, action) {
			                Ext.Msg.alert(_('Error'), action.result.errorMessage);
			            },
						scope: this
					});
		    	}
			}
		});
    },

    onClickReset: function(cbutton) {
    	Ext.Msg.show({
			title: _('Confirm'),
			msg: _('Are you sure you want reset all form fields?'),
			scope: this,
			modal: true,
			buttons: Ext.Msg.YESNO,
			fn: function(button) {
				if (button == "yes") {	
			    	var form = cbutton.up('form').getForm();
			    	
			    	form.reset();
				}
			}
    	});
    },

    loadForm: function(formpanel) {
//      console.log('render ' + formpanel.itemId);
        formpanel.load({ 
            method: "GET", 
            params: formpanel.getForm().getFieldValues(),
            scope: this,
            formpanel: formpanel,
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
                else{
                    if (formpanel.xtype == 'lomdata'){
                    	//this.on('afterrender', this.extendForm, this, [form, action]);                    	
                        formpanel.extendForm(form, action);
                    	//console.log('ExtendForm end');
                    }
                	showbutton.hide();
                }                    
            },
            failure: function(form, action) {
            	if (action.result)
            		Ext.Msg.alert(_('Error'), action.result.errorMessage);
            }
        });
//        console.log('render end');
    },
    
    beforeAction: function(form, action, eOpts) {
        form.url = location.pathname + "/properties";
    },
    
    beforeAction: function(form, action, eOpts) {
//    	console.log('beforeaction');
        form.url = location.pathname + "/properties";
    },

    updateAuthoring: function(action, object, isChanged, currentNode, destNode) {
        if (action && (action == "done" || action == "move" || action == "delete" || action == "movePrev" || action == "moveNext" || action == "ChangeStyle")) {
		    var outlineTreePanel = this.getOutlineTreePanel(),
	            selmodel = outlineTreePanel.getSelectionModel(),
                selectednode = selmodel.getSelection()[0].get('id');
            if (currentNode == selectednode || (action == "move" && selectednode == destNode) || action == "ChangeStyle") {
		        var authoring = Ext.ComponentQuery.query('#authoring')[0];
		        authoring.load(location.pathname + '/authoring?clientHandleId=' + nevow_clientHandleId + "&currentNode=" + selectednode);
            }
        }
    },

    sourcesDownload: function() {
        nevow_clientToServerEvent('sourcesDownload', this, '');
    },

    onTabChange: function(tabPanel, newCard, oldCard, eOpts) {
        var newformpanel = null;

        while (newCard.getActiveTab)
            newCard = newCard.getActiveTab();
        if (newCard.getForm)
            newformpanel = newCard;

        if (newformpanel) {
            this.loadForm(newformpanel);
        }
    },

    lomImportSuccess: function(prefix) {
            Ext.Msg.alert('', _('LOM Metadata import success!'));
            var formpanel = Ext.ComponentQuery.query('lomdata'), i;

            prefix = prefix.toLowerCase() + '_';
            for (i = 0; i < formpanel.length; i++) {
                if (formpanel[i].prefix == prefix) {
                    formpanel[i].clear();
                    if (formpanel[i].getVisibilityEl())
                        this.loadForm(formpanel[i]);
                }
            }
        }

});