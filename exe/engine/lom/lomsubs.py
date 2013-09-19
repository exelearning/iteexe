#!/usr/bin/env python
# -*- coding: utf-8 -*-

#
# Generated Fri May 10 13:36:48 2013 by generateDS.py version 2.9a.
#

import sys
import re


import lom as supermod
import inspect

etree_ = None
Verbose_import_ = False
(   XMLParser_import_none, XMLParser_import_lxml,
    XMLParser_import_elementtree
    ) = range(3)
XMLParser_import_library = None
try:
    # lxml
    from lxml import etree as etree_
    XMLParser_import_library = XMLParser_import_lxml
    if Verbose_import_:
        print("running with lxml.etree")
except ImportError:
    try:
        # cElementTree from Python 2.5+
        import xml.etree.cElementTree as etree_
        XMLParser_import_library = XMLParser_import_elementtree
        if Verbose_import_:
            print("running with cElementTree on Python 2.5+")
    except ImportError:
        try:
            # ElementTree from Python 2.5+
            import xml.etree.ElementTree as etree_
            XMLParser_import_library = XMLParser_import_elementtree
            if Verbose_import_:
                print("running with ElementTree on Python 2.5+")
        except ImportError:
            try:
                # normal cElementTree install
                import cElementTree as etree_
                XMLParser_import_library = XMLParser_import_elementtree
                if Verbose_import_:
                    print("running with cElementTree")
            except ImportError:
                try:
                    # normal ElementTree install
                    import elementtree.ElementTree as etree_
                    XMLParser_import_library = XMLParser_import_elementtree
                    if Verbose_import_:
                        print("running with ElementTree")
                except ImportError:
                    raise ImportError(
                        "Failed to import ElementTree from any known place")

def parsexml_(*args, **kwargs):
    if (XMLParser_import_library == XMLParser_import_lxml and
        'parser' not in kwargs):
        # Use the lxml ElementTree compatible parser so that, e.g.,
        #   we ignore comments.
        kwargs['parser'] = etree_.ETCompatXMLParser()
    doc = etree_.parse(*args, **kwargs)
    return doc

#
# Globals
#

ExternalEncoding = 'UTF-8'

#
# Data representation classes
#

class LanguageIdSub(supermod.LanguageId):
    def __init__(self, valueOf_=None, extensiontype_=None):
        super(LanguageIdSub, self).__init__(valueOf_, extensiontype_, )
supermod.LanguageId.subclass = LanguageIdSub
# end class LanguageIdSub


class VCardSub(supermod.VCard):
    def __init__(self, valueOf_=None, extensiontype_=None):
        super(VCardSub, self).__init__(valueOf_, extensiontype_, )
supermod.VCard.subclass = VCardSub
# end class VCardSub


class LanguageStringSub(supermod.LanguageString):
    def __init__(self, string=None, extensiontype_=None):
        super(LanguageStringSub, self).__init__(string, extensiontype_, )
supermod.LanguageString.subclass = LanguageStringSub
# end class LanguageStringSub


class LangStringSub(supermod.LangString):
    def __init__(self, language=None, valueOf_=None):
        super(LangStringSub, self).__init__(language, valueOf_, )
supermod.LangString.subclass = LangStringSub
# end class LangStringSub


class DateTimeSub(supermod.DateTime):
    def __init__(self, dateTime=None, description=None, extensiontype_=None):
        super(DateTimeSub, self).__init__(dateTime, description, extensiontype_, )
supermod.DateTime.subclass = DateTimeSub
# end class DateTimeSub


class DateTimeValueSub(supermod.DateTimeValue):
    def __init__(self, uniqueElementName=None, valueOf_=None):
        super(DateTimeValueSub, self).__init__(uniqueElementName, valueOf_, )
supermod.DateTimeValue.subclass = DateTimeValueSub
# end class DateTimeValueSub


class DurationSub(supermod.Duration):
    def __init__(self, duration=None, description=None, extensiontype_=None):
        super(DurationSub, self).__init__(duration, description, extensiontype_, )
supermod.Duration.subclass = DurationSub
# end class DurationSub


class DurationValueSub(supermod.DurationValue):
    def __init__(self, uniqueElementName=None, valueOf_=None):
        super(DurationValueSub, self).__init__(uniqueElementName, valueOf_, )
supermod.DurationValue.subclass = DurationValueSub
# end class DurationValueSub

internalkeys = [
                'subclass',
                'superclass',
                'tzof_pattern',
                'uniqueElementName',
                'valueOf_'
             ]


class lomSub(supermod.lom):
    sourceMap = {
                 'Accesibilidad LOM-ESv1.0': 'accesibilidad_LOM-ES',
                 'Nivel educativo LOM-ESv1.0': 'nivel_educativo_LOM-ES',
                 'Competencia LOM-ESv1.0': 'competencia_LOM-ES',
                 'Árbol curricular LOE 2006': 'arbol_curricular_LOE_2006',
                 'ETB-LRE MEC-CCAA V1.0': 'etb-lre_mec-ccaa_V.1.0'
                }

    def __init__(self, general=None, lifeCycle=None, metaMetadata=None, technical=None, educational=None, rights=None, relation=None, annotation=None, classification=None):
        self.__oldchild__ = None
        self.__index__ = {}
        super(lomSub, self).__init__(general, lifeCycle, metaMetadata, technical, educational, rights, relation, annotation, classification, )

    def getFieldClass(self, key, parentObj):
        sub = 'Sub'
        clsname = parentObj.__class__.__name__
        if key == 'string':
            cls = 'LangString'
        elif key == 'language':
            cls = 'LanguageId'
        elif key == 'description':
            cls = 'LanguageString'
        elif key == 'entity':
            cls = 'VCard'
        elif key == 'source':
            if clsname.rstrip(sub) != 'taxonPath':
                cls = key + 'Value'
            else:
                cls = key
        elif key == 'entry':
            if clsname.rstrip(sub) == 'taxon':
                cls = 'entryTaxon'
            else:
                cls = key
        elif key == 'duration':
            if clsname.rstrip(sub) in ['duration', 'typicalLearningTime']:
                cls = 'DurationValue'
            else:
                cls = key
        elif key == 'contribute':
            if clsname.rstrip(sub) == 'metaMetadata':
                cls = 'contributeMeta'
            else:
                cls = key
        elif key == 'dateTime':
            cls = 'DateTimeValue'
        elif key == 'type':
            cls = 'type_'
        elif key == 'value':
            cls = clsname.rstrip(sub)
            cls = cls.rstrip('_')
            cls = cls + 'Value'
        else:
            cls = key
        return eval(cls + sub)

    def addChilds(self, rootNode, rootObj=None):
        if not rootObj:
            rootObj = self

        if not  isinstance(rootNode, dict):
            rootObj.set_valueOf_(rootNode)
            return True

        if 'valueOf_' in rootNode.keys():
            for key, value in rootNode.iteritems():
                if key != '__numberid__':
                    getattr(rootObj, 'set_' + key)(value)
            return True

        for key, value in rootNode.iteritems():
            if key == '__numberid__':
                continue
            childclass = self.getFieldClass(key, rootObj)
            if isinstance(value, list):
                for v in value:
                    child = childclass.factory()
                    if hasattr(child, 'uniqueElementName'):
                        child.set_uniqueElementName(key)
                    getattr(rootObj, 'add_' + key)(child)
                    self.addChilds(v, child)
            else:
                child = childclass.factory()
                if hasattr(child, 'uniqueElementName'):
                    child.set_uniqueElementName(key)
                getattr(rootObj, 'set_' + key)(child)
                self.addChilds(value, child)

    def isAttrib(self, key):
        ret = False
        if not re.findall("^__.*__$", key) and\
            key not in internalkeys:
            ret = True
        return ret

    def genForm(self, base=None, rootObj=None, form={}):
        if not rootObj:
            rootObj = self
        if not base:
            base = 'lom'

        if isinstance(rootObj, str):
            form[base] = rootObj
            return True

        elif hasattr(rootObj, 'get_valueOf_'):
            if base.endswith('_dateTime'):
                form[base[:-9]] = rootObj.get_valueOf_()
            elif base.endswith('_source'):
                pass
            elif re.findall("_entity[0-9]*$", base):
                v = rootObj.get_valueOf_()
                if v.startswith('BEGIN:VCARD'):
                    if not v.endswith(' END:VCARD'):
                        v = v + ' END:VCARD'
                    if re.findall('^BEGIN\:VCARD VERSION\:3\.0 FN\:.*\ EMAIL\;TYPE\=INTERNET\:.*\ ORG\:.*END\:VCARD$', v):
                        sep = []
                        sep.append(v.find(' FN:') + 4)
                        sep.append(v.find(' EMAIL;TYPE=INTERNET:'))
                        sep.append(v.find(' ORG:'))
                        sep.append(v.find(' END:VCARD'))
                        form[base + '_name'] = v[sep[0]:sep[1]]
                        form[base + '_email'] = v[sep[1] + 21:sep[2]]
                        form[base + '_organization'] = v[sep[2] + 5:sep[3]]
                else:
                    print 'Entity VCARD structure error'
            elif base.endswith('_duration'):
                base2 = base[:-9]
                v = rootObj.get_valueOf_()
                d = re.findall('^P([0-9]+Y){0,1}([0-9]+M){0,1}([0-9]+D){0,1}(T([0-9]+H){0,1}([0-9]+M){0,1}([0-9]+(\.[0-9]+){0,1}S){0,1}){0,1}$', v)
                if d:
                    form[base2 + '_years'] = d[0][0].rstrip('Y')
                    form[base2 + '_months'] = d[0][1].rstrip('M')
                    form[base2 + '_days'] = d[0][2].rstrip('D')
                    form[base2 + '_hours'] = d[0][4].rstrip('H')
                    form[base2 + '_minutes'] = d[0][5].rstrip('M')
                    form[base2 + '_seconds'] = d[0][6].rstrip('S')
                else:
                    print 'Duration structure error'
            elif re.findall("taxonPath[0-9]+_source", base):
                try:
                    form[base] = self.sourceMap[rootObj.get_valueOf_().encode('utf-8')] + '_%s' % rootObj.language
                except:
                    form[base] = _('Invalid source: %s') % rootObj.get_valueOf_()
            else:
                form[base] = rootObj.get_valueOf_()

        for key, value  in vars(rootObj).iteritems():
            if self.isAttrib(key):
                base2 = base + '_' + key.rstrip('_')
                #print key + ' -- ' + str(value)
                if isinstance(value, list):
                    i = 1
                    for v in value:
                        rootObj = v
                        if rootObj:
                            self.genForm(base2 + str(i), rootObj, form)
                        else:
                            continue
                        i += 1
                else:
                    rootObj = value
                    if rootObj:
                        self.genForm(base2, rootObj, form)
                    else:
                        continue
        return form

    def resetindex(self):
        self.__index__ = {}

    def getindex(self, field):
        num = re.findall("[0-9]+$", field)
        ret = -1
        if num:
            num = num[0]
            name = field[: -len(num)]
            if not name in self.__index__.keys():
                self.__index__[name] = {}
            if not num in self.__index__[name]:
                self.__index__[name][num] = len(self.__index__[name].keys())
            ret = self.__index__[name][num]
        return ret

    def getfname(self, node):
        num = re.findall("[0-9]+$", node)
        if num:
            num = num[0]
            name = node[: -len(num)]
        else:
            name = node
        return name

    def getval(self, field):
        val = ''
        nodes = field.split('_')
        index = -1
        obj = self
        if field.startswith('lom_'):
            base = 'lom'
            nodes.remove('lom')
            for node in nodes:
                base += '_' + node
                if node[-1].isdigit():
                    name = self.getfname(node)
                    index = self.getindex(base)
                else:
                    index = -1
                    name = node
                if obj:
                    if index > -1:
                        obj = getattr(obj, name)[index]
                    else:
                        obj = getattr(obj, name)
                else:
                    break
            if isinstance(obj, str):
                val = obj
            else:
                if obj:
                    val = obj.get_valueOf_()
        return val

supermod.lom.subclass = lomSub
# end class lomSub


class generalSub(supermod.general):
    def __init__(self, uniqueElementName=None, identifier=None, title=None, language=None, description=None, keyword=None, coverage=None, structure=None, aggregationLevel=None):
        super(generalSub, self).__init__(uniqueElementName, identifier, title, language, description, keyword, coverage, structure, aggregationLevel, )
supermod.general.subclass = generalSub
# end class generalSub


class identifierSub(supermod.identifier):
    def __init__(self, catalog=None, entry=None):
        super(identifierSub, self).__init__(catalog, entry, )
supermod.identifier.subclass = identifierSub
# end class identifierSub


class catalogSub(supermod.catalog):
    def __init__(self, uniqueElementName=None, valueOf_=None):
        super(catalogSub, self).__init__(uniqueElementName, valueOf_, )
supermod.catalog.subclass = catalogSub
# end class catalogSub


class entrySub(supermod.entry):
    def __init__(self, uniqueElementName=None, valueOf_=None):
        super(entrySub, self).__init__(uniqueElementName, valueOf_, )
supermod.entry.subclass = entrySub
# end class entrySub


class titleSub(supermod.title):
    def __init__(self, string=None, uniqueElementName=None):
        super(titleSub, self).__init__(string, uniqueElementName, )
supermod.title.subclass = titleSub
# end class titleSub


class languageSub(supermod.language):
    def __init__(self, valueOf_=None):
        super(languageSub, self).__init__(valueOf_, )
supermod.language.subclass = languageSub
# end class languageSub


class keywordSub(supermod.keyword):
    def __init__(self, string=None):
        super(keywordSub, self).__init__(string, )
supermod.keyword.subclass = keywordSub
# end class keywordSub


class coverageSub(supermod.coverage):
    def __init__(self, string=None):
        super(coverageSub, self).__init__(string, )
supermod.coverage.subclass = coverageSub
# end class coverageSub


class lifeCycleSub(supermod.lifeCycle):
    def __init__(self, uniqueElementName=None, version=None, status=None, contribute=None):
        super(lifeCycleSub, self).__init__(uniqueElementName, version, status, contribute, )
supermod.lifeCycle.subclass = lifeCycleSub
# end class lifeCycleSub


class versionSub(supermod.version):
    def __init__(self, string=None, uniqueElementName=None):
        super(versionSub, self).__init__(string, uniqueElementName, )
supermod.version.subclass = versionSub
# end class versionSub


class contributeSub(supermod.contribute):
    def __init__(self, role=None, entity=None, date=None):
        super(contributeSub, self).__init__(role, entity, date, )
supermod.contribute.subclass = contributeSub
# end class contributeSub


class dateSub(supermod.date):
    def __init__(self, dateTime=None, description=None, uniqueElementName=None, valueOf_=None):
        super(dateSub, self).__init__(dateTime, description, uniqueElementName, )
supermod.date.subclass = dateSub
# end class dateSub


class metaMetadataSub(supermod.metaMetadata):
    def __init__(self, uniqueElementName=None, identifier=None, contribute=None, metadataSchema=None, language=None):
        super(metaMetadataSub, self).__init__(uniqueElementName, identifier, contribute, metadataSchema, language, )
supermod.metaMetadata.subclass = metaMetadataSub
# end class metaMetadataSub


class contributeMetaSub(supermod.contributeMeta):
    def __init__(self, role=None, entity=None, date=None):
        super(contributeMetaSub, self).__init__(role, entity, date, )
supermod.contributeMeta.subclass = contributeMetaSub
# end class contributeMetaSub


class metadataSchemaSub(supermod.metadataSchema):
    def __init__(self, valueOf_=None):
        super(metadataSchemaSub, self).__init__(valueOf_, )
supermod.metadataSchema.subclass = metadataSchemaSub
# end class metadataSchemaSub


class technicalSub(supermod.technical):
    def __init__(self, uniqueElementName=None, format=None, size=None, location=None, requirement=None, installationRemarks=None, otherPlatformRequirements=None, duration=None):
        super(technicalSub, self).__init__(uniqueElementName, format, size, location, requirement, installationRemarks, otherPlatformRequirements, duration, )
supermod.technical.subclass = technicalSub
# end class technicalSub


class formatSub(supermod.format):
    def __init__(self, valueOf_=None):
        super(formatSub, self).__init__(valueOf_, )
supermod.format.subclass = formatSub
# end class formatSub


class sizeSub(supermod.size):
    def __init__(self, uniqueElementName=None, valueOf_=None):
        super(sizeSub, self).__init__(uniqueElementName, valueOf_, )
supermod.size.subclass = sizeSub
# end class sizeSub


class locationSub(supermod.location):
    def __init__(self, valueOf_=None):
        super(locationSub, self).__init__(valueOf_, )
supermod.location.subclass = locationSub
# end class locationSub


class requirementSub(supermod.requirement):
    def __init__(self, orComposite=None):
        super(requirementSub, self).__init__(orComposite, )
supermod.requirement.subclass = requirementSub
# end class requirementSub


class orCompositeSub(supermod.orComposite):
    def __init__(self, type_=None, name=None, minimumVersion=None, maximumVersion=None):
        super(orCompositeSub, self).__init__(type_, name, minimumVersion, maximumVersion, )
supermod.orComposite.subclass = orCompositeSub
# end class orCompositeSub


class minimumVersionSub(supermod.minimumVersion):
    def __init__(self, uniqueElementName=None, valueOf_=None):
        super(minimumVersionSub, self).__init__(uniqueElementName, valueOf_, )
supermod.minimumVersion.subclass = minimumVersionSub
# end class minimumVersionSub


class maximumVersionSub(supermod.maximumVersion):
    def __init__(self, uniqueElementName=None, valueOf_=None):
        super(maximumVersionSub, self).__init__(uniqueElementName, valueOf_, )
supermod.maximumVersion.subclass = maximumVersionSub
# end class maximumVersionSub


class installationRemarksSub(supermod.installationRemarks):
    def __init__(self, string=None, uniqueElementName=None):
        super(installationRemarksSub, self).__init__(string, uniqueElementName, )
supermod.installationRemarks.subclass = installationRemarksSub
# end class installationRemarksSub


class otherPlatformRequirementsSub(supermod.otherPlatformRequirements):
    def __init__(self, string=None):
        super(otherPlatformRequirementsSub, self).__init__(string, )
supermod.otherPlatformRequirements.subclass = otherPlatformRequirementsSub
# end class otherPlatformRequirementsSub


class durationSub(supermod.duration):
    def __init__(self, duration=None, description=None, uniqueElementName=None, valueOf_=None):
        super(durationSub, self).__init__(duration, description, uniqueElementName, )
supermod.duration.subclass = durationSub
# end class durationSub


class educationalSub(supermod.educational):
    def __init__(self, interactivityType=None, learningResourceType=None, interactivityLevel=None, semanticDensity=None, intendedEndUserRole=None, context=None, typicalAgeRange=None, difficulty=None, typicalLearningTime=None, description=None, language=None, cognitiveProcess=None):
        super(educationalSub, self).__init__(interactivityType, learningResourceType, interactivityLevel, semanticDensity, intendedEndUserRole, context, typicalAgeRange, difficulty, typicalLearningTime, description, language, cognitiveProcess, )
supermod.educational.subclass = educationalSub
# end class educationalSub


class typicalAgeRangeSub(supermod.typicalAgeRange):
    def __init__(self, string=None):
        super(typicalAgeRangeSub, self).__init__(string, )
supermod.typicalAgeRange.subclass = typicalAgeRangeSub
# end class typicalAgeRangeSub


class typicalLearningTimeSub(supermod.typicalLearningTime):
    def __init__(self, duration=None, description=None, uniqueElementName=None):
        super(typicalLearningTimeSub, self).__init__(duration, description, uniqueElementName, )
supermod.typicalLearningTime.subclass = typicalLearningTimeSub
# end class typicalLearningTimeSub


class rightsSub(supermod.rights):
    def __init__(self, uniqueElementName=None, cost=None, copyrightAndOtherRestrictions=None, description=None, access=None):
        super(rightsSub, self).__init__(uniqueElementName, cost, copyrightAndOtherRestrictions, description, access, )
supermod.rights.subclass = rightsSub
# end class rightsSub


class descriptionSub(supermod.description):
    def __init__(self, string=None):
        super(descriptionSub, self).__init__(string, )
supermod.description.subclass = descriptionSub
# end class descriptionSub


class accessSub(supermod.access):
    def __init__(self, uniqueElementName=None, accessType=None, description=None):
        super(accessSub, self).__init__(uniqueElementName, accessType, description, )
supermod.access.subclass = accessSub
# end class accessSub


class relationSub(supermod.relation):
    def __init__(self, kind=None, resource=None):
        super(relationSub, self).__init__(kind, resource, )
supermod.relation.subclass = relationSub
# end class relationSub


class resourceSub(supermod.resource):
    def __init__(self, uniqueElementName=None, identifier=None, description=None):
        super(resourceSub, self).__init__(uniqueElementName, identifier, description, )
supermod.resource.subclass = resourceSub
# end class resourceSub


class annotationSub(supermod.annotation):
    def __init__(self, entity=None, date=None, description=None):
        super(annotationSub, self).__init__(entity, date, description, )
supermod.annotation.subclass = annotationSub
# end class annotationSub


class entitySub(supermod.entity):
    def __init__(self, valueOf_=None):
        super(entitySub, self).__init__(valueOf_, )
supermod.entity.subclass = entitySub
# end class entitySub


class classificationSub(supermod.classification):
    def __init__(self, purpose=None, taxonPath=None, description=None, keyword=None):
        super(classificationSub, self).__init__(purpose, taxonPath, description, keyword, )
supermod.classification.subclass = classificationSub
# end class classificationSub


class taxonPathSub(supermod.taxonPath):
    def __init__(self, source=None, taxon=None):
        super(taxonPathSub, self).__init__(source, taxon, )
supermod.taxonPath.subclass = taxonPathSub
# end class taxonPathSub


class sourceSub(supermod.source):
    def __init__(self, string=None, uniqueElementName=None, extensiontype_=None):
        super(sourceSub, self).__init__(string, uniqueElementName, extensiontype_, )
supermod.source.subclass = sourceSub
# end class sourceSub


class taxonSub(supermod.taxon):
    def __init__(self, id=None, entry=None):
        super(taxonSub, self).__init__(id, entry, )
supermod.taxon.subclass = taxonSub
# end class taxonSub


class idSub(supermod.id):
    def __init__(self, uniqueElementName=None, valueOf_=None):
        super(idSub, self).__init__(uniqueElementName, valueOf_, )
supermod.id.subclass = idSub
# end class idSub


class entryTaxonSub(supermod.entryTaxon):
    def __init__(self, string=None, uniqueElementName=None):
        super(entryTaxonSub, self).__init__(string, uniqueElementName, )
supermod.entryTaxon.subclass = entryTaxonSub
# end class entryTaxonSub


class sourceValueSub(supermod.sourceValue):
    def __init__(self, string=None, uniqueElementName=None, valueOf_=None):
        super(sourceValueSub, self).__init__(string, uniqueElementName, valueOf_, )
supermod.sourceValue.subclass = sourceValueSub
# end class sourceValueSub


class structureVocabSub(supermod.structureVocab):
    def __init__(self, source=None, value=None, extensiontype_=None):
        super(structureVocabSub, self).__init__(source, value, extensiontype_, )
supermod.structureVocab.subclass = structureVocabSub
# end class structureVocabSub


class aggregationLevelVocabSub(supermod.aggregationLevelVocab):
    def __init__(self, source=None, value=None, extensiontype_=None):
        super(aggregationLevelVocabSub, self).__init__(source, value, extensiontype_, )
supermod.aggregationLevelVocab.subclass = aggregationLevelVocabSub
# end class aggregationLevelVocabSub


class statusVocabSub(supermod.statusVocab):
    def __init__(self, source=None, value=None, extensiontype_=None):
        super(statusVocabSub, self).__init__(source, value, extensiontype_, )
supermod.statusVocab.subclass = statusVocabSub
# end class statusVocabSub


class roleVocabSub(supermod.roleVocab):
    def __init__(self, source=None, value=None, extensiontype_=None):
        super(roleVocabSub, self).__init__(source, value, extensiontype_, )
supermod.roleVocab.subclass = roleVocabSub
# end class roleVocabSub


class roleMetaVocabSub(supermod.roleMetaVocab):
    def __init__(self, source=None, value=None, extensiontype_=None):
        super(roleMetaVocabSub, self).__init__(source, value, extensiontype_, )
supermod.roleMetaVocab.subclass = roleMetaVocabSub
# end class roleMetaVocabSub


class typeVocabSub(supermod.typeVocab):
    def __init__(self, source=None, value=None, extensiontype_=None):
        super(typeVocabSub, self).__init__(source, value, extensiontype_, )
supermod.typeVocab.subclass = typeVocabSub
# end class typeVocabSub


class nameVocabSub(supermod.nameVocab):
    def __init__(self, source=None, value=None, extensiontype_=None):
        super(nameVocabSub, self).__init__(source, value, extensiontype_, )
supermod.nameVocab.subclass = nameVocabSub
# end class nameVocabSub


class interactivityTypeVocabSub(supermod.interactivityTypeVocab):
    def __init__(self, source=None, value=None, extensiontype_=None):
        super(interactivityTypeVocabSub, self).__init__(source, value, extensiontype_, )
supermod.interactivityTypeVocab.subclass = interactivityTypeVocabSub
# end class interactivityTypeVocabSub


class learningResourceTypeVocabSub(supermod.learningResourceTypeVocab):
    def __init__(self, source=None, value=None, extensiontype_=None):
        super(learningResourceTypeVocabSub, self).__init__(source, value, extensiontype_, )
supermod.learningResourceTypeVocab.subclass = learningResourceTypeVocabSub
# end class learningResourceTypeVocabSub


class interactivityLevelVocabSub(supermod.interactivityLevelVocab):
    def __init__(self, source=None, value=None, extensiontype_=None):
        super(interactivityLevelVocabSub, self).__init__(source, value, extensiontype_, )
supermod.interactivityLevelVocab.subclass = interactivityLevelVocabSub
# end class interactivityLevelVocabSub


class semanticDensityVocabSub(supermod.semanticDensityVocab):
    def __init__(self, source=None, value=None, extensiontype_=None):
        super(semanticDensityVocabSub, self).__init__(source, value, extensiontype_, )
supermod.semanticDensityVocab.subclass = semanticDensityVocabSub
# end class semanticDensityVocabSub


class intendedEndUserRoleVocabSub(supermod.intendedEndUserRoleVocab):
    def __init__(self, source=None, value=None, extensiontype_=None):
        super(intendedEndUserRoleVocabSub, self).__init__(source, value, extensiontype_, )
supermod.intendedEndUserRoleVocab.subclass = intendedEndUserRoleVocabSub
# end class intendedEndUserRoleVocabSub


class contextVocabSub(supermod.contextVocab):
    def __init__(self, source=None, value=None, extensiontype_=None):
        super(contextVocabSub, self).__init__(source, value, extensiontype_, )
supermod.contextVocab.subclass = contextVocabSub
# end class contextVocabSub


class difficultyVocabSub(supermod.difficultyVocab):
    def __init__(self, source=None, value=None, extensiontype_=None):
        super(difficultyVocabSub, self).__init__(source, value, extensiontype_, )
supermod.difficultyVocab.subclass = difficultyVocabSub
# end class difficultyVocabSub


class cognitiveProcessVocabSub(supermod.cognitiveProcessVocab):
    def __init__(self, source=None, value=None, extensiontype_=None):
        super(cognitiveProcessVocabSub, self).__init__(source, value, extensiontype_, )
supermod.cognitiveProcessVocab.subclass = cognitiveProcessVocabSub
# end class cognitiveProcessVocabSub


class costVocabSub(supermod.costVocab):
    def __init__(self, source=None, value=None, extensiontype_=None):
        super(costVocabSub, self).__init__(source, value, extensiontype_, )
supermod.costVocab.subclass = costVocabSub
# end class costVocabSub


class copyrightAndOtherRestrictionsVocabSub(supermod.copyrightAndOtherRestrictionsVocab):
    def __init__(self, source=None, value=None, extensiontype_=None):
        super(copyrightAndOtherRestrictionsVocabSub, self).__init__(source, value, extensiontype_, )
supermod.copyrightAndOtherRestrictionsVocab.subclass = copyrightAndOtherRestrictionsVocabSub
# end class copyrightAndOtherRestrictionsVocabSub


class accessTypeVocabSub(supermod.accessTypeVocab):
    def __init__(self, source=None, value=None, extensiontype_=None):
        super(accessTypeVocabSub, self).__init__(source, value, extensiontype_, )
supermod.accessTypeVocab.subclass = accessTypeVocabSub
# end class accessTypeVocabSub


class kindVocabSub(supermod.kindVocab):
    def __init__(self, source=None, value=None, extensiontype_=None):
        super(kindVocabSub, self).__init__(source, value, extensiontype_, )
supermod.kindVocab.subclass = kindVocabSub
# end class kindVocabSub


class purposeVocabSub(supermod.purposeVocab):
    def __init__(self, source=None, value=None, extensiontype_=None):
        super(purposeVocabSub, self).__init__(source, value, extensiontype_, )
supermod.purposeVocab.subclass = purposeVocabSub
# end class purposeVocabSub


class purposeSub(supermod.purpose):
    def __init__(self, source=None, value=None, uniqueElementName=None, extensiontype_=None):
        super(purposeSub, self).__init__(source, value, uniqueElementName, extensiontype_, )
supermod.purpose.subclass = purposeSub
# end class purposeSub


class kindSub(supermod.kind):
    def __init__(self, source=None, value=None, uniqueElementName=None, extensiontype_=None):
        super(kindSub, self).__init__(source, value, uniqueElementName, extensiontype_, )
supermod.kind.subclass = kindSub
# end class kindSub


class accessTypeSub(supermod.accessType):
    def __init__(self, source=None, value=None, uniqueElementName=None, extensiontype_=None):
        super(accessTypeSub, self).__init__(source, value, uniqueElementName, extensiontype_, )
supermod.accessType.subclass = accessTypeSub
# end class accessTypeSub


class copyrightAndOtherRestrictionsSub(supermod.copyrightAndOtherRestrictions):
    def __init__(self, source=None, value=None, uniqueElementName=None, extensiontype_=None):
        super(copyrightAndOtherRestrictionsSub, self).__init__(source, value, uniqueElementName, extensiontype_, )
supermod.copyrightAndOtherRestrictions.subclass = copyrightAndOtherRestrictionsSub
# end class copyrightAndOtherRestrictionsSub


class costSub(supermod.cost):
    def __init__(self, source=None, value=None, uniqueElementName=None, extensiontype_=None):
        super(costSub, self).__init__(source, value, uniqueElementName, extensiontype_, )
supermod.cost.subclass = costSub
# end class costSub


class cognitiveProcessSub(supermod.cognitiveProcess):
    def __init__(self, source=None, value=None, uniqueElementName=None, extensiontype_=None):
        super(cognitiveProcessSub, self).__init__(source, value, uniqueElementName, extensiontype_, )
supermod.cognitiveProcess.subclass = cognitiveProcessSub
# end class cognitiveProcessSub


class difficultySub(supermod.difficulty):
    def __init__(self, source=None, value=None, uniqueElementName=None, extensiontype_=None):
        super(difficultySub, self).__init__(source, value, uniqueElementName, extensiontype_, )
supermod.difficulty.subclass = difficultySub
# end class difficultySub


class contextSub(supermod.context):
    def __init__(self, source=None, value=None, extensiontype_=None):
        super(contextSub, self).__init__(source, value, extensiontype_, )
supermod.context.subclass = contextSub
# end class contextSub


class intendedEndUserRoleSub(supermod.intendedEndUserRole):
    def __init__(self, source=None, value=None, extensiontype_=None):
        super(intendedEndUserRoleSub, self).__init__(source, value, extensiontype_, )
supermod.intendedEndUserRole.subclass = intendedEndUserRoleSub
# end class intendedEndUserRoleSub


class semanticDensitySub(supermod.semanticDensity):
    def __init__(self, source=None, value=None, uniqueElementName=None, extensiontype_=None):
        super(semanticDensitySub, self).__init__(source, value, uniqueElementName, extensiontype_, )
supermod.semanticDensity.subclass = semanticDensitySub
# end class semanticDensitySub


class interactivityLevelSub(supermod.interactivityLevel):
    def __init__(self, source=None, value=None, uniqueElementName=None, extensiontype_=None):
        super(interactivityLevelSub, self).__init__(source, value, uniqueElementName, extensiontype_, )
supermod.interactivityLevel.subclass = interactivityLevelSub
# end class interactivityLevelSub


class learningResourceTypeSub(supermod.learningResourceType):
    def __init__(self, source=None, value=None, extensiontype_=None):
        super(learningResourceTypeSub, self).__init__(source, value, extensiontype_, )
supermod.learningResourceType.subclass = learningResourceTypeSub
# end class learningResourceTypeSub


class interactivityTypeSub(supermod.interactivityType):
    def __init__(self, source=None, value=None, uniqueElementName=None, extensiontype_=None):
        super(interactivityTypeSub, self).__init__(source, value, uniqueElementName, extensiontype_, )
supermod.interactivityType.subclass = interactivityTypeSub
# end class interactivityTypeSub


class nameSub(supermod.name):
    def __init__(self, source=None, value=None, uniqueElementName=None, extensiontype_=None):
        super(nameSub, self).__init__(source, value, uniqueElementName, extensiontype_, )
supermod.name.subclass = nameSub
# end class nameSub


class type_Sub(supermod.type_):
    def __init__(self, source=None, value=None, uniqueElementName=None, extensiontype_=None):
        super(type_Sub, self).__init__(source, value, uniqueElementName, extensiontype_, )
supermod.type_.subclass = type_Sub
# end class type_Sub


class roleMetaSub(supermod.roleMeta):
    def __init__(self, source=None, value=None, uniqueElementName=None, extensiontype_=None):
        super(roleMetaSub, self).__init__(source, value, uniqueElementName, extensiontype_, )
supermod.roleMeta.subclass = roleMetaSub
# end class roleMetaSub


class roleSub(supermod.role):
    def __init__(self, source=None, value=None, uniqueElementName=None, extensiontype_=None):
        super(roleSub, self).__init__(source, value, uniqueElementName, extensiontype_, )
supermod.role.subclass = roleSub
# end class roleSub


class statusSub(supermod.status):
    def __init__(self, source=None, value=None, uniqueElementName=None, extensiontype_=None):
        super(statusSub, self).__init__(source, value, uniqueElementName, extensiontype_, )
supermod.status.subclass = statusSub
# end class statusSub


class aggregationLevelSub(supermod.aggregationLevel):
    def __init__(self, source=None, value=None, uniqueElementName=None, extensiontype_=None):
        super(aggregationLevelSub, self).__init__(source, value, uniqueElementName, extensiontype_, )
supermod.aggregationLevel.subclass = aggregationLevelSub
# end class aggregationLevelSub


class structureSub(supermod.structure):
    def __init__(self, source=None, value=None, uniqueElementName=None, extensiontype_=None):
        super(structureSub, self).__init__(source, value, uniqueElementName, extensiontype_, )
supermod.structure.subclass = structureSub
# end class structureSub


class purposeValueSub(supermod.purposeValue):
    def __init__(self, source=None, value=None, uniqueElementName=None, valueOf_=None):
        super(purposeValueSub, self).__init__(source, value, uniqueElementName, valueOf_, )
supermod.purposeValue.subclass = purposeValueSub
# end class purposeValueSub


class kindValueSub(supermod.kindValue):
    def __init__(self, source=None, value=None, uniqueElementName=None, valueOf_=None):
        super(kindValueSub, self).__init__(source, value, uniqueElementName, valueOf_, )
supermod.kindValue.subclass = kindValueSub
# end class kindValueSub


class accessTypeValueSub(supermod.accessTypeValue):
    def __init__(self, source=None, value=None, uniqueElementName=None, valueOf_=None):
        super(accessTypeValueSub, self).__init__(source, value, uniqueElementName, valueOf_, )
supermod.accessTypeValue.subclass = accessTypeValueSub
# end class accessTypeValueSub


class copyrightAndOtherRestrictionsValueSub(supermod.copyrightAndOtherRestrictionsValue):
    def __init__(self, source=None, value=None, uniqueElementName=None, valueOf_=None):
        super(copyrightAndOtherRestrictionsValueSub, self).__init__(source, value, uniqueElementName, valueOf_, )
supermod.copyrightAndOtherRestrictionsValue.subclass = copyrightAndOtherRestrictionsValueSub
# end class copyrightAndOtherRestrictionsValueSub


class costValueSub(supermod.costValue):
    def __init__(self, source=None, value=None, uniqueElementName=None, valueOf_=None):
        super(costValueSub, self).__init__(source, value, uniqueElementName, valueOf_, )
supermod.costValue.subclass = costValueSub
# end class costValueSub


class cognitiveProcessValueSub(supermod.cognitiveProcessValue):
    def __init__(self, source=None, value=None, uniqueElementName=None, valueOf_=None):
        super(cognitiveProcessValueSub, self).__init__(source, value, uniqueElementName, valueOf_, )
supermod.cognitiveProcessValue.subclass = cognitiveProcessValueSub
# end class cognitiveProcessValueSub


class difficultyValueSub(supermod.difficultyValue):
    def __init__(self, source=None, value=None, uniqueElementName=None, valueOf_=None):
        super(difficultyValueSub, self).__init__(source, value, uniqueElementName, valueOf_, )
supermod.difficultyValue.subclass = difficultyValueSub
# end class difficultyValueSub


class contextValueSub(supermod.contextValue):
    def __init__(self, source=None, value=None, uniqueElementName=None, valueOf_=None):
        super(contextValueSub, self).__init__(source, value, uniqueElementName, valueOf_, )
supermod.contextValue.subclass = contextValueSub
# end class contextValueSub


class intendedEndUserRoleValueSub(supermod.intendedEndUserRoleValue):
    def __init__(self, source=None, value=None, uniqueElementName=None, valueOf_=None):
        super(intendedEndUserRoleValueSub, self).__init__(source, value, uniqueElementName, valueOf_, )
supermod.intendedEndUserRoleValue.subclass = intendedEndUserRoleValueSub
# end class intendedEndUserRoleValueSub


class semanticDensityValueSub(supermod.semanticDensityValue):
    def __init__(self, source=None, value=None, uniqueElementName=None, valueOf_=None):
        super(semanticDensityValueSub, self).__init__(source, value, uniqueElementName, valueOf_, )
supermod.semanticDensityValue.subclass = semanticDensityValueSub
# end class semanticDensityValueSub


class interactivityLevelValueSub(supermod.interactivityLevelValue):
    def __init__(self, source=None, value=None, uniqueElementName=None, valueOf_=None):
        super(interactivityLevelValueSub, self).__init__(source, value, uniqueElementName, valueOf_, )
supermod.interactivityLevelValue.subclass = interactivityLevelValueSub
# end class interactivityLevelValueSub


class learningResourceTypeValueSub(supermod.learningResourceTypeValue):
    def __init__(self, source=None, value=None, uniqueElementName=None, valueOf_=None):
        super(learningResourceTypeValueSub, self).__init__(source, value, uniqueElementName, valueOf_, )
supermod.learningResourceTypeValue.subclass = learningResourceTypeValueSub
# end class learningResourceTypeValueSub


class interactivityTypeValueSub(supermod.interactivityTypeValue):
    def __init__(self, source=None, value=None, uniqueElementName=None, valueOf_=None):
        super(interactivityTypeValueSub, self).__init__(source, value, uniqueElementName, valueOf_, )
supermod.interactivityTypeValue.subclass = interactivityTypeValueSub
# end class interactivityTypeValueSub


class nameValueSub(supermod.nameValue):
    def __init__(self, source=None, value=None, uniqueElementName=None, valueOf_=None):
        super(nameValueSub, self).__init__(source, value, uniqueElementName, valueOf_, )
supermod.nameValue.subclass = nameValueSub
# end class nameValueSub


class typeValueSub(supermod.typeValue):
    def __init__(self, source=None, value=None, uniqueElementName=None, valueOf_=None):
        super(typeValueSub, self).__init__(source, value, uniqueElementName, valueOf_, )
supermod.typeValue.subclass = typeValueSub
# end class typeValueSub


class roleMetaValueSub(supermod.roleMetaValue):
    def __init__(self, source=None, value=None, uniqueElementName=None, valueOf_=None):
        super(roleMetaValueSub, self).__init__(source, value, uniqueElementName, valueOf_, )
supermod.roleMetaValue.subclass = roleMetaValueSub
# end class roleMetaValueSub


class roleValueSub(supermod.roleValue):
    def __init__(self, source=None, value=None, uniqueElementName=None, valueOf_=None):
        super(roleValueSub, self).__init__(source, value, uniqueElementName, valueOf_, )
supermod.roleValue.subclass = roleValueSub
# end class roleValueSub


class statusValueSub(supermod.statusValue):
    def __init__(self, source=None, value=None, uniqueElementName=None, valueOf_=None):
        super(statusValueSub, self).__init__(source, value, uniqueElementName, valueOf_, )
supermod.statusValue.subclass = statusValueSub
# end class statusValueSub


class aggregationLevelValueSub(supermod.aggregationLevelValue):
    def __init__(self, source=None, value=None, uniqueElementName=None, valueOf_=None):
        super(aggregationLevelValueSub, self).__init__(source, value, uniqueElementName, valueOf_, )
supermod.aggregationLevelValue.subclass = aggregationLevelValueSub
# end class aggregationLevelValueSub


class structureValueSub(supermod.structureValue):
    def __init__(self, source=None, value=None, uniqueElementName=None, valueOf_=None):
        super(structureValueSub, self).__init__(source, value, uniqueElementName, valueOf_, )
supermod.structureValue.subclass = structureValueSub
# end class structureValueSub



def get_root_tag(node):
    tag = supermod.Tag_pattern_.match(node.tag).groups()[-1]
    rootClass = None
    rootClass = supermod.GDSClassesMapping.get(tag)
    if rootClass is None and hasattr(supermod, tag):
        rootClass = getattr(supermod, tag)
    return tag, rootClass


def parse(inFilename):
    doc = parsexml_(inFilename)
    rootNode = doc.getroot()
    rootTag, rootClass = get_root_tag(rootNode)
    if rootClass is None:
        rootTag = 'LanguageId'
        rootClass = supermod.lom
    rootObj = rootClass.factory()
    rootObj.build(rootNode)
    # Enable Python to collect the space used by the DOM.
    doc = None
#    sys.stdout.write('<?xml version="1.0" ?>\n')
#    rootObj.export(sys.stdout, 0, name_=rootTag,
#        namespacedef_='',
#        pretty_print=True)
    return rootObj


def parseEtree(inFilename):
    doc = parsexml_(inFilename)
    rootNode = doc.getroot()
    rootTag, rootClass = get_root_tag(rootNode)
    if rootClass is None:
        rootTag = 'LanguageId'
        rootClass = supermod.lom
    rootObj = rootClass.factory()
    rootObj.build(rootNode)
    # Enable Python to collect the space used by the DOM.
    doc = None
    rootElement = rootObj.to_etree(None, name_=rootTag)
    content = etree_.tostring(rootElement, pretty_print=True,
        xml_declaration=True, encoding="utf-8")
    sys.stdout.write(content)
    sys.stdout.write('\n')
    return rootObj, rootElement


def parseString(inString):
    from StringIO import StringIO
    doc = parsexml_(StringIO(inString))
    rootNode = doc.getroot()
    rootTag, rootClass = get_root_tag(rootNode)
    if rootClass is None:
        rootTag = 'LanguageId'
        rootClass = supermod.lom
    rootObj = rootClass.factory()
    rootObj.build(rootNode)
    # Enable Python to collect the space used by the DOM.
    doc = None
    sys.stdout.write('<?xml version="1.0" ?>\n')
    rootObj.export(sys.stdout, 0, name_=rootTag,
        namespacedef_='')
    return rootObj


def parseLiteral(inFilename):
    doc = parsexml_(inFilename)
    rootNode = doc.getroot()
    rootTag, rootClass = get_root_tag(rootNode)
    if rootClass is None:
        rootTag = 'LanguageId'
        rootClass = supermod.lom
    rootObj = rootClass.factory()
    rootObj.build(rootNode)
    # Enable Python to collect the space used by the DOM.
    doc = None
    sys.stdout.write('#from ??? import *\n\n')
    sys.stdout.write('import ??? as model_\n\n')
    sys.stdout.write('rootObj = model_.LanguageId(\n')
    rootObj.exportLiteral(sys.stdout, 0, name_="LanguageId")
    sys.stdout.write(')\n')
    return rootObj


USAGE_TEXT = """
Usage: python ???.py <infilename>
"""

def usage():
    print USAGE_TEXT
    sys.exit(1)


def main():
    args = sys.argv[1:]
    if len(args) != 1:
        usage()
    infilename = args[0]
    root = parse(infilename)


if __name__ == '__main__':
    #import pdb; pdb.set_trace()
    main()


