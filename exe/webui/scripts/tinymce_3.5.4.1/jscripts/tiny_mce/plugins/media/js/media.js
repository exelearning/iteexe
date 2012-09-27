(function() {
	var url;

	if (url = tinyMCEPopup.getParam("media_external_list_url"))
		document.write('<script language="javascript" type="text/javascript" src="' + tinyMCEPopup.editor.documentBaseURI.toAbsolute(url) + '"></script>');

	function get(id) {
		return document.getElementById(id);
	}

	function clone(obj) {
		var i, len, copy, attr;

		if (null == obj || "object" != typeof obj)
			return obj;

		// Handle Array
		if ('length' in obj) {
			copy = [];

			for (i = 0, len = obj.length; i < len; ++i) {
				copy[i] = clone(obj[i]);
			}

			return copy;
		}

		// Handle Object
		copy = {};
		for (attr in obj) {
			if (obj.hasOwnProperty(attr))
				copy[attr] = clone(obj[attr]);
		}

		return copy;
	}

	function getVal(id) {
		var elm = get(id);

		if (elm.nodeName == "SELECT")
			return elm.options[elm.selectedIndex].value;

		if (elm.type == "checkbox")
			return elm.checked;

		return elm.value;
	}

	function setVal(id, value, name) {
		if (typeof(value) != 'undefined' && value != null) {
			var elm = get(id);

			if (elm.nodeName == "SELECT")
				selectByValue(document.forms[0], id, value);
			else if (elm.type == "checkbox") {
				if (typeof(value) == 'string') {
					value = value.toLowerCase();
					value = (!name && value === 'true') || (name && value === name.toLowerCase());
				}
				elm.checked = !!value;
			} else
				elm.value = value;
		}
	}

	window.Media = {
		init : function() {
			var html, editor, self = this;

			self.editor = editor = tinyMCEPopup.editor;

			// Setup file browsers and color pickers
			get('filebrowsercontainer').innerHTML = getBrowserHTML('filebrowser','src','media','media');
			get('qtsrcfilebrowsercontainer').innerHTML = getBrowserHTML('qtsrcfilebrowser','quicktime_qtsrc','media','media');
			get('bgcolor_pickcontainer').innerHTML = getColorPickerHTML('bgcolor_pick','bgcolor');
			get('video_altsource1_filebrowser').innerHTML = getBrowserHTML('video_filebrowser_altsource1','video_altsource1','media','media');
			get('video_altsource2_filebrowser').innerHTML = getBrowserHTML('video_filebrowser_altsource2','video_altsource2','media','media');
			get('audio_altsource1_filebrowser').innerHTML = getBrowserHTML('audio_filebrowser_altsource1','audio_altsource1','media','media');
			get('audio_altsource2_filebrowser').innerHTML = getBrowserHTML('audio_filebrowser_altsource2','audio_altsource2','media','media');
			get('video_poster_filebrowser').innerHTML = getBrowserHTML('filebrowser_poster','video_poster','media','image');

			html = self.getMediaListHTML('medialist', 'src', 'media', 'media');
			if (html == "")
				get("linklistrow").style.display = 'none';
			else
				get("linklistcontainer").innerHTML = html;

			if (isVisible('filebrowser'))
				get('src').style.width = '230px';

			if (isVisible('video_filebrowser_altsource1'))
				get('video_altsource1').style.width = '220px';

			if (isVisible('video_filebrowser_altsource2'))
				get('video_altsource2').style.width = '220px';

			if (isVisible('audio_filebrowser_altsource1'))
				get('audio_altsource1').style.width = '220px';

			if (isVisible('audio_filebrowser_altsource2'))
				get('audio_altsource2').style.width = '220px';

			if (isVisible('filebrowser_poster'))
				get('video_poster').style.width = '220px';

			editor.dom.setOuterHTML(get('media_type'), self.getMediaTypeHTML(editor));

			self.setDefaultDialogSettings(editor);
			self.data = clone(tinyMCEPopup.getWindowArg('data'));
			self.dataToForm();
			self.preview();

			updateColor('bgcolor_pick', 'bgcolor');
		},

		insert : function() {
		
			// The New eXeLearning
			var html5_media = false;		
			var t = get("media_type").value;
			var src = get("src").value;
			var file_extension = src.split(".").pop().toLowerCase();
			if (file_extension!='') {
				if (t=='video' || t=='audio') {
					var msg = tinyMCEPopup.getLang("media_dlg.html5_warning")+".\n\n"+tinyMCEPopup.getLang("media_dlg.selected_file")+": "+file_extension;
					if (file_extension=="mp3" || file_extension=="flv") msg +="\n\n"+tinyMCEPopup.getLang("media_dlg.recommended_type")+": "+tinyMCEPopup.getLang("media_dlg.flash");
					msg += "\n\n"+tinyMCEPopup.getLang("media_dlg.confirm_question");
					if (!confirm(msg)) {
						return false;
					} else {
						html5_media = true; 					
					}		
				}
				else if (t=='quicktime') {
					var mH = get("height").value;			
					var mW = get("width").value;					
					var QTCode = '';
						if (mH=='') mH = 320;
						if (mW=='') mW = 240;
						QTCode += '<object type="video/quicktime" data="'+src+'" width="'+mH+'" height="'+mW+'">';
						QTCode += '<param name="controller" value="true" />';
						QTCode += '<param name="autoplay" value="false" />';
						QTCode += '<a href="'+src+'">mov.mov</a>';
						QTCode += '</object>';
					tinyMCEPopup.editor.execCommand('mceInsertContent', false, QTCode);
					tinyMCEPopup.close();			
				}
			}
			// The New eXeLearning
		
			var editor = tinyMCEPopup.editor;

			this.formToData();
			editor.execCommand('mceRepaint');
			tinyMCEPopup.restoreSelection();
			
			// The New eXeLearning
			if (html5_media) {
				
				var w = "";
				if (window.parent) w = window.parent;
				else if (window.opener) w = window.opener;
				
				if (w!='') {
				
					var uploaded_file_1_name = w.exe_tinymce.uploaded_file_1_name;
					
					if (typeof(uploaded_file_1_name)!='undefined' && uploaded_file_1_name!="") {
						
						// If present, remove the path to the file:						
						var uploaded_file_1_name_parts = uploaded_file_1_name.split("/");
						if (uploaded_file_1_name_parts.length>1) uploaded_file_1_name = uploaded_file_1_name_parts[uploaded_file_1_name_parts.length-1];						
						
						setVal("src","resources/"+uploaded_file_1_name);
						
						get(t+"_controls").checked=true;
						this.formToData('source');
						
						var old_code = get("source").value;
						
						var uploaded_file_1_link = '';
						var uploaded_file_1_link_text = get('download_'+t+'_text').value;
						if (uploaded_file_1_link_text!='') uploaded_file_1_link += uploaded_file_1_link_text+' ';
						uploaded_file_1_link += uploaded_file_1_name;						
						
						if (old_code.indexOf('class="download-media-file"')==-1) {
							// We add links to the files so than eXe includes those files in the package and the users with no HTML5 support can download the files
							// Main file
							var links_to_files = '<a href="'+src+'" class="download-media-file">'+uploaded_file_1_link+'</a>';
							// Replacing </video> or </audio> by Links + </video> or </audio>
							var new_code = old_code.replace("</"+t+">",links_to_files+"</"+t+">");
							setVal("source",new_code);
						} else {
							var countAs = old_code.match(/\<a /g); 
							var countClassName = old_code.match(/class=\"download-media-file\"/g);  
							if (countAs.length==1 && countClassName.length==1){
								// Relpace href="old_file" class="download-media-file" by href="new_file" class="download-media-file"
								var new_code = old_code.replace(/href="(.*?)"/,'href="'+src+'"');
								new_code = new_code.replace(/class="download-media-file">(.*?)</,'class="download-media-file">'+uploaded_file_1_link+'<');
								setVal("source",new_code);							
							}	
						}
						this.formToData();			
					}
					
				}
				
			}
			// The New eXeLearning			
			
			editor.selection.setNode(editor.plugins.media.dataToImg(this.data));
			tinyMCEPopup.close();
		},

		preview : function() {
			// The New eXeLearning
			//get('prev').innerHTML = this.editor.plugins.media.dataToHtml(this.data, true);
			var preview_html = this.editor.plugins.media.dataToHtml(this.data, true);
			
			var w = "";
			if (window.parent) w = window.parent;
			else if (window.opener) w = window.opener;
			if (w!='') {
				if(typeof(w.exe_package_name)!="undefined") {
					preview_html = preview_html.replace("{ 'url': 'resources","{ 'url': '/"+w.exe_package_name+"/resources");
				}
				// exe_package_name global var is missing (old eXeLearning) and it's a flv:
				else if (preview_html.indexOf("{ 'url': 'resources")!=-1) {
					preview_html = tinyMCEPopup.getLang("media_dlg.preview_error")+".";
				}
			}
			
			get('prev').innerHTML = preview_html;
			// The New eXeLearning
		},

		moveStates : function(to_form, field) {
			var data = this.data, editor = this.editor,
				mediaPlugin = editor.plugins.media, ext, src, typeInfo, defaultStates, src;

			defaultStates = {
				// QuickTime
				quicktime_autoplay : true,
				quicktime_controller : true,

				// Flash
				flash_play : true,
				flash_loop : true,
				flash_menu : true,

				// WindowsMedia
				windowsmedia_autostart : true,
				windowsmedia_enablecontextmenu : true,
				windowsmedia_invokeurls : true,

				// RealMedia
				realmedia_autogotourl : true,
				realmedia_imagestatus : true
			};

			function parseQueryParams(str) {
				var out = {};

				if (str) {
					tinymce.each(str.split('&'), function(item) {
						var parts = item.split('=');

						out[unescape(parts[0])] = unescape(parts[1]);
					});
				}

				return out;
			};

			function setOptions(type, names) {
				var i, name, formItemName, value, list;

				if (type == data.type || type == 'global') {
					names = tinymce.explode(names);
					for (i = 0; i < names.length; i++) {
						name = names[i];
						formItemName = type == 'global' ? name : type + '_' + name;

						if (type == 'global')
						list = data;
					else if (type == 'video' || type == 'audio') {
							list = data.video.attrs;

							if (!list && !to_form)
							data.video.attrs = list = {};
						} else
						list = data.params;

						if (list) {
							if (to_form) {
								setVal(formItemName, list[name], type == 'video' || type == 'audio' ? name : '');
							} else {
								delete list[name];

								value = getVal(formItemName);
								if ((type == 'video' || type == 'audio') && value === true)
									value = name;

								if (defaultStates[formItemName]) {
									if (value !== defaultStates[formItemName]) {
										value = "" + value;
										list[name] = value;
									}
								} else if (value) {
									value = "" + value;
									list[name] = value;
								}
							}
						}
					}
				}
			}

			if (!to_form) {
				data.type = get('media_type').options[get('media_type').selectedIndex].value;
				data.width = getVal('width');
				data.height = getVal('height');

				// Switch type based on extension
				src = getVal('src');
				if (field == 'src') {
					ext = src.replace(/^.*\.([^.]+)$/, '$1');
					if (typeInfo = mediaPlugin.getType(ext))
						data.type = typeInfo.name.toLowerCase();

					setVal('media_type', data.type);
				}

				if (data.type == "video" || data.type == "audio") {
					if (!data.video.sources)
						data.video.sources = [];

					data.video.sources[0] = {src: getVal('src')};
				}
			}

			// Hide all fieldsets and show the one active
			get('video_options').style.display = 'none';
			get('audio_options').style.display = 'none';
			get('flash_options').style.display = 'none';
			get('quicktime_options').style.display = 'none';
			get('shockwave_options').style.display = 'none';
			get('windowsmedia_options').style.display = 'none';
			get('realmedia_options').style.display = 'none';
			get('embeddedaudio_options').style.display = 'none';

			if (get(data.type + '_options'))
				get(data.type + '_options').style.display = 'block';

			setVal('media_type', data.type);
			
			// The New eXeLearning	
			get('exe_video_options').style.display = 'none';
			get('exe_audio_options').style.display = 'none';
			get('advanced_tab').style.display = 'block';
			if (data.type=='video') {
				get('exe_video_options').style.display = 'block';
			}
			else if (data.type=='audio') {
				get('exe_audio_options').style.display = 'block';
			}
			else if (data.type=='quicktime') {
				get('advanced_tab').style.display = 'none';
			}
			// /The New eXeLearning

			setOptions('flash', 'play,loop,menu,swliveconnect,quality,scale,salign,wmode,base,flashvars');
			setOptions('quicktime', 'loop,autoplay,cache,controller,correction,enablejavascript,kioskmode,autohref,playeveryframe,targetcache,scale,starttime,endtime,target,qtsrcchokespeed,volume,qtsrc');
			setOptions('shockwave', 'sound,progress,autostart,swliveconnect,swvolume,swstretchstyle,swstretchhalign,swstretchvalign');
			setOptions('windowsmedia', 'autostart,enabled,enablecontextmenu,fullscreen,invokeurls,mute,stretchtofit,windowlessvideo,balance,baseurl,captioningid,currentmarker,currentposition,defaultframe,playcount,rate,uimode,volume');
			setOptions('realmedia', 'autostart,loop,autogotourl,center,imagestatus,maintainaspect,nojava,prefetch,shuffle,console,controls,numloop,scriptcallbacks');
			setOptions('video', 'poster,autoplay,loop,muted,preload,controls');
			setOptions('audio', 'autoplay,loop,preload,controls');
			setOptions('embeddedaudio', 'autoplay,loop,controls');
			setOptions('global', 'id,name,vspace,hspace,bgcolor,align,width,height');

			if (to_form) {
				if (data.type == 'video') {
					if (data.video.sources[0])
						setVal('src', data.video.sources[0].src);

					src = data.video.sources[1];
					if (src)
						setVal('video_altsource1', src.src);

					src = data.video.sources[2];
					if (src)
						setVal('video_altsource2', src.src);
                } else if (data.type == 'audio') {
                    if (data.video.sources[0])
                        setVal('src', data.video.sources[0].src);
                    
                    src = data.video.sources[1];
                    if (src)
                        setVal('audio_altsource1', src.src);
                    
                    src = data.video.sources[2];
                    if (src)
                        setVal('audio_altsource2', src.src);
				} else {
					// Check flash vars
					if (data.type == 'flash') {
						tinymce.each(editor.getParam('flash_video_player_flashvars', {url : '$url', poster : '$poster'}), function(value, name) {
							if (value == '$url')
								data.params.src = parseQueryParams(data.params.flashvars)[name] || data.params.src || '';
						});
					}

					setVal('src', data.params.src);					
					
				}
			} else {
				src = getVal("src");

				// YouTube *NEW*
				if (src.match(/youtu.be\/[a-z1-9.-_]+/)) {
					data.width = 425;
					data.height = 350;
					data.params.frameborder = '0';
					data.type = 'iframe';
					src = 'http://www.youtube.com/embed/' + src.match(/youtu.be\/([a-z1-9.-_]+)/)[1];
					setVal('src', src);
					setVal('media_type', data.type);
				}

				// YouTube
				if (src.match(/youtube.com(.+)v=([^&]+)/)) {
					data.width = 425;
					data.height = 350;
					data.params.frameborder = '0';
					data.type = 'iframe';
					src = 'http://www.youtube.com/embed/' + src.match(/v=([^&]+)/)[1];
					setVal('src', src);
					setVal('media_type', data.type);
				}

				// Google video
				if (src.match(/video.google.com(.+)docid=([^&]+)/)) {
					data.width = 425;
					data.height = 326;
					data.type = 'flash';
					src = 'http://video.google.com/googleplayer.swf?docId=' + src.match(/docid=([^&]+)/)[1] + '&hl=en';
					setVal('src', src);
					setVal('media_type', data.type);
				}

				if (data.type == 'video') {
					if (!data.video.sources)
						data.video.sources = [];

					data.video.sources[0] = {src : src};

					src = getVal("video_altsource1");
					if (src)
						data.video.sources[1] = {src : src};

					src = getVal("video_altsource2");
					if (src)
						data.video.sources[2] = {src : src};
                } else if (data.type == 'audio') {
                    if (!data.video.sources)
                        data.video.sources = [];
                    
                    data.video.sources[0] = {src : src};
                    
                    src = getVal("audio_altsource1");
                    if (src)
                        data.video.sources[1] = {src : src};
                    
                    src = getVal("audio_altsource2");
                    if (src)
                        data.video.sources[2] = {src : src};
				} else
					data.params.src = src;
					
				// The New eXeLearning
				var file_extension = src.split(".").pop().toLowerCase();
				if (file_extension=='mp3') {
					//setVal('width', 400);
					//setVal('height', 15);
					var new_src = src;
					if (src.indexOf("../templates/xspf_player.swf?song_url=")==0) {
						new_src = src.replace("../templates/xspf_player.swf?song_url=","");
					}
					data.width = 400;				
					data.height = 15;
					data.params.exe_mp3 = new_src;
				} else if (file_extension=='flv') {
					setVal('src', src);
					data.params.src = src;
					data.params.exe_flv = src;
					//data.params.flashvars = "config={'playlist': [ { 'url': '"+src+"', 'autoPlay': false, 'autoBuffering': true } ] }";					
				}
				// The New eXeLearning					

				// Set default size
				setVal('width', data.width || (data.type == 'audio' ? 300 : 320));
				setVal('height', data.height || (data.type == 'audio' ? 32 : 240));			
			}
		},

		dataToForm : function() {
			this.moveStates(true);
		},

		formToData : function(field) {
			if (field == "width" || field == "height")
				this.changeSize(field);

			if (field == 'source') {
				this.moveStates(false, field);
				setVal('source', this.editor.plugins.media.dataToHtml(this.data));
				this.panel = 'source';
			} else {
				if (this.panel == 'source') {
					this.data = clone(this.editor.plugins.media.htmlToData(getVal('source')));
					this.dataToForm();
					this.panel = '';
				}

				this.moveStates(false, field);
				this.preview();
			}
			
			// The New eXeLearning
			if (field == 'type') {
				if (get('media_type').value=='quicktime') {
					get('advanced_tab').style.display='none';					
				}
				else {
					get('advanced_tab').style.display='block';					
				}
			}
			// The New eXeLearning
		},

		beforeResize : function() {
            this.width = parseInt(getVal('width') || (this.data.type == 'audio' ? "300" : "320"), 10);
            this.height = parseInt(getVal('height') || (this.data.type == 'audio' ? "32" : "240"), 10);
		},

		changeSize : function(type) {
			var width, height, scale, size;

			if (get('constrain').checked) {
                width = parseInt(getVal('width') || (this.data.type == 'audio' ? "300" : "320"), 10);
                height = parseInt(getVal('height') || (this.data.type == 'audio' ? "32" : "240"), 10);

				if (type == 'width') {
					this.height = Math.round((width / this.width) * height);
					setVal('height', this.height);
				} else {
					this.width = Math.round((height / this.height) * width);
					setVal('width', this.width);
				}
			}
		},

		getMediaListHTML : function() {
			if (typeof(tinyMCEMediaList) != "undefined" && tinyMCEMediaList.length > 0) {
				var html = "";

				html += '<select id="linklist" name="linklist" style="width: 250px" onchange="this.form.src.value=this.options[this.selectedIndex].value;Media.formToData(\'src\');">';
				html += '<option value="">---</option>';

				for (var i=0; i<tinyMCEMediaList.length; i++)
					html += '<option value="' + tinyMCEMediaList[i][1] + '">' + tinyMCEMediaList[i][0] + '</option>';

				html += '</select>';

				return html;
			}

			return "";
		},

		getMediaTypeHTML : function(editor) {
			function option(media_type, element) {
				if (!editor.schema.getElementRule(element || media_type)) {
					return '';
				}

				return '<option value="'+media_type+'">'+tinyMCEPopup.editor.translate("media_dlg."+media_type)+'</option>'
			}

			var html = "";

			html += '<select id="media_type" name="media_type" onchange="Media.formToData(\'type\');">';
			html += option("video");
			html += option("audio");
			html += option("flash", "object");
			html += option("quicktime", "object");
			//html += option("shockwave", "object");
			html += option("windowsmedia", "object");
			//html += option("realmedia", "object");
			html += option("iframe");

			if (editor.getParam('media_embedded_audio', false)) {
				html += option('embeddedaudio', "object");
			}

			html += '</select>';
			return html;
		},

		setDefaultDialogSettings : function(editor) {
			var defaultDialogSettings = editor.getParam("media_dialog_defaults", {});
			tinymce.each(defaultDialogSettings, function(v, k) {
				setVal(k, v);
			});
		}
	};

	tinyMCEPopup.requireLangPack();
	tinyMCEPopup.onInit.add(function() {
		Media.init();
	});
})();
