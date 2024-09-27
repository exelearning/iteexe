# Copyright (c) 2004 Divmod.
# See LICENSE for details.

#  failure.py

import types
import linecache
import re

from nevow.tags import *
from twisted.python import failure


stylesheet = """
p.error {
  color: black;
  font-family: Verdana, Arial, helvetica, sans-serif;
  font-weight: bold;
  font-size: large;
  margin: 0.25em;
}

div {
  font-family: Verdana, Arial, helvetica, sans-serif;
}

strong.variableClass {
  font-size: small;
}

div.stackTrace {
}

div.frame {
  padding: 0.25em;
  background: white;
  border-bottom: thin black dotted;
}

div.firstFrame {
  padding: 0.25em;
  background: white;
  border-top: thin black dotted;
  border-bottom: thin black dotted;
}

div.location {
    font-size: small;
}

div.snippet {
  background: #FFFFDD;
  padding: 0.25em;
}

div.snippetHighlightLine {
  color: red;
}

span.lineno {
    font-size: small;
}

pre.code {
  margin: 0px;
  padding: 0px;
  display: inline;
  font-size: small;
  font-family: "Courier New", courier, monotype;
}

span.function {
  font-weight: bold;
  font-family: "Courier New", courier, monotype;
}

table.variables {
  border-collapse: collapse;
  width: 100%;
}

td.varName {
  width: 1in;
  vertical-align: top;
  font-style: italic;
  font-size: small;
  padding-right: 0.25em;
}

td.varValue {
  padding-left: 0.25em;
  padding-right: 0.25em;
  font-size: small;
}

div.variables {
  margin-top: 0.5em;
}

div.dict {
  background: #cccc99;
  padding: 2px;
  float: left;
}

td.dictKey {
  background: #ffff99;
  font-weight: bold;
}

td.dictValue {
  background: #ffff99;
}

div.list {
  background: #7777cc;
  padding: 2px;
  float: left;
}

div.listItem {
  background: #9999ff;
}

div.instance {
  width: 100%;
  background: #efefef;
  padding: 2px;
  float: left;
}

span.instanceName {
  font-size: small;
  display: block;
}

span.instanceRepr {
  font-family: "Courier New", courier, monotype;
}

div.function {
  background: orange;
  font-weight: bold;
  float: left;
}
"""


def saferepr(x):
    try:
        rx = repr(x)
    except:
        rx = "repr failed! %s instance at 0x%x" % (x.__class__, id(x))
    return rx


def htmlDict(d):
    return div(_class="dict")[
        span(_class="heading")[
            "Dictionary instance @ 0x%x" % id(d)
        ],
        table(_class="dict")[[
            tr[
                td(_class="dictKey")[ k == '__builtins__' and 'builtin dictionary' or k ],
                td(_class="dictValue")[ htmlrepr(v) ]
            ]
            for k, v in list(d.items())
        ]]
    ]
                

def htmlList(l):
    io = StringIO()
    w = io.write
    w('<div class="list"><span class="heading">List instance @ %s</span>' % hex(id(l)))
    for i in l:
        w('<div class="listItem">%s</div>' % htmlrepr(i))
    w('</div>')
    return io.getvalue()


def htmlList(l):
    return div(_class="list")[
        span(_class="heading")[ "List instance @ 0x%x" % id(l) ],
        [div(_class="listItem")[ htmlrepr(i) ] for i in l]
    ]


def htmlInst(i):
    return div(_class="instance")[
        span(_class="instanceName")[ "%s instance at 0x%x" % (i.__class__, id(i)) ],
        span(_class="instanceRepr")[ saferepr(i) ]
    ]


def htmlString(s):
    return s


def htmlFunc(f):
    return div(_class="function")[
        "Function %s in file %s at line %s" % (f.__name__, f.__code__.co_filename, f.__code__.co_firstlineno)
    ]


def htmlMeth(m):
    return div(_class="method")[
        "Method %s in file %s at line %s" % (m.__func__.__name__, m.__func__.__code__.co_filename, m.__func__.__code__.co_firstlineno)
    ]

def htmlUnknown(u):
    return pre[
        saferepr(u)
    ]


htmlReprTypes = {
    dict: htmlDict,
    list: htmlList,
    types.InstanceType: htmlInst,
    bytes: htmlString,
    types.FunctionType: htmlFunc,
    types.MethodType: htmlMeth,
}


def htmlrepr(x):
    return htmlReprTypes.get(type(x), htmlUnknown)(x)


def varTable(usedVars):
    return table(_class="variables")[[
        tr(_class="varRow")[
            td(_class="varName")[ key ],
            td(_class="varValue")[ htmlrepr(value) ]
        ]
        for (key, value) in usedVars
    ]]


def formatFailure(myFailure):
    if not isinstance(myFailure, failure.Failure):
        return pre[ str(myFailure) ]

    stackTrace = div(_class="stackTrace")
    failureOverview = p(_class="error")[ str(myFailure.type), ": ", str(myFailure.value) ]

    result = [
        style(type="text/css")[
            stylesheet,
        ],
        a(href="#tracebackEnd")[ failureOverview ],
        stackTrace,
        a(name="tracebackEnd")[ failureOverview ]
    ]

    first = 1
    for method, filename, lineno, localVars, globalVars in myFailure.frames:
        # It's better to have a line number than nothing at all.
        #if filename == '<string>':
        #    continue
        if first:
            frame = div(_class="firstFrame")
            first = 0
        else:
            frame = div(_class="frame")
        stackTrace[ frame ]

        snippet = div(_class="snippet")
        frame[
            div(_class="location")[
                filename, ", line ", lineno, " in ", span(_class="function")[ method ]
            ],
            snippet,
        ]

        textSnippet = ''
        for snipLineNo in range(lineno-2, lineno+2):
            snipLine = linecache.getline(filename, snipLineNo)
            textSnippet += snipLine
            if snipLineNo == lineno:
                snippetClass = "snippetHighlightLine"
            else:
                snippetClass = "snippetLine"
            snippet[
                div(_class=snippetClass)[
                    span(_class="lineno")[ snipLineNo ],
                    pre(_class="code")[ snipLine ]
                ]
            ]

        # Instance variables
        for name, var in localVars:
            if name == 'self' and hasattr(var, '__dict__'):
                usedVars = [ (key, value) for (key, value) in list(var.__dict__.items())
                             if re.search(r'\W'+'self.'+key+r'\W', textSnippet) ]
                if usedVars:
                    frame[
                        div(_class="variables")[
                            strong(_class="variableClass")[ "Self" ],
                            varTable(usedVars)
                        ]
                    ]
                    break

        # Local and global vars
        for nm, varList in ('Locals', localVars), ('Globals', globalVars):
            usedVars = [ (name, var) for (name, var) in varList
                         if re.search(r'\W'+name+r'\W', textSnippet) ]
            if usedVars:
                frame[
                    div(_class="variables")[ strong(_class="variableClass")[ nm ] ],
                    varTable(usedVars)
                ]

    return result
