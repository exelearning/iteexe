/**
 * Mind mapping iDevice (edition code)
 *
 * It works with mindmaps (https://www.mindmaps.app/), by David Richard (http://drichard.org/), licensed under AGPL V3.
 * See /tools/mindmaps/LICENSE
 *
 * It includes Cropper (https://fengyuanchen.github.io/cropper) and jQuery Cropper (https://fengyuanchen.github.io/jquery-cropper), by Chen Fengyuan, under the MIT license.
 *
 * Released under the MIT license.
 * Author: Ignacio Gros (http://gros.es/) for http://exelearning.net/
 *
 */
 
var $exeDevice = {
	
	// We use eXe's _ function
	i18n : {
		name : _('Mind map')
	},	
	
	iDevicePath : "/scripts/idevices/mindmaps/edition/",
	
	init : function(){
		
		this.createForm();
		 
	},
	
	// Create the form to insert HTML in the TEXTAREA
	createForm : function(){
		
		var html = '';
		
		var field = $("textarea.jsContentEditor").eq(0);
		
		html = '\
			<div id="mindmapsIdeviceForm">\
				<p style="text-align:center"><input type="button" id="mindmapsOpenEditorLink" value="'+_("Editor")+'" /></p>\
				<div id="mindmapsIdeviceImg"></div>\
				<div id="mindmapsIdeviceData"></div>\
			</div>\
		';
		
		field.before(html);
		
		$("#mindmapsOpenEditorLink").click(function(){
			$exeDevice.editor.start(this);
			return false;		   
		});
		
		// Create the object to contain all data
		top.mindmapEditor = {
			imgWrapper : $("#mindmapsIdeviceImg"),
			dataWrapper : $("#mindmapsIdeviceData"),
			win : null,
			closeConfirmed : false,
			authoringScript : $exeAuthoring
		};		
		
		this.loadPreviousValues(field);
		
	},
	
	// Load the saved values in the form fields
	loadPreviousValues : function(field){

		var originalHTML = field.val();
		if (originalHTML != '') {
			
			var wrapper = $("<div id='mindmapsTmpWrapper'></div>");
				wrapper.html(originalHTML);
			$('body').append(wrapper);
			
			// Preview the image
			var img = $("#mindmapsTmpWrapper img");
			if (img.length==1) top.mindmapEditor.imgWrapper.html('<img src="'+img.attr("src")+'" alt="" />');
			
			// Get the previous code
			var code = $("#mindmapsTmpWrapper .exe-mindmap-code");
			if (code.length==1) top.mindmapEditor.dataWrapper.html(code.html());
			
		}	
		
	},
	
	editor : {
		
		start : function(){
			
			var win = new Ext.Window({
				height:Ext.getBody().getViewSize().height*.85,
				width:Ext.getBody().getViewSize().width*.95,
				modal: true,
				resizable: false,
				maximizable: true,
				id: 'interactiveVideoEditor',
				title: _("Editor"),
				items: {
					xtype: 'uxiframe',
					src: $exeDevice.iDevicePath+"editor/",
					height: '100%'
				},
				closable: true,
				listeners: {
					beforeclose:function(win) {
						if (top.mindmapEditor.closeConfirmed==false) {
							Ext.Msg.show({
								title: _("Confirm"),
								msg: _("If you have made changes and have not saved them, they will be lost. Do you really want to quit?"),
								buttons:Ext.Msg.YESNO,
								callback:function(btn) {
									if('yes' === btn) {
										top.mindmapEditor.closeConfirmed = true;
										top.mindmapEditor.dialog.close();
									}
								}
							});
							return false;
						}
					}
				}				
			});
			// Save the requiered data so you can close it, etc.
			top.mindmapEditor.dialog = win;

			// Open the window
			win.show();
			
		}
		
	},
	
	save : function(){
		
		var img = $("#mindmapsIdeviceImg img");
		var data = $("#mindmapsIdeviceData");
		if (img.length==0 || data.html().indexOf("{")!=0) {
			eXe.app.alert(_("There is nothing to save..."));
			return false;
		}
		
		var w = img.width();
		var h = img.height();
		if (!w || isNaN(w) || w==0 || !h || isNaN(h) || h==0) {
			eXe.app.alert(_("Could not retrieve data (Core error)"));
			return false;
		}
		
		html = '<div class="exe-mindmap">';
			html += '\
			<figure class="exe-figure exe-image position-center" style="width:'+w+'px;">\
				<img src="'+img.attr("src")+'" width="'+w+'" height="'+h+'" alt="" />\
				<figcaption class="figcaption"><span class="title"><em>mindmap</em></span></figcaption>\
			</figure>';
			html += '<p class="exe-mindmap-code" style="display:none">'+data.html()+'</p>';
		html += '</div>';
		
		return html;
		
	}

}