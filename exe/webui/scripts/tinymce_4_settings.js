_ = parent._;

var $exeTinyMCE = {
	
	// imagetools is disabled because it generates base64 images
	plugins: "toggletoolbars compat3x nonbreaking exegames_hangman exeeffects easyattributes exelist autolink exelink charmap print preview anchor tooltips searchreplace visualchars visualblocks code codemagic fullscreen insertdatetime table contextmenu paste template textcolor hr clearfloat addcontent definitionlist blockquoteandcite pastecode pastemath exeimage exealign exemedia abcmusic abbr",
	// These buttons will be visible when the others are hidden
	buttons0 : "toggletoolbars | undo redo | bold italic | formatselect | alignleft aligncenter alignright alignjustify | exelink unlink | bullist numlist | exeimage exemedia | fullscreen",
	// When buttons0 are hidden, 1, 2 and 3 are visible
	buttons1 : "toggletoolbars | bold italic | formatselect fontsizeselect fontselect | forecolor backcolor",
	buttons2 : "alignleft aligncenter alignright alignjustify clearfloat addcontent | bullist numlist definitionlist | exelink unlink | outdent indent | blockquote blockquoteandcite",	
	buttons3 : "undo redo | cut copy paste pastetext | pastehtml pastecode pastemath | tooltips exeeffects | exeimage exemedia abcmusic | codemagic | fullscreen",	
	// To add:
		// buttons2 : "exemath"
	content_css: "/css/extra.css," + exe_style,
	browser_spellcheck: true,
	templates: [
		{ title: _("2 columns") + " 50% 50%", url: "/scripts/tinymce_templates/2-50-50.html" },
		{ title: _("2 columns") + " 30% 70%", url: "/scripts/tinymce_templates/2-30-70.html" },
		{ title: _("2 columns") + " 70% 30%", url: "/scripts/tinymce_templates/2-70-30.html" },
		{ title: _("3 columns"), url: "/scripts/tinymce_templates/3.html" }
	],
	path_to_folder: "/scripts/tinymce_4/js/tinymce/",
	menu: {
		edit: {title: 'Edit', items: 'undo redo | selectall searchreplace | cut copy paste pastetext | easyattributes style'},
		insert: {title: 'Insert', items: 'template | nonbreaking hr charmap anchor | abbr insertdatetime | exegames_hangman'},
		format: {title: 'Format', items: 'underline strikethrough superscript subscript | formats | removeformat'},
		table: {title: 'Table', items: 'inserttable tableprops deletetable | cell row column'},
		tools: {title: 'Tools', items: 'code codemagic visualchars visualblocks fullscreen'}
	},	
	contextmenu: "exelink | inserttable | cell row column deletetable",
	language: "all", // We set all so we can use eXe's i18n mechanism in all.js
	table_default_styles: {
		width: '100%'
	},
	// Get classes from base.css and content.css
	getAvailableClasses: function() {
		
		var sheets = document.styleSheets;
		var sheet, rule, rules, item, name, tmp;
		var classes = [];
		var names = [];
		
		for (var i=0, iLen=sheets.length; i<iLen; i++) {
			sheet = sheets[i];
			if (sheet.href.indexOf("/base.css")!=-1 || sheet.href.indexOf("/content.css")!=-1) {
				rules = sheet.rules || sheet.cssRules;

				for (var j=0, jLen=rules.length; j<jLen; j++) {
					rule = rules[j];
					tmp = rule.cssText.match(/\.\w+/g);
					if (tmp) {
						classes.push.apply(classes, tmp);
					}
				}
			}
		}
		classes.sort();
		
		// Add some classes (exe-hidden, etc.)
		var rightClasses = [
			{text: '-- Not Set --', value: ''},
			{text: 'exe-hidden', value: 'exe-hidden'},
			{text: 'exe-hidden-accessible', value: 'exe-hidden-accessible'}
		];
		
		for (var z=0;z<classes.length;z++) {
			name = classes[z].replace('.','');
			if (isNaN(classes[z].charAt(1)) && names.indexOf(name)==-1 && name.indexOf("iDevice")==-1 && name.indexOf("Idevice")==-1 && name!="js") {
				rightClasses.push({text: name, value: name});
				names.push(name);
			}
		}
		
		return rightClasses;				
		
	},	
	rel_list: [
		{title: '---', value: ''},
		{title: 'alternate', value: 'alternate'},
		{title: 'author', value: 'author'},
		{title: 'bookmark', value: 'bookmark'},
		{title: 'external', value: 'external'},
		{title: 'help', value: 'help'},
		{title: 'license', value: 'license'},
		{title: 'lightbox', value: 'lightbox'},
		{title: 'next', value: 'next'},
		{title: 'nofollow', value: 'nofollow'},
		{title: 'prev', value: 'prev'}
	],
	image_title: true,
    
	init: function(mode,criteria,hide){
		
		var h = 300;
		if (mode=="multiple") h = 50;
		var w = 882;
		if (typeof($exeTinyMCEToggler.documentWidth)=='undefined' || (typeof($exeTinyMCEToggler.documentWidth)!='undefined' && $exeTinyMCEToggler.documentWidth<900)) w = '';
		
		tinymce.init({
			language: this.language,
			selector: criteria,
			width: w,
			height: h,
			convert_urls: false,
			schema: this.getSchema(),
			content_css: this.content_css,			
			resize: "both",
			entity_encoding: "raw",
			valid_children: this.getValidChildren(),
			valid_elements: this.getValidElements(),
			extended_valid_elements: this.getExtendedValidElements(),			
			fix_list_elements: true,
			plugins: this.plugins,
			menu: this.menu,
			contextmenu: this.contextmenu,
			browser_spellcheck: this.browser_spellcheck,
			templates: this.templates,
			table_default_styles: this.table_default_styles,
			table_class_list: this.getAvailableClasses(),
			rel_list: this.rel_list,
			// Base URL
			path_to_folder: this.path_to_folder,
			// Images
			image_advtab: true,
			image_title: this.image_title,
			file_browser_callback: function(field_name, url, type, win){
				exe_tinymce.chooseImage(field_name, url, type, win);
			},
			//Drag and Drop
			paste_data_images: true,
			images_upload_handler : function(blobInfo, success, failure) {
				var editor = tinyMCE.activeEditor.getBody();
				var imgs = editor.getElementsByTagName("IMG");

				var n = imgs.length - 1;

				var blobType= blobInfo.blob().type;
				if(blobInfo.blob().name === undefined){
					if(blobType.includes('image/')){
						blobName='img'+n+'.'+blobType.substr(6);
					}else{
						blobName='img'+n+'.png';
					}
				}else if(blobInfo.blob().name == 'image.png'){
					blobName='img'+n+'.png';
				}else{
					blobName=blobInfo.blob().name;
				}
				success(exe_tinymce.dragDropImage(
						'previewTinyMCEimageDragDrop', this, '', this,
						this.name, blobName, blobInfo
								.base64()));
					},
			// Media
			media_alt_source: false,
			media_poster: false,
			// Style Formats (see defaultStyleFormats in tinymce.js)
			style_formats : [
			
				{title: 'Headings', items: [
					{title: 'Heading 1', format: 'h1'},
					{title: 'Heading 2', format: 'h2'},
					{title: 'Heading 3', format: 'h3'},
					{title: 'Heading 4', format: 'h4'},
					{title: 'Heading 5', format: 'h5'},
					{title: 'Heading 6', format: 'h6'}
				]},

				{title: _('Inline'), items: [
					{title: _('Bold'), icon: 'bold', format: 'bold'},
					{title: _('Italic'), icon: 'italic', format: 'italic'},
					{title: _('Underline'), icon: 'underline', format: 'underline'},
					{title: _('Strikethrough'), icon: 'strikethrough', format: 'strikethrough'},
					{title: _('Superscript'), icon: 'superscript', format: 'superscript'},
					{title: _('Subscript'), icon: 'subscript', format: 'subscript'},
					{title: _('Code'), icon: 'code', format: 'code'},
					// Deletion, Insertion and Cite are not part of the default list
					{title: _('Deletion')+": <del>", inline: 'del'},
					{title: _('Insertion')+": <ins>", inline: 'ins'},
					{title: _('Cite')+": <cite>", inline: 'cite'}
				]},

				{title: 'Blocks', items: [
					{title: 'Paragraph', format: 'p'},
					{title: 'Blockquote', format: 'blockquote'},
					{title: 'Div', format: 'div'},
					{title: 'Pre', format: 'pre'}
				]},

				{title: 'Alignment', items: [
					{title: 'Left', icon: 'alignleft', format: 'alignleft'},
					{title: 'Center', icon: 'aligncenter', format: 'aligncenter'},
					{title: 'Right', icon: 'alignright', format: 'alignright'},
					{title: 'Justify', icon: 'alignjustify', format: 'alignjustify'}
				]}			
				
			],
			// style_formats_merge: true,
			toolbar: [
				this.buttons0,
				this.buttons1,
				this.buttons2,
				this.buttons3
			],			
			init_instance_callback: function(ed) {
				if (mode=="multiple") {
					$exeTinyMCEToggler.init(ed.id,hide);
				}
			},
			external_plugins: {
				"style": "/scripts/tinymce_4/js/tinymce/plugins/style/editor_plugin_src.js"
			}			
		});
	},
	
	getSchema: function(){
		var s = "html4";
		if (exe_export_format=="html5") s = "html5";
		return s;
	},
	
	getValidElements: function(){
		var e = "*[*]";
		if (exe_editor_mode=="strict") e = "";
		return e;
	},
	
	getValidChildren: function(){
		var v = "+body[style]";
		if (exe_export_format=="html5") v += ",+video[a],+audio[a]";
		if (exe_editor_mode=="strict") {
			v = "";
			if (exe_export_format=="html5") v = "+video[a],+audio[a]";
		}
		return v;
	},
	
	getExtendedValidElements: function(){
		var e = "";
		if (exe_editor_mode=="strict") {
			// To review (this is not really Strict)
			// Allow exe_math_latex for images and allowfullscreen for iframes
			// We just allow any attributes and values for both tags
			e = "img[*],iframe[*]";
			// Allow lang for span in HTML5
			if (exe_export_format=="html5") e += ",span[*]";
		}
		return e;
	}
	
}

/* This will run when having more than one TEXTAREA in a page */
var $exeTinyMCEToggler = {

	// mode - Always load TinyMCE or not.
	// setup - Step 0.
	// createViewer - Step 1. It creates the viewer (if mode!="always" it creates a link that will create the viewer).
	// removeViewer - It removes the viewer and init TinyMCE (with or without buttons).
	// getHelpLink - It looks for a help link to place the "Editor" link after it.
	// createEditorLink - It creates the link to toggle the editor. If there's no help link it just creates the editor.
	// startEditor - Init TinyMCE
	// addLinkAndToggle - It creates a link to toggle the editor after enabling it
	// init - Init TinyMCE (called from startEditor)
	// toggle - Toggle the editor
	
	mode: "always", // "always" if you don't want to have contents without HTML (plain textareas). Any other value if you do.
	
	setup: function(eds){
		eds.each(function(){
			var n = this.name;
			this.id = n;
			var e = $(this);
			if ($exeTinyMCEToggler.mode=="always") {
				$exeTinyMCEToggler.createViewer(e);
			} else {
				if (e.val()=="" || e.val()==e.html()) {
					// No HTML (plain textarea)
					e.css({
						border: "1px solid #ccc",
						height: "1.5em",
						width: "80%",
						padding: "15px",
						margin: "0 0 1.5em 0"
					});
					$exeTinyMCEToggler.createEditorLink(e,n);
				} else {
					$exeTinyMCEToggler.createViewer(e);
				}
			}
		});
	},
	
	createViewer: function(e){
		if (typeof(this.documentWidth)=='undefined') {
			this.documentWidth = $(document).width();
		}
		var id = e.attr("id");
		var n = e.attr("name");
		var c = e.val();
		var w = ";width:852px";
		if (this.documentWidth<900) w = "";
		$exeTinyMCEToggler.createEditorLink(e,n);
		var v = $('<div id="'+id+'-viewer" style="height:96px;padding:2px 15px;border:1px solid #ccc;overflow:auto'+w+'" onclick="$exeTinyMCEToggler.removeViewer(\''+id+'\')">'+c+'</div>');
		e.before(v).addClass("sr-av"); // If we use e.hide() TinyMCE won't be properly displayed
	},
	
	removeViewer: function(id){
		$('#'+id+'-toggler').remove();
		this.startEditor(id,true);
	},
	
	getHelpLink: function(e) {
    
        // The textarea has a label with an ID: textareaID-editor-label
        var w = $("#"+e.attr("id")+"-editor-label");
        if (w.length>0) return w;

		// Get the help link to insert the TinyMCE toggler after it
		var r = "";

		// Multi-choice, etc.
		var p = e.parent().parent().prev();
		var f = $("A",p).eq(0); // f = First link in p, being p the previous element (it can be different in each case)
		if (f.length==1 && f.html().indexOf("/images/help.gif")!=-1) {
			return f;
		}

		// Look for the help link in the previous .block
		p = e.parent().prev(".block");
		f = $("A",p).eq(0);
		if (f.length==1 && f.html().indexOf("/images/help.gif")!=-1) {
			return f;
		} 
			
		// Multi-select question has a different HTML. We look for the help link.
		p = e.parent();
		f = $("A",p).eq(0);
		if (f.length==1 && f.html().indexOf("/images/help.gif")!=-1) {
			return f;
		} 

		// Case Study...
		p = e.parent().prev().prev().prev();
		if (p.length==1) {
			var h = p.attr("href");
			if (h && h.indexOf("Javascript:void")==0) {
				return p;
			}
		}

		return r;
		
	}, 
	
	createEditorLink: function(e,id) {
        var f = this.getHelpLink(e);
        if (f!="") {
            var l = $('<a href="#" id="'+id+'-toggler" onclick="$exeTinyMCEToggler.startEditor(\''+id+'\',false);$(this).remove();return false" class="visible-editor">'+_("Editor")+'</a>');
            f.css("margin-right","5px").after(l);
        } else {
            // We can't find the help link, so be just enable the editor
            $exeTinyMCEToggler.startEditor(id,false);
        }        
	},
	
	startEditor: function(id,hide){
		$("#"+id+"-viewer").remove();
		$("#"+id).show();
		$exeTinyMCE.init("multiple","#"+id,hide);
	},
	
	addLinkAndToggle: function(id,lab,l,hide) {
		lab.css("margin-right","5px").after(l);
		if (hide!=false) this.toggle(id,document.getElementById(id+"-toggler"));
	},
	
	init: function(id,hide) {

        var e = $("#"+id);
        var f = this.getHelpLink(e);
        
        if (f!="") {
            var l = $('<a href="#" id="'+id+'-toggler" onclick="$exeTinyMCEToggler.toggle(\''+id+'\',this);return false" class="visible-editor">'+_("Editor")+'</a>');
            this.addLinkAndToggle(id,f,l,hide);
        }

	},
	
	toggle: function(id,e) {
		var p = $("#"+id).parent();
		window[e.id+"-iframeHeight"] = "134px";
		var t = $("IFRAME",p);
		var i = "";
		if (t.length==1) i = t.eq(0);
		if (e.className=='visible-editor') {
			// Hide toolbars
			if (i!='') {
				window[e.id+"-iframeHeight"] = i.css("height");
				var w = i.css("width");
				if (parseInt(w.replace("px",""))<500) w = "700px";
				i.css("width",w);
				var h = parseInt(window[e.id+"-iframeHeight"].replace("px"));
                h = 100; // Force height: Comment this line to make it as high as the TinyMCE editor
				i.css("height",h+"px");
			}
			e.className = 'hidden-editor';
			p.addClass("hidden-editor");
			$(".mce-edit-area").css("border-width","0"); // So the box doesn't have a 2px border top
		} else {
			// Show toolbars
			if (i!='') i.css("height",window[e.id+"-iframeHeight"]);
			e.className = 'visible-editor';
			$(".mce-edit-area").css("border-width","1px 0 0");
			p.removeClass("hidden-editor");
		}
	}
	
}

$(function(){
	var selector = ".mceEditor";
	var eds = $("textarea"+selector);
	if (eds.length>0) {
		if (eds.length==1) $exeTinyMCE.init("single",selector);
		else $exeTinyMCEToggler.setup(eds);
	}
});