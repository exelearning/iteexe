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
            Ext.MessageBox.alert("", _('Settings Saved'));
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
    
    onClickSave: function(button) {
	    var form = button.up('form').getForm();
	    if (form.isValid()) {
	        form.submit({ 
	            failure: function(form, action) {
	                Ext.Msg.alert(_('Error'), action.result.errorMessage);
	            }
	        });
	    }
        else
            Ext.Msg.alert(_('Error'), _('The form contains invalid fields. Please check back.'))
    },
    
    getInsertDelField: function(key){
        var vid = key.split('_'),
            field = false, fieldkey = false;
        if (/contribute[0-9]$/.exec(vid[2]) && /.*date_description_string[0-9]*/.exec(key)){        
         	fieldkey = vid[0] +  '_' + vid[1] + '_' + vid[2] +'_date';
        }else if (/taxon[0-9]*_entry_string[0-9]*$/.exec(key)){
        	fieldkey = vid[0] +  '_' + vid[1] +  '_' + vid[2] + '_' + vid[3].replace(/[0-9]+/g, '');
        }
        else{
          	fieldkey = vid[0] +  '_' + vid[1] +  '_' + vid[2].replace(/[0-9]+/g, '');	
        }
        field = Ext.ComponentQuery.query('#' + fieldkey)[0];
        return field;
                                             
    	
    },    
    getAddSectionButton: function(key){
    	var vid = key.split('_'), s;
    	s = vid[0] + '_' + vid[1].replace(/[0-9]+/g, '');    
    	return Ext.ComponentQuery.query('#button_' + s )[0];
    },
    getAddFieldButton: function(key){
    	var field = this.getInsertDelField(key);
    	if  (field){
    		return field.down('#addbutton');
    	}    	
    	return false;
    },
    getSection: function(key){
    	var vid = key.split('_');
    	return vid[0] + '_'+ vid[1];
    },
    existSection: function(form, key){    	
    	var section = this.getSection(key), fsection, fk ;
    	for(var i=0, items = form.getFields().items; i< items.length; i++){
    		//console.log(items[i].getName())
    		fk = items[i].getName();
    		fsection = this.getSection(fk);
    		if (section == fsection){
    			return true;
    		}   		
    	};    	
    	return false;    	
    },
    expandParents: function(field){
    	var comp = field;
    	while (comp.xtype !== 'lomdata'){
    		if ((comp.xtype == 'insertdelfieldset' || comp.xtype == 'preservescrollfieldset') && comp.collapsed){
    			comp.expand();
    		}
    		comp = comp.up();
    	}
    	return true;
    },
//    collapseForm: function(form) {
//        var insertdelfieldset = Ext.ComponentQuery.query('insertdelfieldset'),
//            i, j,
//            fields = form.getFields().items,
//            fLen   = fields.length;
//
//        Ext.suspendLayouts();
//        for (i = 0; i < fLen; i++) {
//            fields[i].setValue();
//            fields[i].resetOriginalValue();
//        }
//
//        for (i=0; i < insertdelfieldset.length; i++) {
//            var delbutton = Ext.ComponentQuery.query('#' + insertdelfieldset[i].itemId + ' #delbutton');
//
//            if (delbutton.length > 1) {
//                for (j=1; j < delbutton.length; j++) {
//                    if (delbutton[j].el)
//                        delbutton[j].el.dom.click();
//                }
//            }
//            insertdelfieldset[i].lastId = 2;
//        }
//        Ext.resumeLayouts(true);
//    },
    extendForm: function(form, action){
		//console.log('EXTENDFORM');		
		//var lform = form.owner;
    	//var vp = Ext.ComponentQuery.query('#eXeViewport')[0];    	   	
    	//lform.suspendLayouts(true);
    	Ext.suspendLayouts();
    	var field, fields = [], r, v, key, but, rLayout, lasttaxons = {}, k, vid, nv, finaltaxonKeys = {};
    	for (key in action.result.data){
    		fields.push(key);
    		if(/_taxon[0-9]*_entry_string1$/.exec(key)){
    			vid =key.split('_');
    			k = vid[0] + '_' + vid[1] + '_' + vid[2]
    			nv = parseInt(/[0-9]*$/.exec(key.split('_')[3])[0]);
				if (!lasttaxons[k]){
					lasttaxons[k] = nv;
				}else if (nv > lasttaxons[k]){
					lasttaxons[k] = nv;
				}
			}
    	}
    	Ext.define('taxonModel', {
    	    extend: 'Ext.data.Model',
    	    fields: [ 'identifier', 'text']
    	});
    	
    	Ext.iterate(lasttaxons, function(key, value){
    		finaltaxonKeys[key + '_taxon' + String(value) + '_entry_string1'] = true;
    	});
    	fields.sort();
    	
    	for (var i = 0, len = fields.length; i < len; i++){    		
    		key = fields[i];
    		//console.log(key);
    		rLayout = false;
    		field = form.findField(key);
    		v = action.result.data[key];
    		r = false;
    		if (field){
    			field.setValue(v);
                field.resetOriginalValue();
    			this.expandParents(field);
    			r = field;
    			field = this.getInsertDelField(key);
//    			console.log('OK:      ' + key );
    		}else{
    			//console.log('PROCESS: ' + key );
    			if (action.result.data[key] !== ''){//
					if (! this.existSection(form, key)){
//						console.log('ADD Section: ' + key);
						but = this.getAddSectionButton(key);
						but.fireEvent('click', but);
						r = form.findField(key);
						if (r){
        					if (r){
//        						console.log('Set Field for key ' + key);
        						r.setValue(v);
                                r.resetOriginalValue();
        					}
						}else{
							console.log('ERROR: Set Field for key ' + key);
						}                						
					}else{
//						console.log('ADD New Field for key: ' + key);
						field = this.getInsertDelField(key);
						if (field){
							field.expand();
							if (/contribute$/.exec(field.getItemId())){
								but = Ext.ComponentQuery.query('#' + field.getItemId() + ' #addbutton')[1];
							}
							else{								
								if (field.addButtonObj){
									but = field.addButtonObj;
								}else{
									console.log('Can not get de button: ' + key);
								}								
							}							
							if (but){
								if (! but.el){
									Ext.resumeLayouts(true);
									rLayout = true;
//									console.log(key);
								}
								but.el.dom.click();
								
    							r = form.findField(key);
        						if (r){
//                						console.log('Set Field for key ' + key);
                						r.setValue(v);
                                        r.resetOriginalValue();
                				}else{
        							console.log('ERROR: Set Field for key ' + key);
        						}
        						if (rLayout){
        							Ext.suspendLayouts();
        						}
							}            							
						}
						else{
							console.log('ERROR: Field not found: ' + key);
						}
					}
    			}
    		}
    		if(/_taxon[0-9]*_entry_string1$/.exec(key)){    			
    			if (finaltaxonKeys[key]){
    				field.addButtonObj.el.dom.click();
    				finaltaxonKeys[key] = r;
    			}
    		}    		
    	}
    	Ext.resumeLayouts(true);
    	Ext.suspendLayouts();
    	Ext.iterate(finaltaxonKeys, function(key, r){
    		if (r){    				
				var	scp, nextCombo, nextbutdel;
				nextCombo = r.nextNode('combo');
				nextbutdel = nextCombo.nextNode('image#delbutton');
				scp= {'scope': eXe.view.forms.LomWidgets, 'combo': nextCombo},
				nextbutdel.getEl().removeAllListeners();
				nextbutdel.getEl().addListener( 'click', eXe.view.forms.LomWidgets.addDelEvent, scp);
			}    		
    	});
    	Ext.resumeLayouts(true);
//    	msg.close();
//    	vp.setLoading(true);
//    	vp.doLayout();
//    	vp.setLoading(false);
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
                    	this.extendForm(form, action);
                    	//console.log('ExtendForm end');
                    }
                	showbutton.hide();
                }                    
            },
            failure: function(form, action) {
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
        var newformpanel, oldformpanel, widgets = eXe.view.forms.LomWidgets;

        while (newCard.getActiveTab)
            newCard = newCard.getActiveTab();
        if (newCard.getForm)
            newformpanel = newCard;

        while (oldCard.getActiveTab)
            oldCard = oldCard.getActiveTab();
        if (oldCard.getForm)
            oldformpanel = oldCard;

        if (oldformpanel) {
            if (oldformpanel.xtype == 'lomdata')
                oldformpanel.clear();
        }

        if (newformpanel) {
            this.loadForm(newformpanel);
        }
    }
});