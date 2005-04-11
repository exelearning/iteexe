# ===========================================================================
# eXe 
# Copyright 2004-2005, University of Auckland
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

"""
OutlinePane is responsible for creating the XHTML for the package outline
"""

import logging
import gettext
from nevow.livepage import document
from exe.webui import common
log = logging.getLogger(__name__)
_   = gettext.gettext


# ===========================================================================
class OutlinePane(object):
    """
    OutlinePane is responsible for creating the XHTML for the package outline
    """
    def __init__(self, package):
        """'parent' is our authoring page"""
        self.package = package

    def process(self, request):
        """ 
        Get current package
        """
        log.debug("process")
        
        if "action" in request.args:
            nodeId = request.args["object"][0]

            if request.args["action"][0] == "changeNode":
                node = self.package.findNode(nodeId)
                if node is not None:
                    self.package.currentNode = node
                else:
                    log.error("changeNode cannot locate "+nodeId)
            # The Draft node has an id of '0' and cannot be added to or deleted
            elif nodeId != '0' and request.args["action"][0] == "addChildNode":
                node = self.package.findNode(nodeId)
                if node is not None:
                    self.package.currentNode = node.createChild()
                else:
                    log.error("addChildNode cannot locate "+nodeId)
            # Don't let them delete the Draft or Home nodes (also checked on client)
            elif nodeId not in ('0', '1') and request.args["action"][0] == "deleteNode":
                node = self.package.findNode(nodeId)
                if node is not None:
                    node.delete()
                    if node.isAncestorOf(self.package.currentNode):
                        self.package.currentNode = self.package.root
                else:
                    log.error("deleteNode cannot locate "+nodeId)
            
    def handleAddChild(self, client, nodeId):
        """Called from client via xmlhttp. When the addChild button is called.
        Hooked up by authoringPage.py
        """
        if nodeId == '0': return # Can't add a child to the draft node!
        node = self.package.findNode(nodeId)
        if node is not None:
            self.package.currentNode = newNode = node.createChild()
            client.call('XHAddChildTreeItem', newNode.getIdStr(), str(newNode.title))

    def handleDelNode(self, client, confirm, nodeId):
        """Called from xmlhttp. 
        'confirm' is a string. It is 'false' if the user or the gui has cancelled the deletion
        'nodeId' is the nodeId
        """
        if confirm == 'true' and nodeId not in ('0', '1'):
            node = self.package.findNode(nodeId)
            if node is not None:
                # Actually remove the elements in the dom
                client.call('XHDelNode', nodeId)
                if node.isAncestorOf(self.package.currentNode):
                    self.package.currentNode = node.parent
                node.delete()
            else:
                log.error("deleteNode cannot locate " + nodeId)

    def handleRenNode(self, client, nodeId, newName):
        """Called from xmlhttp"""
        if newName in ('', 'null'): return
        node = self.package.findNode(nodeId)
        node.title.setTitle(newName)
        client.call('XHRenNode', newName)

    def handleDrop(self, ctx, sourceNodeId, parentNodeId, nextSiblingNodeId):
        """Handles the end of a drag drop operation..."""
        print sourceNodeId, parentNodeId, nextSiblingNodeId
        return "alert('hello'); return true" # Will be evaluated as JS on client

    def render(self):
        """
        Returns an xul string for viewing this pane.
        The xul is stored in a tuple inside the methods of this class
        then new lines are added when we actually return it
        """
        log.debug("render")
        xul = ('<!-- start outline pane -->',
               '    <tree id="outlineTree" hidecolumnpicker="true" onselect="outlineClick()" ',
               '          context="outlineMenu" flex="1"',
               '          ondraggesture="treeDragGesture(event)"'
               '          ondragenter="treeDragEnter(event)"',
               '          ondragover="treeDragOver(event)"',
               '          ondragexit="treeDragExit(event)"',
               '          ondragdrop="treeDragDrop(event)">',
               '        <treecols>',
               '            <treecol id="sectionCol" primary="true" label="Section" flex="1"/>',
               '        </treecols>',
               '        <treechildren>',)
        xul += self.__renderNode(self.package.draft, 12)
        xul += self.__renderNode(self.package.root, 12)
        xul += ('       </treechildren>',
                '    </tree>',
                '<!-- end outline pane -->')
        return '\n'.join(xul)

    def __renderNode(self, node, indent, extraIndent=2):
        """Renders all children recursively.
        'indent' is the number of spaces to put in front of each line of xul
        'extraIndent' is the extra number of spaces to put for the next level when recursing
        (this is really used as a local static constant)"""
        if node.children:
            start = '<treeitem container="true" open="true">'
        else:
            start = '<treeitem>'
        # Render the inner bits
        xul = ('%s' % start,
               """    <treerow _exe_nodeid="%s"> """ % node.getIdStr(),
               '        <treecell label="%s"/>' % node.title,
               '    </treerow>')
        # Recursively render children if necessary
        if node.children:
            xul += ('    <treechildren>',)
            for child in node.children:
                xul += self.__renderNode(child, indent + extraIndent)
            xul += ('    </treechildren>',)
        xul += ('</treeitem>',)
        # Return nicely indented xul
        return tuple([(' ' * indent) + line for line in xul])
    
# ===========================================================================
