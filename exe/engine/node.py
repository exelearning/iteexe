# ===========================================================================
# eXe 
# Copyright 2004-2006, University of Auckland
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
Nodes provide the structure to the package hierarchy
"""

import logging
from copy               import deepcopy
from exe.engine.persist import Persistable
from exe.engine.path    import toUnicode
from exe                import globals as G

log = logging.getLogger(__name__)

# ===========================================================================
class Node(Persistable):
    """
    Nodes provide the structure to the package hierarchy
    """

    # Class attributes
    persistenceVersion = 2

    def __init__(self, package, parent=None, title=""):
        """
        Initialize a new node
        """
        log.debug(u"init " + title)

        if parent:
            parent.children.append(self)
        self._package = package
        self._id      = package._regNewNode(self)
        self.parent   = parent
        self._title   = title
        self.children = []
        self.idevices = []

    # Properties

    # id
    def getId(self):
        """
        Returns our id.
        Used property to make it read only
        """
        if hasattr(self, '_id'): 
            return self._id
        else:
            return None
    id = property(getId)


    # package
    def getPackage(self):
        """
        Returns our package.
        Makes it read only
        """
        if hasattr(self, '_package'): 
            return self._package
        else:
            return None
    package = property(getPackage)


    # level
    def getLevel(self):
        """
        Calculates and returns our current level
        """
        return len(list(self.ancestors()))
    level = property(getLevel)


    # title
    def getTitle(self):
        """
        Returns our title as a string
        """
        if hasattr(self, '_title') and self._title:
            return toUnicode(self._title)
        elif hasattr(self, '_package'):
            return _(toUnicode(self.package.levelName(self.level - 1)))
        else:
            return u'Unknown Node [no title or package]'



    def setTitle(self, title):
        """
        Allows one to set the title as a string
        """
        if toUnicode(title) != toUnicode(self._title):
            self._title = title
            self.package.isChanged = True

    title = property(getTitle, setTitle)
    titleShort = property(lambda self: self.title.split('--', 1)[0].strip())
    titleLong = property(lambda self: self.title.split('--', 1)[-1].strip())

    # Normal methods

    def copyToPackage(self, newPackage, newParentNode=None):
        """
        Clone a node just like this one, still belonging to this package.
        if 'newParentNode' is None, the newly created node will replace the 
            root of 'newPackage'

        The newly inserted node is automatically selected.
        """
        log.debug(u"clone " + self.title)

        # copy any nonpersistables of interest as well:
        G.application.persistNonPersistants = True

        try: 
            # Setting self.parent in the copy to None, so it doesn't 
            # go up copying the whole tree 
            newNode = deepcopy(self, {id(self._package): newPackage,
                                  id(self.parent): None}) 
            newNode._id = newPackage._regNewNode(newNode)
        except Exception, e:
            # and be sure to return nonpersistables to normal status: 
            G.application.persistNonPersistants = False
            # before continuing with the exception:
            raise

        # return nonpersistables to normal status:
        G.application.persistNonPersistants = False

        # Give all the new nodes id's
        for node in newNode.walkDescendants():
            node._id = newPackage._regNewNode(node)
        # Insert into the new package
        if newParentNode is None:
            newNode.parent = None
            newPackage.root = newPackage.currentNode = newNode
        else:
            newNode.parent = newParentNode
            newNode.parent.children.append(newNode)
            newPackage.currentNode = newNode
        return newNode

    def ancestors(self):
        """Iterates over our ancestors"""
        if self.parent: # All top level nodes have no ancestors
            node = self
            while node is not None and node is not self.package.root:
                if not hasattr(node, 'parent'):
                    log.warn("ancestor node has no parent")
                    node = None
                else: 
                    node = node.parent
                    yield node


    def isAncestorOf(self, node):
        """If we are an ancestor of 'node' returns 'true'"""
        return self in node.ancestors()


    def getResources(self):
        """
        Return the resource files used by this node
        """
        log.debug(u"getResources ")
        resources = {}
        for idevice in self.idevices:
            reses = [toUnicode(res.storageName, 'utf8') for res in idevice.userResources]
            for resource in (idevice.systemResources + reses):
                resources[resource] = True
        return resources.keys()


    def createChild(self):
        """
        Create a child node
        """
        log.debug(u"createChild ")
        self.package.isChanged = True
        return Node(self.package, self)


    def delete(self, pruningZombies=False):
        """
        Delete a node with all its children
        """
        delete_msg = ""
        if pruningZombies:
            delete_msg += "pruning zombie Node "
        else:
            delete_msg += "deleting Node "
        delete_msg += "[parent="
        if hasattr(self, 'parent') and self.parent:
            delete_msg += "\"" + self.parent._title + "\"] \""
        else:
            delete_msg += "None] \""
        delete_msg += self.getTitle() + "\" nodeId=" + str(self.getId()) \
            + ", @ \"" + str(id(self)) +"\""

        if pruningZombies: 
            log.warn(delete_msg)
        else:
            log.debug(delete_msg)

        # Remove ourself from the id dict and our parents child thing
        # (zombie nodes may not even be listed)
        if hasattr(self, '_package') and self.package is not None \
        and self.id in self.package._nodeIdDict \
        and self.package._nodeIdDict[self.id] == self: 
            # okay, this node IS in the package's node ID dictionary.
            # do NOT delete it if we are pruningZombies,
            # as that is to be done as SAFELY as possible,
            # and zombies are usually NOT in the node ID dictionary:

            if pruningZombies:
                # BEWARE, as zombies are not usually in the node ID dictionary,
                # unless a full zombie tree, or the root itself, from an
                # earlier version of Extract which left its parent tree zombied

                if self.package and self.package.root == self:
                    # okay, this is a valid root-node, with a parent left over:
                    if self.parent and self in self.parent.children: 
                        self.parent.children.remove(self)
                    self.parent = None
                    log.warn("While pruning zombie nodes, found ROOT node \"" 
                        + self._title + "\" still in package node dictionary. "
                        + "Stopping the prune on this part of the node tree.")
                    # and bail, leaving its children and idevices in place
                    self.package.isChanged = True
                    return
                elif self.parent:
                    if self in self.parent.children: 
                        self.parent.children.remove(self)
                    self.parent = None
                    log.warn("While pruning zombie nodes, found node \"" 
                        + self._title + "\" still in package node dictionary. "
                        + "Stopping the prune on this part of the node tree.")
                    # and bail, leaving its children and idevices in place
                    self.package.isChanged = True
                    return

                # else this is a stand-alone zombie tree
                del self.package._nodeIdDict[self.id]
                # and continue on with the pruning / standard deleting...

            else: 
                # standard delete, which IS expected to be in the node ID dict:
                del self.package._nodeIdDict[self.id]
                # and continue on with the pruning / standard deleting...

        if hasattr(self, 'parent') and self.parent:
            # (zombie nodes will NOT necessarily be in the parent's children):
            if hasattr(self.parent, 'children')\
            and self in self.parent.children: 
                self.parent.children.remove(self)
            self.parent = None

        # Remove all children from package id-dict and our own children list
        # use reverse for loop to delete, in case of any problems deleting:
        num_children = 0
        if hasattr(self, 'children'):
            num_children = len(self.children)
        for i in range(num_children-1, -1, -1):
            if self.children[i].parent is None:
                log.warn('reconnecting child node before deletion from node')
                self.children[i].parent = self
            elif self.children[i].parent != self:
                log.warn('about to delete child node from node, '\
                        'but it points to a different parentNode.')
                # continuing on with the delete anyhow, though...
            self.children[i].delete(pruningZombies)

        # Let all the iDevices know they're being deleted too
        # use reverse for loop to delete, in case of any problems deleting:
        num_idevices = 0
        if hasattr(self, 'idevices'): 
            num_idevices = len(self.idevices)
        for i in range(num_idevices-1, -1, -1):
            if self.idevices[i].parentNode is None:
                log.warn('reconnecting iDevice before deletion from node')
                self.idevices[i].parentNode = self
            elif self.idevices[i].parentNode != self:
                log.warn('about to delete iDevice from node, '\
                        'but it points to a different parentNode.')
                # continuing on with the delete anyhow, though...
            self.idevices[0].delete()

        if self.package: 
            self.package.isChanged = True
            self._package = None


    def addIdevice(self, idevice):
        """
        Add the idevice to this node, sets idevice's parentNode 
        """
        log.debug(u"addIdevice ")
        idevice.id = self.package.getNewIdeviceId()
        idevice.parentNode = self
        for oldIdevice in self.idevices:
            oldIdevice.edit = False
        self.idevices.append(idevice)


    def move(self, newParent, nextSibling=None):
        """
        Moves the node around in the tree.
        nextSibling can be a node object or an integer index
        """
        log.debug(u"move ")
        if newParent:
            assert newParent.package is self.package, \
                   "Can't change a node into a different package"
        if self.parent:
            self.parent.children.remove(self)
        self.parent = newParent
        if newParent:
            children = newParent.children
            if nextSibling: 
                if type(nextSibling) is int:
                    children.insert(nextSibling, self)
                else:
                    children.insert(children.index(nextSibling), self)
            else:
                newParent.children.append(self)

        self.package.isChanged = True


    def promote(self):
        """
        Convenience function.
        Moves the node one step closer to the tree root.
        Returns True is successful
        """
        log.debug(u"promote ")
        if self.parent and self.parent.parent:
            self.move(self.parent.parent, self.parent.nextSibling())
            return True

        return False


    def demote(self):
        """
        Convenience function.
        Moves the node one step further away from its parent,
        tries to keep the same position in the tree.
        Returns True is successful
        """
        log.debug(u"demote ")
        if self.parent:
            idx = self.parent.children.index(self)
            if idx > 0:
                newParent = self.parent.children[idx - 1]
                self.move(newParent)
                return True

        return False


    def up(self):
        """
        Moves the node up one node vertically, keeping to the same level in 
        the tree.
        Returns True is successful.
        """
        log.debug(u"up ")
        if self.parent:
            children = self.parent.children
            i = children.index(self)
            if i > 0:
                children.remove(self)
                children.insert(i-1, self)
                # Mark the package as changed
                self.package.isChanged = True
                return True

        return False


    def down(self):
        """
        Moves the node down one vertically, keeping its level the same.
        Returns True is successful.
        """
        log.debug(u"down ")
        if self.parent:
            children = self.parent.children
            i = children.index(self)
            children.remove(self)
            children.insert(i+1, self)
            # Mark the package as changed
            self.package.isChanged = True
            return True

        return False


    def nextSibling(self):
        """Returns our next sibling or None"""
        log.debug(u"nextSibling ")
        sibling = None

        if self.parent:
            children = self.parent.children
            i = children.index(self) + 1
            if i < len(children):
                sibling = children[i]

        return sibling


    def previousSibling(self):
        """Returns our previous sibling or None"""
        log.debug(u"previousSibling ")
        sibling = None

        if self.parent:
            children = self.parent.children
            i = children.index(self) - 1
            if i > 0:
                sibling = children[i]

        return sibling

    def walkDescendants(self):
        """
        Generator that walks all descendant nodes
        """
        for child in self.children:
            yield child
            for descendant in child.walkDescendants():
                yield descendant

    def __str__(self):
        """
        Return a node as a string
        """
        nodeStr = ""
        nodeStr += self.id + u" "
        nodeStr += self.title + u"\n"

        for child in self.children:
            nodeStr += child.__str__()

        return nodeStr


    def upgradeToVersion1(self):
        """Upgrades the node from version 0 to 1."""
        log.debug(u"upgradeToVersion1 ")
        self._title = self.__dict__[u'title']


    def upgradeToVersion2(self):
        """Upgrades the node from eXe version 0.5."""
        log.debug(u"upgradeToVersion2 ")
        self._title = self._title.title
        
    def launch_testForZombies(self):
        """
        a wrapper to testForZombieNodes(self), such that it might be called
        after the package has been loaded and upgraded.  Otherwise, due 
        to the seemingly random upgrading of the package and resource objects,
        this might be called too early.
        """
        # only bother launching the zombie node sub-tree check 
        # on potential root nodes, either valid or of zombie trees:
        if not hasattr(self, 'parent') or self.parent is None: 
            # supposedly the root of a sub-tree, but it could also be a zombie.
            # Allow all of the package to load up and upgrade before testing:
            G.application.afterUpgradeHandlers.append(self.testForZombieNodes)
        elif not hasattr(self.parent, 'children')\
        or not self in self.parent.children: 
            # this seems a child which is not properly connected to its parent:
            G.application.afterUpgradeHandlers.append(self.testForZombieNodes)

    def testForZombieNodes(self):
        """ 
        testing a possible post-load confirmation that this resource 
        is indeed attached to something.  
        to be called from twisted/persist/styles.py upon load of a Node.
        """
        # remembering that this is only launched for this nodes
        # with parent==None or not in the parent's children list.
        if not hasattr(self, '_package') or self._package is None\
        or not hasattr(self._package, 'root') or self._package.root != self: 
            log.warn("Found zombie Node \"" + self.getTitle() 
                + "\", nodeId=" + str(self.getId()) 
                + " @ " + str(id(self)) + ".")
            if not hasattr(self, '_title'):
                # then explicitly set its _title attribute to update below
                self._title = self.getTitle()
            # disconnect it from any package, parent, and idevice links,
            # and go through and delete any and all children nodes:
            zombie_preface = u"ZOMBIE("
            if self._title[0:len(zombie_preface)] != zombie_preface: 
                self._title = zombie_preface + self._title + ")"
            G.application.afterUpgradeZombies2Delete.append(self)


# ===========================================================================
