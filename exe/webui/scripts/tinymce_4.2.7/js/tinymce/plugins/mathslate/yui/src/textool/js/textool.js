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
 * @copyright  2013 Daniel Thies  <dthies@ccal.edu>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

M.tinymce_mathslate = M.tinymce_mathslate || {};
var NS = M && M.tinymce_mathslate || {};
/* Constructor function for an editor of a page.
 * @method Editor
 * @param string editorID
 * @param string config
 */
NS.TeXTool = function(editorID, addMath) {
    var input = Y.Node.create('<input type="text">');
    var tool = Y.Node.create('<span>\\[ \\]</span>');
    if (addMath) {
        tool.on('click', function() {
            addMath(tool.json);
        });
    }
    Y.one(editorID).appendChild(input);
    Y.one(editorID).appendChild(tool);
    input.focus();
    var drag = new Y.DD.Drag({node: tool});
    drag.on('drag:end', function() {
        this.get('node').setStyle('top' , '0');
        this.get('node').setStyle('left' , '0');
    });
    tool.toMathML = function(callback) {
        var mml;
        var jax = window.MathJax.Hub.getAllJax(this.generateID())[0];
        try {
            mml = jax.root.toMathML("");
        } catch(err) {
            if (!err.restart) {throw err;} // an actual error
            return window.MathJax.Callback.After(['toMathML', this, jax, callback], err.restart);
        }
        window.MathJax.Callback(callback)(mml);
    };
    input.on ('change', function() {
        var jax = window.MathJax.Hub.getAllJax(tool.generateID())[0];
        var tex = this.getDOMNode().value;
        if (!jax) {return;}
        var output = '';
        window.MathJax.Hub.Queue(['Text', jax, this.getDOMNode().value]);

        var parse = function (mml) {
            if (/<mtext mathcolor="red">/.test(mml) || /<merror/.test(mml)) {
                return;
            }
            mml = mml.replace(/$\s+/mg, ' ');

            //First look for beginning tag.
            var tag = mml.replace(/^\s*<([a-z]*).*/, '$1');

            //Find attributes of element.
            mml = mml.replace(/^\s*<[a-z]*/, '');
            output += '["' + tag + '", {';
            while (mml.trim().search('>') > 1) {
                 output  += mml.replace(/^ *([a-z]*) *= *"([^"]*)".*/, '"$1": "$2"');
                 mml = mml.replace(/^ *([a-z]*) *= *"([^"]*)"/, '');
                 if (mml.trim().search('>') > 1) {
                     output += ', ';
                 }
            }
            if (mml.trim().match('^/>')) {
                output += '}]';
                return mml.trim().replace('/>', '');
            }
            output += '}, ';
            mml = mml.replace(/^ *>/, '');

            //If element contains string quote string.
            if (mml.replace(new RegExp('^ *([^<]*).*'), '$1')) {
                output += '"' +mml.replace(/<.*/, '') + '"';
                mml = mml.replace(/^ *[^<]*/, '');
                if (mml.trim().search('<!--') === 0) {
                    mml = mml.replace(/<!--[^>]*-->/, '');
                }
            //Otherwise parse the children.
            } else {
                output += '[';
                while(mml.trim().search('</' + tag + '>') !== 0) {
                    mml = parse(mml);
                    if (mml.trim().search('</' + tag + '>') !== 0) {
                        output += ', ';
                    }
                }
                output += ']';
            }
            output += ']';
            return mml.replace('</' + tag + '>', '');
        };
        window.MathJax.Hub.Queue(['toMathML', tool, parse]);

        window.MathJax.Hub.Queue(function() {
            if (output === '') {
                return;
            }
            tool.json = Y.JSON.stringify(["mrow", {"tex": [tex]}, Y.JSON.parse(output)[2]]);
            drag.set('data', tool.json);
            addMath(tool.json);
        });
    });
};

