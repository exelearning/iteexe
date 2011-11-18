# ===========================================================================
# __init__.py
# Copyright 2011, Mikel Larreategi, CodeSyntax
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



import logging
log = logging.getLogger(__name__)

NS = 'urn:oasis:names:tc:xliff:document:1.2'

class XliffImport(object):
    def __init__(self, package, filename):
        self.package = package
        self.filename = filename

    def parseAndImport(self, import_from_source=False):

        from exe.engine.beautifulsoup import BeautifulSoup
        fp = open(self.filename)
        bs = BeautifulSoup(fp.read())
        fp.close()
        
        for transunit in bs.findAll('trans-unit'):
            item_id = transunit.get('id', None)
            if item_id is None:
                log.info('Item id not found: %s' % item_id)
                continue

            field = self.getFieldFromPackage(self.package, item_id)
            if field is None:
                log.info('Field not found: %s' % item_id)
                continue

            if import_from_source:
                tar = transunit.find('source')
            else:
                tar = transunit.find('target')

            if item_id.endswith('title'):
                # It's a idevice, set the title
                field.set_title(u' '.join([unicode(u) for u in tar.contents]))
                log.debug('Title set for: %s' % item_id)
            else:
                # It's a field
                field.content_w_resourcePaths = u' '.join([unicode(u) for u in tar.contents])
                field.TwistedRePersist()
                log.debug('Content set for: %s' % item_id)

            ## Just in case we need XML parser...
            ##
            ## from lxml import etree
            ## doc = etree.parse(self.filename)
            ## root = doc.getroot()
            ## for transunit in root.xpath('//n:trans-unit', namespaces={'n': NS}):
            ##     item_id = transunit.get('id', None)
            ##     if item_id is None:
            ##         continue

            ##     field = self.getFieldFromPackage(self.package, item_id)
            ##     if field is None:
            ##         continue

            ##     content = transunit.xpath('n:target', namespaces={'n': NS})[0].text
            ##     field.content_w_resourcePaths = content
            ##     field.TwistedRePersist()




    def getNodeFrom(self, somewhere, raw_id):
        # raw_id == 'node5'
        id = raw_id.split('node')[1]
        if id == 'root':
            return somewhere
        else:
            for descendant in somewhere.children:
                if descendant.id == id:
                    return descendant

    def getIdeviceFromNode(self, somewhere, raw_id):
        # raw_id == 'idev34'
        id = raw_id.split('idev')[1]
        for idevice in somewhere.idevices:
            if idevice.id == id:
                return idevice

        return None

    def getField(self, somewhere, raw_id):
        # raw_id == 'field5_223'
        id = raw_id.split('field')[1]
        for field in somewhere.getRichTextFields():
            if field.id == id:
                return field

        return None

    def getFieldFromPackage(self, package, id):
        id_items = id.split('-')
        what = package.root
        for id_item in id_items:
            if what is None:
                return None
            else:
                if id_item.startswith('node'):
                    what = self.getNodeFrom(what, id_item)
                elif id_item.startswith('idev'):
                    what = self.getIdeviceFromNode(what, id_item)
                elif id_item.startswith('field'):
                    what = self.getField(what, id_item)
                elif id_item == 'title':
                    # This is the item's title (the last one),
                    # so return the previous item: the IDevice
                    return what
                    
        return what
