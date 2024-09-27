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
from exe.webui.livepage import allSessionPackageClients
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
                    self.parent.clientHandleFactory.clientHandles[request.args['clientHandleId'][0]].currentNodeId = node.id
                else:
                    log.error("changeNode cannot locate " + nodeId)

    def handleAddChild(self, client, parentNodeId):
        """Called from client via xmlhttp. When the addChild button is called.
        Hooked up by authoringPage.py
        """
        node = self.package.findNode(parentNodeId)
        log.debug("handleAddChild parent=" + parentNodeId)
        if node is not None:
            self.package.currentNode = node.createChild()
            client.currentNodeId = self.package.currentNode.id
            log.debug('Updating clients Outlines')
            client.sendScript('eXe.app.getController("Outline").reload()', filter_func=allSessionPackageClients)
            client.call('eXe.app.getController("Outline").loadNodeOnAuthoringPage', client.currentNodeId)

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
                client.currentNodeId = self.package.currentNode.id
            node.delete()
            client.sendScript('eXe.app.getController("Outline").reload()', filter_func=allSessionPackageClients)
            client.call('eXe.app.getController("Outline").loadNodeOnAuthoringPage', client.currentNodeId)
        else:
            log.error("deleteNode cannot locate " + nodeId)

    def handleRenNode(self, client, nodeId, newName):
        """Called from xmlhttp"""
        log.debug("handleRenNode nodeId=%s newName=%s" % (nodeId, newName))
        if newName in ('', 'null'):
            return
        node = self.package.findNode(nodeId)

        node.title = str(newName, 'utf8')
        # and send a signal to the node that it needs to change its anchors,
        # and those of ALL of its children nodes, as well:
        node.RenamedNodePath()

        client.sendScript('eXe.app.getController("Outline").reload()', filter_func=allSessionPackageClients)
        client.call('eXe.app.getController("Outline").loadNodeOnAuthoringPage', client.currentNodeId)

    def handleSetTreeSelection(self, client):
        """
        Called when the client want's to update the tree with the correct
        selection
        """
        if client.currentNodeId:
            client.sendScript('var outline = eXe.app.getController("Outline");\
                if (outline) outline.select(%s)' % client.currentNodeId)
        else:
            raise Exception('No current node in client')

    def handlePromote(self, client, sourceNodeId):
        """Promotes a node"""
        node = self.package.findNode(sourceNodeId)
        node.promote()
        client.sendScript('eXe.app.getController("Outline").reload()', filter_func=allSessionPackageClients)
        client.call('eXe.app.getController("Outline").loadNodeOnAuthoringPage', client.currentNodeId)

    def handleDemote(self, client, sourceNodeId):
        """Demotes a node"""
        node = self.package.findNode(sourceNodeId)
        node.demote()
        client.sendScript('eXe.app.getController("Outline").reload()', filter_func=allSessionPackageClients)
        client.call('eXe.app.getController("Outline").loadNodeOnAuthoringPage', client.currentNodeId)

    def handleUp(self, client, sourceNodeId):
        """Moves a node up its list of siblings"""
        node = self.package.findNode(sourceNodeId)
        node.up()
        client.sendScript('eXe.app.getController("Outline").reload()', filter_func=allSessionPackageClients)
        client.call('eXe.app.getController("Outline").loadNodeOnAuthoringPage', client.currentNodeId)

    def handleDown(self, client, sourceNodeId):
        """Moves a node down its list of siblings"""
        node = self.package.findNode(sourceNodeId)
        node.down()
        client.sendScript('eXe.app.getController("Outline").reload()', filter_func=allSessionPackageClients)
        client.call('eXe.app.getController("Outline").loadNodeOnAuthoringPage', client.currentNodeId)

    def render(self, request=None):
        """
        Returns an xml string for viewing this pane.
        """
        # Now do the rendering
        log.debug("Render")
        request.setHeader('content-type', 'application/xml')
        node_id = request.args['node'][0]
        xml = '<?xml version="1.0" encoding="UTF-8"?>'
        xml += '<!-- start outline pane -->'
        xml += '<nodes>'
        if node_id == 'root':
            childs = [self.package.root]
        else:
            childs = self.package.findNode(node_id).children
        for node in childs:
            xml += '<node>'
            xml += '<text>%s</text>' % self.encode2nicexml(node.title)
            xml += '<id>%s</id>' % self.encode2nicexml(node.id)
            xml += '<expanded>true</expanded>'
            if node.children:
                xml += '<leaf>false</leaf>'
            else:
                xml += '<leaf>true</leaf>'
            xml += '<icon>data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==</icon>'
            xml += '</node>'
        xml += '</nodes>'
        xml += '<!-- end outline pane -->'
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
