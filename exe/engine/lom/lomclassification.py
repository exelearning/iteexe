'''
Created on 04/06/2013

@author: jesusjd
'''
from xml.dom.minidom import parse


class Classification(object):
    '''
    classdocs
    '''

    def __init__(self, xmlfile):
        '''
        Constructor
        '''
        self.file = xmlfile
        try:
            self.dom = parse(xmlfile)
        except:
            raise Exception('Can not create dom object')

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
