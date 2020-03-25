/* Mind mapping plugin for TinyMCE (custom toolbar and actions) */
// Toolbar.js
mindmaps.ToolBarPresenter = function(eventBus, commandRegistry, view, mindmapModel) {
	
	function commandToButton(commandType) {
		var command = commandRegistry.get(commandType);
		return new mindmaps.ToolBarButton(command);
	}

	function commandsToButtons(commands) {
		return commands.map(commandToButton);
	}

	var nodeCommands = [ mindmaps.CreateNodeCommand, mindmaps.DeleteNodeCommand ];
	var nodeButtons = commandsToButtons(nodeCommands);
	view.addButtonGroup(nodeButtons, view.alignLeft);

	// undo buttons
	var undoCommands = [ mindmaps.UndoCommand, mindmaps.RedoCommand ];
	var undoButtons = commandsToButtons(undoCommands);
	view.addButtonGroup(undoButtons, view.alignLeft);

	// clipboard buttons.
	var clipboardCommands = [ mindmaps.CopyNodeCommand,
	mindmaps.CutNodeCommand, mindmaps.PasteNodeCommand ];
	var clipboardButtons = commandsToButtons(clipboardCommands);
	view.addButtonGroup(clipboardButtons, view.alignLeft);

	// eXeLearning (file menu)
	var fileMenu = new mindmaps.ToolBarMenu(_("Tools"), "ui-icon-document");
	var fileCommands = [ 
		// mindmaps.SaveDocumentAndExitCommand, // Save
		mindmaps.OpenDocumentCommand, // Import
		mindmaps.SaveDocumentCommand, // Export
		// mindmaps.ExportCommand, // Export as PNG
		mindmaps.PrintCommand // Print
		// mindmaps.CloseDocumentCommand // Finish
	];
	var fileButtons = commandsToButtons(fileCommands);
	fileMenu.add(fileButtons);
	view.addMenu(fileMenu);

	// help button
	view.addButton(commandToButton(mindmaps.HelpCommand), view.alignRight);
	
	// save button
	var saveCommand = [ mindmaps.SaveDocumentAndExitCommand ];
	var saveButton = commandsToButtons(saveCommand);
	view.addButtonGroup(saveButton, view.alignRight);	

	this.go = function() {
		view.init();
	};
	
};

// ApplicationController.js
mindmaps.ApplicationController = function() {
	
	var eventBus = new mindmaps.EventBus();
	var shortcutController = new mindmaps.ShortcutController();
	var commandRegistry = new mindmaps.CommandRegistry(shortcutController);
	var undoController = new mindmaps.UndoController(eventBus, commandRegistry);
	var mindmapModel = new mindmaps.MindMapModel(eventBus, commandRegistry, undoController);
	var clipboardController = new mindmaps.ClipboardController(eventBus, commandRegistry, mindmapModel);
	var helpController = new mindmaps.HelpController(eventBus, commandRegistry);
	var printController = new mindmaps.PrintController(eventBus, commandRegistry, mindmapModel);
	var autosaveController = new mindmaps.AutoSaveController(eventBus, mindmapModel);
	var filePicker = new mindmaps.FilePicker(eventBus, mindmapModel);

	// Handles the new document command
	// Triggered when $mapCode == '{}'
	function doNewDocument() {
		// close old document first
		var doc = mindmapModel.getDocument();
		doCloseDocument(false); // eXeLearning: false
		var presenter = new mindmaps.NewDocumentPresenter(eventBus, mindmapModel, new mindmaps.NewDocumentView());
		presenter.go();
	}

	// Import
	function doOpenDocument() {
		var presenter = new mindmaps.OpenDocumentPresenter(eventBus, mindmapModel, new mindmaps.OpenDocumentView(), filePicker);
		presenter.go();
	}
	
	// eXeLearning
	
	// Export
	function doSaveDocument() {
		var presenter = new mindmaps.SaveDocumentPresenter(eventBus, mindmapModel, new mindmaps.SaveDocumentView(), autosaveController, filePicker);
		presenter.go();
	}
	
	// Export as image
	function doExportDocument() {
		var presenter = new mindmaps.ExportMapPresenter(eventBus, mindmapModel, new mindmaps.ExportMapView());
		presenter.go();
	}	
	
	// Open $mapCode (no menu option)
	mindmaps.OpenIdeviceDocument = function(eventBus, mindmapModel, view) {

		this.go = function() {
			try {
				var doc = mindmaps.Document.fromObject(JSON.parse(top.mindmapEditor.data));
			} catch (e) {
				eventBus.publish(mindmaps.Event.NOTIFICATION_ERROR, _('File is not a valid mind map!'));
				throw new Error(_('Error while opening map from hdd'), e);
			}
			mindmapModel.setDocument(doc);
		};

	};

	function openIdeviceDocument() {
		var doc = mindmapModel.getDocument();
		doCloseDocument(false);
		var presenter = new mindmaps.OpenIdeviceDocument(eventBus, mindmapModel, new mindmaps.NewDocumentView());
		presenter.go();
	}

	// Fullscreen
	function openMapInNewWindow(){
		window.open(window.location.href);
	}
	
	// Hide show the navigator (read only mode)
	function toggleNavigator(){
		$(".ui-dialog").toggle();
	}
	
	function doSaveDocumentAndExit(data) {
		var renderer = new mindmaps.StaticCanvasRenderer();
		var renderer = new mindmaps.StaticCanvasRenderer();
		var $img = renderer.renderAsPNG(mindmapModel.getDocument());
		var base64img = $img.attr("src");
		
		if (!document.getElementById("cropper-options")) {
			var btns = '\
				<div id="cropper-buttons" class="buttons buttons-right">\
						<span class="ui-buttonset">\
							<button id="crop-and-finish" class="ui-button ui-widget ui-state-default ui-corner-left ui-button-text-icon-primary">\
								<span class="ui-button-text">'+_("Crop and save")+'</span>\
							</button>\
							<button id="do-not-crop-and-finish" class="ui-button ui-widget ui-state-default ui-button-text-icon-primary">\
								<span class="ui-button-text">'+_("Save without cropping")+'</span>\
							</button>\
							<button id="reset-cropper-canvas" class="ui-button ui-widget ui-state-default ui-corner-right ui-button-text-icon-primary">\
								<span class="ui-button-text">'+_("Reset")+'</span>\
							</button>\
							<button id="hide-cropper" class="ui-button ui-widget ui-state-default ui-corner-right ui-button-text-icon-primary">\
								<span class="ui-button-text">'+_("Cancel")+'</span>\
							</button>\
						</span>\
				</div>\
			'
			$("#toolbar .buttons").before(btns);

			var opts = '\
				<div id="cropper-options" class="buttons">\
					<p class="docs-toggles">\
						<label for="aspectRatio0"><input type="radio" id="aspectRatio0" name="aspectRatio" value="1.7777777777777777"> 16:9</label>\
						<label for="aspectRatio1"><input type="radio" id="aspectRatio1" name="aspectRatio" value="1.3333333333333333"> 4:3</label>\
						<label for="aspectRatio2"><input type="radio" id="aspectRatio2" name="aspectRatio" value="1"> 1:1</label>\
						<label for="aspectRatio3"><input type="radio" id="aspectRatio3" name="aspectRatio" value="0.6666666666666666">	2:3</label>\
						<label for="aspectRatio4"><input type="radio" id="aspectRatio4" name="aspectRatio" value="NaN" checked="checked"> Free</label>\
					</p>\
				</div>\
			'		
			$("#statusbar .buttons").before(opts);	

			$("#crop-and-finish").click(function(){
				var $this = $(this);
				var cropper = $image.data('cropper');
				var cropped;
				var result;
				if (cropper) {
					cropped = cropper.cropped;
					result = $image.cropper("getCroppedCanvas", '{ "maxWidth": 4096, "maxHeight": 4096 }');
					if (result) {
						eXeMindMaps.save(result.toDataURL('image/png'),data);
					}
				}
			});
			
			$("#do-not-crop-and-finish").click(function(){
				eXeMindMaps.save(base64img,data);
			});

			$("#hide-cropper").click(function(){
				$("body").removeClass("cropping")
				$("#cropper-img").html("");
			});		
			
			$("input[name='aspectRatio']").change(function(){
				var $this = $(this);
				if (!$image.data('cropper')) return;
				$image.cropper('destroy').cropper({
					aspectRatio: $this.val()
				});
			});
			
			$("#reset-cropper-canvas").click(function(){
				$image.cropper("reset");
			});
			
		}
		
		$("#aspectRatio4").prop("checked","checked");
		$("#cropper-img").html('<img id="cropper-image" src="'+base64img+'" alt="" />');
				
		
		$("body").addClass("cropping");
		
		try {
			$image.cropper('destroy')	
		} catch (e) {}
		
		var $image = $('#cropper-image');
		$image.cropper({aspectRatio: "NaN"});
		
		// Set the height
		var h = $("#canvas-container").height();
		if (!isNaN(h) && h>0) {
			$("#cropper-wrapper").css("height",h+"px");
		}
		$(window).resize(function(){
			var h = $("#canvas-container").height();
			if (!isNaN(h) && h>0) {
				$("#cropper-wrapper").css("height",h+"px");
			}
		});
		
		// Get the Cropper.js instance after initialized
		var cropper = $image.data('cropper');
	}	
		
	function saveDocumentAndExit() {			
			var content = mindmapModel.getDocument().prepareSave().serialize();
			var renderer = new mindmaps.StaticCanvasRenderer();
			var $img = renderer.renderAsPNG(mindmapModel.getDocument());
			var base64img = $img.attr("src");
			doSaveDocumentAndExit(content);
	}

	// Finish
	function doCloseDocument(showDialog) { 
		if (showDialog!=false) {
			top.mindmapEditor.dialog.close();
		} else {
			var doc = mindmapModel.getDocument();
			if (doc) mindmapModel.setDocument(null);	
		}
	}
	
	// / eXeLearning

	// Initializes the controller, registers for all commands and subscribes to event bus
	this.init = function() {
		
		var openDocumentCommand = commandRegistry.get(mindmaps.OpenDocumentCommand);
		openDocumentCommand.setHandler(doOpenDocument);
		openDocumentCommand.setEnabled(true);

		var saveDocumentCommand = commandRegistry.get(mindmaps.SaveDocumentCommand);
		saveDocumentCommand.setHandler(doSaveDocument); 
		
		// Save and exit
		var SaveDocumentAndExitCommand = commandRegistry.get(mindmaps.SaveDocumentAndExitCommand);
		SaveDocumentAndExitCommand.setHandler(saveDocumentAndExit);

		var openInNewWindowCommand = commandRegistry.get(mindmaps.OpenInNewWindowCommand);
		openInNewWindowCommand.setHandler(openMapInNewWindow);	

		var toggleNavigatorCommand = commandRegistry.get(mindmaps.ToggleNavigatorCommand);
		toggleNavigatorCommand.setHandler(toggleNavigator);			
		// / eXeLearning

		var closeDocumentCommand = commandRegistry.get(mindmaps.CloseDocumentCommand);
		closeDocumentCommand.setHandler(doCloseDocument);

		var exportCommand = commandRegistry.get(mindmaps.ExportCommand);
		exportCommand.setHandler(doExportDocument); 

		eventBus.subscribe(mindmaps.Event.DOCUMENT_CLOSED, function() {
			saveDocumentCommand.setEnabled(false);
			closeDocumentCommand.setEnabled(false);
			exportCommand.setEnabled(false);
		});

		// eXeLearning
		var enable = true;
		eventBus.subscribe(mindmaps.Event.DOCUMENT_OPENED, function() {
			saveDocumentCommand.setEnabled(enable); // You can't save the JSON file if it's not an open document (with an open license)
			closeDocumentCommand.setEnabled(true);
			exportCommand.setEnabled(true);
		});		
		// / eXeLearning
	};

	// Launches the main view controller
	this.go = function() {
		var viewController = new mindmaps.MainViewController(eventBus, mindmapModel, commandRegistry);
		viewController.go();

		// eXeLearning
		var hasData = top && top.mindmapEditor && top.mindmapEditor.data && top.mindmapEditor.data!="";
		if (hasData) openIdeviceDocument();
		else doNewDocument(); // Triggered when $mapCode == '{}'
		// / eXeLearning
	};

	this.init();
	
};
// Command.js
// Import
mindmaps.OpenDocumentCommand = function() {
	this.id = "OPEN_DOCUMENT_COMMAND";
	this.label = _("Import");
	this.shortcut = ["ctrl+o", "meta+o"];
	this.icon = "ui-icon-folder-open";
	this.description = _("Open an existing mind map from your disk");
};
mindmaps.OpenDocumentCommand.prototype = new mindmaps.Command();

// Export
mindmaps.SaveDocumentCommand = function() {
	this.id = "SAVE_DOCUMENT_COMMAND";
	this.label = _("Export");
	this.enabled = false;
	this.shortcut = ["ctrl+e", "meta+e"];
	this.icon = "ui-icon-copy";
	this.description = _("Download the map to save it");
};
mindmaps.SaveDocumentCommand.prototype = new mindmaps.Command();

// Save
mindmaps.saveDocumentInExeCommand = function() {
	this.id = "SAVE_DOCUMENT_IN_EXE_COMMAND";
	this.label = _("Save...");
	this.enabled = true;
	this.shortcut = ["ctrl+s", "meta+s"];
	this.icon = "ui-icon-disk";
	this.description = _("Save the mind map");
};
mindmaps.saveDocumentInExeCommand.prototype = new mindmaps.Command();

mindmaps.SaveDocumentAndExitCommand = function() {
	this.id = "SAVE_DOCUMENT_AND_EXIT_COMMAND"; 
	this.label = _("Save...");
	this.enabled = true; 
	this.shortcut = ["ctrl+s", "meta+s"];
	this.icon = "ui-icon-disk";
	this.description = "Salvar el mapa mental y salir";
};
mindmaps.SaveDocumentAndExitCommand.prototype = new mindmaps.Command();

// Fullscreen
mindmaps.OpenInNewWindowCommand = function() {
	this.id = "OPEN_IN_NEW_WINDOW_COMMAND";
	this.label = _("Fullscreen");
	this.enabled = true;
	this.icon = "ui-icon-newwin";
	this.description = _("Open this map in a new window");
};
mindmaps.OpenInNewWindowCommand.prototype = new mindmaps.Command();

// Hide/Show the navigator (read only mode)
mindmaps.ToggleNavigatorCommand = function() {
	this.id = "TOGGLE_NAVIGATOR_COMMAND";
	this.label = _("Navigator");
	this.enabled = true;
	this.icon = "ui-icon-zoomin";
	this.description = _("Hide or show the navigator");
};
mindmaps.ToggleNavigatorCommand.prototype = new mindmaps.Command();

// Finish
mindmaps.CloseDocumentCommand = function() {
	this.id = "CLOSE_DOCUMENT_COMMAND";
	this.label = _("Finish");
	this.icon = "ui-icon-close";
	this.description = _("Close the mind map editor");
};
mindmaps.CloseDocumentCommand.prototype = new mindmaps.Command();

// i18n
var eXeMindMaps = {
	init : function(){
		var footer = customStrings.footer;
			footer = footer.replace("mindmaps",'<a href="https://github.com/drichard/mindmaps" target="_blank" hreflang="en">mindmaps</a>');
		$("#about").html(footer);
		$("#print-placeholder").html(customStrings.printInstructions);
	},
	save : function(base64ToUpload,data){
		// Just save the image in Base64
		// exe_tinymce.dragDropImage will do the rest
		$("body").addClass("saving");
		result = JSON.stringify(data);
		result = result.replace(/\\"/g,'"')
		result = result.slice(1, -1);
		var img = new Image();
		img.onload = function() {
			var win = top.mindmapEditor.pluginDialog;
				win.find("#mindmapImg")[0].value(base64ToUpload);
				win.find("#mindmapCode")[0].value(result);
				win.find("#originalWidth")[0].value(this.width);
				win.find("#originalHeight")[0].value(this.height);						
				win.find("#width")[0].value(this.width);
				win.find("#height")[0].value(this.height);
			top.mindmapEditor.closeConfirmed = true;
			top.mindmapEditor.editor.close();
		}
		img.src = base64ToUpload;
	}
}
eXeMindMaps.init();