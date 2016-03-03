// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Tinymce text editor mathslate plugin.
 *
 * @package    editor-tinymce
 * @subpackage    mathslate
 * @copyright  2013 Daniel Thies  <dthies@ccal.edu>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
M.tinymce_mathslate = M.tinymce_mathslate || {};
var CSS = {
   EDITOR: 'mathslate-tinymce'
};
var NS = M.tinymce_mathslate;
    /**
     * The window used to hold the editor.
     *
     * @property dialogue
     * @type M.core.dialogue
     * @default null
     */
    NS.dialogue = null;

    /**
     * The selection object returned by the browser.
     *
     * @property selection
     * @type Range
     * @default null
     */
    NS.selection = null;

    /**
     * The configuration json string for math tools.
     *
     * @property config
     * @type Range
     * @default null
     */

    NS.config = null;

    /**
     * Add this button to the form.
     *
     * @method init
     * @param {Object} params
     */

    NS.init = function(params) {
        M.tinymce_mathslate = M.tinymce_mathslate || {};
        M.tinymce_mathslate.config = params.config || M.tinymce_mathslate.config;
        M.tinymce_mathslate.help = params.help || M.tinymce_mathslate.help;
        var dialogue = Y.one('#' + params.elementid);
        
        var editorID = dialogue.one('.mathslate-container').generateID();
        Y.one('#' + editorID).addClass(CSS.EDITOR);
        var me = new M.tinymce_mathslate.Editor('#' + editorID, M.tinymce_mathslate.config);

        var cancel = Y.one('#' + editorID).appendChild(Y.Node.create('<button title="'
            + M.util.get_string('cancel_desc', 'tinymce_mathslate') + '">'
            + M.util.get_string('cancel', 'tinymce_mathslate') + '</button>'));
        cancel.on('click', function() {
            window.tinyMCEPopup.close();
        });
        if (typeof MathJax === 'undefined') {
            return;
        }

        var displayTex = Y.one('#' + editorID).appendChild(Y.Node.create('<button title="'
            + M.util.get_string('display_desc', 'tinymce_mathslate') + '">'
            + M.util.get_string('display', 'tinymce_mathslate') + '</button>'));
        var inlineTex = Y.one('#' + editorID).appendChild(Y.Node.create('<button title="'
            + M.util.get_string('inline_desc', 'tinymce_mathslate') + '">'
            + M.util.get_string('inline', 'tinymce_mathslate') + '</button>'));

/* This code shows a button to saves work as JSON that can be incorporated in config.json.
        var saveJSON = Y.one('#' + editorID).appendChild(Y.Node.create('<button title="' + 'JSON' + '">'
            + 'JSON' + '</button>'));
        saveJSON.on('click', function() {
            window.tinyMCEPopup.editor.execCommand('mceInsertContent', false, me.output('JSON'));
            window.tinyMCEPopup.close();
            });
*/
        displayTex.on('click', function() {
            window.tinyMCEPopup.editor.execCommand('mceInsertContent', false,  '\\[' + me.output('tex') + '\\]');
            window.tinyMCEPopup.close();
            });
        inlineTex.on('click', function() {
            window.tinyMCEPopup.editor.execCommand('mceInsertContent', false,  '\\(' + me.output('tex') + '\\)');
            window.tinyMCEPopup.close();
            });
            
        window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, me.node.generateID()]);

        M.tinymce_mathslate.dialogue = dialogue;
        
    };

