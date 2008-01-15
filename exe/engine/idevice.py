# ===========================================================================
# eXe 
# Copyright 2004-2006, University of Auckland
# Copyright 2004-2007 eXe Project, New Zealand Tertiary Education Commission
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
The base class for all iDevices
"""

import copy
import logging
from copy                 import deepcopy
from exe.engine.persist   import Persistable
from exe.engine.translate import lateTranslate
from exe.engine.resource  import Resource

log = logging.getLogger(__name__)

# ===========================================================================
class Idevice(Persistable):
    """
    The base class for all iDevices
    iDevices are mini templates which the user uses to create content in the 
    package
    """

    # Class attributes
    # see derieved classes for persistenceVersion 
    nextId = 1
    NoEmphasis, SomeEmphasis, StrongEmphasis = range(3)

    def __init__(self, title, author, purpose, tip, icon, parentNode=None):
        """Initialize a new iDevice, setting a unique id"""
        log.debug("Creating iDevice")
        self.edit        = True
        self.lastIdevice = True
        self.emphasis    = Idevice.NoEmphasis
        self.version     = 0
        self.id          = unicode(Idevice.nextId)
        Idevice.nextId  += 1
        self.parentNode  = parentNode
        self._title      = title
        self._author     = author
        self._purpose    = purpose
        self._tip        = tip
        self.icon        = icon
        # userResources are copied into and stored in the package
        self.userResources = []
        # systemResources are resources from whatever style dir we are using at render time
        if self.icon:
            self.systemResources = ["icon_"+self.icon+".gif"]
        else:
            self.systemResources = []

    # Properties
    def get_title(self):
        """
        Gives a nicely encoded and translated title that can be put inside
        xul labels (eg. <label value="my &quot;idevice&quot;">)
        """
        if not hasattr(self, '_title'):
            self._title = 'NO TITLE'
        if self._title:
            title = _(self._title)
            title = title.replace('&', '&amp;') 
            title = title.replace('"', '&quot;')
            return title
        else:
            return u''


    def set_title(self, value):
        """
        Sets self._title
        """
        self._title = value

    title    = property(get_title, set_title)
    rawTitle = lateTranslate('title')
    author   = lateTranslate('author')
    purpose  = lateTranslate('purpose')
    tip      = lateTranslate('tip')

    def get_klass(self):
        if hasattr(self, 'class_'):
            if self.class_ == '':
                return u'customIdevice'
            else:
                return self.class_ + u'Idevice'
        else:
            klass = str(self.__class__).split('.')[-1]
            return klass[:-2]
    klass = property(get_klass)

    def __cmp__(self, other):
        """
        Compare this iDevice with other
        """
        return cmp(self.id, other.id)

    def __deepcopy__(self, others):
        """
        Override deepcopy because normal one seems to skip things when called from resource.__deepcopy__
        """
        # Create a new me
        miniMe = self.__class__.__new__(self.__class__)
        others[id(self)] = miniMe
        # Copy our resources first
        miniMe.userResources = []
        for resource in self.userResources:
            miniMe.userResources.append(deepcopy(resource, others))
        # Copy the rest of our attributes
        for key, val in self.__dict__.items():
            if key != 'userResources':
                setattr(miniMe, key, deepcopy(val, others))
        miniMe.id = unicode(Idevice.nextId)
        Idevice.nextId += 1
        return miniMe

    # Public Methods

    def clone(self):
        """
        Clone an iDevice just like this one
        """
        log.debug("Cloning iDevice")
        newIdevice = copy.deepcopy(self)
        return newIdevice
        
    def delete(self):
        """
        delete an iDevice from it's parentNode
        """
        # Clear out old user resources
        # use reverse for loop to delete old user resources
        length=len(self.userResources) 
        for i in range(length-1, -1, -1):
            # possible bug fix, due to inconsistent order of loading:
            # ensure that this idevice IS attached to the resource:
            if self.userResources[i]._idevice is None:
                self.userResources[i]._idevice = self
            # and NOW we can finally properly delete it!
            self.userResources[i].delete()

        if self.parentNode:
            # first remove any internal anchors' links:
            self.ChangedParentNode(self.parentNode, None)

            self.parentNode.idevices.remove(self)
            self.parentNode = None


    def isFirst(self):
        """
        Return true if this is the first iDevice in this node
        """
        index = self.parentNode.idevices.index(self)
        return index == 0


    def isLast(self):
        """
        Return true if this is the last iDevice in this node
        """
        index = self.parentNode.idevices.index(self)
        return index == len(self.parentNode.idevices) - 1


    def movePrev(self):
        """
        Move to the previous position
        """
        parentNode = self.parentNode
        index = parentNode.idevices.index(self)
        if index > 0:
            temp = parentNode.idevices[index - 1]
            parentNode.idevices[index - 1] = self
            parentNode.idevices[index]     = temp


    def moveNext(self):
        """
        Move to the next position
        """
        parentNode = self.parentNode
        index = parentNode.idevices.index(self)
        if index < len(parentNode.idevices) - 1:
            temp = parentNode.idevices[index + 1]
            parentNode.idevices[index + 1] = self
            parentNode.idevices[index]     = temp


    def setParentNode(self, parentNode):
        """
        Change parentNode
        Now includes support for renaming any internal anchors and their links.
        """
        old_node = None
        if self.parentNode:
            old_node = self.parentNode
            self.parentNode.idevices.remove(self)
        parentNode.addIdevice(self)
        # and update any internal anchors and their links:
        self.ChangedParentNode(old_node, parentNode)


    def ChangedParentNode(self, old_node, new_node):
        """
        To update all fo the anchors (if any) that are defined within
        any of this iDevice's variouos fields, and any 
        internal links corresponding to those anchors.
        This is essentially a variation of Node:RenamedNode()
        """
        # only need to continue on if there are any anchor_fields within
        # this particular iDevice.  Rather than having each different idevice
        # type look through each of its fields, the easiest approach to this
        # is to simply check on the node's list of anchor_fields to see if
        # any of those use THIS idevice:

        if old_node is None or not hasattr(old_node, 'anchor_fields'):
            # no anchors here, then!
            return

        # Must use the old_node's last_full_node_path rather than 
        # the old_node's GetFullNodePath() primarily for a node delete, where
        # the node itself will have already been disconnected from the tree.
        old_node_path = old_node.last_full_node_path
        old_package = old_node.package
        if new_node: 
            new_node_path = new_node.GetFullNodePath()
            new_package = new_node.package
        else:
            # as called during a delete of this iDevice:
            new_node_path = ""
            new_package = None

        for this_field in old_node.anchor_fields:
            if this_field.idevice == self:
                # okay, this is an applicable field with some anchors:
                if hasattr(this_field, 'anchor_names') \
                and hasattr(this_field, 'anchors_linked_from_fields'): 
                    for this_anchor_name in this_field.anchor_names: 
                        old_full_link_name = old_node_path + "#" \
                                + this_anchor_name 
                        new_full_link_name = new_node_path + "#" + \
                                this_anchor_name 
                        for that_field in \
                        this_field.anchors_linked_from_fields[this_anchor_name]:
                            if new_node:
                                that_field.RenameInternalLinkToAnchor( 
                                    this_field, old_full_link_name, 
                                    new_full_link_name) 
                            else:
                                # appears that this is being deleted:
                                that_field.RemoveInternalLinkToAnchor( 
                                    this_field, old_full_link_name)

                # and change not only the link names to the anchors, (as above) 
                # but also the package and node internal data structures....  
                old_node.anchor_fields.remove(this_field)
                if len(old_node.anchor_fields) == 0:
                    # remove the old_node from the package's anchor_nodes:
                    if old_package and hasattr(old_package, 'anchor_nodes') \
                    and old_node in old_package.anchor_nodes:
                        old_package.anchor_nodes.remove(old_node)

                if new_node:
                    if not hasattr(new_node, 'anchor_fields'):
                        new_node.anchor_fields = []
                    if this_field not in new_node.anchor_fields: 
                        new_node.anchor_fields.append(this_field)
                    if new_package:
                        if not hasattr(new_package, 'anchor_nodes'):
                            new_package.anchor_nodes = []
                        if new_node not in new_package.anchor_nodes:
                            new_package.anchor_nodes.append(new_node)

        return

    def getResourcesField(self, this_resource):
        """
        Allow resources to easily find their specific corresponding field,
        to help out with loading and especially merging scenarios for resources
        with names already in use, for example.
        This method is expected to be overridden within each specific iDevice.
        """
        # in the parent iDevice class, merely return a None,
        # and let each specific iDevice class implement its own version:
        log.warn("getResourcesField called on iDevice; no specific "
                + "implementation available for this particular iDevice "
                + "class: " + repr(self) )
        return None
        
        
    # Protected Methods

    def _upgradeIdeviceToVersion1(self):
        """
        Upgrades the Idevice class members from version 0 to version 1.
        Should be called in derived classes.
        """
        log.debug("upgrading to version 1")
        self._title   = self.__dict__.get('title', self.title)
        self._author  = self.__dict__.get('author', self.title)
        self._purpose = self.__dict__.get('purpose', self.title)
        self._tip     = self.__dict__.get('tip', self.title)


    def _upgradeIdeviceToVersion2(self):
        """
        Upgrades the Idevice class members from version 1 to version 2.
        Should be called in derived classes.
        """
        log.debug("upgrading to version 2, for 0.12")
        self.userResources = []
        if self.icon:
            self.systemResources = ["icon_"+self.icon+".gif"]
        else:
            self.systemResources = []

# ===========================================================================
