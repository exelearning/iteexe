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
        },
        {
            selector: '#file',
            ref: 'file'
        },
        {
            selector: '#tools',
            ref: 'tools'
        },
        {
            selector: '#main_tab',
            ref: 'maintab'
        },

    ],

    init: function() {
        this.control({

        	'#file': {
        		click: this.onTabBlur
    		},
    		'#tools': {
        		click: this.onTabBlur
    		},
        	'#authoring': {
        		beforetabchange: this.onBeforeTabChange
    		},
    		'#main_tab': {
    			beforetabchange: this.onBeforeTabChange
            },
            '#metadata_tab': {
            	beforetabchange: this.onBeforeTabChange
            },
            '#properties_tab': {
            	beforetabchange: this.onBeforeTabChange
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
            },
            '#pp_lang': {
            	select: this.langChanged,
            	scope: this
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
    	var formpanel = button.up('form');
    	this.saveForm(formpanel, true);
    },

    saveForm: function(formpanel, show_wait) {

    	if (typeof show_wait === 'undefined') {
    		show_wait = false;
    	}

    	var form = formpanel.getForm();

	    if (form.isValid()) {
	    	if (show_wait) {
	    		Ext.Msg.wait(_('Please wait...'));
	    	}
	        form.submit({
                success: function(form, action) {
                	if (show_wait) {
                		Ext.MessageBox.hide();
                		Ext.MessageBox.alert("", _('Settings Saved'));
                	}
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

    onBeforeTabChange: function(tabPanel, newCard, oldCard, eOpts) {

	    var newformpanel = null;

	    while (newCard.getActiveTab)
	        newCard = newCard.getActiveTab();


	    if (newCard.getForm) {
	        newformpanel = newCard;

	    } else {

	        if ((typeof(oldCard) !== "undefined") &&
	            (typeof(oldCard.items) !== "undefined") &&
	            (oldCard.items.items.length > 0)) {

	            for (i = 0; i < oldCard.items.items.length; i++) {

	            	if(oldCard.items.items[i].itemId == 'metadata_tab'){

	            		for (t = 0; t < oldCard.items.items[i].items.items.length; t++) {

	    	                if (oldCard.items.items[i].items.items[t].getForm) {

			                    fields = oldCard.items.items[i].items.items[t].managedListeners;

			                    if(this.checkFormChanges(fields)){
			                    	if(!this.validateForm(oldCard.items.items[i].items.items[t])){
			                    		return false;
			                    	}
			                    }

			                }
	            		}

	            	}else{

	                	if (oldCard.items.items[i].getForm) {

		                    fields = oldCard.items.items[i].managedListeners;

		                    if(this.checkFormChanges(fields)){
		                    	if(!this.validateForm(oldCard.items.items[i])){
		                    		return false;
		                    	}
		                    }
	                	}
	            	}

	            }//for
	        }
	    }

	    if (newformpanel &&
	        oldCard.getForm) {

	        fields = oldCard.managedListeners;

	        if(this.checkFormChanges(fields)){
	        	if(!this.validateForm(oldCard)){
	        		return false;
	        	}
	        }

	    } else {

	        if ((typeof(oldCard) !== "undefined") &&
	            (typeof(oldCard.items) !== "undefined") &&
	            (oldCard.items.items.length > 0)) {

	            for (i = 0; i < oldCard.items.items.length; i++) {

	                if (oldCard.items.items[i].getForm) {

	                    fields = oldCard.items.items[i].managedListeners;

	                    if(this.checkFormChanges(fields)){
	                    	if(!this.validateForm(oldCard.items.items[i])){
	                    		return false;
	                    	}
	                    }
	                }
	            }
	        }
	    }


	    if (newformpanel){
        	this.loadForm(newformpanel);
        }

	},

	checkFormChanges: function(fields){

        for (x = 0; x < fields.length; x++) {

            if (document.getElementById(fields[x].item.id) != null) {

                classField = document.getElementById(fields[x].item.id).className;

                if (classField.search('property-form-dirty') > 0) {

                	return true;
                    break;
                }
            }

        } // for

        return false;
	},


	validateForm: function(formpanel){

		var form = formpanel.getForm();

	    if (form.isValid()) {

	    	this.saveForm(formpanel);
	    	return true;
	    }
        else {
        	Ext.Msg.alert(_('Error'), _('The form contains invalid fields. Please check back.'));
        	if (formpanel.expandParents) {
        		form.getFields().each(function(field){
        			if (!field.validate())
        				formpanel.expandParents(field, true);
        		});
        	}

        	return false;
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
    },

    onTabBlur: function() {

    	if(this.getMaintab().getActiveTab().itemId == 'properties_tab'){
    		this.onBeforeTabChange(this.getMaintab(), '', this.getMaintab().getActiveTab());
    	}
	},

	checkIsTemplate: function(ifTemplate, ifNotTemplate) {
    	nevow_clientToServerEvent('isPackageTemplate', this, '', ifTemplate, ifNotTemplate)
	},

    langChanged: function(element, records, eOpts) {
    	// If the current file is not a template, don't do anything
    	this.checkIsTemplate('eXe.app.getController("MainTab").doLangChange("#' + element.itemId + '");', 'eXe.app.getController("MainTab").doNothing();');
    },

    doLangChange: function(itemId) {
    	// Submit the form
    	var element = Ext.ComponentQuery.query(itemId);
		var formpanel = element[0].up('form');
		var form = formpanel.getForm();

		// We add the lang_only parameter to prevent the package from getting
		// marked as changed, which would prevent it from getting translated
		form.submit({
			params: {
				'lang_only': 1
			},
            success: function(form, action) {
            	eXe.app.reload();
            },
            failure: function(form, action) {
                Ext.Msg.alert(_('Error'), action.result.errorMessage);
            }
        });
    },
    // Add return for it to work save, export, exit... from the main menu
    doNothing: function() {
        return;
    }

});