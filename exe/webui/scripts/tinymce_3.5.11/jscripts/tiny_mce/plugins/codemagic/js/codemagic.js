tinyMCEPopup.requireLangPack();
tinyMCEPopup.onInit.add(_init);
var cmEditor;
var cmActive;
var localStorageKey = tinyMCEPopup.editor.getParam('codemagic_storage_key') 
    || 'tinymce:codemagic';

function _init() 
{
    tinyMCEPopup.resizeToInnerSize();

    if (tinymce.isGecko) {
        document.body.spellcheck = tinyMCEPopup.editor.getParam('gecko_spellcheck');
    }

    document.getElementById('htmlSource').value = tinyMCEPopup.editor.getContent({
        source_view : true
    });

    var settings = get_settings();
    setup_editor();
    cmActive = true;
    document.getElementById('toggleWrap').checked = settings.wrap;
    toggle('wrap', document.getElementById('toggleWrap'));
    document.getElementById('toggleAutoclose').checked = settings.autoclose;
    toggle('autoclosetags', document.getElementById('toggleAutoclose'));
    document.getElementById('toggleHighlight').checked = settings.highlight;
    toggle('highlight', document.getElementById('toggleHighlight'));
    resize();
}

function save()
{
    tinyMCEPopup.editor.setContent(cmEditor.getValue(), {
        source_view : true
    }); 
    tinyMCEPopup.close();
}

function resize()
{
    var vp = tinyMCEPopup.dom.getViewPort(window);
    var size = vp.h - 100
        - document.getElementById('headerContainer').offsetHeight;
        - document.getElementById('mceActionPanel').offsetHeight;
    cmEditor.setSize('100%', size + 'px');
    document.getElementById('htmlSource').style.height = size + 'px';
}

function toggle(which, el)
{
    switch (which) {
        case 'theme':
            var theme = el.options[el.selectedIndex].innerHTML;
            cmEditor.setOption('theme', theme);
            break;
        case 'wrap':
            cmEditor.setOption('lineWrapping', el.checked);
            break;
        case 'autoclosetags':
            cmEditor.setOption('autoCloseTags', el.checked);
            break;
        case 'highlight':
            if (el.checked) {
                if (!cmActive) {
                    setup_editor();
                }
                resize();
                document.getElementById('toggleWrap').disabled      = false;
                document.getElementById('toggleAutoclose').disabled = false;
                document.getElementById('themeselect').disabled     = false;
                document.getElementById('searchKeys').style.display = 'block';
                cmActive = true;
            } else {
                cmEditor.toTextArea();
                document.getElementById('toggleWrap').disabled      = true;
                document.getElementById('toggleAutoclose').disabled = true;
                document.getElementById('themeselect').disabled     = true;
                document.getElementById('searchKeys').style.display = 'none';
                cmActive = false;
            }
            break;
    }
    save_settings();
    return false;
}

function setup_editor()
{
    cmEditor = CodeMirror.fromTextArea(document.getElementById('htmlSource'), {
        mode          : 'text/html',
        width         : '100%',
        height        : '350px',
        autofocus     : true,
        lineNumbers   : true,
        matchBrackets : true,
        matchTags     : { bothTags: true },
        tabMode       : 'indent',
        lineWrapping  : true,
        autoCloseTags : true,
        theme         : 'default',
        foldGutter    : true,
        gutters       : ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        extraKeys     : {
            'Ctrl-Q': function(cm) { cm.foldCode(cm.getCursor()); },
            'Ctrl-J': 'toMatchingTag'
        }
    });
    var settings = get_settings();
    if (settings.theme) {
        var sel = document.getElementById('themeselect');
        for (var i, j = 0; i = sel.options[j]; j++) {
            if (i.value == settings.theme) {
                sel.selectedIndex = j;
                break;
            }
        }
        cmEditor.setOption('theme', settings.theme);
    }
}

function get_settings()
{
    if (supports_html5_storage()) {
        var settings = localStorage.getItem(localStorageKey);
        if (settings) {
            return JSON.parse(settings);
        }
    }
    return {
        highlight: document.getElementById('toggleHighlight').checked,
        wrap: document.getElementById('toggleWrap').checked,
        autoclose: document.getElementById('toggleAutoclose').checked,
        theme: document.getElementById('themeselect').options[document.getElementById('themeselect').selectedIndex].innerHTML
    };
}

function save_settings()
{
    if (supports_html5_storage()) {
        var settings = JSON.stringify({
            highlight: document.getElementById('toggleHighlight').checked,
            wrap: document.getElementById('toggleWrap').checked,
            autoclose: document.getElementById('toggleAutoclose').checked,
            theme: document.getElementById('themeselect').options[document.getElementById('themeselect').selectedIndex].innerHTML
        });
        localStorage.setItem(localStorageKey, settings);
    }
}

function supports_html5_storage()
{
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}
