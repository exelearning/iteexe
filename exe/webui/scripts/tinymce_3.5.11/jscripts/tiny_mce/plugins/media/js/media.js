

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
            get('video_poster_filebrowser').innerHTML = getBrowserHTML('filebrowser_poster','video_poster','image','media');

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
            var t = get("media_type").value;
            var src = get("src").value;
            var file_extension = src.split(".").pop().toLowerCase();
            
            var mH = get("height").value;           
            var mW = get("width").value;
            // Default dimensions
            if (t=='audio') {
                if (mW=='') mW = 300;
                if (mH=='') mH = 32;                            
            } else {
                if (mW=='') mW = 320;
                if (mH=='') mH = 240;                   
            }

            // Alternative content (a link to file itself)
            var link_text = src;
            var file_src = src;
            var w = "";
            if (window.parent) w = window.parent;
            else if (window.opener) w = window.opener;
            if (w!="") {
                var uploaded_file_1_name = w.exe_tinymce.uploaded_file_1_name;
                if (typeof(uploaded_file_1_name)!='undefined' && uploaded_file_1_name!="") {
                    // If present, remove the path to the file:                     
                    var uploaded_file_1_name_parts = uploaded_file_1_name.split("/");
                    if (uploaded_file_1_name_parts.length>1) uploaded_file_1_name = uploaded_file_1_name_parts[uploaded_file_1_name_parts.length-1];
                    link_text = uploaded_file_1_name;
                }
            }   

            if (file_extension!='') {
                if (t=='video' || t=='audio') {
                    var msg = tinyMCEPopup.getLang("media_dlg.html5_warning")+".\n\n"+tinyMCEPopup.getLang("media_dlg.selected_file")+": "+file_extension;
                    if (file_extension=="flv")
                    	msg +="\n\n"+tinyMCEPopup.getLang("media_dlg.recommended_type")+": "+tinyMCEPopup.getLang("media_dlg.flash");
                    msg += "\n\n"+tinyMCEPopup.getLang("media_dlg.confirm_question");
                    if (!file_extension=="flv" && !confirm(msg)) {
                        return false;
                    } else {
                        var mediaelement = '';
                        // The New eXeLearning
                        var autoplayelement = '';
                        var html5MediaCode= '';
                        var controlsElement = '';
                        // /The New eXeLearning 
                        
                        
                        if (get("mediaelement").checked) {
                            mediaelement = ' class="mediaelement"';
                        }
                        
                        // The New eXeLearning
                        if(get("autoplayelement").checked) {
                            autoplayelement = ' autoplay="autoplay"';
                            
                        }
                        
                        if(get('controlselement').checked) {
                            controlselement = ' controls="controls" ';
                        }
                            html5MediaCode += '<'+t+mediaelement+ ' ' + autoplayelement +' src="'+file_src+'" width="'+mW+'" height="'+mH+'" ' + controlselement + '>';
                            html5MediaCode += '<a href="'+src+'">'+link_text+'</a>';
                            html5MediaCode += '</'+t+'>';
                        //added controlselement and autoplayelement to the above
                        // /The New eXeLearning
                        //tinyMCEPopup.editor.execCommand('mceInsertContent', false, html5MediaCode);
                        Media.executeInsert(html5MediaCode);
                        tinyMCEPopup.close(); 
                        return false; // To avoid the execution of the next Media.executeInsert(obj) in some browsers
                    }       
                }
                else if (t=='quicktime') {
                    var QTCode = '';
                        QTCode += '<object type="video/quicktime" data="'+src+'" width="'+mW+'" height="'+mH+'">';
                        QTCode += '<param name="controller" value="true" />';
                        QTCode += '<param name="autoplay" value="false" />';
                        QTCode += '<a href="'+src+'">'+link_text+'</a>';
                        QTCode += '</object>';
                    //tinyMCEPopup.editor.execCommand('mceInsertContent', false, QTCode);
                    Media.executeInsert(QTCode);
                    tinyMCEPopup.close();
                    return false;					
                }
                else if (t=='windowsmedia') {
                    var WMCode = '';
                        WMCode += '<object type="application/x-mplayer2" data="'+file_src+'" width="'+mW+'" height="'+mH+'">';
                        // WMCode += '<param name="url" value="'+file_src+'" />'; TinyMCE already includes this.
                        WMCode += '<param name="autostart" value="false" />';
                        WMCode += '<a href="'+src+'">'+link_text+'</a>';
                        WMCode += '</object>';
                    //tinyMCEPopup.editor.execCommand('mceInsertContent', false, WMCode);
                    Media.executeInsert(WMCode);
                    tinyMCEPopup.close();
                    return false;					
                }
                else if (t=='realmedia') {
                    var RMCode = '';
                        RMCode += '<object type="audio/x-pn-realaudio-plugin" data="'+file_src+'" width="'+mW+'" height="'+mH+'">';
                        // RMCode += '<param name="src" value="'+src+'" />'; TinyMCE already includes this.
                        RMCode += '<a href="'+src+'">'+link_text+'</a>';
                        RMCode += '</object>';
                    //tinyMCEPopup.editor.execCommand('mceInsertContent', false, RMCode);
                    Media.executeInsert(RMCode);
                    tinyMCEPopup.close();
                    return false;
                }
            }
            // /The New eXeLearning
            
            var editor = tinyMCEPopup.editor;

            this.formToData();
            editor.execCommand('mceRepaint');
            tinyMCEPopup.restoreSelection();
            //editor.selection.setNode(editor.plugins.media.dataToImg(this.data));
            // The New eXeLearning
            // We replace the previous line:
            var obj = editor.plugins.media.dataToHtml(this.data);
            Media.executeInsert(obj);
            // /The New eXeLearning            
            tinyMCEPopup.close();
        },
        
        // The New eXeLearning
        executeInsert : function(c) {
        
            // Remove protocol for some providers
            if (c.indexOf("<iframe")==0){
                c = c.replace('" src="http://www.youtube.com/','" src="//www.youtube.com/');
                c = c.replace('" src="http://video.google.com/','" src="//video.google.com/');
                c = c.replace('" src="http://player.vimeo.com/','" src="//player.vimeo.com/');
                c = c.replace('" src="http://maps.google.com/','" src="//maps.google.com/');
            }
        
            var imageHeader = getVal("header");
            var imageTitle = getVal("imagetitle");
            var imageTitleLink = getVal("imagetitlelink");
            var authorName = getVal("authorname");
            var authorNameLink = getVal("authornamelink");
            var captionLicense = getVal("captionlicense");
            var imageAlignment = getVal("align");
            
            if (imageHeader!="" || imageTitle!="" || imageTitleLink!="" || authorName!="" || authorNameLink!="" || captionLicense!="") {
                var hText = "";
                var cText = "";
                var license = "";
                
                var figureTag = "div";
                var headerFigcaptionTag = "div";
                var footerFigcaptionTag = "div";
                if (parent.exe_export_format=="html5") {
                    figureTag = "figure";
                    if (imageTitle=="" && imageTitleLink=="" && authorName=="" && authorNameLink=="" && captionLicense=="") headerFigcaptionTag = "figcaption";
                    footerFigcaptionTag = "figcaption";
                }                 
                
                //Header
                if (imageHeader!="") {
                    hText = "<"+headerFigcaptionTag+" class='figcaption header'><strong>"+imageHeader+"</strong></"+headerFigcaptionTag+">";
                }
                
                //Author and link
                if (authorName!="") {
                    if (authorNameLink!="") {
                        cText+="<a href='"+authorNameLink+"' target='_blank' class='author'>"+authorName+"</a>";
                    } else {
                        cText+="<span class='author'>"+authorName+"</span>";
                    }
                } else {
                    if (authorNameLink!="") {
                        cText+="<a href='"+authorNameLink+"' target='_blank' class='author'>"+authorNameLink+"</a>";
                    }
                }
                
                //Title and link
                if (imageTitle!="") {
                    if (cText!="") cText+=". ";
                    if (imageTitleLink!="") {
                        cText+="<a href='"+imageTitleLink+"' target='_blank' class='title'><em>"+imageTitle+"</em></a>";
                    } else {
                        cText+="<span class='title'><em>"+imageTitle+"</em></span>";
                    }
                } else {
                    if (imageTitleLink!="") {
                        if (cText!="") cText+=" - ";
                        cText+="<a href='"+imageTitleLink+"' target='_blank' class='title'><em>"+imageTitleLink+"</em></a>";
                    }
                }
                
                //License:
                var licenseLang = "en";
                var ccLink = "http://creativecommons.org/licenses/";
                var w = window.opener;
                if (!w) w = window.parent;
                if (w && w.document.getElementsByTagName) {
                    var lang = w.document.getElementsByTagName("HTML")[0].lang;
                    if (lang && lang != "") licenseLang = lang;
                    if (lang!="en") ccLink += "?lang="+lang;
                }                
                if (captionLicense!="") {
                    if (captionLicense=="pd") {
                        license = "<span>"+tinyMCEPopup.getLang("media_dlg.public_domain")+"</span>";
                    } else if (captionLicense=="gnu-gpl") {
                        license = "<a href='http://www.gnu.org/licenses/gpl.html' rel='license nofollow' target='_blank'>GNU/GPL</a>";
                    } else if (captionLicense=="CC0") {
                        license = "<a href='http://creativecommons.org/publicdomain/zero/1.0/deed."+licenseLang+"' rel='license nofollow' target='_blank'>CC0</a>";
                    } else if (captionLicense=="copyright") {
                        license = "<span>"+tinyMCEPopup.getLang("media_dlg.all_rights_reserved")+"</span>";
                    } else {
                        license = "<a href='"+ccLink+"' rel='license nofollow' target='_blank'>"+captionLicense.replace("CC-","CC ")+"</a>";
                    }
                    
                    if (cText!="") {
                        license = ' <span class="license"><span class="sep">(</span>'+license+'<span class="sep">)</span></span>';
                    } else {
                        license = '<span class="license"><span class="tit">'+tinyMCEPopup.getLang("media_dlg.caption_license")+": </span>"+license+"</span>";
                    }
                }
                
                var defaultPos = "position-center";
                if (imageAlignment=="left" || imageAlignment=="right") {
                    defaultPos = "float-"+imageAlignment;
                    c = c.replace(' align="'+imageAlignment+'"','');
                }              
                var cssClass = "exe-figure exe-media "+defaultPos;
                
                if (captionLicense!="") cssClass += " license-"+captionLicense;
				
                var _w = getVal("width");
				if (_w=="") {
					var mW = 320;
					var t = get("media_type").value;
					if (t=='audio') mW = 300;				
					_w = mW;
				}
                
                var extraStyle="width:"+_w+"px;";
                var fText = "";
                if (cText!="" || license!="") fText = "<"+footerFigcaptionTag+" class='figcaption'>"+cText+license+"</"+footerFigcaptionTag+">";

                c = "<"+figureTag+" class='"+cssClass+"' style='"+extraStyle+"'>"+hText+c+fText+"</"+figureTag+"><br />";
            }
            
            tinyMCEPopup.editor.execCommand('mceInsertContent', false, c);
        },
        // /The New eXeLearning

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
            
            //HTML5 video/audio preview
            var s = getVal("src");
            if (s!="" && preview_html.indexOf('<audio')!=-1 && preview_html.indexOf(' controls')==-1) {
                preview_html = preview_html.replace('></audio>',' controls></audio>');
            } else if (s!="" && preview_html.indexOf('<video')!=-1 && preview_html.indexOf(' controls')==-1) {
				preview_html = preview_html.replace('></video>',' controls></video>');
            }
            get('prev').innerHTML = preview_html;
            // /The New eXeLearning         
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
                    
                    if(!data.attrs) {
                    	data.video.attrs = {};
                    }
                    
                    if(get("autoplayelement").checked) {
                    	data.video.attrs.autoplay = "autoplay";
                    	document.getElementById("video_autoplay").checked = true;
                    }else if(data.video.attrs.autoplay) {
                		delete data.video.attrs.autoplay;
                		document.getElementById("video_autoplay").checked = false;
                    }
                    
                    if(get("controlselement").checked) {
                    	data.video.attrs.controls = "controls";
                    	document.getElementById("video_controls").checked = true;
                    }else if(data.video.attrs.autoplay) {
                		delete data.video.attrs.controls;
                		document.getElementById("video_controls").checked = false;
                    }
                    
                    if(get("mediaelement").checked) {
                    	data.video.attrs.class = "mediaelement";
                    	document.getElementById("video_class").value = "mediaelement";
                    }else {
                		data.video.attrs.class = "";
                		document.getElementById("video_class").value = "";
                    }
                    

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
            if (data.type=='quicktime' || data.type=='windowsmedia' || data.type=='realmedia' || data.type=='audio' || data.type=='video') {
                get('advanced_tab').style.display = 'none';
            } else {
                get('advanced_tab').style.display = 'block';
            }
            if (data.type == 'video' || data.type == 'audio') {
                get('use_mediaelement').style.display = 'table-row';
            } else {
                get('use_mediaelement').style.display = 'none';
            }
            if (data.type == 'iframe') {
                get('filebrowser_link').style.display = 'none';
                get('src').style.width = '250px';
            } else {
                get('filebrowser_link').style.display = '';
                get('src').style.width = '230px';
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

                    if (!data.video.attrs || (data.video.attrs.class && data.video.attrs.class == 'mediaelement')) {
                        setVal('mediaelement', true);
                        document.getElementById("video_class").value= "mediaelement";
                    }else {
                        setVal('mediaelement', false);
                        document.getElementById("video_class").value= "";
                    }
                        
                    // The New eXeLearning
                    if (data.video.attrs && data.video.attrs.autoplay && data.video.attrs.autoplay == 'autoplay') {
                        setVal('autoplayelement', true);
                        document.getElementById("video_autoplay").checked = true;
                    }else {
                        setVal('autoplayelement', false);
                        document.getElementById("video_autoplay").checked = false;
                    }
                    
                    if (!data.video.attrs || (data.video.attrs.controls && data.video.attrs.controls == 'controls')) {
                        setVal('controlselement', true);
                        document.getElementById("video_controls").checked = true;
                    } else {
                        setVal('controlselement', false);
                        document.getElementById("video_controls").checked = false;
                    }
                    // /The New eXeLearning
                } else if (data.type == 'audio') {
                    if (data.video.sources[0])
                        setVal('src', data.video.sources[0].src);
                    
                    src = data.video.sources[1];
                    if (src)
                        setVal('audio_altsource1', src.src);
                    
                    src = data.video.sources[2];
                    if (src)
                        setVal('audio_altsource2', src.src);

                    if (!data.video.attrs || (data.video.attrs.class && data.video.attrs.class == 'mediaelement')) {
                        setVal('mediaelement', true);
                        document.getElementById("video_class").value= "mediaelement";
                    }else {
                        setVal('mediaelement', false);
                        document.getElementById("video_class").value= "";
                    }
                    // The New eXeLearning    
                    if (data.video.attrs && data.video.attrs.autoplay && data.video.attrs.autoplay == 'autoplay') {
                        setVal('autoplayelement', true);
                    	document.getElementById("video_autoplay").checked = true;
                    }else {
                        setVal('autoplayelement', false);
                        document.getElementById("video_autoplay").checked = false;
                    }
                    
                    if (!data.video.attrs || (data.video.attrs.controls && data.video.attrs.controls == 'controls')) {
                        setVal('controlselement', true);
                    	document.getElementById("video_controls").checked = true;
                    }else {
                        setVal('controlselement', false);
                        document.getElementById("video_controls").checked = false;
                    }
                    // /The New eXeLearning
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
                    //src = 'http://www.youtube.com/embed/' + src.match(/youtu.be\/([a-z1-9.-_]+)/)[1];
                    // The New eXeLearning
                    src = '//www.youtube.com/embed/' + src.match(/youtu.be\/([a-z1-9.-_]+)/)[1];
                    // /The New eXeLearning					
                    setVal('src', src);
                    setVal('media_type', data.type);
                }

                // YouTube
                if (src.match(/youtube.com(.+)v=([^&]+)/)) {
                    data.width = 425;
                    data.height = 350;
                    data.params.frameborder = '0';
                    data.type = 'iframe';
                    //src = 'http://www.youtube.com/embed/' + src.match(/v=([^&]+)/)[1];
                    // The New eXeLearning
                    src = '//www.youtube.com/embed/' + src.match(/v=([^&]+)/)[1];
                    // /The New eXeLearning					
                    setVal('src', src);
                    setVal('media_type', data.type);
                }

                // Google video
                if (src.match(/video.google.com(.+)docid=([^&]+)/)) {
                    data.width = 425;
                    data.height = 326;
                    data.type = 'flash';
                    //src = 'http://video.google.com/googleplayer.swf?docId=' + src.match(/docid=([^&]+)/)[1] + '&hl=en';
                    // The New eXeLearning
                    src = '//video.google.com/googleplayer.swf?docId=' + src.match(/docid=([^&]+)/)[1] + '&hl=en';
                    // /The New eXeLearning
                    setVal('src', src);
                    setVal('media_type', data.type);
                }
                
                // Vimeo
                if (src.match(/vimeo.com\/([0-9]+)/)) {
                    data.width = 425;
                    data.height = 350;
                    data.params.frameborder = '0';
                    data.type = 'iframe';
                    //src = 'http://player.vimeo.com/video/' + src.match(/vimeo.com\/([0-9]+)/)[1];
                    // The New eXeLearning
                    src = '//player.vimeo.com/video/' + src.match(/vimeo.com\/([0-9]+)/)[1];
                    // /The New eXeLearning		
                    setVal('src', src);
                    setVal('media_type', data.type);
                }
            
                // stream.cz
                if (src.match(/stream.cz\/((?!object).)*\/([0-9]+)/)) {
                    data.width = 425;
                    data.height = 350;
                    data.params.frameborder = '0';
                    data.type = 'iframe';
                    src = 'http://www.stream.cz/object/' + src.match(/stream.cz\/[^/]+\/([0-9]+)/)[1];
                    setVal('src', src);
                    setVal('media_type', data.type);
                }
                
                // Google maps
                if (src.match(/maps.google.([a-z]{2,3})\/maps\/(.+)msid=(.+)/)) {
                    data.width = 425;
                    data.height = 350;
                    data.params.frameborder = '0';
                    data.type = 'iframe';
                    //src = 'http://maps.google.com/maps/ms?msid=' + src.match(/msid=(.+)/)[1] + "&output=embed";
                    // The New eXeLearning
                    src = '//maps.google.com/maps/ms?msid=' + src.match(/msid=(.+)/)[1] + "&output=embed";
                    // /The New eXeLearning					
                    setVal('src', src);
                    setVal('media_type', data.type);
                }
                
                if (data.type == 'video') {
                    if (!data.video.sources)
                        data.video.sources = [];

                    data.video.sources[0] = {src : src, class: 'mediaelement'};

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
                }
                // /The New eXeLearning

                // Set default size
                setVal('width', data.width || (data.type == 'audio' ? 300 : 320));
                setVal('height', data.height || (data.type == 'audio' ? 32 : 240));
            }
            // The New eXeLearning 
            if (tinyMCE.activeEditor.selection.getContent()!="") {
                document.getElementById("caption_panel-fieldset-1").style.display="none";
                document.getElementById("caption_panel-explanation").innerHTML=tinyMCEPopup.getLang("media_dlg.caption_warning");
                document.getElementById("caption_panel").style.height="420px";
            }
            // /The New eXeLearning            
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
            //Set default size and hide advanced settings tab
            if (field == 'type') {
                
                if (get('media_type').value=='audio') {
                    setVal('width', 300);   
                    setVal('height', 32);
                } else if (get('media_type').value=='flash') {
                    var f = get('src').value;
                    var file_extension = f.split(".").pop().toLowerCase();
                    if (file_extension=="mp3") {
                        setVal('width', 400);   
                        setVal('height', 15);                       
                    }
                    
                } else {
                    setVal('width', 320);   
                    setVal('height', 240);              
                }
                
                //show advanced tab for now
                /*
                if (get('media_type').value=='quicktime' || get('media_type').value=='windowsmedia' || get('media_type').value=='realmedia' || get('media_type').value=='video' || get('media_type').value=='audio') {
                    get('advanced_tab').style.display='none';                   
                }
                else {
                    get('advanced_tab').style.display='block';                  
                }
                */
                get('advanced_tab').style.display='block';
                
                if (get('media_type').value == 'video' || get('media_type').value == 'audio') {
                    get('use_mediaelement').style.display = 'table-row';
                }else {
                    get('use_mediaelement').style.display = 'none';
                }
                    
            }
            // /The New eXeLearning         
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
            // The New eXeLearning
            //html += option("shockwave", "object");
            // /The New eXeLearning
            html += option("windowsmedia", "object");
            html += option("realmedia", "object");
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
