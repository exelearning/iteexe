/**
 * $Id: editor_plugin_src.js 201 2007-02-12 15:56:56Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright © 2004-2007, Moxiecode Systems AB, All rights reserved.
 */

/* Import plugin specific language pack */
tinyMCE.importPluginLanguagePack('exemath');

var TinyMCE_AdvancedImagePlugin = {
	getInfo : function() {
		return {
			longname : 'eXe math LaTeX-based plugin using mimetex',
			author : 'eXe',
			authorurl : 'http://exelearning.org',
			infourl : 'http://exelearning.org',
			version : tinyMCE.majorVersion + "." + tinyMCE.minorVersion
		};
	},

	getControlHTML : function(cn) {
		switch (cn) {
			//case "image":
			case "exemath":
				//return tinyMCE.getButtonHTML(cn, 'lang_image_desc', '{$themeurl}/images/image.gif', 'mceAdvImage');
				return tinyMCE.getButtonHTML(cn, 'lang_exemath_desc', '{$pluginurl}/images/exemath.gif', 'mceExeMath');
		}

		return "";
	},

	execCommand : function(editor_id, element, command, user_interface, value) {
		switch (command) {
			//case "mceAdvImage":
			case "mceExeMath":
				var template = new Array();

				//template['file']   = '../../plugins/advimage/image.htm';
				template['file']   = '../../plugins/exemath/exemath.htm';
				template['width']  = 480;
				template['height'] = 380;

				// Language specific width and height addons
				template['width']  += tinyMCE.getLang('lang_advimage_delta_width', 0);
				template['height'] += tinyMCE.getLang('lang_advimage_delta_height', 0);

				var inst = tinyMCE.getInstanceById(editor_id);
				var elm = inst.getFocusElement();

				if (elm != null && tinyMCE.getAttrib(elm, 'class').indexOf('mceItem') != -1)
					return true;

				tinyMCE.openWindow(template, {editor_id : editor_id, inline : "yes"});

				return true;
		}

		return false;
	},

	cleanup : function(type, content) {
		switch (type) {
			case "insert_to_editor_dom":
				var imgs = content.getElementsByTagName("img"), src, i;
				for (i=0; i<imgs.length; i++) {
					var onmouseover = tinyMCE.cleanupEventStr(tinyMCE.getAttrib(imgs[i], 'onmouseover'));
					var onmouseout = tinyMCE.cleanupEventStr(tinyMCE.getAttrib(imgs[i], 'onmouseout'));

					if ((src = this._getImageSrc(onmouseover)) != "") {
						if (tinyMCE.getParam('convert_urls'))
							src = tinyMCE.convertRelativeToAbsoluteURL(tinyMCE.settings['base_href'], src);

						imgs[i].setAttribute('onmouseover', "this.src='" + src + "';");
					}

					if ((src = this._getImageSrc(onmouseout)) != "") {
						if (tinyMCE.getParam('convert_urls'))
							src = tinyMCE.convertRelativeToAbsoluteURL(tinyMCE.settings['base_href'], src);

						imgs[i].setAttribute('onmouseout', "this.src='" + src + "';");
					}
				}
				break;

			case "get_from_editor_dom":
				var imgs = content.getElementsByTagName("img");
				for (var i=0; i<imgs.length; i++) {
					var onmouseover = tinyMCE.cleanupEventStr(tinyMCE.getAttrib(imgs[i], 'onmouseover'));
					var onmouseout = tinyMCE.cleanupEventStr(tinyMCE.getAttrib(imgs[i], 'onmouseout'));

					if ((src = this._getImageSrc(onmouseover)) != "") {
						if (tinyMCE.getParam('convert_urls'))
							src = eval(tinyMCE.settings['urlconverter_callback'] + "(src, null, true);");

						imgs[i].setAttribute('onmouseover', "this.src='" + src + "';");
					}

					if ((src = this._getImageSrc(onmouseout)) != "") {
						if (tinyMCE.getParam('convert_urls'))
							src = eval(tinyMCE.settings['urlconverter_callback'] + "(src, null, true);");

						imgs[i].setAttribute('onmouseout', "this.src='" + src + "';");
					}
				}
				break;
		}

		return content;
	},

	handleNodeChange : function(editor_id, node, undo_index, undo_levels, visual_aid, any_selection) {
		if (node == null)
			return;

		do {
			if (node.nodeName == "IMG" && tinyMCE.getAttrib(node, 'class').indexOf('mceItem') == -1) {
				//tinyMCE.switchClass(editor_id + '_advimage', 'mceButtonSelected');
				tinyMCE.switchClass(editor_id + '_exemath', 'mceButtonSelected');
				return true;
			}
		} while ((node = node.parentNode));

		//tinyMCE.switchClass(editor_id + '_advimage', 'mceButtonNormal');
		tinyMCE.switchClass(editor_id + '_exemath', 'mceButtonNormal');

		return true;
	},

	/**
	 * Returns the image src from a scripted mouse over image str.
	 *
	 * @param {string} s String to get real src from.
	 * @return Image src from a scripted mouse over image str.
	 * @type string
	 */
	_getImageSrc : function(s) {
		var sr, p = -1;

		if (!s)
			return "";

		if ((p = s.indexOf('this.src=')) != -1) {
			sr = s.substring(p + 10);
			sr = sr.substring(0, sr.indexOf('\''));

			return sr;
		}

		return "";
	}
};

//tinyMCE.addPlugin("advimage", TinyMCE_AdvancedImagePlugin);
tinyMCE.addPlugin("exemath", TinyMCE_AdvancedImagePlugin);
