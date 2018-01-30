/*! ===========================================================================
	eXe
	Copyright 2004-2005, University of Auckland
	Copyright 2004-2008 eXe Project, http://eXeLearning.org/

	This program is free software; you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation; either version 2 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program; if not, write to the Free Software
	Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
	===========================================================================

	ClozelangElement's functions by José Ramón Jiménez Reyes
	More than one right answer in the Cloze iDevice by José Miguel Andonegi
	2015. Refactored and completed by Ignacio Gros (http://www.gros.es) for http://exelearning.net/
*/

if (typeof($exe_i18n)=='undefined') $exe_i18n={previous:"Previous",next:"Next",show:"Show",hide:"Hide",showFeedback:"Show Feedback",hideFeedback:"Hide Feedback",correct:"Correct",incorrect:"Incorrect",menu:"Menu",download:"Download",yourScoreIs:"Your score is ",dataError:"Error recovering data",epubJSerror:"This will not work in this ePub reader.",print:"Print"}

var $exe = {
	
    init: function() {
        var e = document.body.className;
        $exe.addRoles();
        if (e != "exe-single-page js") {
            var t = $exe.isIE();
            if (t) {
                if (t > 7) $exe.iDeviceToggler.init()
            } else $exe.iDeviceToggler.init()
        }
		this.hasMultimediaGalleries = false;
		this.setMultimediaGalleries();
		// No MediaElement in ePub3
		if (e.indexOf("exe-epub3") != 0) {
            var n = document.body.innerHTML;
            if (this.hasMultimediaGalleries || $(".mediaelement").length>0) {
                $exe.loadMediaPlayer.getPlayer();
            }
        } else {
			// No inline SCRIPT tags in ePub (due to Chrome app Content Security Policy)
			document.body.className += ' js';
		}
        $exe.hint.init();
        $exe.setIframesProperties();
        $exe.hasTooltips();
        $exe.math.init();
        $exe.dl.init();
		// Add a zoom icon to the images using CSS 
		$("a.exe-enlarge").each(function(i){
			 var e = $(this);
			 var c = $(this).children();
			 if (c.length==1 && c.eq(0).prop("tagName")=="IMG") {
				e.prepend('<span class="exe-enlarge-icon"><b></b></span>');
			 }
		});
		$exe.sfHover();
		// Disable autocomplete
		$("INPUT.autocomplete-off").attr("autocomplete", "off");
		// Enable feedback buttons
		// Common feedback
		$('.feedbackbutton.feedback-toggler').click(function(){
			$exe.toggleFeedback(this,false);
		});
		// Cloze iDevice
		$('.cloze-feedback-toggler').click(function(){
			var e = $(this);
			var id = e.attr('name').replace('feedback','');
			$exe.cloze.toggleFeedback(id,this);
		});
		$('.cloze-score-toggler').click(function(){
			var e = $(this);
			var id = e.attr('name').replace('getScore','');
			$exe.cloze.showScore(id,1);
		});
		$('form.cloze-form').submit(function(){
			var e = $(this);
			var id = e.attr('name').replace('cloze-form-','');
			try {
				$exe.cloze.showScore(id,1);
			} catch(e) {
				// Due to G. Chrome's Content Security Policy ('unsafe-eval' is not allowed)
				var txt = $exe_i18n.dataError;
				if ($('body').hasClass('exe-epub3')) txt += '<br /><br />'+$exe_i18n.epubJSerror;
				$("#clozeScore" + id).html(txt);
			}
			return false;            
		}); 
		// SCORM Quiz iDevice
		$('form.quiz-test-form').submit(function(){
			try {
				calcScore2();
			} catch(e) {
				// Due to G. Chrome's Content Security Policy ('unsafe-eval' is not allowed)
				var txt = $exe_i18n.dataError;
				if ($('body').hasClass('exe-epub3')) txt += '<br /><br />'+$exe_i18n.epubJSerror;
				$('form.quiz-test-form input[type=submit]').hide().before(txt);
			}
			return false;
		});	
		// Multi-choice iDevice and True-False Question
		$('.exe-radio-option').click(function(){
			var c = this.className.split(" ");
			if (c.length!=2) return;
			c = c[1];
			c = c.replace("exe-radio-option-","");
			c = c.split("-");
			if (c.length!=4) return;
			$exe.getFeedback(c[0],c[1],c[2],c[3]);
		});
    },
	
    // Transform links to audios or videos (with rel^='lightbox') in links to inline content (see prettyPhoto documentation)
    setMultimediaGalleries : function(){
		if (typeof($.prettyPhoto) != 'undefined') {
			var lightboxLinks = $("a[rel^='lightbox']");
			lightboxLinks.each(function(i){
				var ref = $(this).attr("href");
				var _ref = ref.toLowerCase();
				var isAudio = _ref.indexOf(".mp3")!=-1;
				var isVideo = _ref.indexOf(".mp4")!=-1 || _ref.indexOf(".flv")!=-1 || _ref.indexOf(".ogg")!=-1 || _ref.indexOf(".ogv")!=-1;
				if (isAudio || isVideo) {
					var id = "media-box-"+i;
					$(this).attr("href","#"+id);
					var hiddenPlayer = $('<div class="exe-media-box js-hidden" id="'+id+'"></div>');
						if (isAudio) hiddenPlayer.html('<div class="exe-media-audio-box"><audio controls="controls" src="'+ref+'" class="exe-media-box-element exe-media-box-audio"><a href="'+ref+'">audio/mpeg</a></audio></div>');
						else hiddenPlayer.html('<div class="exe-media-video-box"><video width="480" height="385" controls="controls" class="exe-media-box-element"><source src="'+ref+'" /></video></div>');
					$("body").append(hiddenPlayer);
					$exe.hasMultimediaGalleries = true;
				}
                // Inline content title
                var t = this.title;
                if (ref.indexOf('#')==0 && $(ref).length==1 && t && t!="") $(ref).prepend('<h2 class="pp_title">'+t+'</h2>');
			});
			lightboxLinks.prettyPhoto({
				social_tools: "",
				deeplinking: false,
				opacity: 0.85,
				changepicturecallback: function() {
					var block = $("#pp_full_res")
					var media = $(".exe-media-box-element",block);
					if ($exe.loadMediaPlayer.isReady) {
						if (media.length==1) media.mediaelementplayer();
						$exe.loadMediaPlayer.isCalledInBox = true;
					}
					// Add a download link and a CSS class to pp_content_container (see exe_lightbox.css)
					var cont = $(".pp_content_container");
					cont.attr("class","pp_content_container");
					if (media.length==1 && media[0].hasAttribute('src')) {
						if (media.hasClass("exe-media-box-audio")) cont.attr("class","pp_content_container with-audio");
						var src = media.attr('src');
						var ext = src.split("/");
						ext = ext[ext.length-1];
						ext = ext.split(".")[1];
						$(".pp_details .pp_description").append(' <span class="exe-media-download"><a href="'+src+'" title="'+$exe_i18n.download+'" download>'+ext+'</a></span>');
					} else {
                        // Hide the title at the bottom (we use h2.pp_title instead)
                        block = $(".pp_inline",block);
                        if(block.length==1) $(".pp_description").hide();
                    }
				}
			});
		}
	},
	
	// Apply the 'sfhover' class to li elements when they are 'moused over'
	// Old browsers need this because they don't support li:hover
	sfHover : function() {
		var e = document.getElementById("siteNav");
		if (e) {
			var t = e.getElementsByTagName("LI");
			for (var n = 0; n < t.length; n++) {
				t[n].onmouseover = function() {
					this.className = "sfhover"
				};
				t[n].onmouseout = function() {
					this.className = "sfout"
				}
			}
			// Enable Keyboard:
			var r = e.getElementsByTagName("A");
			for (var n = 0; n < r.length; n++) {
				r[n].onfocus = function() {
					this.className += (this.className.length > 0 ? " " : "") + "sffocus";
					this.parentNode.className += (this.parentNode.className.length > 0 ? " " : "") + "sfhover";
					if (this.parentNode.parentNode.parentNode.nodeName == "LI") {
						this.parentNode.parentNode.parentNode.className += (this.parentNode.parentNode.parentNode.className.length > 0 ? " " : "") + "sfhover";
						if (this.parentNode.parentNode.parentNode.parentNode.parentNode.nodeName == "LI") {
							this.parentNode.parentNode.parentNode.parentNode.parentNode.className += (this.parentNode.parentNode.parentNode.parentNode.parentNode.className.length > 0 ? " " : "") + "sfhover"
						}
					}
				};
				r[n].onblur = function() {
					this.className = this.className.replace(new RegExp("( ?|^)sffocus\\b"), "");
					this.parentNode.className = this.parentNode.className.replace(new RegExp("( ?|^)sfhover\\b"), "");
					if (this.parentNode.parentNode.parentNode.nodeName == "LI") {
						this.parentNode.parentNode.parentNode.className = this.parentNode.parentNode.parentNode.className.replace(new RegExp("( ?|^)sfhover\\b"), "");
						if (this.parentNode.parentNode.parentNode.parentNode.parentNode.nodeName == "LI") {
							this.parentNode.parentNode.parentNode.parentNode.parentNode.className = this.parentNode.parentNode.parentNode.parentNode.parentNode.className.replace(new RegExp("( ?|^)sfhover\\b"), "")
						}
					}
				}
			}
		}
	},
	
	mediaReplace : function() {
		// Quicktime and Real Media for IE
		if (navigator.appName == "Microsoft Internet Explorer") {
			var e = document.getElementsByTagName("OBJECT");
			var t = e.length;
			while (t--) {
				if (e[t].type == "video/quicktime" || e[t].type == "audio/x-pn-realaudio-plugin") {
					if (typeof e.classid == "undefined") {
						e[t].style.display = "none";
						var n = "02BF25D5-8C17-4B23-BC80-D3488ABDDC6B";
						if (e[t].type == "audio/x-pn-realaudio-plugin") n = "CFCDAA03-8BE4-11CF-B84B-0020AFBBCCFA";
						var r = e[t].height;
						var i = e[t].width;
						var s = e[t].data;
						var o = document.createElement("DIV");
						o.innerHTML = '<object classid="clsid:' + n + '" data="' + s + '" width="' + i + '" height="' + r + '"><param name="controller" value="true" /><param name="src" value="' + s + '" /><param name="autoplay" value="false" /></object>';
						e[t].parentNode.insertBefore(o, e[t])
					}
				}
			}
		} else if (document.body.className.indexOf("exe-epub3")==0) {
			// Replace OBJECT with VIDEO and AUDIO in ePub
			$("object").each(function() {
				var e = $(this);
				var p = e.attr("data"); // Player
				var w, h, f; // Width, Height, File
				var v = $("param[name=flv_src]", e);
				if (p == "flowPlayer.swf" && v.length==1) {
					w = this.width || 320;
					h = this.height || 240;
					f = v.attr("value");
					e.before('<video width="' + w + '" height="' + h + '" src="' + f + '" controls="controls"><a href="' + f + '">' + f + '</a></video>').remove()
				} else if (p.indexOf("xspf_player.swf?song_url=") == 0) {
					f = p.replace("xspf_player.swf?song_url=", "");
					f = f.split("&")[0];
					e.before('<audio width="300" height="32" src="' + f + '" controls="controls"><a href="' + f + '">' + f + '</a></audio>').remove()
				}
			});
		}
	},
	
    // RGB color to HEX
	rgb2hex: function(a) {
        if (/^#[0-9A-F]{6}$/i.test(a)) return a;
        a = a.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

        function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2)
        }
        return "#" + hex(a[1]) + hex(a[2]) + hex(a[3])
    },
	
    // Use black or white text depending on the background color
	useBlackOrWhite: function(h) {
        var r = parseInt(h.substr(0, 2), 16);
        var g = parseInt(h.substr(2, 2), 16);
        var b = parseInt(h.substr(4, 2), 16);
        var y = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (y >= 128) ? 'black' : 'white'
    },
	
    // Definition lists with improved presentation
	dl: {
        init: function() {
            var l = $("dl.exe-dl");
            if (l.length == 0) return false;
            var h, e, t, bg, tc, s, id;
            l.each(function(i) {
                e = this;
                bg = $exe.rgb2hex($(e).css("color"));
                tc = $exe.useBlackOrWhite(bg.replace("#", ""));
                s = " style='text-decoration:none;background:" + bg + ";color:" + tc + "'";
                if (e.id == "") e.id = "exe-dl-" + i;
                id = e.id;
                $("dt", e).each(function() {
                    t = this;
                    h = $(t).html();
                    $(t).html("<a href='#' class='exe-dd-toggler exe-dl-" + i + "-a'><span class='icon'" + s + ">» </span>" + h + "</a>")
                });
                $(e).before("<p class='exe-dl-toggler'><a href='#" + id + "' title='" + $exe_i18n.show + "'" + s + ">+</a> <a href='#" + id + "' title='" + $exe_i18n.hide + "'" + s + ">-</a></p>")
            });
            $('a.exe-dd-toggler').click(function(){
                $exe.dl.toggle(this);
                return false;
            });
            $('.exe-dl-toggler a').click(function(){
                var id = $(this).attr('href').replace("#","");
                var action = 'show';
                if ($(this).attr('title')==$exe_i18n.hide) action = 'hide';
                $exe.dl.toggle(action,id);
            });
        },
        toggle: function(e, a) {
            if (e == "show") $("#" + a + " dd").show();
            else if (e == "hide") $("#" + a + " dd").hide();
            else $(e).parent().next("dd").toggle()
        }
    },
	
    // If the page has tooltips we load the JS file
	hasTooltips: function() {
        if ($("A.exe-tooltip").length > 0) {
            var p = "";
            if (typeof(exe_editor_mode) != "undefined") p = "/scripts/exe_tooltips/";
            $exe.loadScript(p + "exe_tooltips.js", "$exe.tooltips.init('" + p + "')")
        }
    },
	
    // Math options (MathJax, etc.)
    math : {
        // Change this from your Style or your elp using $exe.math.engine="..."
        engine : "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML",
        // Create links to the code and the image (different possibilities)
        createLinks : function(math) {
            var mathjax = false;
            if (!math) {
                var math = $(".exe-math");
                mathjax = true;
            }
            math.each(function(){
                var e = $(this);
                var img = $(".exe-math-img img",e);
                var txt = "LaTeX";
                if (e.html().indexOf("<math")!=-1) txt = "MathML";
                var html = '';
                if (img.length==1) html += '<a href="'+img.attr("src")+'" target="_blank">GIF</a>';
                if (!mathjax) {
                    if (html!="") html += '<span> - </span>';
                    html += '<a href="#" class="exe-math-code-lnk">'+txt+'</a>';
                }
                if (html!="") {
                    html = '<p class="exe-math-links">'+html+'</p>';
                    e.append(html);
                }
                $(".exe-math-code-lnk").click(function(){
                    $exe.math.showCode(this);
                    return false;
                });
            });            
        },
        // Open a new window with the LaTeX or MathML code
        showCode : function(e){
            var tit = e.innerHTML;
            var block = $(e).parent().parent();
            var code = $(".exe-math-code",block);
            var a = window.open(tit);
            a.document.open("text/html");
            var html = '<!DOCTYPE html><html><head><title>'+tit+'</title>';
                html += '<style type="text/css">body{font:10pt/1.5 Verdana,Arial,Helvetica,sans-serif;margin:10pt;padding:0}</style>';
                html += '</head><body><pre><code>';
                html += code.html();
                html += '</code></pre></body></html>';
            a.document.write(html);
            a.document.close();           
        },
        // Load MathJax or just create the links to the code and/or image
        init : function(){
            var math = $(".exe-math");
            var mathjax = false;
            if (math.length>0) {
                math.each(function(){
                    var e = $(this);
                    if (e.hasClass("exe-math-engine")) {
                        if (navigator.onLine) mathjax = true;
                    }
                });
                if (mathjax && navigator.onLine) {
                    $(".exe-math-code").each(function(){
                        var code = this.innerHTML.replace(/ /g,'');
                        if (code.indexOf("<math")==-1) {
                            if (code.indexOf("\\[")!=0 && code.substr(code.length-2)!="\\]") {
                                // Wrap the code: \[ ... \]
                                this.innerHTML = "\\[ "+this.innerHTML+" \\]";
                            }
                        }
                    });
                    $exe.loadScript($exe.math.engine,$exe.math.createLinks());
                } else {
                    $exe.math.createLinks(math);
                }
            }
        }
    },	
	
    // Add WAI-ARIA roles
	addRoles: function() {
        $("#header").attr("role", "banner");
        $("#siteNav").attr("role", "navigation");
        $("#main").attr("role", "main");
        $("#siteFooter").attr("role", "contentinfo");
        $(".js-feedback").attr("role", "status")
    },
	
    // Internet Explorer?
	isIE: function() {
        var e = navigator.userAgent.toLowerCase();
        return e.indexOf("msie") != -1 ? parseInt(e.split("msie")[1]) : false
    },
	
    // Enable "Lightbox"
	imageGallery: {
        init: function(e) {
            $("A", "#" + e).attr("rel", "lightbox[" + e + "]")
        }
    },
	
    // Show/Hide tips
	hint: {
        init: function() {
            $(".iDevice_hint").each(function(e) {
				// To review (this should be in base.css)
				if (typeof($exe.hint.imgs)=='undefined') {
					$exe.hint.imgs = [ 'panel-amusements.png', 'stock-stop.png' ];
				}
                var t = e + 1;
                var n = "hint-" + t;
                var r = $(".iDevice_hint_content", this);
                var i = $(".iDevice_hint_title", this);
                if (r.length == 1 && i.length == 1) {
                    r.eq(0).attr("id", n);
                    var s = i.eq(0);
                    var o = s.html();
                    s.html('<a href="#' + n + '" title="' + $exe_i18n.show + '" class="hint-toggler show-hint" id="toggle-' + n + '" style="background-image:url(' + $exe.hint.imgs[0] + ')">' + o + "</a>")
                }
                $('.hint-toggler',this).click(function(){
                    $exe.hint.toggle(this);
                    return false;
                });
            });
        },
        toggle: function(e) {
            var t = e.id.replace("toggle-", "");
            if (e.title == $exe_i18n.show) {
                $("#" + t).fadeIn("slow");
                e.title = $exe_i18n.hide;
                e.className = "hint-toggler hide-hint";
                e.style.backgroundImage = "url(" + $exe.hint.imgs[1] + ")"
            } else {
                $("#" + t).fadeOut();
                e.title = $exe_i18n.show;
                e.className = "hint-toggler show-hint";
                e.style.backgroundImage = "url(" + $exe.hint.imgs[0] + ")"
            }
        }
    },
	
    // Hide/Show iDevices (base.css hides this)
	iDeviceToggler: {
        init: function() {
            if ($(".iDevice").length < 2) return false;
            var t = $(".iDevice_header,.iDevice.emphasis0");
            t.each(function() {
                var t = $exe_i18n.hide;
                e = $(this), c = e.hasClass("iDevice_header") ? "em1" : "em0", eP = e.parents(".iDevice_wrapper");
                if (eP.length) {
                    var n = '<p class="toggle-idevice toggle-' + c + '"><a href="#" id="toggle-idevice-'+eP.attr("id")+'-'+c+'" title="' + t + '"><span>' + t + "</span></a></p>";
                    if (c == "em1") {
                        var r = e.html();
                        e.html(r + n)
                    } else e.before(n)
                }
            });
			$(".toggle-idevice a").click(function(){
				var id = this.id.replace("toggle-idevice-","");
					id = id.split("-");
				$exe.iDeviceToggler.toggle(this,id[0],id[1]);
				return false;
			});
        },
        toggle: function(e, t, n) {
            var r = $exe_i18n.hide;
            var i = $("#" + t);
            var s = ".iDevice_content";
            if (n == "em1") s = ".iDevice_inner";
            var o = $(s, i);
            var u = i.attr("class");
            if (typeof u == "undefined") return false;
            if (u.indexOf(" hidden-idevice") == -1) {
                r = $exe_i18n.show;
                u += " hidden-idevice";
                o.slideUp("fast");
                e.className = "show-idevice";
                e.title = r;
                e.innerHTML = "<span>" + r + "</span>"
            } else {
                u = u.replace(" hidden-idevice", "");
                o.slideDown("fast");
                e.className = "hide-idevice";
                e.title = r;
                e.innerHTML = "<span>" + r + "</span>"
            }
            i.attr("class", u)
        }
    },
	
    // The MediaElement did not respect the alignment
	alignMediaElement: function(e) {
        var t = $(e);
        var n = t.parents().eq(2);
        var r = n.attr("class");
        if (typeof r == "string" && r.indexOf("mejs-container") == 0) {
            var i = e.style.marginLeft;
            var s = e.style.marginRight;
            if (i == "auto" && i == s) $(n).wrap('<div style="text-align:center"></div>')
        }
    },
	
    // Load MediaElement if required
	loadMediaPlayer: {
        isCalledInBox: false, // Box = prettyPhoto with video or audio
        isReady: false,
        getPlayer: function() {
            $exe.mediaelements = $(".mediaelement");
            $exe.mediaelements.each(function() {
                if (typeof this.localName != "undefined" && this.localName == "video") {
                    var e = this.width;
                    var t = $(window).width();
                    if (e > t) {
                        var n = t - 20;
                        var r = parseInt(this.height * n / e);
                        this.width = n;
                        this.height = r
                    }
                }
            }).hide();
            var e = "exe_media.js";
            if (typeof eXe != "undefined") {
                e = "../scripts/mediaelement/" + e
            }
            // Load the JS file and then load the CSS
			$exe.loadScript(e, "$exe.loadMediaPlayer.getCSS()")
        },
        // Load the CSS file and start MediaElement
		getCSS: function() {
            var e = "exe_media.css";
            if (typeof eXe != "undefined") {
                e = "../scripts/mediaelement/" + e
            }
            $exe.loadScript(e, "$exe.loadMediaPlayer.init()")
        },
        // Start MediaElement
		init: function() {
			if (typeof eXe != "undefined") {
                mejs.MediaElementDefaults.flashName = "../scripts/mediaelement/" + mejs.MediaElementDefaults.flashName;
                mejs.MediaElementDefaults.silverlightName = "../scripts/mediaelement/" + mejs.MediaElementDefaults.silverlightName
            }
            $exe.mediaelements.mediaelementplayer().show().each(function() {
                $exe.alignMediaElement(this)
            });
			// Multimedia galleries
			$exe.loadMediaPlayer.isReady = true;
			if (!$exe.loadMediaPlayer.isCalledInBox) $("#pp_full_res .exe-media-box-element").mediaelementplayer();
        }
    },
	
    // Add "http" to the IFRAMES without protocol in local pages and create a hidden link for the print version
	setIframesProperties: function() {
		// setTimeout is provisional. We use it because some Styles were already adding the "external-iframe" class.
		setTimeout(function(){
			var p = window.location.protocol;
			var t = false;
			if (p != "http" && p != "https") t = true;
			$("iframe").each(function() {
				var i = $(this);
				var s = i.attr("src");
				if (t && s.indexOf("//") == 0) $(this).attr("src", "http:" + s);
				s = i.attr("src");
				if (!i.hasClass("external-iframe") && s.indexOf("http")==0) {
					i.addClass("external-iframe").before("<span class='external-iframe-src' style='display:none'><a href='"+s+"'>"+s+"</a></span>");
				}
			});			
		}, 1000);
    },
	
    // Load a JavaScript or CSS file (in HEAD)
	loadScript: function(url, callback) {
        var s;
        if (url.split(".").pop() == "css") {
            s = document.createElement("link");
            s.type = "text/css";
            s.rel = "stylesheet";
            s.href = url
        } else {
            s = document.createElement("script");
            s.type = "text/javascript";
            s.src = url
        }
        if (s.readyState) { // IE
            s.onreadystatechange = function() {
                if (s.readyState == "loaded" || s.readyState == "complete") {
                    s.onreadystatechange = null;
                    if (callback) eval(callback)
                }
            }
        } else {
            s.onload = function() {
                if (callback) eval(callback)
            }
        }
        document.getElementsByTagName("head")[0].appendChild(s)
    },
	
	// True-False Question and Multi-choice (truefalseelement.py and element.py)
	getFeedback: function(e, t, n, r) {
		var i, s;
		if (r == "truefalse") {
			var o = "right";
			if (e == 1) o = "wrong";
			var u = document.getElementById("s" + n + "-result");
			var a = document.getElementById("s" + n);
			if (!u || !a) return false;
			var f = $exe_i18n.incorrect;
			if (u.className == o) f = $exe_i18n.correct;
			u.innerHTML = f;
			a.style.display = "block"
		} else {
			// Multi choice iDevice (mode=='multi')
			for (i = 0; i < t; i++) {
				s = "sa" + i + "b" + n;
				var d = "none";
				if (i == e) d = "block";
				document.getElementById(s).style.display = d;
			}
		}
	},
	
	// used to show question's feedback for multi-select idevice 	
	showFeedback : function(e, t, n) {
		var r, i, s, o;
		for (r = 0; r < t; r++) {
			var u = n + r.toString();
			var a = document.getElementById("op" + u);
			i = "False";
			s = $exe_i18n.incorrect;
			o = "wrong";
			if (a.checked == 1) i = "True";
			if (i == a.value) {
				s = "<strong>" + $exe_i18n.correct + "</strong>";
				o = "right"
			}
			var f = '<p class="' + o + '-option">' + s + "</p>";
			var l = $("#feedback-" + u);
			if (e.value == $exe_i18n.showFeedback) l.html(f).show();
			else l.hide()
		}
		if (e.value == $exe_i18n.showFeedback) {
			$("#f" + n).show();
			e.value = $exe_i18n.hideFeedback
		} else {
			$("#f" + n).hide();
			e.value = $exe_i18n.showFeedback
		}
	},
	
    // Common feedback (see common.py)
	toggleFeedback: function(e, b) {
        var t = e.name.replace("toggle-", "");
        var n = document.getElementById(t);
        var d = false;
        var r = window[t.replace("-", "") + "text"];
        if (typeof(r) != 'undefined') {
            r = r.split("|");
            if (r.length > 1) d = true
        }
        if (n) {
            if (n.className == "feedback js-feedback js-hidden") {
                n.className = "feedback js-feedback";
                if (b) e.value = $exe_i18n.hideFeedback;
                else if (d) e.value = r[1]
            } else {
                n.className = "feedback js-feedback js-hidden";
                if (b) e.value = $exe_i18n.showFeedback;
                else if (d) e.value = r[0]
            }
        }
    },
	
	// To do: 
	// calcScore was used for multiple select idevice for calculating score and showing feedback.
	// calcScore2 (quiztestblock.py)
	
	// used by maths idevice
	insertSymbol : function(e, t, n) {
		var r = document.getElementById(e);
		$exe.insertAtCursor(r, t, n)
	},
	
	// To review:
	insertAtCursor : function(e, t, n) {
		// MOZILLA/NETSCAPE support
		if (e.selectionStart || e.selectionStart == "0") {
			var r = e.selectionStart;
			var i = e.selectionEnd;
			e.value = e.value.substring(0, r) + t + e.value.substring(i, e.value.length);
			e.selectionStart = r + t.length - n
		} else {
			e.value += t
		}
		e.selectionEnd = e.selectionStart;
		e.focus()
	}
	
};

// Cloze iDevice
$exe.cloze = {
	
	// Constants
	NOT_ATTEMPTED : 0,
	WRONG : 1,
	CORRECT : 2,
	
	// Functions
	
	// Called when a learner types something into a cloze word space
	change : function(ele){
		var ident = $exe.cloze.getIds(ele)[0];
		var instant = eval(document.getElementById("clozeFlag" + ident + ".instantMarking").value);
		if (instant) {
			$exe.cloze.checkAndMarkWord(ele);
			// Hide the score paragraph if visible
			var scorePara = document.getElementById("clozeScore" + ident);
			scorePara.innerHTML = ""
		}
	},

	// Recieves and marks answers from student
	submit : function(e){
		// Mark all of the words
		$exe.cloze.showScore(e, 1);
		// Hide Submit
		$exe.cloze.toggle("submit" + e);
		// Show Restart
		$exe.cloze.toggle("restart" + e);
		// Show Show Answers Button
		$exe.cloze.toggle("showAnswersButton" + e);
		// Show feedback
		$exe.cloze.toggleFeedback(e)	
	},	
	
	// Makes cloze idevice like new:
	restart : function(e){
		// Hide Feedback
		$exe.cloze.toggleFeedback(e);
		// Clear the answers (Also hides score)
		$exe.cloze.toggleAnswers(e, true);
		// Hide Restart
		$exe.cloze.toggle("restart" + e);
		// Hide Show Answers Button
		$exe.cloze.toggle("showAnswersButton" + e);
		// Show Submit
		$exe.cloze.toggle("submit" + e)		
	},
	
	// Show/Hide all answers in the cloze idevice
	// 'clear' is an optional argument, that forces all the answers to be cleared
	// whether they are all finished and correct or not	
	toggleAnswers : function(e, t) {
		// See if any have not been answered yet		
		var n = true; // allCorrect
		var r = $exe.cloze.getInputs(e);
		if (!t) {
			for (var i = 0; i < r.length; i++) {
				var s = r[i];
				if ($exe.cloze.getMark(s) != 2) {
					n = false;
					break
				}
			}
		}
		if (n) {
			// Clear all answers
			$exe.cloze.clearInputs(e, r)
		} else {
			// Write all answers
			$exe.cloze.fillInputs(e, r)
		}
		// Hide the score paragraph, irrelevant now
		var o = document.getElementById("clozeScore" + e);
		o.innerHTML = "";
		// If the get score button is visible and we just filled in all the right
		// answers, disable it until they clear the scores again.		
		var u = document.getElementById("getScore" + e);
		if (u) {
			u.disabled = !n
		}
	},
	
	// Shows all answers for a cloze field
	// 'inputs' is an option argument containing a list of the 'input' elements for
	// the field	
	fillInputs : function(e, t) {
		if (!t) {
			var t = $exe.cloze.getInputs(e)
		}
		for (var n = 0; n < t.length; n++) {
			var r = t[n];
			var i = $exe.cloze.getAnswer(r); // Right Answer
			i = i.trim();
			var s = false;
			// Check if it has more than one right answer: |dog|bird|cat|
			if (i.indexOf("|") == 0 && i.charAt(i.length - 1) == "|") {
				var o = i; // Right answer (to operate with this var)
				var o = o.substring(1, o.length - 1);
				var u = o.split("|");
				if (u.length > 1) {
					s = true;
					var a = "";
					for (x = 0; x < u.length; x++) {
						a += u[x];
						if (x < u.length - 1) a += " — ";
						if (u[x] == "") s = false
					}
				}
				if (s) {
					// Update the field width to display all the answers and save the previous width (the user may want to try again)
					r.className = "autocomplete-off width-" + r.style.width;
					r.style.width = "auto";
					i = a
				}
			}
			// Show the right answer
			r.value = i;
			$exe.cloze.markWord(r, $exe.cloze.CORRECT);
			r.setAttribute("readonly", "readonly")
		}
	},
	
	// Blanks all the answers for a cloze field
	// 'inputs' is an option argument containing a list of the 'input' elements for
	// the field	
	clearInputs : function(e, t) {
		if (!t) {
			var t = $exe.cloze.getInputs(e)
		}
		for (var n = 0; n < t.length; n++) {
			var r = t[n];
			// Reset the field width if it has more than one right answer: |dog|bird|cat|
			if (r.className.indexOf("autocomplete-off width-") != -1) {
				var i = r.className.replace("autocomplete-off width-", "");
				r.style.width = i
			}
			r.value = "";
			$exe.cloze.markWord(r, $exe.cloze.NOT_ATTEMPTED);
			// Toggle the readonlyness of the answers also
			r.removeAttribute("readonly")
		}
	},
	
	// Marks a cloze word in view mode.
	// Returns NOT_ATTEMPTED, CORRECT, or WRONG	
	checkAndMarkWord : function(e) {
		var t = $exe.cloze.checkWord(e);
		if (t != "") {
			$exe.cloze.markWord(e, $exe.cloze.CORRECT);
			e.value = t;
			return $exe.cloze.CORRECT
		} else if (!e.value) {
			$exe.cloze.markWord(e, $exe.cloze.NOT_ATTEMPTED);
			return $exe.cloze.NOT_ATTEMPTED
		} else {
			$exe.cloze.markWord(e, $exe.cloze.WRONG);
			return $exe.cloze.WRONG
		}
	},
	
	// Marks a cloze question (at the moment just changes the color)
	// 'mark' should be 0=Not Answered, 1=Wrong, 2=Right	
	markWord : function(e, t) {
		switch (t) {
			case 0:
				// Not attempted
				e.style.backgroundColor = "";
				e.style.color = "";
				break;
			case 1:
				// Wrong
				e.style.backgroundColor = "#FF9999";
				e.style.color = "#000000";
				break;
			case 2:
				// Correct
				e.style.backgroundColor = "#CCFF99";
				e.style.color = "#000000";
				break
		}
		return t
	},
	
	// Return the last mark applied to a word	
	getMark : function(e) {
		var t = $exe.cloze.checkWord(e);
		if (t != "") {
			return $exe.cloze.CORRECT
		} else if (!e.value) {
			return $exe.cloze.NOT_ATTEMPTED
		} else {
			return $exe.cloze.WRONG
		}
	},
	
	// Decrypts and returns the answer for a certain cloze field word
	getAnswer : function(e) {
		var t = $exe.cloze.getIds(e);
		var n = t[0];
		var r = t[1];
		var i = document.getElementById("clozeAnswer" + n + "." + r);
		var s = i.innerHTML;
		s = $exe.cloze.decode64(s);
		s = unescape(s);
		// XOR "Decrypt"
		result = "";
		var o = "X".charCodeAt(0);
		for (var u = 0; u < s.length; u++) {
			var a = s.charCodeAt(u);
			o ^= a;
			result += String.fromCharCode(o)
		}
		return result
	},
	
	// Base64 Decode
	// Base64 code from Tyler Akins -- http://rumkin.com	
	decode64 : function(e) {
		var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var n = "";
		var r, i, s;
		var o, u, a, f;
		var l = 0;
		// Remove all characters that are not A-Z, a-z, 0-9, +, /, or =
		e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		do {
			o = t.indexOf(e.charAt(l++));
			u = t.indexOf(e.charAt(l++));
			a = t.indexOf(e.charAt(l++));
			f = t.indexOf(e.charAt(l++));
			r = o << 2 | u >> 4;
			i = (u & 15) << 4 | a >> 2;
			s = (a & 3) << 6 | f;
			n = n + String.fromCharCode(r);
			if (a != 64) {
				n = n + String.fromCharCode(i)
			}
			if (f != 64) {
				n = n + String.fromCharCode(s)
			}
		} while (l < e.length);
		return n
	},
	
	// Returns the corrected word or an empty string	
	checkWord : function(e) {
		var t = e.value;
		// Extract the idevice id and the input number out of the element's id
		var n = $exe.cloze.getAnswer(e);
		var r = n;
		r = r.trim();
		var i = r.indexOf("|");
		var s = r.lastIndexOf("|");
		if (i == 0 && s == r.length - 1) {
			var o = r.split("|");
			var u;
			for (var a in o) {
				if (o[a] != "") {
					u = $exe.cloze.checkWordAnswer(e, o[a]);
					if (u != "") return o[a]
				}
			}
			return ""
		} else return $exe.cloze.checkWordAnswer(e, r)
	},
	
	// Returns the corrected word or an empty string agains one of the possible answers
	checkWordAnswer : function(ele, original_answer) {
		original_answer = original_answer.trim();
		var guess = ele.value;
		// Extract the idevice id and the input number out of the element's id
		//var original = getClozeAnswer(ele);		
		var answer = original_answer;
		var ident = $exe.cloze.getIds(ele)[0];
		// Read the flags for checking answers
		var strictMarking = eval(document.getElementById("clozeFlag" + ident + ".strictMarking").value);
		var checkCaps = eval(document.getElementById("clozeFlag" + ident + ".checkCaps").value);
		
		// The Dropdown Activity has no strictMarking or checkCaps options (see #171)
		var $form = $(ele).closest('.iDevice_wrapper');
		if ($form.length==1 && $form.hasClass("ListaIdevice")) {
			strictMarking = true;
			checkCaps = true;
		}
		
		if (!checkCaps) {
			guess = guess.toLowerCase();
			answer = answer.toLowerCase()
		}
		if (guess == answer) {
			 // You are right!
			return original_answer;
		} else if (strictMarking || answer.length <= 4) {
			// You are wrong!
			return "";
		} else {
			// Now use the similarity check algorythm
			var i = 0;
			var j = 0;
			var orders = [
				[answer, guess],
				[guess, answer]
			];
			var maxMisses = Math.floor(answer.length / 6) + 1;
			var misses = 0;
			if (guess.length <= maxMisses) {
				misses = Math.abs(guess.length - answer.length);
				for (i = 0; i < guess.length; i++) {
					if (answer.search(guess[i]) == -1) {
						misses += 1
					}
				}
				if (misses <= maxMisses) {
					return original_answer
				} else {
					return ""
				}
			}
			// Iterate through the different orders of checking
			for (i = 0; i < 2; i++) {
				var string1 = orders[i][0];
				var string2 = orders[i][1];
				while (string1) {
					misses = Math.floor((Math.abs(string1.length - string2.length) + Math.abs(guess.length - answer.length)) / 2);
					var max = Math.min(string1.length, string2.length);
					for (j = 0; j < max; j++) {
						var a = string2.charAt(j);
						var b = string1.charAt(j);
						if (a != b) misses += 1;
						if (misses > maxMisses) break
					}
					if (misses <= maxMisses) {
						// You are right
						return original_answer;
					}
					string1 = string1.substr(1)
				}
			}
			// You are wrong!
			return ""
		}
	},
	
	// Extracts the idevice id and input id from a javascript element
	getIds : function(e) {
		// Extract the idevice id and the input number out of the element's id
		// id is "clozeBlank%s.%s" % (idevice.id, input number)		
		var t = e.id.slice(10);
		var n = t.indexOf(".");
		var r = t.slice(0, n);
		var i = t.slice(t.indexOf(".") + 1);
		return [r, i]
	},
	
	// Calculate the score for cloze idevice
	showScore : function(e, t) {
		var n = 0;
		var r = document.getElementById("cloze" + e);
		var i = $exe.cloze.getInputs(e);
		for (var s = 0; s < i.length; s++) {
			var o = i[s];
			if (t) {
				var u = $exe.cloze.checkAndMarkWord(o)
			} else {
				var u = $exe.cloze.getMark(o)
			}
			if (u == 2) {
				n++
			}
		}
		// Show it in a nice paragraph
		var a = document.getElementById("clozeScore" + e);
		a.innerHTML = $exe_i18n.yourScoreIs + n + "/" + i.length + "."
	},
	
	// Returns an array of input elements that are associated with a certain idevice
	getInputs : function(e) {
		var t = new Array;
		var n = document.getElementById("cloze" + e);
		$exe.cloze.recurseFindInputs(n, e, t);
		return t
	},
	
	// Adds any cloze inputs found to result, recurses down
	recurseFindInputs : function(e, t, n) {
		for (var r = 0; r < e.childNodes.length; r++) {
			var i = e.childNodes[r];
			// See if it is a blank
			if (i.id) {
				if (i.id.search("clozeBlank" + t) == 0) {
					n.push(i);
					continue
				}
			}
			// See if it contains blanks
			if (i.hasChildNodes()) {
				$exe.cloze.recurseFindInputs(i, t, n)
			}
		}
	},
	
	// Pass the cloze element's id, and the visible property of the feedback element
	// associated with it will be toggled. If there is no feedback field, does
	// nothing	
	toggleFeedback : function(e, t) {
		var n = document.getElementById("clozeVar" + e + ".feedbackId");
		if (n) {
			var r = n.value;
			if (t) {
				if (t.value == $exe_i18n.showFeedback) t.value = $exe_i18n.hideFeedback;
				else t.value = $exe_i18n.showFeedback
			}
			$exe.cloze.toggle(r)
		}
	},
	
	// Toggle the visiblity of an element from it's id
	toggle : function(e) {
		$("#" + e).toggle()
	},
	
	// ClozelangElement's functions
	// This functions are only required for the iDevice "FPD - Actividad de Espacios en Blanco (Modificada)"
	
		// ClozelangElement's function
		// Called when a learner types something into a cloze word space
		onLangChange : function(ele) {
			var ident = $exe.cloze.getLangIds(ele)[0];
			var instant = eval(document.getElementById("clozelangFlag" + ident + ".instantMarking").value);
			if (instant) {
				$exe.cloze.checkAndMarkLangWord(ele);
				// Hide the score paragraph if visible
				var scorePara = document.getElementById("clozelangScore" + ident);
				scorePara.innerHTML = ""
			}
		},

		// ClozelangElement's function
		// Recieves and marks answers from student
		langSubmit : function(e) {
			// Mark all of the words
			$exe.cloze.showLangScore(e, 1);
			// Hide Submit
			$exe.cloze.toggle("submit" + e);
			// Show feedback
			$exe.cloze.toggleLangFeedback(e)
		},
		
		// ClozelangElement's function
		// Makes cloze idevice like new:	
		langRestart : function(e) {
			// Hide Feedback
			$exe.cloze.toggleLangFeedback(e);
			// Clear the answers (Also hides score)
			$exe.cloze.toggleLangAnswers(e, true);
			// Hide Restart
			$exe.cloze.toggle("restart" + e);
			// Hide Show Answers Button
			$exe.cloze.toggle("showAnswersButton" + e);
			// Show Submit
			$exe.cloze.toggle("submit" + e)
		},
		
		// ClozelangElement's function
		// Show/Hide all answers in the cloze idevice
		// 'clear' is an optional argument, that forces all the answers to be cleared
		// whether they are all finished and correct or not	
		toggleLangAnswers: function(e, t) {
			// See if any have not been answered yet
			var n = true; // allCorrect
			var r = $exe.cloze.getLangInputs(e);
			if (!t) {
				for (var i = 0; i < r.length; i++) {
					var s = r[i];
					if ($exe.cloze.getLangMark(s) != 2) {
						n = false;
						break
					}
				}
			}
			if (n) {
				// Clear all answers
				$exe.cloze.clearLangInputs(e, r)
			} else {
				// Write all answers
				$exe.cloze.fillLangInputs(e, r)
			}
			// Hide the score paragraph, irrelevant now
			var o = document.getElementById("clozelangScore" + e);
			o.innerHTML = "";
			// If the get score button is visible and we just filled in all the right
			// answers, disable it until they clear the scores again.		
			var u = document.getElementById("getScore" + e);
			if (u) {
				u.disabled = !n
			}
		},
		
		// ClozelangElement's function
		// Shows all answers for a cloze field
		// 'inputs' is an option argument containing a list of the 'input' elements for
		// the field	
		fillLangInputs: function(e, t) {
			if (!t) {
				var t = $exe.cloze.getLangInputs(e)
			}
			for (var n = 0; n < t.length; n++) {
				var r = t[n];
				r.value = $exe.cloze.getLangAnswer(r);
				$exe.cloze.markWord(r, $exe.cloze.CORRECT);
				// Toggle the readonlyness of the answers also
				r.setAttribute("readonly", "readonly")
			}
		},
		
		// ClozelangElement's function
		// Blanks all the answers for a cloze field
		// 'inputs' is an option argument containing a list of the 'input' elements for
		// the field	
		clearLangInputs : function(e, t) {
			if (!t) {
				var t = $exe.cloze.getLangInputs(e)
			}
			for (var n = 0; n < t.length; n++) {
				var r = t[n];
				r.value = "";
				$exe.cloze.markWord(r, $exe.cloze.NOT_ATTEMPTED);
				// Toggle the readonlyness of the answers also
				r.removeAttribute("readonly")
			}
		},
		
		// ClozelangElement's function
		// Marks a cloze word in view mode.
		// Returns NOT_ATTEMPTED, CORRECT, or WRONG	
		checkAndMarkLangWord : function(e) {
			var t = $exe.cloze.checkLangWord(e);
			if (t != "") {
				$exe.cloze.markLangWord(e, $exe.cloze.CORRECT);
				e.value = t;
				return $exe.cloze.CORRECT
			} else if (!e.value) {
				$exe.cloze.markLangWord(e, $exe.cloze.NOT_ATTEMPTED);
				return $exe.cloze.NOT_ATTEMPTED
			} else {
				$exe.cloze.markLangWord(e, $exe.cloze.WRONG);
				return $exe.cloze.WRONG
			}
		},
		
		// ClozelangElement's function
		// Marks a cloze question (at the moment just changes the color)
		// 'mark' (t) should be 0=Not Answered, 1=Wrong, 2=Right	
		markLangWord : function(e, t) {
			switch (t) {
				case 0:
					// Not attempted
					e.style.backgroundColor = "";
					break;
				case 1:
					// Wrong
					e.style.backgroundColor = "#FF9999";
					break;
				case 2:
					// Correct
					e.style.backgroundColor = "#CCFF99";
					break
			}
			return t
		},
		
		// ClozelangElement's function
		// Return the last mark applied to a word
		getLangMark : function(e) {
			// Return last mark applied
			switch (e.style.backgroundColor) {
				case "#FF9999":
					return 1; // Wrong
				case "#CCFF99":
					return 2; // Correct
				default:
					return 0 // Not attempted
			}
		},
		
		// ClozelangElement's function
		// Decrypts and returns the answer for a certain cloze field word
		getLangAnswer : function(e) {
			var t = $exe.cloze.getLangIds(e);
			var n = t[0];
			var r = t[1];
			var i = document.getElementById("clozelangAnswer" + n + "." + r);
			var s = i.innerHTML;
			s = $exe.cloze.decode64(s);
			s = unescape(s);
			// XOR "Decrypt"
			result = "";
			var o = "X".charCodeAt(0);
			for (var u = 0; u < s.length; u++) {
				var a = s.charCodeAt(u);
				o ^= a;
				result += String.fromCharCode(o)
			}
			return result
		},
		
		// ClozelangElement's function
		// Returns the corrected word or an empty string
		checkLangWord : function(ele) {
			var guess = ele.value;
			// Extract the idevice id and the input number out of the element's id
			var original = $exe.cloze.getLangAnswer(ele);
			var answer = original;
			var guess = ele.value;
			var ident = $exe.cloze.getLangIds(ele)[0];
			// Read the flags for checking answers
			var strictMarking = eval(document.getElementById("clozelangFlag" + ident + ".strictMarking").value);
			var checkCaps = eval(document.getElementById("clozelangFlag" + ident + ".checkCaps").value);
			if (!checkCaps) {
				guess = guess.toLowerCase();
				answer = original.toLowerCase()
			}
			if (guess == answer) {
				// You are right!
				return original;
			} else if (strictMarking || answer.length <= 4) {
				// You are wrong!
				return "";
			} else {
				// Now use the similarity check algorythm
				var i = 0;
				var j = 0;
				var orders = [
					[answer, guess],
					[guess, answer]
				];
				var maxMisses = Math.floor(answer.length / 6) + 1;
				var misses = 0;
				if (guess.length <= maxMisses) {
					misses = Math.abs(guess.length - answer.length);
					for (i = 0; i < guess.length; i++) {
						if (answer.search(guess[i]) == -1) {
							misses += 1
						}
					}
					if (misses <= maxMisses) {
						return answer
					} else {
						return ""
					}
				}
				// Iterate through the different orders of checking
				for (i = 0; i < 2; i++) {
					var string1 = orders[i][0];
					var string2 = orders[i][1];
					while (string1) {
						misses = Math.floor((Math.abs(string1.length - string2.length) + Math.abs(guess.length - answer.length)) / 2);
						var max = Math.min(string1.length, string2.length);
						for (j = 0; j < max; j++) {
							var a = string2.charAt(j);
							var b = string1.charAt(j);
							if (a != b) misses += 1;
							if (misses > maxMisses) break
						}
						if (misses <= maxMisses) {
							// You are right
							return answer;
						}
						string1 = string1.substr(1)
					}
				}
				// You are wrong!
				return ""
			}
		},
		
		// ClozelangElement's function
		// Extracts the idevice id and input id from a javascript element	
		getLangIds : function(e) {
			// Extract the idevice id and the input number out of the element's id
			// id is "clozelangBlank%s.%s" % (idevice.id, input number)		
			var t = e.id.slice(14);
			var n = t.indexOf(".");
			var r = t.slice(0, n);
			var i = t.slice(t.indexOf(".") + 1);
			return [r, i]
		},
		
		// ClozelangElement's function
		// Calculate the score for cloze idevice	
		showLangScore : function(ident, mark) {
			var showScore = eval(document.getElementById("clozelangFlag" + ident + ".showScore").value);
			if (showScore) {
				var score = 0;
				var div = document.getElementById("clozelang" + ident);
				var inputs = $exe.cloze.getLangInputs(ident);
				for (var i = 0; i < inputs.length; i++) {
					var input = inputs[i];
					if (mark) {
						var result = $exe.cloze.checkAndMarkLangWord(input)
					} else {
						var result = $exe.cloze.getLangMark(input)
					}
					if (result == 2) {
						score++
					}
				}
				// Show it in a nice paragraph
				var scorePara = document.getElementById("clozelangScore" + ident);
				scorePara.innerHTML = $exe_i18n.yourScoreIs + score + "/" + inputs.length + "."
			}
		},
			
		// ClozelangElement's function
		// Adds any cloze inputs found to result, recurses down
		recurseFindLangInputs : function(e, t, n) {
			for (var r = 0; r < e.childNodes.length; r++) {
				var i = e.childNodes[r];
				// See if it is a blank
				if (i.id) {
					if (i.id.search("clozelangBlank" + t) == 0) {
						n.push(i);
						continue
					}
				}
				// See if it contains blanks
				if (i.hasChildNodes()) {
					$exe.cloze.recurseFindLangInputs(i, t, n)
				}
			}
		},	
		
		// ClozelangElement's function
		// Returns an array of input elements that are associated with a certain idevice
		getLangInputs : function(e) {
			var t = new Array;
			var n = document.getElementById("clozelang" + e);
			$exe.cloze.recurseFindLangInputs(n, e, t);
			return t
		},
		
		// Pass the cloze element's id, and the visible property of the feedback element
		// associated with it will be toggled. If there is no feedback field, does
		// nothing	
		toggleLangFeedback : function(e) {
			var t = document.getElementById("clozelangVar" + e + ".feedbackId");
			if (t) {
				var n = t.value;
				$exe.cloze.toggle(n)
			}
		}
	
	// / ClozelangElement's functions
};

// Execute
if (typeof jQuery != "undefined") {
    $(function() {
        $exe.init();
    });
	$(window).load(function(){
		$exe.mediaReplace();
	});	
}