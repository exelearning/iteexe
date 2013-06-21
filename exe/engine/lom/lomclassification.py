#!/usr/bin/env python
# -*- coding: utf-8 -*-
'''
Created on 04/06/2013

@author: jesusjd
'''
from xml.dom.minidom import parse


class Classification(object):
    '''
    classdocs
    '''
    TREE = 1
    GRAPH = 2
    LEVEL0 = ['TE0', 'TE']

    def __init__(self, xmlfile=False):
        '''
        Constructor
        '''
        self.configPath = 'classification_sources'
        self.file = None
        self.dom = None
        self.sourceType = self.TREE
        if xmlfile:
            self.file = xmlfile
            self.setDom()

    def setDom(self):
        if self.file:
            try:
                self.dom = parse(self.file)
            except:
                raise Exception('Can not create dom object')

    def setSource(self, source, configDir):
        p1 = source[:-3]
        p2 = source[-2:]
        path = configDir / self.configPath / p1 / p2
        files = path.files()
        if files:
            xmlfile = str(files[0].abspath())
            self.file = xmlfile
            self.setDom()

    def getSources(self, source, configDir):
        sources = []
        dirs = ['accesibilidad_LOM-ES', 'nivel_educativo_LOM-ES', 'competencia_LOM-ES', 'etb-lre_mec-ccaa_V.1.0', 'arbol_curricular_LOE_2006']
        path = configDir / self.configPath
        paths = []
        if source == 'accessibility restrictions':
            path = path / dirs[0]
            paths.append(path)
        elif source == 'educational level':
            path = path / dirs[1]
            paths.append(path)
        elif source == "competency":
            path = path / dirs[2]
            paths.append(path)
        elif source == "discipline":
            path1 = path / dirs[3]
            path2 = path / dirs[4]
            paths.append(path1)
            paths.append(path2)
#        elif source == '':
#            for v in dirs:
#                paths.append(path / v)
        for p in paths:
            for sp in p.dirs():
                reg = {'text': str(p.basename()) + '_' + str(sp.basename()), 'id': str(p.basename()) + '_' + str(sp.basename())}
                sources.append(reg)
        return sources

    def getChildNodeByName(self, node, name):
        for n in node.childNodes:
            if n.nodeName == name:
                return n
        return None

    def getChildCaptionIdentifier(self, node):
        termidentifier = False
        caption = ''
        for cnode in node.childNodes:
            if cnode.nodeName == 'termIdentifier':
                termidentifier = cnode.firstChild.nodeValue
            elif cnode.nodeName == 'caption':
                ccnode = self.getChildNodeByName(cnode, 'langstring')
                if ccnode:
                    caption = ccnode.firstChild.nodeValue
            if termidentifier and caption:
                return termidentifier, caption
        return termidentifier, caption

    def getNodeIdentifier(self, node, identifier):
        rootNode = None
        for cnode in node.getElementsByTagName('termIdentifier'):
            if cnode.firstChild.nodeValue == identifier:
                return cnode.parentNode
        return rootNode

    def appendVal(self, data, val):
        if val not in data:
            return True
        return False

    def removeElements(self, data, removeData):
        for key in removeData:
            if key in data.keys():
                del data[key]
        return True

    def getLevelGraph(self, dom, identifier):
        """
        <relationship>
        <sourceTerm>M170</sourceTerm>
        <targetTerm>835</targetTerm>
        <relationshipType source="ETB-LRE MEC-CCAA">TE0</relationshipType>
        </relationship>
        """
        data = {}
        removeData = []
        if not identifier:
            for rsnode in dom.getElementsByTagName('relationship'):
                typeNodes = rsnode.getElementsByTagName('relationshipType')
                if typeNodes and typeNodes[0].firstChild.nodeValue in self.LEVEL0:
                    if typeNodes[0].firstChild.nodeValue == self.LEVEL0[1]:
                        targetNodes = rsnode.getElementsByTagName('targetTerm')
                        removeData.append(targetNodes[0].firstChild.nodeValue)
                    sourceNodes = rsnode.getElementsByTagName('sourceTerm')
                    if sourceNodes:
                        val = sourceNodes[0].firstChild.nodeValue
                        if self.appendVal(data, val):
                            data[val] = ''
            self.removeElements(data, removeData)
        else:
            for sourceTerm in dom.getElementsByTagName('sourceTerm'):
                if sourceTerm.firstChild.nodeValue == identifier:
                    targets = sourceTerm.parentNode.getElementsByTagName('targetTerm')
                    if targets:
                        val = targets[0].firstChild.nodeValue
                        if not val in data:
                            data[val] = ''
        if data:
            for termNode in dom.getElementsByTagName('term'):
                termidentifier, caption = self.getChildCaptionIdentifier(termNode)
                if termidentifier in data:
                    data[termidentifier] = caption
        return data

    def getElementsByIdentifier(self, identifier=False, stype=False):
        data = {}
        rootNode = None
        if stype:
            self.sourceType = stype
        if self.sourceType == self.TREE:
            if not identifier:  # Level 0 root elements
                rootNode = self.getChildNodeByName(self.dom, 'vdex')
            else:
                rootNode = self.getNodeIdentifier(self.dom, identifier)
            if rootNode:
                for node in rootNode.childNodes:
                    if node.nodeName == 'term':
                        termidentifier, caption = self.getChildCaptionIdentifier(node)
                        if termidentifier:
                            data[termidentifier] = caption
        else:
            data = self.getLevelGraph(self.dom, identifier)
        return data

    def getDataByIdentifier(self, identifier=False, stype=False):
        data = []
        for key, value in self.getElementsByIdentifier(identifier, stype).iteritems():
            reg = {'text': value, 'identifier': key}
            data.append(reg)
        return data
