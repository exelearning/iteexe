from nevow import tags as t, static, livepage as le

def _locateFile(filename):
    import os.path
    dirname = os.path.abspath(os.path.dirname(__file__))
    return os.path.join(dirname, filename)

_tp_style_fn = _locateFile("tabbedPane-style.css")
_tp_layout_fn = _locateFile("tabbedPane-layout.css")
_tp_JS = _locateFile("tabbedPane.js")

tabbedPaneStyle = t.style(type_='text/css')[
    open(_tp_style_fn).read()
    ]
tabbedPaneLayout = t.style(type_='text/css')[
    open(_tp_layout_fn).read()
    ]
tabbedPaneJS = t.inlineJS(
    open(_tp_JS).read()
    )

tabbedPaneHeadInline = t.invisible[
    tabbedPaneStyle,
    tabbedPaneLayout,
    tabbedPaneJS,
]

tabbedPaneStyleFile = static.File(_tp_style_fn, 'text/css')
tabbedPaneLayoutFile = static.File(_tp_layout_fn, 'text/css')
tabbedPaneJSFile = static.File(_tp_JS, 'text/javascript')

tabbedPaneHeadFiles = t.invisible[
    t.link(rel='stylesheet', type='text/css', href='/tabbedPane-style.css'),
    t.link(rel='stylesheet', type='text/css', href='/tabbedPane-layout.css'),
    t.script(type='text/javascript', src='/tabbedPane.js'),
]

class TabbedPane(object):
    def tabbedPane(self, ctx, data):
        tab_names = [element[0] for element in data]
        
        return t.invisible[
        t.div(class_='tabbedPane')[
            t.ul(class_='tabs')[
                [t.li(id_="tab-"+name.replace(' ', '_'))[name] for name in tab_names]
            ],
            [t.div(id_="page-"+name.replace(' ', '_'))[fragment] for name, fragment in data]
        ],
        t.inlineJS('setupTabbedPane(['+','.join([le.flt(le.js['tab-'+name.replace(' ', '_'),'page-'+name.replace(' ', '_')], quote=False) for name, junk in data])+']);')
        ]
    
tabbedPane = TabbedPane().tabbedPane

__all__ = ["tabbedPane", "tabbedPaneStyle", "tabbedPaneLayout",
           "tabbedPaneJS", "tabbedPaneHeadInline",
           "tabbedPaneStyleFile", "tabbedPaneLayoutFile",
           "tabbedPaneJSFile", "tabbedPaneHeadFiles"]

