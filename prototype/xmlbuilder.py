#!/usr/bin/env python
"""a easy XML builder

    Example:
        b1 = XMLBuilder()
        b1.contacts = {"owner":"thehaas@binary.net"}

        print b1
        <?xml version="1.0" ?>
<contacts><owner>thehaas@binary.net</owner></contacts>


        b2 = XMLBuilder()
        b2.name = {"person": {"attr": {"type":"friend"},"last":"flintstone",
                           "first":"fred"}}
        print b2
        <?xml version="1.0" ?>
<name><person type="friend"><last>flintstone</last><first>fred</first></person></name>


        b1.contacts = {"owner":"thehaas@binary.net", "contact":b2}
        print b1
        <?xml version="1.0" ?>
<contacts><owner>thehaas@binary.net</owner><contact><name><person type="friend"><last>flintstone</last><first>fred</first></person></name></contact></contacts>

        # adding example
        b1.contacts = {"owner":"thehaas@binary.net"}

        print b1+b2
        <?xml version="1.0" ?>
<contacts><owner>thehaas@binary.net</owner><name><person type="friend"><last>flintstone</last><first>fred</first></person></name></contacts>


If you want to put in attributes, use "attr", "attrs", or "attribute" as the dictionary key.

See tablegen.py for a more real-world example
"""

__author__  = 'Mike Hostetler <thehaas@binary.net>'
__version__ = '1.1'
__license__ = "GPL"

import sys,os,types
from xml.dom import minidom

class XMLBuilder:

    attr_keys = ('attr','attrs','attribute')

    def __str__(self):

        rootname = self._findKey()
        roottag = "<%s/>" %rootname
        self._dom = minidom.parseString(roottag)

        if (type(self.__dict__[rootname])==types.DictType):
            self._processDict(self.__dict__[rootname])
        elif (type(self.__dict__[rootname])==types.ListType):
            self._processList(self.__dict__[rootname])
        else:
            self._processObj(self.__dict__[rootname])

        self._dom.normalize()

        return self._dom.toxml()

    def __add__(self,builder):

        sum = XMLBuilder()
        name1 = self._findKey()
        name2 = builder._findKey()

        sum.__dict__[name1] = []

        sum.__dict__[name1].append(self.__dict__[name1])
        sum.__dict__[name1].append(builder)

        return sum

    def __iadd__(self,builder):
        return self + builder


    def _findKey(self):

        for x in self.__dict__:
            if not x.startswith("_"):
                return x

        return ""

    def _processList(self,datalist):

        for item in datalist:
            if (type(item) == types.DictType):
                self._processDict(item)
            else:
                self._processObj(item)

    def _processObj(self,obj,tag=None):

        if type(obj) == types.StringType:
            tag.appendChild(self._dom.createTextNode(obj))

        elif type(obj) == types.DictType:
            self._processDict(obj,tag)

        elif type(obj) == types.ListType:
            map(self._processObj,obj,
                        [tag]*len(obj))
        else:

            try:

                xml = minidom.parseString(str(obj))
                node = self._dom.importNode(xml.documentElement,deep=1)
            except:
                node = self._dom.createTextNode(str(obj))

            if not tag:
                self._dom.documentElement.appendChild(node)
            else:
                tag.appendChild(node)

    def _processDict(self,datadict,root=None):

        if not root:
            root = self._dom.documentElement

        for item in datadict:

            if item in self.attr_keys:
                self._processAttr(datadict[item],root)
                tag = None

            else:

                tag = self._dom.createElement(item)
                self._processObj(datadict[item],tag)


            if tag:
                root.appendChild(tag)


    def _processAttr(self,attr,tag):

        for item in attr:
            tag.setAttribute(item,attr[item])

if __name__ == '__main__':

    ### examples on how this can work

    b1 = XMLBuilder()
    b1.contacts = {"owner":"thehaas@binary.net"}

    print "## first sample:"
    print b1
    print

    b2 = XMLBuilder()
    b2.name = {"person": {"attr": {"type":"friend"},"last":"flintstone",
                           "first":"fred"}}
    print "## second sample:"
    print b2
    print

    b1.contacts = {"owner":"thehaas@binary.net", "contact":b2}
    print "## nested example"
    print b1
    print

    b1.contacts = {"owner":"thehaas@binary.net"}
    print "## adding example (note the root element!)"
    print b1+b2
    print
