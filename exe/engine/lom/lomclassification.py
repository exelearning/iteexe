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

    def __init__(self, xmlfile=False):
        '''
        Constructor
        '''
        self.file = None
        self.dom = None
        if xmlfile:
            self.file = xmlfile
            self.setDom()

    def setDom(self):
        if self.file:
            try:
                self.dom = parse(self.file)
            except:
                raise Exception('Can not create dom object')

    def setSource(self, source):
        if source == u"Accesibilidad LOM-ESv1.0":
            self.file = 'exe/engine/lom/test/sources/PODPL_02_accesibilidad_LOM-ES_es.xml'
        elif source == u"Nivel educativo LOM-ESv1.0":
            self.file = 'exe/engine/lom/test/sources/PODPL_01_nivel_educativo_LOM-ES_es.xml'
        elif source == u"Competencia LOM-ESv1.0":
            self.file = 'exe/engine/lom/test/sources/PODPL_01_competencia_LOM-ES_es.xml'
        elif source == u"Árbol curricular LOE 2006":
            self.file = 'exe/engine/lom/test/sources/PODPL_02_Arbol_curricular_LOE_2006_es.xml'
        elif source == u"ETB-LRE MEC-CCAA V1.0":
            pass
        else:
            raise Exception('Can not set source')
        self.setDom()

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

    def getElementsByIdentifier(self, identifier=False):
        data = {}
        rootNode = None
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
        return data

    def getDataByIdentifier(self, identifier=False):
        data = []
        for key, value in self.getElementsByIdentifier(identifier).iteritems():
            reg = {'text': value, 'identifier': key}
            data.append(reg)
        return data
