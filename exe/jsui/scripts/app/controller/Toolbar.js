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

Ext.define('eXe.controller.Toolbar', {
    extend: 'Ext.app.Controller',
	refs: [{
        ref: 'recentMenu',
        selector: '#file_recent_menu'
    },{
    	ref: 'stylesMenu',
    	selector: '#styles_menu'
    }
    ],    
    init: function() {
        this.control({
        	'#file_new': {
        		click: this.fileNew
        	},
            '#file_new_window': {
                click: this.fileNewWindow
            },
        	'#file_open': {
        		click: this.fileOpen
        	},
        	'#file_recent_menu': {
        		beforerender: this.recentRender
        	},
        	'#styles_button': {
        		beforerender: this.stylesRender
        	},
        	'#file_recent_menu > menuitem': {
        		click: this.recentClick
        	},
        	'#styles_menu > menuitem': {
        		click: this.stylesClick
        	},
        	'#file_save': {
        		click: this.fileSave
        	},
        	'#file_save_as': {
        		click: this.fileSaveAs
        	},
            '#file_print': {
                click: this.filePrint
            },
            '#file_export_cc': {
                click: { fn: this.processExportEvent, exportType: "commoncartridge" }
            },
            '#file_export_scorm': {
                click: { fn: this.processExportEvent, exportType: "scorm" }
            },
            '#file_export_ims': {
                click: { fn: this.processExportEvent, exportType: "ims" }
            },
            '#file_export_website': {
                click: { fn: this.processExportEvent, exportType: "webSite" }
            },
            '#file_export_zip': {
                click: { fn: this.processExportEvent, exportType: "zipFile" }
            },
            '#file_export_singlepage': {
                click: { fn: this.processExportEvent, exportType: "singlePage" }
            },
            '#file_export_text': {
                click: { fn: this.processExportEvent, exportType: "textFile" }
            },
            '#file_export_ipod': {
                click: { fn: this.processExportEvent, exportType: "ipod" }
            },
            '#file_export_xliff': {
                click: this.exportXliff
            },
            '#file_import_xliff': {
                click: this.importXliff
            },
            '#file_import_html': {
                click: this.importHtml
            },
            '#file_insert': {
                click: this.insertPackage
            },
            '#file_extract': {
                click: this.extractPackage
            },
            '#file_quit': {
                click: this.fileQuit
            },
            '#tools_idevice': {
                click: this.toolsIdeviceEditor
            },
            '#tools_preferences': {
                click: this.toolsPreferences
            },
            '#tools_refresh': {
                click: this.toolsRefresh
            },
            '#help_tutorial': {
                click: this.fileOpenTutorial
            },
            '#help_manual': {
                click: { fn: this.processBrowseEvent, url: 'file://%s/docs/manual/Online_manual.html' }
            },
            '#help_notes': {
                click: { fn: this.processBrowseEvent, url: 'file://%t' }
            },
            '#help_website': {
                click: { fn: this.processBrowseEvent, url: 'http://exelearning.net/' }
            },
            '#help_issue': {
                click: { fn: this.processBrowseEvent, url: 'https://forja.cenatic.es/tracker/?group_id=197' }
            },
            '#help_forums': {
                click: { fn: this.processBrowseEvent, url: 'http://exelearning.net/forums/' }
            },
            '#help_about': {
                click: this.aboutPage
            }
        });
        
        var keymap_config = [
			{
				key: Ext.EventObject.N,
				ctrl: true,
                alt: true,
				handler: function() {
				 this.fileNew();
				},
				scope: this,
				defaultEventAction: "stopEvent"
			},
			{
				key: Ext.EventObject.W,
				ctrl: true,
                alt: true,
				handler: function() {
				 this.fileNewWindow();
				},
				scope: this,
				defaultEventAction: "stopEvent"
			},
			{
			     key: Ext.EventObject.O,
			     ctrl: true,
			     handler: function() {
			          this.fileOpen();
			     },
			     scope: this,
			     defaultEventAction: "stopEvent"
			},
			{
				key: Ext.EventObject.S,
				ctrl: true,
				handler: function() {
				 this.fileSave();
				},
				scope: this,
				defaultEventAction: "stopEvent"
			},
			{
			     key: Ext.EventObject.P,
			     ctrl: true,
			     handler: function() {
			          this.filePrint();
			     },
			     scope: this,
			     defaultEventAction: "stopEvent"
			},
			{
			     key: Ext.EventObject.Q,
			     ctrl: true,
			     handler: function() {
			          this.fileQuit();
			     },
			     scope: this,
			     defaultEventAction: "stopEvent"
			},
			{
			     key: Ext.EventObject.F,
			     alt: true,
			     handler: function() {
			          Ext.ComponentQuery.query('#file')[0].showMenu();
			     },
			     scope: this,
			     defaultEventAction: "stopEvent"
			},
			{
			     key: Ext.EventObject.T,
			     alt: true,
			     handler: function() {
			          Ext.ComponentQuery.query('#tools')[0].showMenu();
			     },
			     scope: this,
			     defaultEventAction: "stopEvent"
			},
			{
			     key: Ext.EventObject.S,
			     alt: true,
			     handler: function() {
			          Ext.ComponentQuery.query('#styles_button')[0].showMenu();
			     },
			     scope: this,
			     defaultEventAction: "stopEvent"
			},
			{
			     key: Ext.EventObject.H,
			     alt: true,
			     handler: function() {
			          Ext.ComponentQuery.query('#help')[0].showMenu();
			     },
			     scope: this,
			     defaultEventAction: "stopEvent"
			},
            {
	            key: Ext.EventObject.F5,
	            handler: function() {
	                 this.toolsRefresh();
	            },
	            scope: this,
	            defaultEventAction: "stopEvent"
            }
        ];
        var authoring = Ext.get(Ext.get('authoringIFrame').dom);
        authoring.on("load", function(evt, el, o) {
           var body = Ext.get(authoring.dom.contentDocument.body);
           var keymap = new Ext.util.KeyMap(body, keymap_config);
        }, this);
        var keymap = new Ext.util.KeyMap(Ext.getBody(), keymap_config);
    },

    fileNewWindow: function() {
        window.open(location.href);
    },

	aboutPage: function() {
        var about = new Ext.Window ({
          height: 405, 
          width: 300, 
          modal: true,
          resizable: false,
          id: 'aboutwin',
          title: _("About"), 
          html: '<iframe height="100%" width="100%" src="/docs/credits.xhtml"></iframe>'
        });
        about.show();
	},
    
    browseURL: function(url) {
        nevow_clientToServerEvent('browseURL', this, '', url);
    },
    
    processBrowseEvent: function(menu, item, e, eOpts) {
        this.browseURL(e.url)
    },
    
    fileOpenTutorial: function() {
        this.askDirty("eXe.app.getController('Toolbar').fileOpenTutorial2()");
    },
    
    fileOpenTutorial2: function() {
        nevow_clientToServerEvent('loadTutorial', this, '');
    },
    
    toolsRefresh: function() {
        eXe.app.quitWarningEnabled = false;
        window.location = window.location;
    },

    toolsPreferences: function() {
        var preferences = new Ext.Window ({
          height: 200, 
          width: 500, 
          modal: true,
          id: 'preferenceswin',
          title: _("Preferences"), 
          html: '<iframe height="100%" width="100%" src="/preferences"></iframe>'
        });
        preferences.show();        
	},
    
    // Launch the iDevice Editor Window
	toolsIdeviceEditor: function() {
        var editor = new Ext.Window ({
          height: 700, 
          width: 800, 
          modal: true,
          id: 'ideviceeditorwin',
          title: _("iDevice Editor"), 
          html: '<iframe height="100%" width="100%" src="/editor"></iframe>'
        });
        editor.show();        
	},

    fileQuit: function() {
	    this.saveWorkInProgress();
	    this.askDirty("eXe.app.getController('Toolbar').doQuit()", "quit");
	},

    doQuit: function() {
        eXe.app.quitWarningEnabled = false;
        nevow_clientToServerEvent('quit', this, '');
        Ext.get('loading-mask').fadeIn();
        Ext.get('loading').show();
    },

    insertPackage: function() {
        var f = Ext.create("eXe.view.filepicker.FilePicker", {
            type: eXe.view.filepicker.FilePicker.modeOpen,
            title: _("Select package to insert"),
            modal: true,
            scope: this,
            callback: function(fp) {
                if (fp.status == eXe.view.filepicker.FilePicker.returnOk)
                    nevow_clientToServerEvent('insertPackage', this, '', fp.file.path);
            }
        });
        f.appendFilters([
            { "typename": _("eXe Package Files"), "extension": "*.elp", "regex": /.*\.elp$/ },
            { "typename": _("All Files"), "extension": "*.*", "regex": /.*$/ }
            ]
        );
        f.show();        
	},

	extractPackage: function() {
        var f = Ext.create("eXe.view.filepicker.FilePicker", {
            type: eXe.view.filepicker.FilePicker.modeSave,
            title: _("Save extracted package as"),
            modal: true,
            scope: this,
            callback: function(fp) {
                if (fp.status == eXe.view.filepicker.FilePicker.returnOk || fp.status == eXe.view.filepicker.FilePicker.returnReplace)
                    nevow_clientToServerEvent('extractPackage', this, '', fp.file.path, fp.status == eXe.view.filepicker.FilePicker.returnReplace)
            }
        });
        f.appendFilters([
            { "typename": _("eXe Package Files"), "extension": "*.elp", "regex": /.*\.elp$/ },
            { "typename": _("All Files"), "extension": "*.*", "regex": /.*$/ }
            ]
        );
        f.show();        
	},

    importHtml: function(){
        var fp = Ext.create("eXe.view.filepicker.FilePicker", {
            type: eXe.view.filepicker.FilePicker.modeGetFolder,
            title: _("Select the parent folder for import."),
            modal: true,
            scope: this,
            callback: function(fp) {
                if (fp.status == eXe.view.filepicker.FilePicker.returnOk || fp.status == eXe.view.filepicker.FilePicker.returnReplace) {
                    nevow_clientToServerEvent('importPackage', this, '', 'html', fp.file.path);
                }
            }
        });
        fp.show();
	},

    importHtml2: function(path) {
        var fp = Ext.create("eXe.view.filepicker.FilePicker", {
            type: eXe.view.filepicker.FilePicker.modeOpen,
            title: _("Select the entry point for import."),
            modal: true,
            scope: this,
            callback: function(fp) {
                if (fp.status == eXe.view.filepicker.FilePicker.returnOk) {
                    nevow_clientToServerEvent('importPackage', this, '', 'html', path, fp.file.path);
                }
            }
        });
        fp.appendFilters([
            { "typename": _("HTML Files"), "extension": "*.html", "regex": /.*\.htm[l]*$/i },
            { "typename": _("All Files"), "extension": "*.*", "regex": /.*$/ }
        ]);
        fp.show();
    },
    
    updateImportProgressWindow: function(msg) {
        if (!this.importProgressDisabled)
            this.importProgress.updateText(msg);
    },
    
    initImportProgressWindow: function(title) {
        this.importProgressDisabled = false;
        this.importProgress = Ext.Msg.show( {
            title: title,
            msg: _("Waiting progress..."),
            scope: this,
            modal: true,
            buttons: Ext.Msg.CANCEL,
            fn: function(button) {
                if (button == "cancel")    {
                    this.importProgressDisabled = true;
                    Ext.Msg.show( {
                        title: _("Cancel Import?"),
                        msg: _("There is an ongoing import. Do you want to cancel?"),
                        scope: this,
                        modal: true,
                        buttons: Ext.Msg.YESNO,
                        fn: function(button2) {
	                        if (button2 == "yes")
	                            nevow_clientToServerEvent('cancelImportPackage', this, '');
	                        else
	                            this.initImportProgressWindow(title);
                        }
                    });
                }
            }
        });        
    },
    
    closeImportProgressWindow: function() {
        this.importProgress.destroy();
    },
    
	importXliff: function() {
        var fp = Ext.create("eXe.view.filepicker.FilePicker", {
            type: eXe.view.filepicker.FilePicker.modeOpen,
            title: _("Select Xliff file to import"),
            modal: true,
            scope: this,
            callback: function(fp) {
                if (fp.status == eXe.view.filepicker.FilePicker.returnOk) {
                    var preferences = new Ext.Window ({
                      height: 220, 
                      width: 650, 
                      modal: true,
                      id: 'xliffimportwin',
                      title: _("XLIFF Import Preferences"), 
                      html: '<iframe height="100%" width="100%" src="/xliffimportpreferences?path=' + fp.file.path +'"></iframe>'
                    });
                    preferences.show();
                }
            }
        });
        fp.appendFilters([
            { "typename": _("XLIFF Files"), "extension": "*.xlf", "regex": /.*\.xlf$/ },
            { "typename": _("All Files"), "extension": "*.*", "regex": /.*$/ }
        ]);
        fp.show();
	},

    exportXliff: function() {
        var fp = Ext.create("eXe.view.filepicker.FilePicker", {
            type: eXe.view.filepicker.FilePicker.modeSave,
            title: _("Export to Xliff as"),
            modal: true,
            scope: this,
            callback: function(fp) {
                if (fp.status == eXe.view.filepicker.FilePicker.returnOk || fp.status == eXe.view.filepicker.FilePicker.returnReplace) {
                    var preferences = new Ext.Window ({
					  height: 300, 
					  width: 650, 
                      modal: true,
                      id: 'xliffexportwin',
					  title: _("XLIFF Export Preferences"), 
					  html: '<iframe height="100%" width="100%" src="/xliffexportpreferences?path=' + fp.file.path +'"></iframe>'
					});
                    preferences.show();
                }
            }
        });
        fp.appendFilters([
            { "typename": _("XLIFF Files"), "extension": "*.xlf", "regex": /.*\.xlf$/ },
            { "typename": _("All Files"), "extension": "*.*", "regex": /.*$/ }
        ]);
        fp.show();            
    },

    processExportEvent: function(menu, item, e, eOpts) {
        this.exportPackage(e.exportType, "")
    },
    
	exportPackage: function(exportType, exportDir, printCallback) {
	    if (exportType == 'webSite' || exportType == 'singlePage' || exportType == 'printSinglePage' || exportType == 'ipod' ) {
	        if (exportDir == '') {
                var fp = Ext.create("eXe.view.filepicker.FilePicker", {
		            type: eXe.view.filepicker.FilePicker.modeGetFolder,
		            title: _("Select the parent folder for export."),
		            modal: true,
		            scope: this,
		            callback: function(fp) {
		                if (fp.status == eXe.view.filepicker.FilePicker.returnOk || fp.status == eXe.view.filepicker.FilePicker.returnReplace)
		                    nevow_clientToServerEvent('exportPackage', this, '', exportType, fp.file.path, '')
		            }
		        });
	            fp.show();
	        }
	        else {
	            // use the supplied exportDir, rather than asking.
	            // NOTE: currently only the printing mechanism will provide an exportDir, hence the printCallback function.
	            nevow_clientToServerEvent('exportPackage', this, '', exportType, exportDir, printCallback)
	        }
	    } else if(exportType == "textFile"){
                var fp = Ext.create("eXe.view.filepicker.FilePicker", {
                    type: eXe.view.filepicker.FilePicker.modeSave,
                    title: _("Export text package as"),
                    modal: true,
                    scope: this,
                    callback: function(fp) {
                        if (fp.status == eXe.view.filepicker.FilePicker.returnOk || fp.status == eXe.view.filepicker.FilePicker.returnReplace)
                            nevow_clientToServerEvent('exportPackage', this, '', exportType, fp.file.path, '')
                    }
                });
		        fp.appendFilters([
		            { "typename": _("Text File"), "extension": "*.txt", "regex": /.*\.txt$/ },
		            { "typename": _("All Files"), "extension": "*.*", "regex": /.*$/ }
		            ]
		        );
                fp.show();            
	    } else {
            var title;
	        if (exportType == "scorm")
	            title = _("Export SCORM package as");
	        else if (exportType == "ims")
	            title = _("Export IMS package as");
	        else if (exportType == "zipFile")
	            title = _("Export Website package as");
	        else if (exportType == "commoncartridge")
	            title = _("Export Common Cartridge as");
	        else
	            title = _("INVALID VALUE PASSED TO exportPackage");

            var fp = Ext.create("eXe.view.filepicker.FilePicker", {
	            type: eXe.view.filepicker.FilePicker.modeSave,
	            title: title,
	            modal: true,
	            scope: this,
	            callback: function(fp) {
	                if (fp.status == eXe.view.filepicker.FilePicker.returnOk || fp.status == eXe.view.filepicker.FilePicker.returnReplace)
	                    nevow_clientToServerEvent('exportPackage', this, '', exportType, fp.file.path, '')
	            }
	        });
	        fp.appendFilters([
	            { "typename": _("SCORM/IMS/ZipFile"), "extension": "*.txt", "regex": /.*\.zip$/ },
	            { "typename": _("All Files"), "extension": "*.*", "regex": /.*$/ }
	            ]
	        );
	        fp.show();            
	    }
	},// exportPackage()
    
    filePrint: function() {
	   // filePrint step#1: create a temporary print directory, 
	   // and return that to filePrint2, which will then call exportPackage():
	   var tmpdir_suffix = ""
	   var tmpdir_prefix = "eXeTempPrintDir_"
	   nevow_clientToServerEvent('makeTempPrintDir', this, '', tmpdir_suffix, 
	                              tmpdir_prefix, "eXe.app.getController('Toolbar').filePrint2")
	   // note: as discussed below, at the end of filePrint3_openPrintWin(), 
	   // the above makeTempPrintDir also removes any previous print jobs
	},
	
	filePrint2: function(tempPrintDir, printDir_warnings) {
	   if (printDir_warnings.length > 0) {
	      Ext.Msg.alert("", printDir_warnings)
	   }
	   this.exportPackage('printSinglePage', tempPrintDir, "eXe.app.getController('Toolbar').filePrint3_openPrintWin");
	},
	
	filePrint3_openPrintWin: function(tempPrintDir, tempExportedDir, webPrintDir) {
	    // okay, at this point, exportPackage() has already been called and the 
	    // exported file created, complete with its printing Javascript
	    // into the tempPrintDir was created (and everything below it, and 
	    // including it, will need to be removed), the actual files for printing 
	    // were exported into tempExportedDir/index.html, where tempExportedDir 
	    // is typically a subdirectory of tempDir, named as the package name.
	
	    // Still needs to be (a) opened, printed, and closed:
	    var features = "width=680,height=440,status=1,resizable=1,left=260,top=200", print_url, printWin;
	    print_url = webPrintDir+"/index.html"
	
	    printWin = window.open(print_url, "", features);
	
	
	    // and that's all she wrote!
	
	    // note that due to difficulty with timing issues, the files are not 
	    // (yet!) immediately removed upon completion of the print job 
	    // the hope is for this to be resolved someday, somehow, 
	    // but for now the nevow_clientToServerEvent('makeTempPrintDir',...) 
	    // call in filePrint() also clears out any previous print jobs,
	    // and this is called upon Quit of eXe as well, leaving *at most* 
	    // one temporary print job sitting around.
	},
	
    recentRender: function() {
    	Ext.Ajax.request({
    		url: location.pathname + '/recentMenu',
    		scope: this,
    		success: function(response) {
				var rm = Ext.JSON.decode(response.responseText),
					menu = this.getRecentMenu(), text, item, previtem;
    			for (i in rm) {
    				text = rm[i].num + ". " + rm[i].path
    				previtem = menu.items.getAt(rm[i].num - 1);
    				if (previtem && previtem.text[1] == ".") {
    					previtem.text = text
    				}
    				else {
	    				item = Ext.create('Ext.menu.Item', { text: text });
	    				menu.insert(rm[i].num - 1, item);
    				}
    			}
    		}
    	})
    	return true;
    },
    
    stylesRender: function() {
    	Ext.Ajax.request({
    		url: location.pathname + '/styleMenu',
    		scope: this,
    		success: function(response) {
				var styles = Ext.JSON.decode(response.responseText),
					menu = this.getStylesMenu(), i, item;
    			for (i = styles.length-1; i >= 0; i--) {
    				item = Ext.create('Ext.menu.Item', { text: styles[i].label, itemId: styles[i].style });
    				menu.insert(0, item);
    			}
    		}
    	})
    	return true;
    },

    recentClick: function(item) {
    	if (item.itemId == "file_clear_recent") {
    		nevow_clientToServerEvent('clearRecent', this, '');
    		var menu = this.getRecentMenu(),
    			items = menu.items.items.slice(),
    			i = 0,
    			len = items.length;
    		for (; i < len; i++) 
    			if (items[i].text[1] == ".")
    				menu.remove(items[i], true);
    	}
    	else
    		this.askDirty("eXe.app.getController('Toolbar').fileOpenRecent2('" + item.text[0] + "');")
    },
	
    stylesClick: function(item) {
        var authoring = Ext.get('authoringIFrame').dom.contentWindow;
        if (authoring)
            authoring.submitLink("ChangeStyle", item.itemId, 1);
    },
    
	fileOpenRecent2: function(number) {
	    nevow_clientToServerEvent('loadRecent', this, '', number)
	},
	
    fileNew: function() {
    	// Ask the server if the current package is dirty
    	this.askDirty("eXe.app.gotoUrl('/')");
	},
	
    fileOpen: function() {
    	this.askDirty("eXe.app.getController('Toolbar').fileOpen2()");
    },
    
    fileOpen2: function() {
		var f = Ext.create("eXe.view.filepicker.FilePicker", {
			type: eXe.view.filepicker.FilePicker.modeOpen,
			title: _("Open File"),
			modal: true,
			scope: this,
			callback: function(fp) {
		    	if (fp.status == eXe.view.filepicker.FilePicker.returnOk)
		    		nevow_clientToServerEvent('loadPackage', this, '', fp.file.path);
		    }
		});
		f.appendFilters([
			{ "typename": _("eXe Package Files"), "extension": "*.elp", "regex": /.*\.elp$/ },
			{ "typename": _("All Files"), "extension": "*.*", "regex": /.*$/ }
			]
		);
		f.show();
    },
    
    checkDirty: function(ifClean, ifDirty) {
    	nevow_clientToServerEvent('isPackageDirty', this, '', ifClean, ifDirty)
	},
	
	askSave: function(onProceed) {
		Ext.Msg.show({
			title: _("Save Package first?"),
			msg: _("The current package has been modified and not yet saved. Would you like to save it?"),
			scope: this,
			modal: true,
			buttons: Ext.Msg.YESNOCANCEL,
			fn: function(button, text, opt) {
				if (button == "yes")
					this.fileSave(onProceed);
				else if (button == "no")
                    eval(onProceed);
			}
		});
	},
	
	fileSave: function(onProceed) {
	    if (!onProceed || (onProceed && typeof(onProceed) != "string"))
	        var onProceed = '';
	    nevow_clientToServerEvent('getPackageFileName', this, '', 'eXe.app.getController("Toolbar").fileSave2', onProceed);
	},
	
	fileSave2: function(filename, onDone) {
	    if (filename) {
	        this.saveWorkInProgress();
	        // If the package has been previously saved/loaded
	        // Just save it over the old file
	        if (onDone) {
	            nevow_clientToServerEvent('savePackage', this, '', '', onDone);
	        } else {
	            nevow_clientToServerEvent('savePackage', this, '');
	        }
	    } else {
	        // If the package is new (never saved/loaded) show a
	        // fileSaveAs dialog
	        this.fileSaveAs(onDone)
	    }
	},
	// Called by the user when they want to save their package
	fileSaveAs: function(onDone) {
		var f = Ext.create("eXe.view.filepicker.FilePicker", {
			type: eXe.view.filepicker.FilePicker.modeSave,
			title: _("Select a File"), 
			modal: true,
			scope: this,
			callback: function(fp) {
			    if (fp.status == eXe.view.filepicker.FilePicker.returnOk || fp.status == eXe.view.filepicker.FilePicker.returnReplace) {
			        this.saveWorkInProgress();
			        if (onDone && typeof(onDone) == "string") {
			            nevow_clientToServerEvent('savePackage', this, '', f.file.path, onDone)
			        } else {
			            nevow_clientToServerEvent('savePackage', this, '', f.file.path)
			        }
			    } else {
                    Ext.defer(function() {
				        eval(onDone);
                    }, 500);
			    }
			}
		});
		f.appendFilters([
			{ "typename": _("eXe Package Files"), "extension": "*.elp", "regex": /.*\.elp$/ },
			{ "typename": _("All Files"), "extension": "*.*", "regex": /.*$/ }
			]
		);
		f.show();
	},	
	// Submit any open iDevices
	saveWorkInProgress: function() {
	    // Do a submit so any editing is saved to the server
        var authoring = Ext.get('authoringIFrame').dom.contentWindow;
        if (authoring && authoring.getContentForm) {
		    var theForm = authoring.getContentForm();
		    if (theForm)
		        theForm.submit();
        }
	},
	
    askDirty: function(nextStep) {
    	this.checkDirty(nextStep, 'eXe.app.getController("Toolbar").askSave("'+nextStep+'")');
    }
});