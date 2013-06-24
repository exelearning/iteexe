# ===========================================================================
# eXe 
# Copyright 2004-2006, University of Auckland
# Copyright 2006-2008 eXe Project, http://eXeLearning.org/
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
Package represents the collection of resources the user is editing
i.e. the "package".
"""

import logging
import time
import zipfile 
import uuid
import re
from xml.dom                   import minidom
from exe.engine.path           import Path, TempDirPath, toUnicode
from exe.engine.node           import Node
from exe.engine.genericidevice import GenericIdevice
from exe.engine.persist        import Persistable, encodeObject, \
                                      decodeObject, decodeObjectRaw
from exe                       import globals as G
from exe.engine.resource       import Resource
from twisted.persisted.styles  import Versioned, doUpgrade
from twisted.spread.jelly      import Jellyable, Unjellyable
from exe.engine.beautifulsoup  import BeautifulSoup
from exe.engine.field          import Field
from exe.engine.persistxml     import encodeObjectToXML, decodeObjectFromXML
from exe.engine.lom import lomsubs

log = logging.getLogger(__name__)


def clonePrototypeIdevice(title):
    idevice = None

    for prototype in G.application.ideviceStore.getIdevices(): 
        if prototype.get_title() == title:
            log.debug('have prototype of:' + prototype.get_title()) 
            idevice = prototype.clone() 
            idevice.edit = False
            break 

    return idevice

def burstIdevice(idev_type, i, node): 
    # given the iDevice type and the BeautifulSoup fragment i, burst it:
    idevice = clonePrototypeIdevice(idev_type)
    if idevice is None:
        log.warn("unable to clone " + idev_type + " idevice")
        freetext_idevice = clonePrototypeIdevice('Free Text')
        if freetext_idevice is None:
            log.error("unable to clone Free Text for " + idev_type 
                    + " idevice")
            return
        idevice = freetext_idevice

    # For idevices such as GalleryImage, where resources are being attached,
    # the idevice should already be attached to a node before bursting it open:
    node.addIdevice(idevice)

    idevice.burstHTML(i)
    return idevice

def loadNodesIdevices(node, s):
    soup = BeautifulSoup(s)
    body = soup.find('body')

    if body:
        idevices = body.findAll(name='div', 
                attrs={'class' : re.compile('Idevice$') })
        if len(idevices) > 0:
            for i in idevices: 
                # WARNING: none of the idevices yet re-attach their media,
                # but they do attempt to re-attach images and other links.

                if i.attrMap['class']=="activityIdevice":
                    idevice = burstIdevice('Activity', i, node)
                elif i.attrMap['class']=="objectivesIdevice":
                    idevice = burstIdevice('Objectives', i, node)
                elif i.attrMap['class']=="preknowledgeIdevice":
                    idevice = burstIdevice('Preknowledge', i, node)
                elif i.attrMap['class']=="readingIdevice":
                    idevice = burstIdevice('Reading Activity', i, node)
                # the above are all Generic iDevices;
                # below are all others:
                elif i.attrMap['class']=="RssIdevice":
                    idevice = burstIdevice('RSS', i, node)
                elif i.attrMap['class']=="WikipediaIdevice":
                    # WARNING: Wiki problems loading images with accents, etc:
                    idevice = burstIdevice('Wiki Article', i, node)
                elif i.attrMap['class']=="ReflectionIdevice":
                    idevice = burstIdevice('Reflection', i, node)
                elif i.attrMap['class']=="GalleryIdevice":
                    # WARNING: Gallery problems with the popup html:
                    idevice = burstIdevice('Image Gallery', i, node)
                elif i.attrMap['class']=="ImageMagnifierIdevice":
                    # WARNING: Magnifier missing major bursting components:
                    idevice = burstIdevice('Image Magnifier', i, node)
                elif i.attrMap['class']=="AppletIdevice":
                    # WARNING: Applet missing file bursting components:
                    idevice = burstIdevice('Java Applet', i, node)
                elif i.attrMap['class']=="ExternalUrlIdevice":
                    idevice = burstIdevice('External Web Site', i, node)
                elif i.attrMap['class']=="ClozeIdevice":
                    idevice = burstIdevice('Cloze Activity', i, node)
                elif i.attrMap['class']=="FreeTextIdevice":
                    idevice = burstIdevice('Free Text', i, node)
                elif i.attrMap['class']=="CasestudyIdevice":
                    idevice = burstIdevice('Case Study', i, node)
                elif i.attrMap['class']=="MultichoiceIdevice":
                    idevice = burstIdevice('Multi-choice', i, node)
                elif i.attrMap['class']=="MultiSelectIdevice":
                    idevice = burstIdevice('Multi-select', i, node)
                elif i.attrMap['class']=="QuizTestIdevice":
                    idevice = burstIdevice('SCORM Quiz', i, node)
                elif i.attrMap['class']=="TrueFalseIdevice":
                    idevice = burstIdevice('True-False Question', i, node)
                else:
                    # NOTE: no custom idevices burst yet,
                    # nor any deprecated idevices. Just burst into a FreeText:
                    log.warn("unburstable idevice " + i.attrMap['class'] + 
                            "; bursting into Free Text")
                    idevice = burstIdevice('Free Text', i, node)

        else:
            # no idevices listed on this page,
            # just create a free-text for the entire page:
            log.warn("no idevices found on this node, bursting into Free Text.")
            idevice = burstIdevice('Free Text', i, node)

    else:
        log.warn("unable to read the body of this node.")


def test_for_node(html_content):
    # to see if this html really is an exe-generated node
    exe_string = u"<!-- Created using eXe: http://exelearning.org -->"
    if html_content.decode('utf-8').find(exe_string) >= 0:
        return True
    else:
        return False

def loadNode(pass_num, resourceDir, zippedFile, node, doc, item, level):
    # populate this node
    # 1st pass = merely unzipping all resources such that they are available,
    # 2nd pass = loading the actual node idevices.
    titles = item.getElementsByTagName('title')
    node.setTitle(titles[0].firstChild.data)
    node_resource = item.attributes['identifierref'].value
    log.debug('*' * level + ' ' + titles[0].firstChild.data + '->' + item.attributes['identifierref'].value)

    for resource in doc.getElementsByTagName('resource'):
        if resource.attributes['identifier'].value == node_resource:
            for file in resource.childNodes:
                if file.nodeName == 'file':
                    filename = file.attributes['href'].value

                    is_exe_node_html = False
                    if filename.endswith('.html') \
                    and filename != "fdl.html" \
                    and not filename.startswith("galleryPopup"):
                        # fdl.html is the wikipedia license, ignore it
                        # as well as any galleryPopups:
                        is_exe_node_html = \
                                test_for_node(zippedFile.read(filename))

                    if is_exe_node_html:
                        if pass_num == 1:
                            # 2nd pass call to actually load the nodes:
                            log.debug('loading idevices from node: ' + filename)
                            loadNodesIdevices(node, zippedFile.read(filename))
                    elif filename == "fdl.html" or \
                    filename.startswith("galleryPopup."):
                        # let these be re-created upon bursting.
                        if pass_num == 0:
                            # 1st pass call to unzip the resources:
                            log.debug('ignoring resource file: '+ filename)
                    else:
                        if pass_num == 0:
                            # 1st pass call to unzip the resources:
                            try:
                                zipinfo = zippedFile.getinfo(filename)
                                log.debug('unzipping resource file: '
                                        + resourceDir/filename )
                                outFile = open(resourceDir/filename, "wb") 
                                outFile.write(zippedFile.read(filename)) 
                                outFile.flush() 
                                outFile.close()
                            except:
                                log.warn('error unzipping resource file: '
                                        + resourceDir/filename )
                        ##########
                        # WARNING: the resource is now in the resourceDir,
                        # BUT it is NOT YET added into any of the project,
                        # much less to the specific idevices or fields!
                        # Although they WILL be saved out with the project
                        # upon the next Save.
                        ##########
            break

    # process this node's children
    for subitem in item.childNodes:
        if subitem.nodeName == 'item': 
            # for the first pass, of unzipping only, do not
            # create any child nodes, just cruise on with this one:
            next_node = node
            if pass_num == 1:
                # if this is actually loading the nodes:
                next_node = node.createChild()
            loadNode(pass_num, resourceDir, zippedFile, next_node,
                    doc, subitem, level+1)

def loadCC(zippedFile, filename):
    """
    Load an IMS Common Cartridge or Content Package from filename
    """
    package = Package(Path(filename).namebase)
    xmldoc = minidom.parseString( zippedFile.read('imsmanifest.xml')) 

    organizations_list = xmldoc.getElementsByTagName('organizations')
    level = 0
    # now a two-pass system to first unzip all applicable resources:
    for pass_num in range(2):
        for organizations in organizations_list:
            organization_list = organizations.getElementsByTagName(
                    'organization')
            for organization in organization_list:
                for item in organization.childNodes:
                    if item.nodeName == 'item':
                        loadNode(pass_num, package.resourceDir, zippedFile, 
                                package.root, xmldoc, item, level)
    return package

# ===========================================================================
class DublinCore(Jellyable, Unjellyable):
    """
    Holds dublin core info
    """

    def __init__(self):
        self.title = ''
        self.creator = ''
        self.subject = ''
        self.description = ''
        self.publisher = ''
        self.contributors = ''
        self.date = ''
        self.type = ''
        self.format = ''
        self.identifier = ''
        self.source = ''
        self.language = ''
        self.relation = ''
        self.coverage = ''
        self.rights = ''

    def __setattr__(self, name, value):
        self.__dict__[name] = toUnicode(value)

         
class Package(Persistable):
    """
    Package represents the collection of resources the user is editing
    i.e. the "package".
    """
    persistenceVersion = 10
    nonpersistant      = ['resourceDir', 'filename']
    # Name is used in filenames and urls (saving and navigating)
    _name              = '' 
    tempFile           = False # This is set when the package is saved as a temp copy file
    # Title is rendered in exports
    _title             = '' 
    _author            = ''
    _description       = ''
    _backgroundImg     = ''
    #styledefault=u"INTEF"
    # This is like a constant
    defaultLevelNames  = [x_(u"Topic"), x_(u"Section"), x_(u"Unit")]

    def __init__(self, name):
        """
        Initialize 
        """
        log.debug(u"init " + repr(name))
        self._nextIdeviceId = 0
        self._nextNodeId    = 0
        # For looking up nodes by ids
        self._nodeIdDict    = {} 

        self._levelNames    = self.defaultLevelNames[:]
        self.name           = name
        self._title         = u''
        self._backgroundImg = u''
        self.backgroundImgTile = False

        # Empty if never saved/loaded
        self.filename      = u''

        self.root          = Node(self, None, _(u"Home"))
        self.currentNode   = self.root
#        self.style         = u"default" 
        #self.styledefault=u"INTEF"
        self.style         = G.application.config.defaultStyle
        self.isChanged     = False
        self.idevices      = []
        self.dublinCore    = DublinCore()
        self.lomEs         = lomsubs.lomSub.factory()
        entry = str(uuid.uuid4())
        self.lomEs.addChilds(self.lomDefaults(entry, 'LOM-ESv1.0'))
        self.lom           = lomsubs.lomSub.factory()
        self.lom.addChilds(self.lomDefaults(entry, 'LOMv1.0'))
        self.scolinks      = False
        self.scowsinglepage= False
        self.scowwebsite   = False
        self.scowsource    = False
        self.exportMetadataType = "LOMES"
        self.license       = u''
        self.footer        = ""
        self._lang = G.application.config.locale.split('_')[0]
        self._objectives = u''
        self._preknowledge = u''
        self._learningResourceType = u''
        self._intendedEndUserRoleType = u''
        self._intendedEndUserRoleGroup = False
        self._intendedEndUserRoleTutor = False
        self._contextPlace = u''
        self._contextMode = u''

        # Temporary directory to hold resources in
        self.resourceDir = TempDirPath()
        self.resources = {} # Checksum-[_Resource(),..]

    # Property Handlers

    def set_name(self, value):
        self._name = toUnicode(value)

    def set_title(self, value):
        if self.dublinCore.title == self._title:
            self.dublinCore.title = value
        lang_str = self.lang.encode('utf-8')
        value_str = value.encode('utf-8')
        for metadata in [self.lom, self.lomEs]:
            title = metadata.get_general().get_title()
            if title:
                for string in title.get_string():
                    if string.get_valueOf_() == self._title.encode('utf-8'):
                        if value:
                            string.set_language(lang_str)
                            string.set_valueOf_(value_str)
                        else:
                            title.string.remove(string)
            else:
                if value:
                    title = lomsubs.titleSub([lomsubs.LangStringSub(lang_str, value_str)])
                    metadata.get_general().set_title(title)
        self._title = toUnicode(value)

    def set_lang(self, value):
        if self.dublinCore.language in [self._lang, '']:
            self.dublinCore.language = value
        value_str = value.encode('utf-8')
        for metadata in [self.lom, self.lomEs]:
            language = metadata.get_general().get_language()
            if language:
                for LanguageId in language:
                    if LanguageId.get_valueOf_() == self._lang.encode('utf-8'):
                        LanguageId.set_valueOf_(value_str)
            else:
                language = [lomsubs.LanguageIdSub(value_str)]
                metadata.get_general().set_language(language)

            metametadata = metadata.get_metaMetadata()
            if metametadata:
                language = metametadata.get_language()
                if language:
                    if language.get_valueOf_() == self._lang.encode('utf-8'):
                        language.set_valueOf_(value_str)
                else:
                    language = lomsubs.LanguageIdSub(value_str)
                    metametadata.set_language(language)
            else:
                language = lomsubs.LanguageIdSub(value_str)
                metametadata = lomsubs.metaMetadataSub(language=language)
                metadata.set_metaMetadata(metametadata)

            educationals = metadata.get_educational()
            if educationals:
                for educational in educationals:
                    language = educational.get_language()
                    if language:
                        for LanguageId in language:
                            if LanguageId.get_valueOf_() == self._lang.encode('utf-8'):
                                LanguageId.set_valueOf_(value_str)
            else:
                language = lomsubs.LanguageIdSub(value_str)
                educational = [lomsubs.educationalSub(language=[language])]
                metadata.set_educational(educational)
        self._lang = toUnicode(value)

    def set_author(self, value):
        if self.dublinCore.creator == self._author:
            self.dublinCore.creator = value
        value_str = value.encode('utf-8')
        author_vcard = 'BEGIN:VCARD VERSION:3.0 FN:%s EMAIL;TYPE=INTERNET: ORG: END:VCARD' % value_str
        for metadata, source in [(self.lom, 'LOMv1.0'), (self.lomEs, 'LOM-ESv1.0')]:
            src = lomsubs.sourceValueSub()
            src.set_valueOf_(source)
            src.set_uniqueElementName('source')
            val = lomsubs.roleValueSub()
            val.set_valueOf_('author')
            val.set_uniqueElementName('value')
            role = lomsubs.roleSub()
            role.set_source(src)
            role.set_value(val)
            role.set_uniqueElementName('role')
            entity = lomsubs.entitySub(author_vcard)

            lifeCycle = metadata.get_lifeCycle()
            if lifeCycle:
                pass
            else:
                if value:
                    contribute = lomsubs.contributeSub(role, [entity])
                    lifeCycle = lomsubs.lifeCycleSub(contribute=[contribute])
                    metadata.set_lifeCycle(lifeCycle)

            metaMetadata = metadata.get_metaMetadata()
            if metaMetadata:
                contributes = metaMetadata.get_contribute()
                if contributes:
                    for contribute in contributes:
                        pass
                else:
                    if value:
                        contribute = lomsubs.contributeMetaSub(role, [entity])
                        metaMetadata.set_contribute([contribute])
        self._author = toUnicode(value)

    def set_description(self, value):
        if self.dublinCore.description == self._description:
            self.dublinCore.description = value
        lang_str = self.lang.encode('utf-8')
        value_str = value.encode('utf-8')
        for metadata in [self.lom, self.lomEs]:
            description = metadata.get_general().get_description()
            if description:
                description_found = False
                for desc in description:
                    for string in desc.get_string():
                        if string.get_valueOf_() == self._description.encode('utf-8'):
                            description_found = True
                            if value:
                                string.set_language(lang_str)
                                string.set_valueOf_(value_str)
                            else:
                                desc.string.remove(string)
                                description.remove(desc)
                if not description_found:
                    if value:
                        description = lomsubs.descriptionSub([lomsubs.LangStringSub(lang_str, value_str)])
                        metadata.get_general().add_description(description)

            else:
                if value:
                    description = [lomsubs.descriptionSub([lomsubs.LangStringSub(lang_str, value_str)])]
                    metadata.get_general().set_description(description)
        self._description = toUnicode(value)

    def get_backgroundImg(self):
        """Get the background image for this package"""
        if self._backgroundImg:
            return "file://" + self._backgroundImg.path
        else:
            return ""

    def set_backgroundImg(self, value):
        """Set the background image for this package"""
        if self._backgroundImg:
            self._backgroundImg.delete()

        if value:
            if value.startswith("file://"):
                value = value[7:]

            imgFile = Path(value)
            self._backgroundImg = Resource(self, Path(imgFile))
        else:
            self._backgroundImg = u''

    def get_level1(self):
        return self.levelName(0)

    def set_level1(self, value):
        if value != '':
            self._levelNames[0] = value
        else:
            self._levelNames[0] = self.defaultLevelNames[0]

    def get_level2(self):
        return self.levelName(1)

    def set_level2(self, value):
        if value != '':
            self._levelNames[1] = value
        else:
            self._levelNames[1] = self.defaultLevelNames[1]

    def get_level3(self):
        return self.levelName(2)

    def set_level3(self, value):
        if value != '':
            self._levelNames[2] = value
        else:
            self._levelNames[2] = self.defaultLevelNames[2]

    def set_objectives(self, value):
        lang_str = self.lang.encode('utf-8')
        value_str = value.encode('utf-8')
        for metadata in [self.lom, self.lomEs]:
            description = metadata.get_general().get_description()
            if description:
                description_found = False
                for desc in description:
                    for string in desc.get_string():
                        if string.get_valueOf_() == self._objectives.encode('utf-8'):
                            description_found = True
                            if value:
                                string.set_language(lang_str)
                                string.set_valueOf_(value_str)
                            else:
                                desc.string.remove(string)
                                description.remove(desc)
                if not description_found:
                    if value:
                        description = lomsubs.descriptionSub([lomsubs.LangStringSub(lang_str, value_str)])
                        metadata.get_general().add_description(description)
            else:
                if value:
                    description = [lomsubs.descriptionSub([lomsubs.LangStringSub(lang_str, value_str)])]
                    metadata.get_general().set_description(description)
        self._objectives = toUnicode(value)

    def set_preknowledge(self, value):
        lang_str = self.lang.encode('utf-8')
        value_str = value.encode('utf-8')
        for metadata in [self.lom, self.lomEs]:
            description = metadata.get_general().get_description()
            if description:
                description_found = False
                for desc in description:
                    for string in desc.get_string():
                        if string.get_valueOf_() == self._preknowledge.encode('utf-8'):
                            description_found = True
                            if value:
                                string.set_language(lang_str)
                                string.set_valueOf_(value_str)
                            else:
                                desc.string.remove(string)
                                description.remove(desc)
                if not description_found:
                    if value:
                        description = lomsubs.descriptionSub([lomsubs.LangStringSub(lang_str, value_str)])
                        metadata.get_general().add_description(description)
            else:
                if value:
                    description = [lomsubs.descriptionSub([lomsubs.LangStringSub(lang_str, value_str)])]
                    metadata.get_general().set_description(description)
        self._preknowledge = toUnicode(value)

    def license_map(self, source, value):
        if source == 'LOM-ESv1.0':
            return value
        elif source == 'LOMv1.0':
            if value == 'not appropriate':
                return 'no'
            else:
                return 'yes'

    def set_license(self, value):
        value_str = value.encode('utf-8')
        if self.dublinCore.rights == self.license:
            self.dublinCore.rights = value
        for metadata, source in [(self.lom, 'LOMv1.0'), (self.lomEs, 'LOM-ESv1.0')]:
            rights = metadata.get_rights()
            if not rights:
                metadata.set_rights(lomsubs.rightsSub())
            copyrightAndOtherRestrictions = metadata.get_rights().get_copyrightAndOtherRestrictions()
            if copyrightAndOtherRestrictions:
                if copyrightAndOtherRestrictions.get_value().get_valueOf_() == self.license_map(source, self.license.encode('utf-8')):
                    if value:
                        copyrightAndOtherRestrictions.get_value().set_valueOf_(self.license_map(source, value_str))
                    else:
                        copyrightAndOtherRestrictions = None
            else:
                if value:
                    src = lomsubs.sourceValueSub()
                    src.set_valueOf_(source)
                    src.set_uniqueElementName('source')
                    val = lomsubs.copyrightAndOtherRestrictionsValueSub()
                    val.set_valueOf_(self.license_map(source, value_str))
                    val.set_uniqueElementName('value')
                    copyrightAndOtherRestrictions = lomsubs.copyrightAndOtherRestrictionsSub()
                    copyrightAndOtherRestrictions.set_source(src)
                    copyrightAndOtherRestrictions.set_value(val)
                    copyrightAndOtherRestrictions.set_uniqueElementName('copyrightAndOtherRestrictions')
                    metadata.get_rights().set_copyrightAndOtherRestrictions(copyrightAndOtherRestrictions)
        self.license = toUnicode(value)

    def set_learningResourceType(self, value):
        value_str = value.encode('utf-8')
        for metadata, source in [(self.lom, 'LOMv1.0'), (self.lomEs, 'LOM-ESv1.0')]:
            educationals = metadata.get_educational()
            if educationals:
                for educational in educationals:
                    learningResourceTypes = educational.get_learningResourceType()
                    found = False
                    if learningResourceTypes:
                        for learningResourceType in learningResourceTypes:
                            if learningResourceType.get_value().get_valueOf_() == self.learningResourceType.encode('utf-8'):
                                found = True
                                if value:
                                    src = lomsubs.sourceValueSub()
                                    src.set_valueOf_(source)
                                    src.set_uniqueElementName('source')
                                    val = lomsubs.learningResourceTypeValueSub()
                                    val.set_valueOf_(value_str)
                                    val.set_uniqueElementName('value')
                                    index = learningResourceTypes.index(learningResourceType)
                                    learningResourceType = lomsubs.learningResourceTypeSub(value_str)
                                    learningResourceType.set_source(src)
                                    learningResourceType.set_value(val)
                                    educational.insert_learningResourceType(index, learningResourceType)
                                else:
                                    learningResourceType = None
                    if not found and value:
                        src = lomsubs.sourceValueSub()
                        src.set_valueOf_(source)
                        src.set_uniqueElementName('source')
                        val = lomsubs.learningResourceTypeValueSub()
                        val.set_valueOf_(value_str)
                        val.set_uniqueElementName('value')
                        learningResourceType = lomsubs.learningResourceTypeSub(value_str)
                        learningResourceType.set_source(src)
                        learningResourceType.set_value(val)
                        educational.add_learningResourceType(learningResourceType)
            else:
                if value:
                    src = lomsubs.sourceValueSub()
                    src.set_valueOf_(source)
                    src.set_uniqueElementName('source')
                    val = lomsubs.learningResourceTypeValueSub()
                    val.set_valueOf_(value_str)
                    val.set_uniqueElementName('value')
                    learningResourceType = lomsubs.learningResourceTypeSub(value_str)
                    learningResourceType.set_source(src)
                    learningResourceType.set_value(val)
                    educational = [lomsubs.educationalSub(learningResourceType=[learningResourceType])]
                    metadata.set_educational(educational)
        self._learningResourceType = toUnicode(value)

    def set_intendedEndUserRoleType(self, value):
        self._intendedEndUserRoleType = toUnicode(value)

    def set_intendedEndUserRoleGroup(self, value):
        self._intendedEndUserRoleGroup = value

    def set_intendedEndUserRoleTutor(self, value):
        self._intendedEndUserRoleTutor = value

    def set_contextPlace(self, value):
        self._contextPlace = toUnicode(value)

    def set_contextMode(self, value):
        self._contextMode = toUnicode(value)

    # Properties

    name          = property(lambda self:self._name, set_name)
    title         = property(lambda self:self._title, set_title)
    lang          = property(lambda self: self._lang, set_lang)
    author        = property(lambda self:self._author, set_author)
    description   = property(lambda self:self._description, set_description)
    newlicense    = property(lambda self:self.license, set_license)

    backgroundImg = property(get_backgroundImg, set_backgroundImg)

    level1 = property(get_level1, set_level1)
    level2 = property(get_level2, set_level2)
    level3 = property(get_level3, set_level3)

    objectives = property(lambda self: self._objectives, set_objectives)
    preknowledge = property(lambda self: self._preknowledge, set_preknowledge)
    learningResourceType = property(lambda self: self._learningResourceType, set_learningResourceType)
    intendedEndUserRoleType = property(lambda self: self._intendedEndUserRoleType, set_intendedEndUserRoleType)
    intendedEndUserRoleGroup = property(lambda self: self._intendedEndUserRoleGroup, set_intendedEndUserRoleGroup)
    intendedEndUserRoleTutor = property(lambda self: self._intendedEndUserRoleTutor, set_intendedEndUserRoleTutor)
    contextPlace = property(lambda self: self._contextPlace, set_contextPlace)
    contextMode = property(lambda self: self._contextMode, set_contextMode)

    def findNode(self, nodeId):
        """
        Finds a node from its nodeId
        (nodeId can be a string or a list/tuple)
        """
        log.debug(u"findNode" + repr(nodeId))
        node = self._nodeIdDict.get(nodeId)
        if node and node.package is self:
            return node
        else: 
            return None


    def levelName(self, level):
        """
        Return the level name
        """
        if level < len(self._levelNames):
            return _(self._levelNames[level])
        else:
            return _(u"?????")
        

    def save(self, filename=None, tempFile=False):
        """
        Save package to disk
        pass an optional filename
        """
        self.tempFile = tempFile
        # Get the filename
        if filename:
            filename = Path(filename)
            # If we are being given a new filename...
            # Change our name to match our new filename
            name = filename.splitpath()[1]
            if not tempFile:
                self.name = name.basename().splitext()[0]
        elif self.filename:
            # Otherwise use our last saved/loaded from filename
            filename = Path(self.filename)
        else:
            # If we don't have a last saved/loaded from filename,
            # raise an exception because, we need to have a new
            # file passed when a brand new package is saved
            raise AssertionError(u'No name passed when saving a new package')
        #JR: Convertimos el nombre del paquete para evitar nombres problematicos
        import string
        validPackagenameChars = "-_. %s%s" % (string.ascii_letters, string.digits)
        self.name = ''.join(c for c in self.name if c in validPackagenameChars).replace(' ','_')
        #JR: Si por casualidad quedase vacio le damos un nombre por defecto
        if self.name == "":
            self.name = "invalidpackagename"
        # Store our new filename for next file|save, and save the package
        log.debug(u"Will save %s to: %s" % (self.name, filename))
        if tempFile:
            self.nonpersistant.remove('filename')
            oldFilename, self.filename = self.filename, unicode(self.filename)
            try:
                filename.safeSave(self.doSave, _('SAVE FAILED!\nLast succesful save is %s.'))
            finally:
                self.nonpersistant.append('filename')
                self.filename = oldFilename
        else:
            # Update our new filename for future saves
            self.filename = filename
            filename.safeSave(self.doSave, _('SAVE FAILED!\nLast succesful save is %s.'))
            self.isChanged = False
            self.updateRecentDocuments(filename)

    def updateRecentDocuments(self, filename):
        """
        Updates the list of recent documents
        """
        # Don't update the list for the generic.data "package"
        genericData = G.application.config.configDir/'idevices'/'generic.data'
        if genericData.isfile() or genericData.islink():
            if Path(filename).samefile(genericData):
                return
        # Save in recentDocuments list
        recentProjects = G.application.config.recentProjects
        if filename in recentProjects:
            # If we're already number one, carry on
            if recentProjects[0] == filename:
                return
            recentProjects.remove(filename)
        recentProjects.insert(0, filename)
        del recentProjects[5:] # Delete any older names from the list
        G.application.config.configParser.write() # Save the settings

    def doSave(self, fileObj):
        """
        Actually performs the save to 'fileObj'.
        """
        zippedFile = zipfile.ZipFile(fileObj, "w", zipfile.ZIP_DEFLATED)
        try:
            for resourceFile in self.resourceDir.files():
                zippedFile.write(unicode(resourceFile.normpath()),
                        resourceFile.name.encode('utf8'), zipfile.ZIP_DEFLATED)

            zinfo = zipfile.ZipInfo(filename='content.data',
                    date_time=time.localtime()[0:6])
            zinfo.external_attr = 0100644<<16L
            zinfo.compress_type = zipfile.ZIP_DEFLATED
            zippedFile.writestr(zinfo, encodeObject(self))

            zinfo2 = zipfile.ZipInfo(filename='contentv2.xml',
                    date_time=time.localtime()[0:6])
            zinfo2.external_attr = 0100644<<16L
            zinfo2.compress_type = zipfile.ZIP_DEFLATED
            zippedFile.writestr(zinfo2, encodeObjectToXML(self))

            zippedFile.write(G.application.config.webDir/'templates'/'content.xsd', 'content.xsd', zipfile.ZIP_DEFLATED)
        finally:
            zippedFile.close()

    def extractNode(self):
        """
        Clones and extracts the currently selected node into a new package.
        """
        newPackage = Package('NoName') # Name will be set once it is saved..
        newPackage.title  = self.currentNode.title
        newPackage.style  = self.style
        newPackage.author = self.author
        newPackage._nextNodeId = self._nextNodeId
        # Copy the nodes from the original package
        # and merge into the root of the new package
        self.currentNode.copyToPackage(newPackage)
        return newPackage

    @staticmethod
    def load(filename, newLoad=True, destinationPackage=None, fromxml=None):
        """
        Load package from disk, returns a package.
        """
        if not zipfile.is_zipfile(filename):
            return None

        zippedFile = zipfile.ZipFile(filename, "r")

        xml = None
        
        try:
            xml = zippedFile.read(u"contentv2.xml")
        except:
            pass
        
        if not xml:
            try:
                # Get the jellied package data
                toDecode   = zippedFile.read(u"content.data")
            except KeyError:
                log.info("no content.data, trying Common Cartridge/Content Package")
                newPackage = loadCC(zippedFile, filename)
                newPackage.tempFile = False
                newPackage.isChanged = False
                newPackage.filename = Path(filename)
    
                return newPackage
            
        # Need to add a TempDirPath because it is a nonpersistant member
        resourceDir = TempDirPath()

        # Extract resource files from package to temporary directory
        for fn in zippedFile.namelist():
            if unicode(fn, 'utf8') not in [u"content.data", u"content.xml", u"contentv2.xml", u"content.xsd" ]:
                #JR: Hacemos las comprobaciones necesarias por si hay directorios
                if ("/" in fn):
                    dir = fn[:fn.index("/")]
                    Dir = Path(resourceDir/dir)
                    if not Dir.exists():
                        Dir.mkdir()
                Fn = Path(resourceDir/fn)
                if not Fn.isdir():
                    outFile = open(resourceDir/fn, "wb")
                    outFile.write(zippedFile.read(fn))
                    outFile.flush()
                    outFile.close()

        try:
            validxml = False
            if fromxml:
                newPackage, validxml = decodeObjectFromXML(fromxml)
            elif xml:
                xmlinfo = zippedFile.getinfo(u"contentv2.xml")
                datainfo = zippedFile.getinfo(u"content.data")
                if xmlinfo.date_time >= datainfo.date_time:
                    newPackage, validxml = decodeObjectFromXML(xml)
            if not validxml:
                toDecode   = zippedFile.read(u"content.data")
                newPackage = decodeObjectRaw(toDecode)
            G.application.afterUpgradeHandlers = []
            newPackage.resourceDir = resourceDir
            G.application.afterUpgradeZombies2Delete = []
            if not validxml and (xml or fromxml or "content.xml" in zippedFile.namelist()):
                for key, res in newPackage.resources.items():
                    if len(res) < 1:
                        newPackage.resources.pop(key)
                    else:
                        if (hasattr(res[0], 'testForAndDeleteZombieResources')):
                            res[0].testForAndDeleteZombieResources()

            if newLoad: 
                # provide newPackage to doUpgrade's versionUpgrade() to
                # correct old corrupt extracted packages by setting the
                # any corrupt package references to the new package:
                #JR: Convertimos el nombre del paquete para evitar nombres problematicos
                import string
                validPackagenameChars = "-_. %s%s" % (string.ascii_letters, string.digits)
                newPackage._name = ''.join(c for c in newPackage._name if c in validPackagenameChars).replace(' ','_')
                #JR: Si por casualidad quedase vacio le damos un nombre por defecto
                if newPackage._name == "":
                    newPackage._name = "invalidpackagename"
                log.debug("load() about to doUpgrade newPackage \"" 
                        + newPackage._name + "\" " + repr(newPackage) )
                if hasattr(newPackage, 'resourceDir'):
                    log.debug("newPackage resourceDir = "
                            + newPackage.resourceDir)
                else:
                    # even though it was just set above? should not get here:
                    log.error("newPackage resourceDir has NO resourceDir!")

                doUpgrade(newPackage)

                # after doUpgrade, compare the largest found field ID:
                if G.application.maxFieldId >= Field.nextId:
                    Field.nextId = G.application.maxFieldId + 1

            else: 
                # and when merging, automatically set package references to
                # the destinationPackage, into which this is being merged:

                log.debug("load() about to merge doUpgrade newPackage \"" 
                        + newPackage._name + "\" " + repr(newPackage)
                        + " INTO destinationPackage \"" 
                        + destinationPackage._name + "\" " 
                        + repr(destinationPackage))
                
                log.debug("using their resourceDirs:")
                if hasattr(newPackage, 'resourceDir'):
                    log.debug("   newPackage resourceDir = " 
                            + newPackage.resourceDir)
                else:
                    log.error("newPackage has NO resourceDir!")
                if hasattr(destinationPackage, 'resourceDir'):
                    log.debug("   destinationPackage resourceDir = " 
                            + destinationPackage.resourceDir)
                else:
                    log.error("destinationPackage has NO resourceDir!")

                doUpgrade(destinationPackage, 
                        isMerge=True, preMergePackage=newPackage)

                # after doUpgrade, compare the largest found field ID:
                if G.application.maxFieldId >= Field.nextId:
                    Field.nextId = G.application.maxFieldId + 1

        except:
            import traceback
            traceback.print_exc()
            raise

        if newPackage.tempFile:
            # newPackage.filename was stored as it's original filename
            newPackage.tempFile = False
        else:
            # newPackage.filename is the name that the package was last loaded from
            # or saved to
            newPackage.filename = Path(filename)

        # Let idevices and nodes handle any resource upgrading they may need to
        # Note: Package afterUpgradeHandlers *must* be done after Resources'
        # and the package should be updated before everything else,
        # so, prioritize with a 3-pass, 3-level calling setup
        # in order of: 1) resources, 2) package, 3) anything other objects
        for handler_priority in range(3):
          for handler in G.application.afterUpgradeHandlers:

            if handler_priority == 0 and \
            repr(handler.im_class)=="<class 'exe.engine.resource.Resource'>":
                # level-0 handlers: Resource
                handler()

            elif handler_priority == 1 and \
            repr(handler.im_class)=="<class 'exe.engine.package.Package'>":
                # level-1 handlers: Package (requires resources first)
                if handler.im_self == newPackage: 
                    handler()
                else:
                    log.warn("Extra package object found, " \
                       + "ignoring its afterUpgradeHandler: " \
                       + repr(handler))

            elif handler_priority == 2 and \
            repr(handler.im_class)!="<class 'exe.engine.resource.Resource'>" \
            and \
            repr(handler.im_class)!="<class 'exe.engine.package.Package'>":
                # level-2 handlers: all others
                handler()

        G.application.afterUpgradeHandlers = []
        
        num_zombies = len(G.application.afterUpgradeZombies2Delete)
        for i in range(num_zombies-1, -1, -1):
            zombie = G.application.afterUpgradeZombies2Delete[i]
            # now, the zombie list can contain nodes OR resources to delete.
            # if zombie is a node, then also pass in a pruning parameter..
            zombie_is_node = False
            if isinstance(zombie, Node):
                zombie_is_node = True

            if zombie_is_node: 
                zombie.delete(pruningZombies=True) 
            else:
                #JR: Eliminamos el recurso del idevice
                if hasattr(zombie._idevice, 'userResources'):
                    for i in range(len(zombie._idevice.userResources)-1, -1, -1):
                        if hasattr(zombie._idevice.userResources[i], 'storageName'):
                            if zombie._idevice.userResources[i].storageName == zombie.storageName:
                                aux = zombie._idevice.userResources[i]
                                zombie._idevice.userResources.remove(aux)
                                aux.delete
                #Eliminamos el recurso de los recursos del sistema
                #for resource in newPackage.resources.keys():
                #    if hasattr(newPackage.resources[resource][0], 'storageName'):
                #        if newPackage.resources[resource][0].storageName == zombie.storageName:
                #            del newPackage.resources[resource]
                #JR: Esto ya no haria falta
                #zombie.delete()
            del zombie
        userResourcesFiles = newPackage.getUserResourcesFiles(newPackage.root)
        #JR: Borramos recursos que no estan siendo utilizados
        newPackage.cleanUpResources(userResourcesFiles)
        G.application.afterUpgradeZombies2Delete = []

        newPackage.updateRecentDocuments(newPackage.filename)
        newPackage.isChanged = False
        nstyle=Path(G.application.config.stylesDir/newPackage.style)
        if not nstyle.isdir():
            newPackage.style=G.application.config.defaultStyle       
        return newPackage

    def getUserResourcesFiles(self, node):
        resourceFiles = set()
        for idevice in node.idevices:
            if hasattr(idevice, 'userResources'):
                for i in range(len(idevice.userResources) - 1, -1, -1):
                    if hasattr(idevice.userResources[i], 'storageName'):
                        resourceFiles.add(idevice.userResources[i].storageName)
        for child in node.children:
            resourceFiles = resourceFiles | self.getUserResourcesFiles(child)
        return resourceFiles

    def cleanUpResources(self, userResourcesFiles=set()):
        """
        Removes duplicate resource files
        """
        # Delete unused resources.
        # Only really needed for upgrading to version 0.20,
        # but upgrading of resources and package happens in no particular order
        # and must be done after all resources have been upgraded

        # some earlier .elp files appear to have been corrupted with 
        # two packages loaded, *possibly* from some strange extract/merge
        # functionality in earlier eXe versions?
        # Regardless, only the real package will have a resourceDir,
        # and the other will fail.
        # For now, then, put in this quick and easy safety check:
        if not hasattr(self,'resourceDir'):
            log.warn("cleanUpResources called on a redundant package")
            return

        existingFiles = set([fn.basename() for fn in self.resourceDir.files()])
        #JR
        usedFiles = set([])
        for reses in self.resources.values():
            if hasattr(reses[0], 'storageName'):
                usedFiles.add(reses[0].storageName)
        #usedFiles = set([reses[0].storageName for reses in self.resources.values()])
        for fn in existingFiles - usedFiles - userResourcesFiles:
            (self.resourceDir/fn).remove()

    def findResourceByName(self, queryName):
        """
        Support for merging, and anywhere else that unique names might be
        checked before actually comparing against the files (as will be 
        done by the resource class itself in its _addOurselvesToPackage() )
        """
        foundResource = None
        queryResources = self.resources
        for this_checksum in queryResources:
            for this_resource in queryResources[this_checksum]:
                if queryName == this_resource.storageName:
                    foundResource = this_resource
                    return foundResource
        return foundResource


    def upgradeToVersion1(self):
        """
        Called to upgrade from 0.3 release
        """
        self._nextNodeId = 0
        self._nodeIdDict = {}

        # Also upgrade all the nodes.
        # This needs to be done here so that draft gets id 0
        # If it's done in the nodes, the ids are assigned in reverse order
        draft = getattr(self, 'draft')
        draft._id = self._regNewNode(draft)
        draft._package = self
        setattr(self, 'editor', Node(self, None, _(u"iDevice Editor")))

        # Add a default idevice to the editor
        idevice = GenericIdevice("", "", "", "", "")
        editor = getattr(self, 'editor')
        idevice.parentNode = editor
        editor.addIdevice(idevice)
        def superReg(node):
            """Registers all our nodes
            because in v0 they were not registered
            in this way"""
            node._id = self._regNewNode(node)
            node._package = self
            for child in node.children:
                superReg(child)
        superReg(self.root)


    def _regNewNode(self, node):
        """
        Called only by nodes, 
        stores the node in our id lookup dict
        returns a new unique id
        """
        id_ = unicode(self._nextNodeId)
        self._nextNodeId += 1
        self._nodeIdDict[id_] = node
        return id_


    def getNewIdeviceId(self):
        """
        Returns an iDevice Id which is unique for this package.
        """
        id_ = unicode(self._nextIdeviceId)
        self._nextIdeviceId += 1
        return id_


    def upgradeToVersion2(self):
        """
        Called to upgrade from 0.4 release
        """
        getattr(self, 'draft').delete()
        getattr(self, 'editor').delete()
        delattr(self, 'draft')
        delattr(self, 'editor')
        # Need to renumber nodes because idevice node and draft nodes are gone
        self._nextNodeId = 0
        def renumberNode(node):
            """
            Gives the old node a number
            """
            node._id = self._regNewNode(node)
            for child in node.children:
                renumberNode(child)
        renumberNode(self.root)


    def upgradeToVersion3(self):
        """
        Also called to upgrade from 0.4 release
        """
        self._nextIdeviceId = 0


    def upgradeToVersion4(self):
        """
        Puts properties in their place
        Also called to upgrade from 0.8 release
        """
        self._name = toUnicode(self.__dict__['name'])
        self._author = toUnicode(self.__dict__['author'])
        self._description = toUnicode(self.__dict__['description'])


    def upgradeToVersion5(self):
        """
        For version 0.11
        """
        self._levelNames = self.levelNames
        del self.levelNames
    
    def upgradeToVersion6(self):
        """
        For version 0.14
        """
        self.dublinCore = DublinCore()
        # Copy some of the package properties to dublin core
        self.title = self.root.title
        self.dublinCore.title = self.root.title
        self.dublinCore.creator = self._author
        self.dublinCore.description = self._description
        self.scolinks = False

    def upgradeToVersion7(self):
        """
        For version 0.15
        """
        self._backgroundImg = ''
        self.backgroundImgTile = False
        
    def upgradeToVersion8(self):
        """
        For version 0.20, alpha, for nightlies r2469
        """
        self.license = 'None'
        self.footer = ""
        self.idevices = []

    def upgradeToVersion9(self):
        """
        For version >= 0.20.4
        """
        if not hasattr(self, 'resources'):
            # The hasattr is needed, because sometimes, Resource instances are upgraded
            # first and they also set this attribute on the package
            self.resources = {}
        G.application.afterUpgradeHandlers.append(self.cleanUpResources)

    def lomDefaults(self, entry, schema):
        return {'general': {'identifier': [{'catalog': _('My Catalog'), 'entry': entry}],
                              'aggregationLevel': {'source': schema, 'value': '3'}
                             },
                  'metaMetadata': {'metadataSchema': [schema]},
                 }

    oldLicenseMap = {"None": "None",
                  "GNU Free Documentation License": u"license GFDL",
                  "Creative Commons Attribution 3.0 License": u"creative commons: attribution",
                  "Creative Commons Attribution Share Alike 3.0 License": u"creative commons: attribution - share alike",
                  "Creative Commons Attribution No Derivatives 3.0 License": u"creative commons: attribution - non derived work",
                  "Creative Commons Attribution Non-commercial 3.0 License": u"creative commons: attribution - non commercial",
                  "Creative Commons Attribution Non-commercial Share Alike 3.0 License": u"creative commons: attribution - non commercial - share alike",
                  "Creative Commons Attribution Non-commercial No Derivatives 3.0 License": u"creative commons: attribution - non derived work - non commercial",
                  "Creative Commons Attribution 2.5 License": u"creative commons: attribution",
                  "Creative Commons Attribution-ShareAlike 2.5 License": u"creative commons: attribution - share alike",
                  "Creative Commons Attribution-NoDerivs 2.5 License": u"creative commons: attribution - non derived work",
                  "Creative Commons Attribution-NonCommercial 2.5 License": u"creative commons: attribution - non commercial",
                  "Creative Commons Attribution-NonCommercial-ShareAlike 2.5 License": u"creative commons: attribution - non commercial - share alike",
                  "Creative Commons Attribution-NonCommercial-NoDerivs 2.5 License": u"creative commons: attribution - non derived work - non commercial",
                  "Developing Nations 2.0": u""
                 }

    def upgradeToVersion10(self):
        """
        For version >= intef8
        """
        entry = str(uuid.uuid4())
        if not hasattr(self, 'lomEs') or not isinstance(self.lomEs, lomsubs.lomSub):
            self.lomEs = lomsubs.lomSub.factory()
            self.lomEs.addChilds(self.lomDefaults(entry, 'LOM-ESv1.0'))
        if not hasattr(self, 'lom') or not isinstance(self.lom, lomsubs.lomSub):
            self.lom = lomsubs.lomSub.factory()
            self.lom.addChilds(self.lomDefaults(entry, 'LOMv1.0'))
        if not hasattr(self, 'scowsinglepage'):
            self.scowsinglepage = False
        if not hasattr(self, 'scowwebsite'):
            self.scowwebsite = False
        if not hasattr(self, 'scowsource'):
            self.scowsource = False
        if not hasattr(self, 'exportMetadataType'):
            self.exportMetadataType = "LOMES"
        if not hasattr(self, 'lang'):
            self._lang = G.application.config.locale.split('_')[0]
        if not hasattr(self, 'objectives'):
            self._objectives = u''
        if not hasattr(self, 'preknowledge'):
            self._preknowledge = u''
        if not hasattr(self, 'learningResourceType'):
            self._learningResourceType = u''
        if not hasattr(self, 'intendedEndUserRoleType'):
            self._intendedEndUserRoleType = u''
        if not hasattr(self, 'intendedEndUserRoleGroup'):
            self._intendedEndUserRoleGroup = False
        if not hasattr(self, 'intendedEndUserRoleTutor'):
            self._intendedEndUserRoleTutor = False
        if not hasattr(self, 'contextPlace'):
            self._contextPlace = u''
        if not hasattr(self, 'contextMode'):
            self._contextMode = u''
        try:
            self.newlicense = self.oldLicenseMap[self.license]
        except:
            self.license = u''

# ===========================================================================
