/**
* editor_plugin_src.js
*
* <http://www.agustinvillalba.com>
* @author: 	Agustin Villalba <info@agustinvillalba.com>
* @license 	LGPL v3
* @name		ImprovedCode
* @package 	TinyMCE 3.4
* @version: 1.2.1 July 2013
*/

(function() {
		var extend = tinymce.extend;

        // Load plugin specific language pack
        tinymce.PluginManager.requireLangPack('improvedcode');

        tinymce.create('tinymce.plugins.ImprovedCodePlugin', {
                /**
                 * Initializes the plugin, this will be executed after the plugin has been created.
                 * This call is done before the editor instance has finished it's initialization so use the onInit event
                 * of the editor instance to intercept that event.
                 *
                 * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
                 * @param {string} url Absolute URL to where the plugin is located.
                 */
                init : function(ed, url) {
					var t = this;

					t.settings = extend({
						height: 580
						,indentUnit: 4
						,tabSize: 4
						,lineWrapping: true
						,lineNumbers: true
						,autoIndent: true
						,optionsBar: true
						,theme: 'default'
					},ed.getParam('improvedcode_options'));

                    // Register the command so that it can be invoked by using tinyMCE.activeEditor.execCommand('mceExample');
                    ed.addCommand('mceImprovedCode', function() {
							ed.focus();
							ed.selection.collapse(true);
							ed.selection.setContent('<span class="CuRCaRet" style="display:none">&#0;</span>');

                            ed.windowManager.open({
                                    file : url + '/improvedcode.htm',
									width : 720,
									height : t.settings.height,
                                    inline : true,
									resizable : true,
									maximizable : true
                            }, {
                                    plugin_url : url, // Plugin absolute URL
									settings: t.settings
                            });
                    });

                    // Register example button
                    ed.addButton('improvedcode', {
                            title : 'improvedcode.desc',
                            cmd : 'mceImprovedCode',
                            image : url + '/img/htmlplus.gif',
                            onPostRender: function() {
                                var cm = this;
                                ed.on('NodeChange',function(e){
                                    ctrl.active(e.element.nodeName == 'IMG');
                                });
                            }
                    });

                    // Add a node change handler, selects the button in the UI when a image is selected
                    ed.onNodeChange.add(function(ed, cm, n) {
                            cm.setActive('improvedcode', n.nodeName == 'IMG');
                    });
                },

                /**
                 * Creates control instances based in the incomming name. This method is normally not
                 * needed since the addButton method of the tinymce.Editor class is a more easy way of adding buttons
                 * but you sometimes need to create more complex controls like listboxes, split buttons etc then this
                 * method can be used to create those.
                 *
                 * @param {String} n Name of the control to create.
                 * @param {tinymce.ControlManager} cm Control manager to use inorder to create new control.
                 * @return {tinymce.ui.Control} New control instance or null if no control was created.
                 */
                createControl : function(n, cm) {
                        return null;
                },

                /**
                 * Returns information about the plugin as a name/value array.
                 * The current keys are longname, author, authorurl, infourl and version.
                 *
                 * @return {Object} Name/value array containing information about the plugin.
                 */
                getInfo : function() {
                        return {
                                longname : 	'Improved source code highlighter plugin',
                                author : 	'Agustin Villalba',
                                authorurl : 'http://www.agustinvillalba.com',
                                infourl : 	'http://www.agustinvillalba.com/portfolio.html',
                                version : 	'1.2.1'
                        };
                }
        });

        // Register plugin
        tinymce.PluginManager.add('improvedcode', tinymce.plugins.ImprovedCodePlugin);
})();


