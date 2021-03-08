/**
 * GeoGebra Activity iDevice (edition code)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Authors: Ignacio Gros (http://gros.es/), Javier Cayetano Rodríguez and Manuel Narváez Martínez for http://exelearning.net/
 *
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */

var $exeDevice = {

	// We use eXe's _ function
	i18n: {
		name: _('GeoGebra Activity')
	},
	activityURLbase: "https://www.geogebra.org/m/",
	init: function () {

		this.createForm();

	},

	// True/false options
	trueFalseOptions: {
		"showMenuBar": [_("Show menu bar"), false],
		"showAlgebraInput": [_("Allow algebra input"), false],
		"showToolBar": [_("Show toolbar"), false],
		"showToolBarHelp": [_("Show toolbar help"), false],
		"showResetIcon": [_("Show reset icon"), false],
		"enableRightClick": [_("Enable right click"), false],
		"errorDialogsActive": [_("Error dialogs active"), false],
		"preventFocus": [_("Prevent focus"), false],
		"showFullscreenButton": [_("Show fullscreen button"), true],
		"disableAutoScale": [_("Disable auto-scale"), false],
		"showSuggestionButtons": [_("Show suggestion buttons"), true],
		"playButton": [_("Play button"), false],
		"ShowAuthor": [_("Authorship"), true]
	},

	// Create the form to insert HTML in the TEXTAREA
	createForm: function () {
		// i18n
		var str1 = c_("Save score");
		str1 = str1[1];
		var html = '\
			<div id="eXeAutoGeogebraForm">\
				<p class="exe-idevice-description">' + _("Insert a GeoGebra activity from www.geogebra.org. It requires an Internet connection.").replace(' www.geogebra.org', ' <a href="https://www.geogebra.org/" target="_blank" rel="noopener noreferrer">www.geogebra.org</a>') + '</p>\
				<fieldset class="exe-fieldset">\
					<legend><a href="#">' + _("Instructions") + '</a></legend>\
					<div class="exe-textarea-field">\
						<label for="geogebraActivityInstructions" class="sr-av">' + _("Instructions") + ': </label>\
						<textarea id="geogebraActivityInstructions" class="exe-html-editor"\></textarea>\
					</div>\
				</fieldset>\
				<fieldset class="exe-fieldset">\
					<legend><a href="#">' + _("General Settings") + '</a></legend>\
					<div>\
						<p id="geogebraActivityURLS">\
							<label for="geogebraActivityURL">' + _("URL or identifier (ID)") + ': </label><input type="text" name="geogebraActivityURL" id="geogebraActivityURL" /> \
							<a href="#" id="geogebraActivityPlayButton" title="' + _("Load data") + '"><span class="sr-av">'+_("Load data")+'</span></a>\
							<label for="geogebraActivityURLexample">' + _("Example") + ': </label><input type="text" id="geogebraActivityURLexample" name="geogebraActivityURLexample" readonly="readonly" value="' + this.activityURLbase + 'VgHhQXCC" />\
						</p>\
						<p>\
							<span>' + _("Title") + ': </span>\
							<span id="geogebraActivityTitle"><a href="https://#" target="_blank"></a></span>\
					    </p>\
						<p>\
						    <span>' + _("Authorship") + ': </span>\
						    <span id="geogebraActivityAuthorURL"></span>\
						</p>\
						<p id="geogebraActivitySize">\
							<label for="geogebraActivityWidth">' + _("Width") + ': </label><input type="text" max="1500" name="geogebraActivityWidth" id="geogebraActivityWidth" /><span> px</span>\
							<label for="geogebraActivityHeight">' + _("Height") + ': </label><input type="text" max="1500" name="geogebraActivityHeight" id="geogebraActivityHeight" /><span> px</span>\
						</p>\
					</div>\
				</fieldset>\
				<fieldset id="eXeAutoGeogebraAdvancedOptions" class="exe-fieldset exe-fieldset-closed exe-feedback-fieldset">\
					<legend><a href="#">' + _("Advanced Options") + '</a></legend>\
					<div>\
						<p id="geogebraActivityLangWrapper">\
							<label for="geogebraActivityLang">' + _("Language") + ': </label><input type="text" max="2" name="geogebraActivityLang" id="geogebraActivityLang" /> <span class="input-instructions">es, en, fr, de, ca, eu, gl...</span>\
							<label for="geogebraActivityBorderColor">' + _("Border color") + ': </label><input type="text" max="6" name="geogebraActivityBorderColor" id="geogebraActivityBorderColor" class="exe-color-picker" />\
							<label for="geogebraActivityScale">' + _("Size") + ' (%): <input type="number" name="geogebraActivityScale" id="geogebraActivityScale" value="100" min="1" max="100"  step="1" /> </label>\
						</p>\
						<div id="eXeAutoGeogebraCheckOptions">' + this.getTrueFalseOptions() + '</div>\
						<p id="">\
							</p>\
						<p id="geogebraActivitySCORMblock">\
							<label for="geogebraActivitySCORM"><input type="checkbox" name="geogebraActivitySCORM" id="geogebraActivitySCORM" /> ' + _("Save score button") + '</label>\
							<span id="geogebraActivitySCORMoptions">\
								<label for="geogebraActivitySCORMbuttonText">' + _("Button text") + ': </label>\
								<input type="text" max="100" name="geogebraActivitySCORMbuttonText" id="geogebraActivitySCORMbuttonText" value="' + str1 + '" /> \
							</span>\
						</p>\
						<div id="geogebraActivitySCORMinstructions">\
							<ul>\
								<li>' + _("The button will only be displayed when exporting as SCORM and while editing in eXeLearning.") + '</li>\
								<li>' + _('Do not include more than one activity with score per page.') + '</li>\
							</ul>\
						</div>\
					</div>\
				</fieldset>\
				' + this.getTextFieldset("after") + '\
			</div>\
		';

		// Insert the form
		var field = $("#activeIdevice textarea");
		field.before(html);

		$("#geogebraActivityURLexample").focus(function () {
			this.select();
		});

		$("#geogebraActivityPlayButton").on('click', function (e) {
			e.preventDefault();
			var urlBase = this.activityURLbase,
				url = $("#geogebraActivityURL").val(),
				murl=url;
			url = url.replace("https://ggbm.at/", urlBase);
			var id = $exeDevice.getId(url);
			$("#geogebraActivityAuthorURL").text('');
			$("#geogebraActivityTitle").find('a').text('');
			$("#geogebraActivityTitle").find('a').prop('href', '#');
			if (url == "" || id == "") {
				$exeDevice.errorMessage(true);
				return;
			}

			$exeDevice.loadData(id, murl);
		});
		// Try to get width and height
		$("#geogebraActivityURL").change(function () {
			var urlBase = this.activityURLbase,
				url = $("#geogebraActivityURL").val(),
				murl=url;
			url = url.replace("https://ggbm.at/", urlBase);
			var id = $exeDevice.getId(url);
			if (url == "" || id == "") {
				return;
			}
			$exeDevice.loadData(id, murl);

		});


		$("#geogebraActivityWidth,#geogebraActivityHeight").keyup(function () {
			var v = this.value;
			v = v.replace(/\D/g, '');
			v = v.substring(0, 4);
			this.value = v;
		});

		$("#geogebraActivityLang").keyup(function () {
			var v = this.value;
			v = v.replace(/[^A-Za-z]/g, "");
			v = v.substring(0, 2);
			this.value = v;
		});

		$("#geogebraActivityScale").keyup(function () {
			var v = this.value;
			v = v.replace(/\D/g, '');
			v = v.substring(0, 3);
			v = v < 1 ? 1 : v;
			v = v > 100 ? 100 : v;
			this.value = v;
		});
		$("#geogebraActivitySCORM").change(function () {
			if (this.checked) {
				$("#geogebraActivitySCORMoptions,#geogebraActivitySCORMinstructions").hide().css({
					opacity: 0,
					visibility: "visible"
				}).show().animate({
					opacity: 1
				}, 500);
			} else {
				$("#geogebraActivitySCORMoptions,#geogebraActivitySCORMinstructions").hide();
			}
		});


		this.loadPreviousValues(field);

	},
	loadData: function (id, lurl) {
		if (id == "") return;
		var data = {
			request: {
				"-api": "1.0.0",
				task: {
					"-type": "fetch",
					fields: {
						field: [{
							"-name": "width"
						}, {
							"-name": "height"
						}, {
							"-name": "author"
						}, {
							"-name": "url"
						}, {
							"-name": "title"
						},{
							"-name": "visibility"
						},]
					},
					filters: {
						field: [{
							"-name": "id",
							"#text": id
						}]
					},
					order: {
						"-by": "timestamp",
						"-type": "desc"
					},
					limit: {
						"-num": "1"
					}
				}
			}
		};
		$("#geogebraActivityURL").addClass("loading");
		$("#geogebraActivityURL").css("color", "#228B22");
		$.ajax({
			type: "POST",
			url: "https://www.geogebra.org/api/json.php",
			data: JSON.stringify(data),
			success: function (res) {
				if (res && res.responses && res.responses.response && res.responses.response.item) {
					res = res.responses.response.item;
					var w = "";
					var h = "";
					if (res.width) w = res.width;
					if (res.height) h = res.height
					$("#geogebraActivityURL").removeClass("loading");
					if (w != "" && h != "") {
						$("#geogebraActivityWidth").val(w);
						$("#geogebraActivityHeight").val(h);
					}
					var author = res.author ? res.author : "",
						murl = res.url ? res.url : "",
						title = res.title ? res.title : "",
						visibility = res.visibility ? res.visibility : "";
					if(visibility.toLowerCase() !="o"){
						murl=lurl.indexOf('http')==0?lurl:"https://ggbm.at/"+id;
					}
					$("#geogebraActivityAuthorURL").text(author);
					$("#geogebraActivityTitle").find('a').text(title);
					$("#geogebraActivityTitle").find('a').prop('href', murl);
				} else {
					$exeDevice.errorMessage(false);
				}
			},
			error: function () {
				$exeDevice.errorMessage(false);

			}
		});

	},
	errorMessage: function (tipo) {
		$("#geogebraActivityAuthorURL").text('');
		$("#geogebraActivityTitle").find('a').text('');
		$("#geogebraActivityTitle").find('a').prop('href', '#');
		$("#geogebraActivityURL").css("color", "#DC143C");
		$("#geogebraActivityURL").focus();
		$("#geogebraActivityURL").removeClass("loading");
		if(tipo){
			eXe.app.alert(_("Provide a valid GeoGebra URL or activity ID."));
		}
	},
	getId: function (url) {
		var id = "";
		var urlBase = $exeDevice.activityURLbase;
		var urlRegex = /^https?:\/\/www\.geogebra\.org\/m\/[a-zA-Z0-9]{2,20}\#material\/[a-zA-Z0-9]{2,20}/;
		var urlRegex2 = /^[a-zA-Z0-9]{2,20}$/;

		if (url.match(urlRegex)) {
			id = url.replace(urlBase, "");
			id = id.split("/");
			id = id[id.length - 1];
		} else if (url.indexOf(urlBase) == 0) {
			id = url.replace(urlBase, "");
			id = id.split("/");
			id = id[0];
		} else if (url.match(urlRegex2)) {
			id = url
		}
		id = id.replace(/ /g, "");
		return id;

	},
	getTrueFalseOptions: function () {

		var html = "";
		var opts = this.trueFalseOptions;
		for (var i in opts) {
			var checked = "";
			html += '<p>';
			html += '<label for="geogebraActivity' + i + '">';
			if (opts[i][1] == true) checked = ' checked="checked"';
			html += '<input type="checkbox" id="geogebraActivity' + i + '"' + checked + ' /> ';
			html += opts[i][0];
			html += '</label>';
			html += '</p>';
		}

		return html;

	},
	getTextFieldset: function (position) {
		if (typeof (position) != "string" || (position != "after" && position != "before")) return "";
		var tit = _('Content after');
		var id = "After";
		if (position == "before") {
			tit = _('Content before');
			id = "Before";
		}
		return "<fieldset class='exe-fieldset exe-feedback-fieldset exe-fieldset-closed'>\
                    <legend><a href='#'>" + tit + " (" + _('Optional').toLowerCase() + ")</a></legend>\
                    <div>\
                        <p>\
                            <label for='eXeIdeviceText" + id + "' class='sr-av'>" + tit + ":</label>\
                            <textarea id='eXeIdeviceText" + id + "' class='exe-html-editor'\></textarea>\
                        </p>\
                    <div>\
				</fieldset>";
	},

	// Load the saved values in the form fields
	loadPreviousValues: function (field) {

		// Set default language
		var defaultLang = "en";
		var langs = ["es", "en", "fr", "de", "ca", "eu"];
		var docLang = $("html").eq(0).attr("lang");
		if (langs.indexOf(docLang) > -1) defaultLang = langs[langs.indexOf(docLang)];
		var langField = $("#geogebraActivityLang");
		langField.val(defaultLang);

		var originalHTML = field.val();
		if (originalHTML != '') {

			var wrapper = $("<div></div>");
			wrapper.html(originalHTML);

			var div = $("div", wrapper);

			if (div.length == 0) return;
			div = div.eq(0);
			if (!div.hasClass("auto-geogebra")) return;

			var css = div.attr("class");

			// URL
			var id = css.replace("auto-geogebra auto-geogebra-", "");
			id = id.split(" ");
			id = id[0];
			if (id != "") {
				$("#geogebraActivityURL").val(this.activityURLbase + id);
			}

			if (div.hasClass("auto-geogebra-scorm")) {
				$('#geogebraActivitySCORM').prop('checked', true);
				// scorm-button-text
				var btn = $(".scorm-button-text", div);
				if (btn.length == 1) {
					btn = btn.html();
					btn = btn.replace(" (", "");
					btn = btn.slice(0, -1);
					$("#geogebraActivitySCORMbuttonText").val(btn);
				}
				$("#geogebraActivitySCORMoptions").css("visibility", "visible");
				$("#geogebraActivitySCORMinstructions").show();
			}
			var parts = css.split(" ");
			for (var i = 0; i < parts.length; i++) {
				var part = parts[i];
				var part0 = part;
				if (part.indexOf("auto-geogebra-height-") > -1) {
					part = parseInt(part.replace("auto-geogebra-height-", ""));
					$('#geogebraActivityHeight').val(part);
				} else if (part.indexOf("auto-geogebra-width-") > -1) {
					part = parseInt(part.replace("auto-geogebra-width-", ""));
					$('#geogebraActivityWidth').val(part);
				} else if (part.indexOf("language-") > -1) {
					$('#geogebraActivityLang').val(part.replace("language-", ""));
				} else if (part.indexOf("auto-geogebra-border-") > -1) {
					$('#geogebraActivityBorderColor').val(part.replace("auto-geogebra-border-", ""));
				} else if (part.indexOf("auto-geogebra-scale-") > -1) {
					$('#geogebraActivityScale').val(part.replace("auto-geogebra-scale-", ""));
				}
				var opts = this.trueFalseOptions;
				for (var p in opts) {
					if (part == p) {
						if (opts[p][1] == false) $('#geogebraActivity' + p).prop('checked', true);
					} else {
						if (part0.slice(0, -1) == p) $('#geogebraActivity' + p).prop('checked', false);
					}
				}
			}

			// Instructions
			var instructions = $(".auto-geogebra-instructions", wrapper);
			if (instructions.length == 1) $("#geogebraActivityInstructions").val(instructions.html());
			var textAfter = $(".auto-geogebra-extra-content", wrapper);
			if (textAfter.length == 1) $("#eXeIdeviceTextAfter").val(textAfter.html());

			var author = $(".auto-geogebra-author", wrapper);
			if (author.length == 1) {
				var alt = author.text().split(',');
				if (alt.length == 5) {
					$("#geogebraActivityAuthorURL").text(unescape(alt[0]));
					$("#geogebraActivityTitle").find('a').text(unescape(alt[2]));
					$("#geogebraActivityTitle").find('a').prop('href', unescape(alt[1]));
				}
			}

		}

	},

	save: function () {

		var urlBase = this.activityURLbase;

		// URL
		var url = $("#geogebraActivityURL").val();
		url = url.replace("https://ggbm.at/", urlBase);
		if (url == "") {
			eXe.app.alert(_("Provide a valid GeoGebra URL or activity ID."));
			return false;
		}
		url = $exeDevice.getId(url);
		if (url == '') {
			$exeDevice.errorMessage(true);
			return false;
		}
		var divContent = "";
		// Instructions
		var instructions = tinymce.editors[0].getContent();
		if (instructions != "") divContent = '<div class="auto-geogebra-instructions">' + instructions + '</div>';

		divContent += '<p><a href="' + urlBase + url + '" target="_blank">' + urlBase + url + ' (' + _("New Window") + ')</a></p>';

		var css = 'auto-geogebra auto-geogebra-' + url;

		if (document.getElementById("geogebraActivitySCORM").checked) {
			var buttonText = $("#geogebraActivitySCORMbuttonText").val();
			if (buttonText == "") {
				eXe.app.alert(_("Please write the button text."));
				return false;
			}
			css += " auto-geogebra-scorm";
			divContent += '<span class="scorm-button-text"> (' + buttonText + ')</span>';
		}

		var width = $("#geogebraActivityWidth").val();
		if (!isNaN(width) && width != "") {
			css += " auto-geogebra-width-" + width;
		}

		var height = $("#geogebraActivityHeight").val();
		if (!isNaN(height) && height != "") {
			css += " auto-geogebra-height-" + height;
		}

		// Border color
		var borderColor = $("#geogebraActivityBorderColor").val();
		if (borderColor != "" && borderColor != "ffffff") css += " auto-geogebra-border-" + borderColor;

		// Advanced options
		var lang = $("#geogebraActivityLang").val();
		if (lang.length == 2 && lang != "en") css += " language-" + lang;

		var opts = this.trueFalseOptions;
		for (var i in opts) {
			var opt = $("#geogebraActivity" + i);
			if (opt.is(':checked')) {
				if (opts[i][1] == false) css += " " + i;
			} else {
				if (opts[i][1] == true) css += " " + i + "0";
			}
		}
		var scl = $('#geogebraActivityScale').val();
		css += " auto-geogebra-scale-" + scl;

		var author = $('#geogebraActivityAuthorURL').text() || '';
		var title = $('#geogebraActivityTitle').find('a').text() || '',
			murl = $('#geogebraActivityTitle').find('a').prop('href') || '';
		if (author != "") {
			var ath = _('Authorship');
			var show = $('#geogebraActivityShowAuthor').prop('checked') ? "1" : "0";
			divContent += '<div class="auto-geogebra-author js-hidden">' + escape(author) + ',' + escape(murl) + ',' + escape(title) + ',' + show + ',' + escape(ath) + '</div>';
		}
		var textAfter = tinymce.editors[1].getContent();
		if (textAfter != "") {
			divContent += '<div class="auto-geogebra-extra-content">' + textAfter + '</div>';
		}
		var html = '<div class="' + css + '">' + divContent + '</div>';
		return html;

	},


}