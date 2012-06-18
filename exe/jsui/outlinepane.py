# -- coding: utf-8 --
# ===========================================================================
# eXe 
# Copyright 2012, Pedro Peña Pérez, Open Phoenix IT
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
from exe.webui.renderable import Renderable
from twisted.web.resource import Resource
log = logging.getLogger(__name__)


# ===========================================================================
class OutlinePane(Renderable, Resource):
    """
    OutlinePane is responsible for creating the XHTML for the package outline
    """
    name = 'outlinePane'

    def __init__(self, parent):
        """
        Initialize
        """
        Renderable.__init__(self, parent)
        if parent:
            self.parent.putChild(self.name, self)
        Resource.__init__(self)

    def process(self, request):
        """
        Get current package
        """
        log.debug("process")

        if "action" in request.args:
            nodeId = request.args["object"][0]
            package = self.package
            log.debug("got action=" + request.args["action"][0])

            if request.args["action"][0] == "changeNode":
                node = package.findNode(nodeId)
                if node is not None:
                    package.currentNode = node
                else:
                    log.error("changeNode cannot locate "+nodeId)

            elif request.args["action"][0] == "addChildNode":
                node = package.findNode(nodeId)
                if node is not None:
                    package.currentNode = node.createChild()
                else:
                    log.error("addChildNode cannot locate "+nodeId)

            elif (nodeId != package.root.id and 
                  request.args["action"][0] == "deleteNode"):
                node = package.findNode(nodeId)
                if node is not None and node is not self.package.root:
                    node.delete()
                    if node.isAncestorOf(package.currentNode):
                        package.currentNode = node.parent
                else:
                    log.error("deleteNode cannot locate "+nodeId)

    def handleAddChild(self, client, parentNodeId):
        """Called from client via xmlhttp. When the addChild button is called.
        Hooked up by authoringPage.py
        """
        node = self.package.findNode(parentNodeId)
        log.debug("handleAddChild parent=" + parentNodeId)
        if node is not None:
            self.package.currentNode = node.createChild()
            log.debug('eXe.app.getController("Outline").reload')
            client.call('eXe.app.getController("Outline").reload')

    def handleDelNode(self, client, nodeId):
        """Called from xmlhttp. 
        """
        log.debug("handleDelNode nodeId=" + nodeId)
        node = self.package.findNode(nodeId)
        if node is not None and node is not self.package.root:
            # Update our server version of the package
            if (node.isAncestorOf(self.package.currentNode) or 
                node is self.package.currentNode):
                self.package.currentNode = node.parent
            node.delete()
            client.call('eXe.app.getController("Outline").reload')
        else:
            log.error("deleteNode cannot locate " + nodeId)

    def handleRenNode(self, client, nodeId, newName):
        """Called from xmlhttp"""
        log.debug("handleRenNode nodeId=%s newName=%s" % (nodeId, newName))
        if newName in ('', 'null'): 
            return
        node = self.package.findNode(nodeId)

        node.title = unicode(newName, 'utf8')
        # and send a signal to the node that it needs to change its anchors,
        # and those of ALL of its children nodes, as well:
        node.RenamedNodePath()

        client.call('eXe.app.getController("Outline").reload')

    def handleSetTreeSelection(self, client):
        """
        Called when the client want's to update the tree with the correct
        selection
        """
        client.call('eXe.app.getController("Outline").select', self.package.currentNode.id)
        
            
    def _doJsRename(self, client, node):
        """
        Recursively renames all children to their default names on
        the client if the node's default name has not been overriden
        """
        log.debug("_doJsRename")
        if not node._title:
            params = [s.replace('"', '\\"') for s in 
                      [node.titleShort, node.titleLong, node.title]]
            params.append(node.id)
            command = 'XHRenNode("%s", "%s", "%s", "%s")' % tuple(params)
            log.debug(command)
            client.sendScript(command)
        for child in node.children: 
            self._doJsRename(client, child)


    def handleDrop(self, client, sourceNodeId, parentNodeId, nextSiblingNodeId):
        """Handles the end of a drag drop operation..."""
        source = self.package.findNode(sourceNodeId)
        parent = self.package.findNode(parentNodeId)
        nextSibling = self.package.findNode(nextSiblingNodeId)
        if source and parent:
            # If the node has a default title and is changing levels
            # Make the client rename the node after we've moved it
            doRename = (not source.title and 
                        parent is not source.parent)
            # Do the move
            if nextSibling:
                assert nextSibling.parent is parent, \
                       '"sibling" has different parent: [%s/%s] [%s/%s]' % \
                        (parent.id, parent.title, nextSibling.id, 
                         nextSibling.title)
                source.move(parent, nextSibling)
                log.info("Dragging %s under %s before %s" % 
                         (source.title, parent.title, nextSibling.title))
            else:
                source.move(parent)
                log.info("Dragging %s under %s at start" % 
                         (source.title, parent.title))
            # Rename on client if it will have changed
            if doRename:
                # Recursively rename all nodes on the client
                self._doJsRename(client, source)
        else:
            log.error("Can't drag and drop tree items")


    def _doJsMove(self, client, node):
        """Makes the javascipt move a node,
        the 'node' param should already have been moved 
        to the new position. This makes the client catch up
        to the server"""
        sibling = node.nextSibling() 
        if sibling:
            siblingId = sibling.id
        else:
            siblingId = 'null'

        if node.parent:
            client.call('XHMoveNode', node.id, node.parent.id, siblingId)


    def handlePromote(self, client, sourceNodeId):
        """Promotes a node"""
        node = self.package.findNode(sourceNodeId)
        if node.promote():
            self._doJsMove(client, node)
            self._doJsRename(client, node)
        else:
            client.call('enableButtons')

    def handleDemote(self, client, sourceNodeId):
        """Demotes a node"""
        node = self.package.findNode(sourceNodeId)
        if node.demote():
            self._doJsMove(client, node)
            self._doJsRename(client, node)
        else:
            client.call('enableButtons')


    def handleUp(self, client, sourceNodeId):
        """Moves a node up its list of siblings"""
        node = self.package.findNode(sourceNodeId)
        if node.up():
            self._doJsMove(client, node)
            self._doJsRename(client, node)
        else:
            client.call('enableButtons')


    def handleDown(self, client, sourceNodeId):
        """Moves a node down its list of siblings"""
        node = self.package.findNode(sourceNodeId)
        if node.down():
            self._doJsMove(client, node)
            self._doJsRename(client, node)
        else:
            client.call('enableButtons')


    def render_GET(self, request=None):
        """
        Returns an xml string for viewing this pane.
        """
        # Now do the rendering
        log.debug("Render")
        request.setHeader('content-type', 'application/xml')
        node_id = request.args['node'][0]
        xml = u'<?xml version="1.0" encoding="UTF-8"?>'
        xml += u'<!-- start outline pane -->'
        xml += u'<nodes>'
        if node_id == 'root':
            childs = [self.package.root]
        else:
            childs = self.package.findNode(node_id).children
        for node in childs:
            xml += u'<node>'
            xml += u'<text>%s</text>' % self.encode2nicexml(node.title)
            xml += u'<id>%s</id>' % self.encode2nicexml(node.id)
            xml += u'<expanded>true</expanded>'
            if node.children:
                xml += u'<leaf>false</leaf>'
            else:
                xml += u'<leaf>true</leaf>'
            xml += u'<icon>data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==</icon>'
            xml += u'</node>'
        xml += u'</nodes>'
        xml += u'<!-- end outline pane -->'
        return xml.encode('utf8')

    def encode2nicexml(self, string):
        """
        Turns & into &amp; etc
        """
        xmlEntities = [('&', '&amp;'),
                       ('"', '&quot;'),
                       ("'", '&apos;'),
                       ('<', '&lt;'),
                       ('>', '&gt;')]
        for src, dest in xmlEntities:
            string = string.replace(src, dest)
        return string

# ===========================================================================
