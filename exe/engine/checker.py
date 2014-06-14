# -- coding: utf-8 --
# ===========================================================================
# eXe
# Copyright 2013, Pedro Peña Pérez, Open Phoenix IT
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

from exe.engine.resource import Resource
import logging
from exe.engine.field import FieldWithResources
from exe.engine.node import Node
from exe.engine.galleryidevice import GalleryImages, GalleryImage
from exe.engine.idevice import Idevice

log = logging.getLogger(__name__)


class Inconsistency:
    def __init__(self, msg, itype, params):
        self.msg = msg
        self.itype = itype
        self.params = params
        log.error('New inconsistency of type %s: %s' % (itype, msg))

    def fix(self):
        fn = getattr(self, 'fix_' + self.itype, None)
        if fn:
            log.info('Fixing inconsistency of type %s: %s' % (self.itype, self.msg))
            fn(*self.params)
            return True
        return False

    def fix_packageResourceChecksum(self, package, checksum, resource):
        if checksum in package.resources:
            package.resources[checksum].remove(resource)
            if not package.resources[checksum]:
                package.resources.pop(checksum)

    def fix_packageResourceZombie(self, package, resource):
        for resources in package.resources.values():
            for r in resources:
                if r.path == resource.path:
                    package.resources[r.checksum].remove(r)
                    if not package.resources[r.checksum]:
                        package.resources.pop(r.checksum)

    def fix_nodeResourceNotInResources(self, package, idevice, checksum, resource):
        self.fix_nodeResourceNonExistant(idevice, resource)
        if resource.checksum in package.resources:
            package.resources[resource.checksum].remove(resource)
            if not package.resources[resource.checksum]:
                package.resources.pop(resource.checksum)
        if resource._idevice:
            if isinstance(resource._idevice.parentNode, Node):
                Resource(idevice, resource.path)
            else:
                log.info('Not adding zombie resource %s') % resource.storageName

    def fix_nodeResourceNonExistant(self, idevice, resource):
        def process(field):
            if isinstance(field, FieldWithResources):
                for image in field.images:
                    if resource.path == image.imageFilename:
                        field.images.remove(image)
            elif hasattr(field, 'getRichTextFields'):
                for field1 in field.getRichTextFields():
                    process(field1)
            else:
                for attr in dir(field):
                    if attr.endswith('Resource'):
                        setattr(field, attr, None)
        for field in idevice.getRichTextFields():
            process(field)
        idevice.userResources.remove(resource)


def clear_fieldResourcesFromIdevice(idevice):
    def process(field):
        if isinstance(field, FieldWithResources):
            field.images = GalleryImages(field)
        elif hasattr(field, 'getRichTextFields'):
            for field1 in field.getRichTextFields():
                process(field1)
        else:
            for attr in dir(field):
                if attr.endswith('Resource'):
                    setattr(field, attr, None)
    for field in idevice.getRichTextFields():
        process(field)


class Checker:
    def __init__(self, package, clear=True):
        self.package = package
        from exe.engine.package import Package
        self.tmppackage = Package('temp')
        self.inconsistencies = []
        self.nodes = [self.package.root] + list(self.package.root.walkDescendants())
        self.clear = clear
        self.idevices = {}
        log.info('Computing content resource references')
        for node in self.nodes:
            for idevice in node.idevices:
                if not idevice.parentNode:
                    log.error('No parent node for idevice %s in node %s! Fixing...' % (idevice.klass, node.title))
                    idevice.parentNode = node
                if idevice.parentNode != node:
                    log.error('Parent node of idevice %s in node %s not match! Fixing...' % (idevice.klass, node.title))
                    idevice.parentNode = node
                fields = idevice.getRichTextFields()
                if fields and idevice.klass != 'ImageMagnifierIdevice':
                    for field in fields:
                        if hasattr(field, 'parentNode'):
                            if not field.parentNode:
                                log.error('No parent node for field in idevice %s in node %s! Fixing...' % (idevice.klass, node.title))
                                field.parentNode = node
                            if field.parentNode != node:
                                log.error('Parent node of field in idevice %s in node %s not match! Fixing...' % (idevice.klass, node.title))
                                field.parentNode = node 
                        for resource in field.ListActiveResources(field.content_w_resourcePaths):
                            path = self.package.resourceDir / resource
                            if not path.exists():
                                msg = "%s referenced in idevice %s of node %s not exists" % (resource, idevice.klass, node.title)
                                self.appendInconsistency(msg, 'contentResourceNonExistant', self.package, path)
                            else:
                                if path in self.idevices:
                                    self.idevices[path].append(field)
                                else:
                                    self.idevices[path] = [field]
                else:
                    for resource in idevice.systemResources:
                        if resource=='magnifier.swf':                       
                            idevice.systemResources.remove(resource)
                    for resource in idevice.userResources:
                        path = self.package.resourceDir / resource.storageName
                        if not path.exists():
                            msg = "%s referenced in idevice %s of node %s not exists" % (resource, idevice.klass, node.title)
                            self.appendInconsistency(msg, 'contentResourceNonExistant', self.package, path)
                        else:
                            if path in self.idevices:
                                self.idevices[path].append(idevice)
                            else:
                                self.idevices[path] = [idevice]

    def clear_resourceReferences(self):
        self.package.resources = {}
        for node in self.nodes:
            for idevice in node.idevices:
                idevice.userResources = []
                clear_fieldResourcesFromIdevice(idevice)

    def check(self):
        if self.clear:
            log.info('Clearing resource references')
            self.clear_resourceReferences()
            log.info('Adding resource references')
            for path in self.package.resourceDir.files():
                if path in self.idevices:
                    for idevice in self.idevices[path]:
                        resource = Resource(idevice, path)
                        if isinstance(idevice, FieldWithResources):
                            galleryimage = GalleryImage(idevice, '', None, mkThumbnail=False)
                            galleryimage._imageResource = resource
                        if isinstance(idevice, Idevice) and idevice.klass == 'ImageMagnifierIdevice':
                            idevice.imageMagnifier.imageResource = resource
                        if isinstance(idevice, Idevice) and idevice.klass == 'GalleryIdevice':
                            for image in idevice.images:
                                if image._imageResource.storageName == resource.storageName:
                                    image._imageResource = resource
                                    break
                                elif image._thumbnailResource.storageName == resource.storageName:
                                    image._thumbnailResource = resource
                                    break
                elif self.package._backgroundImg and path == self.package._backgroundImg.path:
                    self.package._backgroundImg = Resource(self.package, path)
        for check in dir(self):
            if check.startswith('check_'):
                fn = getattr(self, check)
                log.info('Checking %s' % check[6:])
                fn()
        return self.inconsistencies

    def appendInconsistency(self, msg, itype, *args):
        self.inconsistencies.append(Inconsistency(msg, itype, args))

    def check_packageResourcesChecksums(self):
        itype = 'packageResourceChecksum'
        for checksum, resources in self.package.resources.items():
            if resources:
                for resource in resources:
                    try:
                        nresource = Resource(self.tmppackage, resource.path)
                    except:
                        msg = '%s not exists in elp' % resource.storageName
                        self.appendInconsistency(msg, itype, self.package, checksum, resource)
                        continue
                    if nresource.checksum == checksum:
                        if nresource.checksum == resource.checksum:
                            continue
                        else:
                            msg = '%s checksum not consistent' % resource.storageName
                            self.appendInconsistency(msg, itype, self.package, checksum, resource)
                    else:
                        msg = '%s checksum not consistent' % resource.storageName
                        self.appendInconsistency(msg, itype, self.package, checksum, resource)
            else:
                self.package.resources.pop(checksum)

    def check_packageResourcesNonReferenced(self):
        for path in self.package.resourceDir.files():
            resource = Resource(self.tmppackage, path)
            if resource.checksum not in self.package.resources:
                msg = '%s not in package resources' % resource.storageName
                self.appendInconsistency(msg, 'packageResourceNonReferenced', self.package, path)

    def check_nodeResourcesChecksums(self):
        for node in self.nodes:
            for idevice in node.idevices:
                for resource in idevice.userResources:
                    try:
                        nresource = Resource(self.tmppackage, resource.path)
                    except:
                        msg = '%s not exists in elp' % resource.storageName
                        self.appendInconsistency(msg, 'nodeResourceNonExistant', idevice, resource)
                        continue
                    if nresource.checksum in self.package.resources.keys():
                        if nresource.checksum == resource.checksum:
                            continue
                        else:
                            msg = '%s checksum not consistent' % resource.storageName
                            self.appendInconsistency(msg, 'nodeResourceNotInResources', self.package, idevice, nresource.checksum, resource)
                    else:
                        msg = '%s checksum not in package resources' % resource.storageName
                        self.appendInconsistency(msg, 'nodeResourceNotInResources', self.package, idevice, nresource.checksum, resource)

    def check_packageResourcesZombies(self):
        for resources in self.package.resources.values():
            for resource in resources:
                if resource._idevice:
                    if not isinstance(resource._idevice.parentNode, Node):
                        msg = '%s (checksum: %s) resource in idevice with no parent node' % (resource.storageName, resource.checksum)
                        self.appendInconsistency(msg, 'packageResourceZombie', self.package, resource)
