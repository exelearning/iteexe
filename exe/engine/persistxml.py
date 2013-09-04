# ===========================================================================
# eXe 
# Copyright 2011-2012, Pedro Pena Perez
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
# ===========================================================================

import types
from twisted.persisted.marmalade import DOMJellier, DOMUnjellier
from twisted.web.microdom import Document, Element, escape, genprefix, parseString
import logging

log = logging.getLogger(__name__)

class PriorizedDOMJellier(DOMJellier):
    def __init__(self):
        self.prepared = {}
        self.document = XMLDocument()
        self._ref_id = 0

    def priorize(self, key):
        if key[0] == "_title":
            return 0
        if key[0] == "idevices":
            return 1
        if key[0] == "children":
            return "zzzz"
        if key[0] == "questionTextArea":
            return 2
        if key[0] == "instructionsForLearners":
            return 3
        return key[0]

    def jellyToNode(self, obj):
        objType = type(obj)
        if objType is types.DictionaryType:
            if self.prepared.has_key(id(obj)):
                oldNode = self.prepared[id(obj)][1]
                if oldNode.hasAttribute("reference"):
                    # it's been referenced already
                    key = oldNode.getAttribute("reference")
                else:
                    # it hasn't been referenced yet
                    self._ref_id = self._ref_id + 1
                    key = str(self._ref_id)
                    oldNode.setAttribute("reference", key)
                node = self.document.createElement("reference")
                node.setAttribute("key", key)
                return node
            node = self.document.createElement("UNNAMED")
            self.prepareElement(node, obj)
            node.tagName = "dictionary"
            for k, v in sorted(obj.items(), key=self.priorize):
                n = self.jellyToNode(k)
                n.setAttribute("role", "key")
                n2 = self.jellyToNode(v)
                self.setExtendedAttributes(n, n2)
                node.appendChild(n)
                node.appendChild(n2)
            return node
        elif objType is types.UnicodeType:
            node = self.document.createElement("unicode")
            s = obj.encode('utf-8')
            node.setAttribute("value", s)
            return node
        else:
            return DOMJellier.jellyToNode(self, obj)
    def setExtendedAttributes(self, nk, nv):
        if nk.getAttribute('value') == "content_w_resourcePaths":
            nv.setAttribute("content", "true")

class UTF8DOMUnjellier(DOMUnjellier):
    def unjellyNode(self, node):
        if node.tagName == "unicode":
            return unicode(str(node.getAttribute("value")), "utf-8")
        else:
            return DOMUnjellier.unjellyNode(self, node)

class ContentXMLElement(Element):
    version = "0.3"
    def writexml(self, stream, indent='', addindent='', newl='', strip=0, nsprefixes={}, namespace='', first=False):
        # this should never be necessary unless people start
        # changing .tagName on the fly(?)
        if first:
            self.setAttribute('version', self.version)
            self.setAttribute('xmlns', "http://www.exelearning.org/content/v%s" % (self.version))
            self.setAttribute('xmlns:xsi', "http://www.w3.org/2001/XMLSchema-instance")
            self.setAttribute('xsi:schemaLocation', "http://www.exelearning.org/content/v%s content.xsd" % (self.version))
        if not self.preserveCase:
            self.endTagName = self.tagName
        w = stream.write
        if self.nsprefixes:
            newprefixes = self.nsprefixes.copy()
            for ns in nsprefixes.keys():
                del newprefixes[ns]
        else:
            newprefixes = {}

        begin = ['<']
        begin = [newl, indent] + begin
        bext = begin.extend
        writeattr = lambda _atr, _val: bext((' ', _atr, '="', escape(_val), '"'))
        if namespace != self.namespace and self.namespace:
            if nsprefixes.has_key(self.namespace):
                prefix = nsprefixes[self.namespace]
                bext(prefix+':'+self.tagName)
            else:
                bext(self.tagName)
                writeattr("xmlns", self.namespace)
        else:
            bext(self.tagName)
        j = ''.join
        for attr, val in self.attributes.iteritems():
            if isinstance(attr, tuple):
                ns, key = attr
                if nsprefixes.has_key(ns):
                    prefix = nsprefixes[ns]
                else:
                    prefix = genprefix()
                    newprefixes[ns] = prefix
                assert val is not None
                writeattr(prefix+':'+key,val)
            else:
                assert val is not None
                writeattr(attr, val)
        if newprefixes:
            for ns, prefix in newprefixes.iteritems():
                if prefix:
                    writeattr('xmlns:'+prefix, ns)
            newprefixes.update(nsprefixes)
            downprefixes = newprefixes
        else:
            downprefixes = nsprefixes
        w(j(begin))
        if self.childNodes:
            w(">")
            newindent = indent + addindent
            for child in self.childNodes:
                child.writexml(stream, newindent, addindent, newl, strip, downprefixes, self.namespace)
            w(j((newl, indent)))
            w(j(("</", self.endTagName, '>')))
        else:
            w(j(('></', self.endTagName, '>')))
    
class XMLDocument(Document):
    def writexml(self, stream, indent='', addindent='', newl='', strip=0, nsprefixes={}, namespace=''):
        stream.write('<?xml version="1.0" encoding="utf-8"?>' + newl)
        self.documentElement.writexml(stream, indent, addindent, newl, strip, nsprefixes, namespace, True)
    
    def createElement(self, name, **kw):
        return ContentXMLElement(name, **kw)
    
def encodeObjectToXML(toEncode):
    pdj = PriorizedDOMJellier()
    document = pdj.jelly(toEncode)
    return document.toprettyxml()

def decodeObjectFromXML(toDecode):
    document = parseString(toDecode, escapeAttributes=0)
    xmlversion = document.firstChild().getAttribute('version')
    if xmlversion == '0.1':
        log.warn("Invalid content.xml version: 0.1")
        return None, False
    if float(xmlversion) > float(ContentXMLElement.version):
        log.warn("Version of content.xml is greater than the maximum supported: %s > %s" 
                 % (xmlversion, ContentXMLElement.version))
        return None, False
    log.debug("decodeObjectFromXML starting decode")
    du = UTF8DOMUnjellier()
    return du.unjelly(document), True
