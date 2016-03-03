//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Text editor mathslate plugin.
 *
 * @package    tinymce_mathslate
 * @copyright  2013-2014 Daniel Thies  <dthies@ccal.edu>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
M.tinymce_mathslate = M.tinymce_mathslate || {};
var NS = M && M.tinymce_mathslate || {};
var MathJax = window.MathJax,
    dragenabled = true;
var CSS = {
    SELECTED: 'mathslate-selected',
    WORKSPACE: 'mathslate-workspace',
    PREVIEW: 'mathslate-preview',
    HIGHLIGHT: 'mathslate-highlight',
    DRAGNODE: 'mathslate-workspace-drag',
    DRAGGEDNODE: 'mathslate-workspace-dragged',
    HELPBOX: 'mathslate-help-box',
    PANEL: 'mathslate-bottom-panel'
};
var SELECTORS = {
    SELECTED: '.' + CSS.SELECTED,
    HIGHLIGHT: '.' + CSS.HIGHLIGHT
};
       
//Constructor for equation workspace
NS.MathJaxEditor = function(id) {
    var math = [];
    var se = new NS.mSlots();
    se.slots.push(math);
    var shim, ddnodes;
    this.workspace = Y.one(id).append('<div id="canvas" class="' + CSS.WORKSPACE + '"/>');
    var toolbar = Y.one(id).appendChild(Y.Node.create('<form></form>'));
    var preview = Y.one(id).appendChild(Y.Node.create('<div class="' + CSS.PANEL + '"/>'));
    preview.delegate('click', function(e) {
        //canvas.get('node').one('#' + this.getAttribute('id')).handleClick(e);
        ddnodes.one('#' + this.getAttribute('id')).handleClick(e);
    }, 'div');
    var canvas = new Y.DD.Drop({
        node: this.workspace.one('#canvas')});
    this.canvas = canvas;
    this.canvas.get('node').on('click', function() {
        se.select();
        render();
    });

    //Place buttons for internal editor functions
/*
    var undo = Y.Node.create('<button type="button" class="'
           + CSS.UNDO + '">' + '<img class="iiicon" aria-hidden="true" role="presentation" width="16" height="16" src="'
           + M.util.image_url('undo', 'editor_tinymce')
           + '" title="' + M.util.get_string('undo', 'tinymce_mathslate') + '"/></button>');
    var redo = Y.Node.create('<button type="button" class="'
           + CSS.REDO + '">' + '<img class="iiicon" aria-hidden="true" role="presentation" width="16" height="16" src="'
           + M.util.image_url('redo', 'editor_tinymce') + '" title="'
           + M.util.get_string('redo', 'tinymce_mathslate') + '"/></button>');
    var clear = Y.Node.create('<button type="button" class="'
           + CSS.CLEAR + '">' + '<img class="iiicon" aria-hidden="true" role="presentation" width="16" height="16" src="'
           + M.util.image_url('delete', 'editor_tinymce') + '" title="'
           + M.util.get_string('clear', 'tinymce_mathslate') + '"/></button>');
    var help = Y.Node.create('<button type="button" class="'
           + CSS.HELP + '">' + '<img class="iiicon" aria-hidden="true" role="presentation" width="16" height="16" src="'
           + M.util.image_url('help', 'core') + '" title="'
           + M.util.get_string('help', 'tinymce_mathslate') + '"/></button>');
*/

    var undo = Y.Node.create('<button type="button" class="' + CSS.UNDO + '"'
           + '" title="' + M.util.get_string('undo', 'tinymce_mathslate') + '"/>'
           + '<math><mo>&#x25C1;</mo></math>'
           + '</button>');

    var redo = Y.Node.create('<button type="button" class="' + CSS.REDO + '"'
           + '" title="' + M.util.get_string('redo', 'tinymce_mathslate') + '"/>'
           + '<math><mo>&#x25B7;</mo></math>'
           + '</button>');
    var clear = Y.Node.create('<button type="button" class="' + CSS.CLEAR + '"'
           + '" title="' + M.util.get_string('clear', 'tinymce_mathslate') + '"/>'
           + '<math><mi>&#x2718;</mi></math>'
           + '</button>');

    var help = Y.Node.create('<button type="button" class="'
           + CSS.HELP + '" title="'
           + M.util.get_string('help', 'tinymce_mathslate') + '">'
           + '<math><mi>&#xE47C;</mi></math>'
           + '</button>');
    toolbar.appendChild(clear);
    toolbar.appendChild(undo);
    toolbar.appendChild(redo);
    toolbar.appendChild(help);

    redo.on('click', function() {
        se = se.redo();
        math = se.slots[0];
        render();
    });
    undo.on('click', function() {
        se = se.undo();
        math = se.slots[0];
        render();
    });
    clear.on('click', function() {
        if (Y.one(id + ' ' + SELECTORS.SELECTED)) {
            se.removeSnippet(Y.one(id + ' ' + SELECTORS.SELECTED).getAttribute('id'));
        } else {
            math = [];
            se.next = new NS.mSlots();
            se.next.previous = se;
            se = se.next;
            se.slots.push(math);
        }
        render();
    });
 
    help.on('click', function() {
        preview.setHTML('<iframe src="' + NS.help + '" style="width: '
            + preview.getStyle('width') + '" class="' + CSS.HELPBOX + '"/>');
    });

        /* Create drop shim above workspace
         * @function makeDrops
         *
         */
    function makeDrops() {
        shim = Y.Node.create('<span></span>');
        shim.setHTML(se.preview().replace(/div/g, 'span').replace(/<\/*br>/g, ''));
        Y.one(id).appendChild(shim);
        shim.all('span').each(function (s) {
            if (!canvas.get('node').one('#' + s.getAttribute('id'))) {
                return;
            }
            s.appendChild('<span style="position: relative; opacity: 0"><math display="inline">' +
                toMathML([Y.JSON.parse(se.getItemByID(s.getAttribute('id')))]).replace(/id="[^"]*"/,'') +
                '</math></span>');
            s.setAttribute('style', 'position: absolute; top: 0; left: 0; margin: 0px; z-index: +1');
        });
        shim.all('span').each(function (s) {
            if (!canvas.get('node').one('#' + s.getAttribute('id'))) {
                return;
            }
            var rect = canvas.get('node').one('#' + s.getAttribute('id')).getDOMNode().getBoundingClientRect();
            var srect = s.getDOMNode().getBoundingClientRect();
            s.setStyle('top', rect.top - srect.top);
            s.setStyle('left', rect.left - srect.left);
            s.setStyle('width', rect.width);
            s.setStyle('height', rect.height);
        });
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, shim.getDOMNode()]);
    }
        
    /* Add drag and drop functionality
     * @function makeDraggable
     */
    function makeDraggable () {
        if (shim) {
            shim.remove();
        }
        makeDrops();
        ddnodes = shim;
        preview.setHTML('<div class="' + CSS.PREVIEW + '">' + se.preview('tex') + '</div>');
        if (se.getSelected() && preview.one('#' + se.getSelected())) {
            canvas.get('node').one('#' + se.getSelected()).addClass(CSS.SELECTED);
            canvas.get('node').one('#' + se.getSelected()).setAttribute('mathcolor', 'green');
            canvas.get('node').one('#' + se.getSelected()).setAttribute('stroke', 'green');
            canvas.get('node').one('#' + se.getSelected()).setAttribute('fill', 'green');
            preview.one('#' + se.getSelected()).addClass(CSS.SELECTED);
        }
            
        se.forEach(function(m) {
            var node = ddnodes.one('#' + m[1].id);
            if (!node) {return;}
            node.setAttribute('title', preview.one('#' + m[1].id).getHTML().replace(/<div *[^>]*>|<\/div>|<br>/g, ''));
            node.handleClick = function(e) {
                var selectedNode = ddnodes.one('#' + se.getSelected());
                if (!selectedNode) {
                    e.stopPropagation();
                    se.select(this.getAttribute('id'));
                    render();
                    return;
                }
                if (selectedNode === node) {
                    if (preview.one('#' + node.getAttribute('id')).test('.' + CSS.PREVIEW + ' >')) {
                        se.select();
                        render();
                        return;
                    }
                    node.removeClass(CSS.SELECTED);
                    preview.one('#' + node.getAttribute('id')).removeClass(CSS.SELECTED);
                    canvas.get('node').one('#' + se.getSelected()).removeAttribute('mathcolor');
                    canvas.get('node').one('#' + se.getSelected()).removeAttribute('stroke');
                    canvas.get('node').one('#' + se.getSelected()).removeAttribute('fill');
                    se.select();
                    return;
                }
                if (selectedNode.one('#' + this.getAttribute('id'))) {
                    return;
                }
                e.stopPropagation();
                se.insertSnippet(node.getAttribute('id'), se.removeSnippet(selectedNode.getAttribute('id')));
                se.select();
                render();
            };
            node.on('click', function(e) {
                this.handleClick(e);
            });
            var selectedNode = ddnodes.one('#' + se.getSelected());
            if (!dragenabled) {
                return;
            }
            if ((!m[1] || !m[1]['class'] || m[1]['class'] !== 'blank') &&
                    !(selectedNode && preview.one('#' + se.getSelected()).one('#' + m[1].id))) {
                var drag = new Y.DD.Drag({node: node,
                    moveOnEnd: false
                });

                drag.on('drag:start', function() {
                    if (canvas.get('node').one('#' + se.getSelected())) {
                        preview.one('#' + se.getSelected()).removeClass(CSS.SELECTED);
                        canvas.get('node').one('#' + se.getSelected()).removeClass(CSS.SELECTED);
                        canvas.get('node').one('#' + se.getSelected()).removeAttribute('mathcolor');
                        canvas.get('node').one('#' + se.getSelected()).removeAttribute('stroke');
                        canvas.get('node').one('#' + se.getSelected()).removeAttribute('fill');
                        se.select();
                    }
                    this.get('node').addClass(CSS.DRAGGEDNODE);
                    this.get('node').setAttribute('mathcolor', 'red');
                    ddnodes.one('#' + m[1].id).setAttribute('mathcolor', 'red');
                    ddnodes.one('#' + m[1].id).setAttribute('stroke', 'red');
                    this.get('dragNode').addClass(CSS.DRAGNODE);
                    this.get('dragNode').all('> span')
                        .pop()
                        .setStyle('opacity', '1');
                });
                drag.on('drag:end', function() {
                    this.get('node').removeClass(CSS.DRAGGEDNODE);
                    this.get('node').removeAttribute('mathcolor');
                    this.get('node').removeAttribute('stroke');
                    this.get('dragNode').all('> span')
                        .pop()
                        .setStyle('opacity', '0');
                    this.get('dragNode').setStyles({top: 0, left: 0});
                });
            }

            var drop = new Y.DD.Drop({node: node});
            drop.on('drop:hit', function(e) {
                var dragTarget = e.drag.get('node').get('id');
                if (e.drag.get('data')) {
                    se.insertSnippet(m[1].id, se.createItem(e.drag.get('data')));
                }
                else if (dragTarget !== m[1].id && se.isItem(dragTarget) && !preview.one('#' + dragTarget).one('#' + m[1].id)) {
                    se.insertSnippet(e.drop.get('node').get('id'), se.removeSnippet(dragTarget));
                }
                render();
            });
            drop.on('drop:enter', function(e) {
                e.stopPropagation();
                ddnodes.all(id + ' ' + SELECTORS.HIGHLIGHT).each(function(n) {
                     n.removeClass(CSS.HIGHLIGHT);
                     var id = n.getAttribute('id');
                     if (canvas.get('node').one(id)) {
                         canvas.get('node').one(id).removeClass(CSS.HIGHLIGHT);
                         canvas.get('node').one(id).removeAttribute('mathcolor');
                         canvas.get('node').one(id).removeAttribute('stroke');
                         canvas.get('node').one(id).removeAttribute('fill');
                     }
                });
                ddnodes.one('#' + m[1].id).addClass(CSS.HIGHLIGHT);
                canvas.get('node').one('#' + m[1].id).addClass(CSS.HIGHLIGHT);
                canvas.get('node').one('#' + m[1].id).setAttribute('mathcolor', 'yellow');
                canvas.get('node').one('#' + m[1].id).setAttribute('stroke', 'yellow');
                canvas.get('node').one('#' + m[1].id).setAttribute('fill', 'yellow');
            });
            drop.on('drop:exit', function(e) {
                e.stopPropagation();
                this.get('node').removeClass(CSS.HIGHLIGHT);
                canvas.get('node').one('#' + m[1].id).removeClass(CSS.HIGHLIGHT);
                canvas.get('node').one('#' + m[1].id).removeAttribute('mathcolor');
                canvas.get('node').one('#' + m[1].id).removeAttribute('stroke');
                canvas.get('node').one('#' + m[1].id).removeAttribute('fill');
            });
            
        });
    }
    /* Return snippet as MathML string
     * @method toMathML
     * @param object element
     */
    function toMathML(element) {
        if (typeof element !== "object") { return element; }
        var str = '';
        element.forEach(function(m) {
            var attr;
            if (typeof m !== "object") { return; }
            str += '<' + m[0];
            if (m[1] && (typeof m[1] === "object")) {
                for (attr in m[1]) {
                    if (typeof m[1][attr] !== "object") {
                        str += " " + attr + '="' + m[1][attr] + '"';
                    }
                }
            }
            str += '>';
            if (m[2]) {
                str += toMathML(m[2]);
            }
            str += '</' + m[0] + '>';
        });
        return str;
    }
    function render() {
        se.rekey();
        var jax = MathJax.Hub.getAllJax(canvas.get('node').getDOMNode())[0];
        if (jax) {
            MathJax.Hub.Queue(function() {
                MathJax.Hub.Queue(["Text", jax, '<math>' + toMathML(math) + '</math>']);
                MathJax.Hub.Queue(makeDraggable);
            });
        } else {
            canvas.get('node').setHTML('');
            MathJax.Hub.Queue(['addElement', MathJax.HTML, canvas.get('node').getDOMNode(), 'math', {display: "block"}, math]);
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, canvas.get('node').getDOMNode()]);
            MathJax.Hub.Queue(makeDraggable);
        }
    }
    this.render = render;
    this.toMathML = toMathML;
    /* Method for add adding an object to the workspace
     * @method addMath
     * @param string json
     */
    this.addMath = function(json) {
        if (!json) {
            return;
        }
        if (Y.one(id + ' ' + SELECTORS.SELECTED)) {
            se.insertSnippet(Y.one(id + ' ' + SELECTORS.SELECTED).getAttribute('id'), se.createItem(json));
        } else {
            se.append(se.createItem(json));
        }
        render();
    };
    /* Unselect the selected node if any
     * @method clear
     */
    this.clear = function() {
        if (Y.one(id + ' ' + SELECTORS.SELECTED)) {
            se.removeSnippet(Y.one(id + ' ' + SELECTORS.SELECTED).getAttribute('id'));
        } else {
            math = [];
            se.next = new NS.mSlots();
            se.next.previous = se;
            se = se.next;
            se.slots.push(math);
        }
        render();
    };
    /* Return output in various formats
     * @method output
     * @param string format
     */
    this.output = function(format) {
        function cleanSnippet(s) {
            if (typeof s !== "object") { return s; }
            var t = s.slice(0);
            t.forEach(function(m, index) {
                if (typeof m !== "object") { return; }
                if (m[1] && m[1]['class']) {
                    t[index] = '[]';
                    return;
                }
                if (m[1] && m[1].id) {
                    delete m[1].id;
                }
                if (m[2]) {
                    m[2] = cleanSnippet(m[2]);
                }
            });
            return t;
        }
        if (format === 'MathML') {
            return canvas.get('node').one('script').getHTML();
        }
        if (format === 'HTML') {
            return canvas.get('node').one('span').getHTML();
        }
        if (format === 'JSON') {
            return Y.JSON.stringify(cleanSnippet(math));
        }
        return se.output(format);
    };
    this.getHTML = function() {
        return canvas.get('node').one('span').getHTML();
    };
    this.redo = function() {
        se = se.redo();
        math = se.slots[0];
        render();
    };
    this.undo = function() {
        se = se.undo();
        math = se.slots[0];
        render();
    };
    this.makeDrops = function() {
        makeDrops();
    };
    render();
};
