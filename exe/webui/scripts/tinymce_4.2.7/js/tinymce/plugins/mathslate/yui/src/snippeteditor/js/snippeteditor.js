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
 * @copyright  2013 Daniel Thies  <dthies@ccal.edu>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
M.tinymce_mathslate = M.tinymce_mathslate || {};
var NS = M && M.tinymce_mathslate || {};
/* Constructor function for Snippet editor
 * @function NS.mSlots
 */
NS.mSlots = function() {
    var selected;
    var stack = [];
    var stackPointer = 0;
    var slots = [];
    this.slots = slots;
/* save the state of the editor on the stack at location Stackpointer
 * @function saveState
 */
    function saveState () {
        stack.splice(stackPointer);
        var cs = slots.slice(0);
        var ci =[];
        cs.forEach(function(s) {
            ci.push(s.slice(0));
        });
        stack[stackPointer] = [cs, ci];
    }
/* restore a saved state of the editor from the stack
 * @function restoreState
 */
    function restoreState() {
        slots.splice(0);
        if (slots[0]) {
            slots.pop();
        }
        var cs = stack[stackPointer][0];
        var ci = stack[stackPointer][1];
        cs.forEach(function(s, i) {
            s.splice(0);
            if (s[0]) {
                s.pop();
            }
            ci[i].forEach(function(item) {
                s.push(item);
            });
            slots.push(s);
        });
    }
/* Restore previous state after undo
 * @method redo
 */
    this.redo = function() {
        if (!stack[stackPointer + 1]) {
            return this.next || this;
        }
        stackPointer++;
        restoreState();
        return this;
    };
/* Restore earlier stored state and decrement pointer
 * @method undo
 */
    this.undo = function() {
        if (stackPointer === 0) {
            return this.previous || this;
        }
        stackPointer--;
        if (stackPointer === 0) {
            slots[0].pop();
            return this;
            }
        restoreState();
        return this;
    };
/* Create an expression from json of a snippet passed
 * @method createItem
 * @param string json
 */
    this.createItem = function(json) {
        function findBlank(snippet) {
            if (Array.isArray(snippet[2])) {
                snippet[2].forEach(function(a) {
                    if (Array.isArray(a)) {
                        findBlank(a);
                    }
                    else if (a === '[]') {
                        var newID = 'MJX-' + Y.guid();
                        slots.push([['mo', {id: newID, "class": 'blank', tex: ['']}, '\u25FB']]);
                        snippet[2][snippet[2].indexOf(a)] = ['mrow', {}, slots[slots.length-1]];
                    }
                });
            }
        }
   
        var newID = 'MJX-' + Y.Node.create('<span></span').generateID();
        var newMath;

        newMath = Y.JSON.parse(json);
        newMath[1].id = newID;
            findBlank(newMath);
        return newMath;
    };
/* Locate a draggable expression by its currently assigned ID
 * @method getItemById
 * @param string id
 */
    this.getItemByID = function(id) {
        var str;
        this.slots.forEach(function(slot) {
            slot.forEach(function(m) {
                if (m[1].id === id) {str = Y.JSON.stringify(m);}
            });
        });
        return str;},
/* Determine whether ID corresponds to a valid draggable expression
 * @method isItem
 * @param string id
 * @return boolean
 */
    this.isItem = function(id) {
        var found = false;
        this.slots.forEach(function(slot) {
            if (found) {return;}
            slot.forEach(function(m) {
                if (m[1].id === id) {found = true;}
            });
        });
        return found;},
/* Delete an expression and return the snippet of the expression
 * @method removeSnippet
 * @param string id
 * @return array
 */
    this.removeSnippet = function(id) {
        var item = 0;
        this.slots.forEach(function(slot) {
            slot.forEach(function(m) {
                if (m[1].id === id) {
                    item = m;
                    slot.splice(slot.indexOf(m), 1);
                }
            });
        });
        return item;
    },
/* Insert the snippet of an expression before expression with given ID
 * @method removeSnippet
 * @param string id
 * @param array s
 */
    this.insertSnippet = function(id, s) {
        var item = 0;
        this.slots.forEach(function(slot) {
            slot.forEach(function(m) {
                if (item !== 0) {
                    return;
                }
                if (m[1].id === id) {
                    item = m;
                    slot.splice(slot.indexOf(item), 0, s);
                }
            });
        });
        stackPointer++;
        this.next = null;
        saveState();
        return ;
    },
/* Add new expression to workspace following all others
 * @method append
 * @param array element
 */
    this.append = function(element) {
        slots[0].push(element);
        stackPointer++;
        this.next = null;
        saveState();
        return ;
    },
/* Iterate through all draggable expressions executing callback
 * @method forEach
 * @param function f
 */
    this.forEach = function(f) {
        this.slots.forEach(function(slot) {
            slot.forEach(function(m) {
                f(m, slot);
                });
            });
        },
/* Assign new IDs to all elements to avoid inference of MathJax with YUI in display
 * @method rekey
 */
    this.rekey = function() {
        var buffer = this;
        this.slots.forEach(function(s) {
            if (s.length === 0) {
                s.push(['mo', {id: 'MJX-' + Y.guid(), "class": 'blank', tex: ['']}, '\u25FB']);
            }
            else {
                s.forEach(function(m) {
                    if (!m[1]) {
                        return;
                    }
                    if (m[1]['class'] && m[1]['class'] === 'blank' && s.length>1) {
                        buffer.removeSnippet(m[1].id);
                    }
                    if (m[1].id) {
                        m[1].id = 'MJX-' + Y.guid();
                    }
                });
            }
            
        });
    },
/* Return output in various formats
 * @method output
 * @param string format
 */
    this.output = function(format) {
            function generateMarkup (s) {
               var str = '';
               if (typeof s === 'string') {
                   return s;
               }
               if (s[1] && s[1][format]) {
                  var i = 0;
                  while (s[1][format][i]) {
                     str = str + s[1][format][i++];
                     if (s[2] && typeof s[1][format][i] === 'number') {
                            str = str + generateMarkup(s[2][s[1][format][i]]);
                     }
                     i++;
                  }
               }
               else if (s[2]) {
                   if (typeof s[2] === 'string') {
                      str = str + s[2];
                   }
                   else {
                       s[2].forEach(function(t) {
                           str = str + generateMarkup(t);
                       });
                   }
               }
               return str;
            }
            var str = '';
            slots[0].forEach(function(s) {
               str = str + generateMarkup(s);
               });
            return str;
    };
/* Return output in various formats with html tags included to display in browser
 * @method output
 * @param string format
 */
    this.preview = function(format) {
            function generateMarkup (s) {
               var str = '';
               if (typeof s === 'string') {
                   return s;
               }
               if (s[1] && s[1].id) {
                   str = str + '<div id="' + s[1].id + '">';
               }
               if (s[1] && format && s[1][format]) {
                   var i = 0;
                   while (s[1][format][i]) {
                       str = str + s[1][format][i++];
                       if (s[2] && typeof s[1][format][i] === 'number') {
                           str = str + generateMarkup(s[2][s[1][format][i]]);
                       }
                       i++;
                   }
               }
               else if (s[2]) {
                   if (typeof s[2] === 'string') {
                       if (format) {
                           str = str + s[2];
                       }
                   }
                   else {
                       s[2].forEach(function(t) {
                           str = str + generateMarkup(t);
                       });
                   }
               }
               if (s[1] && s[1]['class'] && s[1]['class'] === 'blank') {
                   str = str + '<br>';
               }
               if (s[1] && s[1].id) {
                   str = str + '</div>';
               }
               return str;
            }
            var str = '';
            slots[0].forEach(function(s) {
               str = str + generateMarkup(s);
               });
            return str;
    };
/* Mark expression with current ID as selected
 * @method select
 * @param string id
 */
    this.select = function(id) {
        selected = null;
        this.slots.forEach(function(slot) {
            slot.forEach(function(m) {
                if (m[1].id === id) {selected = m;}
            });
        });
    };
/* Get ID of the selected expression
 * @method getSelected
 * @param string id
 * @return string || false
 */
    this.getSelected = function() {
        return selected && selected[1].id;
    };
};
