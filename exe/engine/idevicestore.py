#!/usr/bin/env python
#-*- coding: utf-8 -*-
# ===========================================================================
# eXe 
# Copyright 2004-2006, University of Auckland
# Copyright 2004-2008 eXe Project, http://eXeLearning.org/
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
The collection of iDevices available
"""

from exe.engine         import persist
from exe.engine.idevice import Idevice
from exe.engine.field   import TextAreaField, FeedbackField
from nevow.flat         import flatten

import imp
import sys
import logging
import copy

log = logging.getLogger(__name__)

# ===========================================================================
class IdeviceStore:
    """
    The collection of iDevices available
    """
    def __init__(self, config):
        """
        Initialize
        """
        self._nextIdeviceId = 0
        self.config         = config
        self.extended       = []
        self.generic        = []
        self.listeners      = []
        # JRJ: Añado una lista que contendrá todos los iDevices disponibles
        # (addition of a list that will contain all the idevices available)
        self.factoryiDevices = []


    def getNewIdeviceId(self):
        """
        Returns an iDevice Id which is unique
        """
        id_ = unicode(self._nextIdeviceId)
        self._nextIdeviceId += 1
        return id_

    def isGeneric(self, idevice):
        """
        Devuelve True si el iDevice es de la clase GenericIdevie
        (Returns True if the iDEvice is of class GenericIdevie)
        """
        from exe.engine.genericidevice import GenericIdevice
        if isinstance(idevice, GenericIdevice):
            return True
        else:
            return False
        
    def getIdevices(self):
        """
        Get the idevices which are applicable for the current node of
        this package
        In future the idevices which are returned will depend
        upon the pedagogical template we are using
        """
        return self.extended + self.generic
    
    def getFactoryIdevices(self):
        """
        JRJ: Devuelve todos los iDevices de fábrica
        (Returns all the factory iDevices)
        """
        return self.factoryiDevices

    
    def __delGenericIdevice(self, idevice):
        """
        Delete a generic idevice from idevicestore.
        """
        idevice_remove = None
        exist = False
        for i in self.generic:
            if idevice.title == i.title:
                idevice_remove = i
                exist = True
                break
        if exist:
            self.generic.remove(idevice_remove)
            # JRJ: Comunicamos a los listeners que este iDevice ya no está disponible
            # (we tell the listeners that this iDevice is no longer available)
            for listener in self.listeners:
                listener.delIdevice(idevice_remove)

    
    def __delExtendedIdevice(self, idevice):
        """
        Delete an extended idevice from idevicestore.
        """
        idevice_remove = None
        exist = False
        for i in self.extended:
            if idevice.title == i.title:
                idevice_remove = i
                exist = True
                break
        if exist:
            self.extended.remove(idevice_remove)
            # JRJ: Comunicamos a los listeners que este iDevice ya no está disponible
            # (we tell the listeners that this iDevice is no longer available)
            for listener in self.listeners:
                listener.delIdevice(idevice_remove)
            
    def delIdevice(self, idevice):
        """
        JRJ: Borra un idevice
        (Deletes an iDevice)
        """
        if not self.isGeneric(idevice):
            idevice_remove = None
            exist = False
            for i in self.extended:
                if i.title == idevice.title:
                    idevice_remove = i
                    exist = True
                    break
            if exist:
                self.__delExtendedIdevice(idevice_remove)
        else:
            idevice_remove = None
            exist = False
            for i in self.generic:
                if i.title == idevice.title:
                    idevice_remove = i
                    exist = True
                    break
            if exist:
                self.__delGenericIdevice(idevice_remove)
    
    def register(self, listener):
        """
        Register a listener who is interested in changes to the
        IdeviceStore.  
        Created for IdevicePanes, but could be used by other objects
        """
        self.listeners.append(listener)


    def addIdevice(self, idevice):
        """
        Register another iDevice as available
        """
        # JRJ: Comprobamos si el iDevice ya existe y en su caso 
        # igualamos el id, de lo contrario lo añadimos a los de fábrica
        # (we check whether the iDevice already exists, in which
        # case we make the id's equal; otherwise we add it to the
        # factory ones)
        exist = False
        for i in self.getFactoryIdevices():
            if (i.title == idevice.title):
                exist = True
                idevice.id = i.id
                break
        if not exist:
            self.factoryiDevices.append(idevice)  
        if not self.isGeneric(idevice):
            exist = False
            for i in self.extended:
                if i.title == idevice.title:
                    exist = True
            if not exist:
                self.extended.append(idevice)
                idevice.edit = True
                for listener in self.listeners:
                    listener.addIdevice(idevice)
        else:
            exist = False
            for i in self.generic:
                if i.title == idevice.title:
                    exist = True
            if not exist:
                self.generic.append(idevice)
                idevice.edit = True
                for listener in self.listeners:
                    listener.addIdevice(idevice)

    def load(self):
        """
        Load iDevices from the generic iDevices and the extended ones
        """
        log.debug("load iDevices")
        idevicesDir = self.config.configDir / 'idevices'
        if not idevicesDir.exists():
            idevicesDir.mkdir()
        self.__loadExtended()
        self.__loadGeneric()
        for idevice in self.getFactoryIdevices():
            idevice.id = self.getNewIdeviceId()

        for idevice in self.extended:
            for factoryiDevice in self.factoryiDevices:
                if factoryiDevice._title == idevice._title:
                    idevice.id = factoryiDevice.id
                    break

        for idevice in self.generic:
            for factoryiDevice in self.factoryiDevices:
                if factoryiDevice._title == idevice._title:
                    idevice.id = factoryiDevice.id
                    break

        #JRJ: comunicamos a los listeners los iDevices extendidos
        # (we inform the listeners of the extended iDevices)
        for listener in self.listeners:
            for idevice in self.getIdevices():
                listener.addIdevice(idevice)

    def __getIdevicesFPD(self):
        """
        JRJ: Esta función devuelve los iDevices de FPD
        (this function returns the FPD iDevices)
        """
        from exe.engine.reflectionfpdidevice import ReflectionfpdIdevice
        from exe.engine.reflectionfpdmodifidevice import ReflectionfpdmodifIdevice
        from exe.engine.clozefpdidevice import ClozefpdIdevice
        from exe.engine.clozelangfpdidevice import ClozelangfpdIdevice
        from exe.engine.parasabermasfpdidevice import ParasabermasfpdIdevice
        from exe.engine.debesconocerfpdidevice import DebesconocerfpdIdevice
        from exe.engine.citasparapensarfpdidevice import CitasparapensarfpdIdevice
        from exe.engine.recomendacionfpdidevice import RecomendacionfpdIdevice
        from exe.engine.verdaderofalsofpdidevice import VerdaderofalsofpdIdevice
        from exe.engine.seleccionmultiplefpdidevice import SeleccionmultiplefpdIdevice
        from exe.engine.eleccionmultiplefpdidevice import EleccionmultiplefpdIdevice
        from exe.engine.casopracticofpdidevice import CasopracticofpdIdevice
        from exe.engine.ejercicioresueltofpdidevice import EjercicioresueltofpdIdevice
        from exe.engine.destacadofpdidevice import DestacadofpdIdevice 
        from exe.engine.orientacionesalumnadofpdidevice import OrientacionesalumnadofpdIdevice
        from exe.engine.orientacionestutoriafpdidevice import OrientacionestutoriafpdIdevice
        from exe.engine.freetextfpdidevice import FreeTextfpdIdevice
		
        
        idevices_FPD = []
        idevices_FPD.append(ReflectionfpdIdevice())
        idevices_FPD.append(ReflectionfpdmodifIdevice())
        idevices_FPD.append(ClozefpdIdevice())
        idevices_FPD.append(ClozelangfpdIdevice())
        idevices_FPD.append(ParasabermasfpdIdevice())
        idevices_FPD.append(DebesconocerfpdIdevice())
        idevices_FPD.append(CitasparapensarfpdIdevice())
        idevices_FPD.append(RecomendacionfpdIdevice())
        idevices_FPD.append(VerdaderofalsofpdIdevice())
        idevices_FPD.append(SeleccionmultiplefpdIdevice())
        idevices_FPD.append(EleccionmultiplefpdIdevice())
        idevices_FPD.append(CasopracticofpdIdevice())
        idevices_FPD.append(EjercicioresueltofpdIdevice())
        idevices_FPD.append(DestacadofpdIdevice()) 
        #idevices_FPD.append(CorreccionfpdIdevice())
        idevices_FPD.append(OrientacionesalumnadofpdIdevice())
        idevices_FPD.append(OrientacionestutoriafpdIdevice())
        idevices_FPD.append(FreeTextfpdIdevice())
        
        return idevices_FPD


    def __getFactoryExtendediDevices(self):
        """
        JRJ: Carga los iDevices de fábrica
        (loads the factory iDevices)
        """
        from exe.engine.freetextidevice import FreeTextIdevice
        from exe.engine.multimediaidevice import MultimediaIdevice
        from exe.engine.reflectionidevice import ReflectionIdevice
        from exe.engine.casestudyidevice import CasestudyIdevice
        from exe.engine.truefalseidevice import TrueFalseIdevice 
        # converting ImageWithTextIdevice -> FreeTextIdevice:
        #from exe.engine.imagewithtextidevice  import ImageWithTextIdevice
        from exe.engine.wikipediaidevice import WikipediaIdevice
        from exe.engine.attachmentidevice import AttachmentIdevice
        from exe.engine.titleidevice import TitleIdevice
        from exe.engine.galleryidevice import GalleryIdevice
        from exe.engine.clozeidevice import ClozeIdevice 
        #from exe.engine.clozelangidevice          import ClozelangIdevice
        from exe.engine.flashwithtextidevice import FlashWithTextIdevice
        from exe.engine.externalurlidevice import ExternalUrlIdevice
        from exe.engine.imagemagnifieridevice import ImageMagnifierIdevice 
        # converting Maths Idevice -> FreeTextIdevice:
        #from exe.engine.mathidevice           import MathIdevice
        from exe.engine.multichoiceidevice import MultichoiceIdevice
        from exe.engine.rssidevice import RssIdevice
        from exe.engine.multiselectidevice import MultiSelectIdevice
        from exe.engine.appletidevice import AppletIdevice
        from exe.engine.flashmovieidevice import FlashMovieIdevice
        from exe.engine.quiztestidevice import QuizTestIdevice
        from exe.engine.listaidevice import ListaIdevice
        from exe.engine.notaidevice import NotaIdevice
        from exe.engine.sortidevice import SortIdeviceInc
        from exe.engine.hangmanidevice import HangmanIdeviceInc
        from exe.engine.clickinorderidevice import ClickInOrderIdeviceInc
        from exe.engine.memorymatchidevice import MemoryMatchIdeviceInc
        from exe.engine.placetheobjectsidevice import PlaceTheObjectsIdeviceInc
        from exe.engine.fileattachidevice import FileAttachIdeviceInc

        # JRJ
        # Necesarios para la FPD
        # (Necessary for FPD)
        from exe.engine.reflectionfpdidevice import ReflectionfpdIdevice
        from exe.engine.reflectionfpdmodifidevice import ReflectionfpdmodifIdevice
        from exe.engine.clozefpdidevice import ClozefpdIdevice
        from exe.engine.clozelangfpdidevice import ClozelangfpdIdevice
        from exe.engine.parasabermasfpdidevice import ParasabermasfpdIdevice
        from exe.engine.debesconocerfpdidevice import DebesconocerfpdIdevice
        from exe.engine.citasparapensarfpdidevice import CitasparapensarfpdIdevice
        from exe.engine.recomendacionfpdidevice import RecomendacionfpdIdevice
        from exe.engine.verdaderofalsofpdidevice import VerdaderofalsofpdIdevice
        from exe.engine.seleccionmultiplefpdidevice import SeleccionmultiplefpdIdevice
        from exe.engine.eleccionmultiplefpdidevice import EleccionmultiplefpdIdevice
        from exe.engine.casopracticofpdidevice import CasopracticofpdIdevice
        from exe.engine.ejercicioresueltofpdidevice import EjercicioresueltofpdIdevice
        from exe.engine.destacadofpdidevice import DestacadofpdIdevice 
        #from exe.engine.correccionfpdidevice		import CorreccionfpdIdevice
        from exe.engine.orientacionesalumnadofpdidevice import OrientacionesalumnadofpdIdevice
        from exe.engine.orientacionestutoriafpdidevice import OrientacionestutoriafpdIdevice
        from exe.engine.freetextfpdidevice import FreeTextfpdIdevice
        
        
        factoryExtendedIdevices = []
        
        factoryExtendedIdevices.append(SortIdeviceInc())
        factoryExtendedIdevices.append(HangmanIdeviceInc())
        factoryExtendedIdevices.append(ClickInOrderIdeviceInc())
        factoryExtendedIdevices.append(MemoryMatchIdeviceInc())
        factoryExtendedIdevices.append(PlaceTheObjectsIdeviceInc())
        factoryExtendedIdevices.append(FileAttachIdeviceInc())
        
        factoryExtendedIdevices.append(FreeTextIdevice())
        factoryExtendedIdevices.append(MultichoiceIdevice())
        factoryExtendedIdevices.append(ReflectionIdevice())
        factoryExtendedIdevices.append(CasestudyIdevice())
        factoryExtendedIdevices.append(TrueFalseIdevice())
        defaultImage = unicode(self.config.webDir / "images" / "sunflowers.jpg")
        # converting ImageWithTextIdevice -> FreeTextIdevice:
        #factoryExtendedIdevices.append(ImageWithTextIdevice(defaultImage))
        factoryExtendedIdevices.append(ImageMagnifierIdevice(defaultImage))
        defaultImage = unicode(self.config.webDir / "images" / "sunflowers.jpg")
        defaultSite = 'http://%s.wikipedia.org/' % self.config.locale
        factoryExtendedIdevices.append(WikipediaIdevice(defaultSite))
        #JRJ: Eliminamos este iDevice de los extendidos
        # (we eliminate this iDevice from the extended ones)
        #factoryExtendedIdevices.append(AttachmentIdevice())
        factoryExtendedIdevices.append(GalleryIdevice())
        factoryExtendedIdevices.append(ClozeIdevice())
        #factoryExtendedIdevices.append(ClozelangIdevice())
        #JRJ: Eliminamos este iDevices de los extendidos
        # (we eliminate this iDevice from the extended ones)
        #factoryExtendedIdevices.append(FlashWithTextIdevice())
        factoryExtendedIdevices.append(ExternalUrlIdevice()) 
        # converting Maths Idevice -> FreeTextIdevice:
        #factoryExtendedIdevices.append(MathIdevice())
        #JRJ: Eliminamos este iDevices de los extendidos
        # (we eliminate this iDevice from the extended ones)
        #factoryExtendedIdevices.append(MultimediaIdevice())
        factoryExtendedIdevices.append(RssIdevice())
        factoryExtendedIdevices.append(MultiSelectIdevice())
        factoryExtendedIdevices.append(AppletIdevice())
        #JRJ: Eliminamos este iDevices de los extendidos
        # (we eliminate this iDevice from the extended ones)
        #factoryExtendedIdevices.append(FlashMovieIdevice())
        factoryExtendedIdevices.append(QuizTestIdevice())
        factoryExtendedIdevices.append(ListaIdevice())
        factoryExtendedIdevices.append(NotaIdevice())
        # JRJ
        # iDevices para la FPD
        # (iDevices for FPD)
        factoryExtendedIdevices.append(ReflectionfpdIdevice())
        factoryExtendedIdevices.append(ReflectionfpdmodifIdevice())
        factoryExtendedIdevices.append(ClozefpdIdevice())
        factoryExtendedIdevices.append(ClozelangfpdIdevice())
        factoryExtendedIdevices.append(ParasabermasfpdIdevice())
        factoryExtendedIdevices.append(DebesconocerfpdIdevice())
        factoryExtendedIdevices.append(CitasparapensarfpdIdevice())
        factoryExtendedIdevices.append(RecomendacionfpdIdevice())
        factoryExtendedIdevices.append(VerdaderofalsofpdIdevice())
        factoryExtendedIdevices.append(SeleccionmultiplefpdIdevice())
        factoryExtendedIdevices.append(EleccionmultiplefpdIdevice())
        factoryExtendedIdevices.append(CasopracticofpdIdevice())
        factoryExtendedIdevices.append(EjercicioresueltofpdIdevice())
        factoryExtendedIdevices.append(DestacadofpdIdevice()) 
        
        #factoryExtendedIdevices.append(CorreccionfpdIdevice())
        factoryExtendedIdevices.append(OrientacionesalumnadofpdIdevice())
        factoryExtendedIdevices.append(OrientacionestutoriafpdIdevice())
        factoryExtendedIdevices.append(FreeTextfpdIdevice())
        
        return factoryExtendedIdevices
        
    def __loadExtended(self):
        """
        Load the Extended iDevices (iDevices coded in Python)
        JRJ: Modifico esta función para que también cargue los idevices extendidos de fábrica
        (Function modified so it also loads extended factory iDevices)
        """
        self.__loadUserExtended()
        
        #JRJ: Si existe el archivo extended.data cargamos de ahi los iDevices extendidos
        # (if the file extended.data exists, we load there the extended iDevices)
        extendedPath = self.config.configDir/'idevices'/'extended.data'
        log.debug("load extended iDevices from "+extendedPath)
        
        self.factoryiDevices = self.__getFactoryExtendediDevices()

        if extendedPath.exists():
            self.extended = persist.decodeObject(extendedPath.bytes())
            self.__upgradeExtended()
        else:
            self.extended = copy.deepcopy(self.factoryiDevices)
            #self.extended = self.factoryiDevices
            for idevice in self.__getIdevicesFPD():
                self.delIdevice(idevice)

    def __upgradeExtended(self):
        from exe.engine.galleryidevice import GalleryIdevice

        for idevice in self.extended:
            if type(idevice) == GalleryIdevice:
                if hasattr(idevice, 'systemResources'):
                    idevice.systemResources = []
                    break

        for idevice in self.factoryiDevices:
            if 'Toughra' in idevice.author or 'PAIWASTOON' in idevice.author:
                self.addIdevice(idevice)

    def __loadUserExtended(self):
        """
        Load the user-created extended iDevices which are in the idevices
        directory
        """
        idevicePath = self.config.configDir/'idevices'
        log.debug("load extended iDevices from "+idevicePath)
            
        if not idevicePath.exists():
            idevicePath.makedirs()
        sys.path = [idevicePath] + sys.path
        
        # Add to the list of extended idevices
        for path in idevicePath.listdir("*idevice.py"):
            log.debug("loading "+path)
            moduleName = path.basename().splitext()[0]
            module = __import__(moduleName, globals(), locals(), [])
            module.register(self)

        # Register the blocks for rendering the idevices
        for path in idevicePath.listdir("*block.py"):
            log.debug("loading "+path)
            moduleName = path.basename().splitext()[0]
            module = __import__(moduleName, globals(), locals(), [])
            module.register()


    def __loadGeneric(self):
        """
        Load the Generic iDevices from the appdata directory
        """
        #JRJ: Modificamos la lectura para contemplar los genéricos que se muestran y todos los genéricos
        # (Modidy the reading to apply also to the generic shown and all the generic iDevices)
        showgenericPath = self.config.configDir/'idevices'/'showgeneric.data'
        log.debug("load generic iDevices from "+showgenericPath)
        if showgenericPath.exists():
            self.generic = persist.decodeObject(showgenericPath.bytes())
            self.__upgradeGeneric()
            allgenericPath = self.config.configDir/'idevices'/'allgeneric.data'
            if allgenericPath.exists():
                self.factoryiDevices = self.factoryiDevices + persist.decodeObject(allgenericPath.bytes())
            else:
                self.factoryiDevices = self.factoryiDevices + self.generic
        else:
            self.generic = self.__createGeneric()
            self.factoryiDevices = self.factoryiDevices + self.generic
            from exe.engine.listaidevice import ListaIdevice
            self.addIdevice(ListaIdevice())

    def __upgradeGeneric(self):
        """
        Upgrades/removes obsolete generic idevices from before
        """
        # We may have two reading activites,
        # one problably has the wrong title, 
        # the other is redundant
        readingActivitiesFound = 0
        for idevice in self.generic:
            if idevice.class_ == 'reading':
                if readingActivitiesFound == 0:
                    # Rename the first one we find
                    idevice.title = x_(u"Reading Activity")
                    # and also upgrade its feedback field from using a simple
                    # string, to a subclass of TextAreaField.
                    # While this will have been initially handled by the
                    # field itself, and if not, then by the genericidevice's
                    # upgrade path, this is included here as a possibly
                    # painfully redundant safety check due to the extra
                    # special handing of generic idevices w/ generic.dat
                    for field in idevice.fields:
                        if isinstance(field, FeedbackField):
                            # must check for the upgrade manually, since
                            # persistence versions not used here.
                            # (but note that the persistence versioning
                            #  will probably have ALREADY happened anyway!)
                            if not hasattr(field,"content"): 
                                # this FeedbackField has NOT been upgraded:
                                field.content = field.feedback 
                                field.content_w_resourcePaths = field.content
                                field.content_wo_resourcePaths = field.content
                else:
                    # Destroy the second
                    self.generic.remove(idevice)
                readingActivitiesFound += 1
                if readingActivitiesFound == 2:
                    break
        #self.save()

    def __createGeneric(self):
        """
        Create the Generic iDevices which you get for free
        (not created using the iDevice editor, but could have been)
        Called when we can't find 'generic.data', generates an initial set of 
        free/builtin idevices and writes the new 'generic.data' file
        
        JRJ: Modifico este método para que acepte otro parámetro que será la lista 
        en la que añadimos los idevices genéricos
        (Modify this method so it accepts a new parameter, the list
        to which we add the generic iDevices)
        """
        
        idevices = []

        from exe.engine.genericidevice import GenericIdevice

        readingAct = GenericIdevice(x_(u"Reading Activity"), 
                                    u"reading",
                                    x_(u"University of Auckland"), 
                                    x_(u"""<p>The Reading Activity will primarily 
be used to check a learner's comprehension of a given text. This can be done 
by asking the learner to reflect on the reading and respond to questions about 
the reading, or by having them complete some other possibly more physical task 
based on the reading.</p>"""),
                                    x_(u"<p>Teachers should keep the following "
                                        "in mind when using this iDevice: </p>"
                                        "<ol>"
                                        "<li>"
                                        "Think about the number of "
                                        "different types of activity "
                                        "planned for your resource that "
                                        "will be visually signalled in the "
                                        "content. Avoid using too many "
                                        "different types or classification "
                                        "of activities otherwise learner "
                                        "may become confused. Usually three "
                                        "or four different types are more "
                                        "than adequate for a teaching "
                                        "resource."
                                        "</li>"
                                        "<li>"
                                        "From a visual design "
                                        "perspective, avoid having two "
                                        "iDevices immediately following "
                                        "each other without any text in "
                                        "between. If this is required, "
                                        "rather collapse two questions or "
                                        "events into one iDevice. "
                                        "</li>"
                                        "<li>"
                                        "Think "
                                        "about activities where the "
                                        "perceived benefit of doing the "
                                        "activity outweighs the time and "
                                        "effort it will take to complete "
                                        "the activity. "
                                        "</li>"
                                        "</ol>")) 
        readingAct.emphasis = Idevice.SomeEmphasis
        readingAct.addField(TextAreaField(x_(u"What to read"), 
x_(u"""Enter the details of the reading including reference details. The 
referencing style used will depend on the preference of your faculty or 
department.""")))
        readingAct.addField(TextAreaField(x_(u"Activity"), 
x_(u"""Describe the tasks related to the reading learners should undertake. 
This helps demonstrate relevance for learners.""")))

        readingAct.addField(FeedbackField(x_(u"Feedback"), 
x_(u"""Use feedback to provide a summary of the points covered in the reading, 
or as a starting point for further analysis of the reading by posing a question 
or providing a statement to begin a debate.""")))

        idevices.append(readingAct)
    
        objectives = GenericIdevice(x_(u"Objectives"), 
                                    u"objectives",
                                    x_(u"University of Auckland"), 
x_(u"""Objectives describe the expected outcomes of the learning and should
define what the learners will be able to do when they have completed the
learning tasks."""), 
                                    u"")
        objectives.emphasis = Idevice.SomeEmphasis

        objectives.addField(TextAreaField(x_(u"Objectives"),
x_(u"""Type the learning objectives for this resource.""")))
        idevices.append(objectives)

        preknowledge = GenericIdevice(x_(u"Preknowledge"), 
                                      u"preknowledge",
                                      "", 
x_(u"""Prerequisite knowledge refers to the knowledge learners should already
have in order to be able to effectively complete the learning. Examples of
pre-knowledge can be: <ul>
<li>        Learners must have level 4 English </li>
<li>        Learners must be able to assemble standard power tools </li></ul>
"""), u"")
        preknowledge.emphasis = Idevice.SomeEmphasis
        preknowledge.addField(TextAreaField(x_(u"Preknowledge"), 
x_(u"""Describe the prerequisite knowledge learners should have to effectively
complete this learning.""")))
        idevices.append(preknowledge)
        
        activity = GenericIdevice(x_(u"Activity"), 
                                  u"activity",
                                  x_(u"University of Auckland"), 
x_(u"""An activity can be defined as a task or set of tasks a learner must
complete. Provide a clear statement of the task and consider any conditions
that may help or hinder the learner in the performance of the task."""),
u"")
        activity.emphasis = Idevice.SomeEmphasis
        activity.addField(TextAreaField(x_(u"Activity"),
x_(u"""Describe the tasks the learners should complete.""")))
        idevices.append(activity)

        #self.save()
        return idevices


    def __createReading011(self):
        """
        Create the Reading Activity 0.11
        We do this only once when the user first runs eXe 0.11
        """
        from exe.engine.genericidevice import GenericIdevice

        readingAct = GenericIdevice(_(u"Reading Activity 0.11"), 
                                    u"reading",
                                    _(u"University of Auckland"), 
                                    x_(u"""<p>The reading activity, as the name 
suggests, should ask the learner to perform some form of activity. This activity 
should be directly related to the text the learner has been asked to read. 
Feedback to the activity where appropriate, can provide the learner with some 
reflective guidance.</p>"""),
                                    x_(u"Teachers should keep the following "
                                        "in mind when using this iDevice: "
                                        "<ol>"
                                        "<li>"
                                        "Think about the number of "
                                        "different types of activity "
                                        "planned for your resource that "
                                        "will be visually signalled in the "
                                        "content. Avoid using too many "
                                        "different types or classification "
                                        "of activities otherwise learner "
                                        "may become confused. Usually three "
                                        "or four different types are more "
                                        "than adequate for a teaching "
                                        "resource."
                                        "</li>"
                                        "<li>"
                                        "From a visual design "
                                        "perspective, avoid having two "
                                        "iDevices immediately following "
                                        "each other without any text in "
                                        "between. If this is required, "
                                        "rather collapse two questions or "
                                        "events into one iDevice. "
                                        "</li>"
                                        "<li>"
                                        "Think "
                                        "about activities where the "
                                        "perceived benefit of doing the "
                                        "activity outweighs the time and "
                                        "effort it will take to complete "
                                        "the activity. "
                                        "</li>"
                                        "</ol>")) 
        readingAct.emphasis = Idevice.SomeEmphasis
        readingAct.addField(TextAreaField(_(u"What to read"), 
_(u"""Enter the details of the reading including reference details. The 
referencing style used will depend on the preference of your faculty or 
department.""")))
        readingAct.addField(TextAreaField(_(u"Activity"), 
_(u"""Describe the tasks related to the reading learners should undertake. 
This helps demonstrate relevance for learners.""")))

        readingAct.addField(FeedbackField(_(u"Feedback"), 
_(u"""Use feedback to provide a summary of the points covered in the reading, 
or as a starting point for further analysis of the reading by posing a question 
or providing a statement to begin a debate.""")))
    
        objectives = GenericIdevice(_(u"Objectives"), 
                                    u"objectives",
                                    _(u"University of Auckland"), 
_(u"""Objectives describe the expected outcomes of the learning and should
define what the learners will be able to do when they have completed the
learning tasks."""), 
                                    u"")
        objectives.emphasis = Idevice.SomeEmphasis

        objectives.addField(TextAreaField(_(u"Objectives"),
_(u"""Type the learning objectives for this resource.""")))
        self.generic.append(objectives)

        preknowledge = GenericIdevice(_(u"Preknowledge"), 
                                      u"preknowledge",
                                      "", 
_(u"""Prerequisite knowledge refers to the knowledge learners should already
have in order to be able to effectively complete the learning. Examples of
pre-knowledge can be: <ul>
<li>        Learners must have level 4 English </li>
<li>        Learners must be able to assemble standard power tools </li></ul>
"""), u"")
        preknowledge.emphasis = Idevice.SomeEmphasis
        preknowledge.addField(TextAreaField(_(u"Preknowledge"), 
_(u"""Describe the prerequisite knowledge learners should have to effectively
complete this learning.""")))
        self.generic.append(preknowledge)
        
        activity = GenericIdevice(_(u"Activity"), 
                                  u"activity",
                                  _(u"University of Auckland"), 
_(u"""An activity can be defined as a task or set of tasks a learner must
complete. Provide a clear statement of the task and consider any conditions
that may help or hinder the learner in the performance of the task."""),
u"")
        activity.emphasis = Idevice.SomeEmphasis
        activity.addField(TextAreaField(_(u"Activity"),
_(u"""Describe the tasks the learners should complete.""")))
        self.generic.append(activity)

        #self.save()


    def save(self):
        """
        Save the Generic iDevices to the appdata directory
        """
        idevicesDir = self.config.configDir/'idevices'
        if not idevicesDir.exists():
            idevicesDir.mkdir()
        #JRJ: Buscamos los génericos dentro de los de fábrica, 
        # ya que generic solo contiene aquellos genéricos que se muestran
        # (we search the generic inside the factory iDevices,
        # since generic only contains the generic iDevices which are shown)
        allgeneric = []
        for idevice in self.getFactoryIdevices():
            if self.isGeneric(idevice):
                allgeneric.append(idevice)
        fileOut = open(idevicesDir/'allgeneric.data', 'wb')
        fileOut.write(persist.encodeObject(allgeneric))
        fileOut = open(idevicesDir/'showgeneric.data', 'wb')
        fileOut.write(persist.encodeObject(self.generic))
        #JRJ: Guardamos también los iDevices extendidos
        # (we also save the extended iDevices)
        fileOut = open(idevicesDir/'extended.data', 'wb')
        fileOut.write(persist.encodeObject(self.extended))

# ===========================================================================
