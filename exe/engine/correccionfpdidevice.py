#!/usr/bin/python
# -*- coding: utf-8 -*-
# ===========================================================================
# iDevice Correccion creado para la FPD por José Ramón Jiménez Reyes
# ===========================================================================
"""
Correccion iDevice
"""

import logging
from exe.engine.idevice   import Idevice
from exe.engine.translate import lateTranslate
from exe.engine.field     import TextAreaField
import re
log = logging.getLogger(__name__)

# ===========================================================================
class CorreccionfpdIdevice(Idevice):
    """
    El iDevice Correccion permite resaltar texto para llamar la atención del alumnado
    """
    persistenceVersion = 7
    
    def __init__(self, activity = "", answer = ""):
        """
        Initialize 
        """
        Idevice.__init__(self, 
                         _(u"FPD - Correccion"),
                         _(u"Jose Ramon Jimenez Reyes"), 
                         _(u"""Correccion es un iDevice que permite resaltar texto para hacer correcciones a los autores."""), u"", u"correccionfpd")
        self.emphasis         = Idevice.NoEmphasis
        self._activityInstruc = _(u"""Introduce el texto que aparecer&aacute; en este iDevice""")
        self.systemResources += ["common.js"]
        
        self.activityTextArea = TextAreaField(_(u'Texto Correci&oacute;n:'), 
                                    self._activityInstruc, activity)
        self.activityTextArea.idevice = self

    # Properties
    activityInstruc = lateTranslate('activityInstruc')

    def getResourcesField(self, this_resource):
        """
        implement the specific resource finding mechanism for this iDevice:
        """ 
        # be warned that before upgrading, this iDevice field could not exist:
        if hasattr(self, 'activityTextArea')\
        and hasattr(self.activityTextArea, 'images'):
            for this_image in self.activityTextArea.images: 
                if hasattr(this_image, '_imageResource') \
                    and this_resource == this_image._imageResource: 
                        return self.activityTextArea

        return None

    def getRichTextFields(self):
        fields_list = []
        if hasattr(self, 'activityTextArea'):
            fields_list.append(self.activityTextArea)

        return fields_list

    def burstHTML(self, i):
        # Parasabermasfpd Idevice:
        title = i.find(name='span', attrs={'class' : 'iDeviceTitle' })
        self.title = title.renderContents().decode('utf-8')

        reflections = i.findAll(name='div', attrs={'id' : re.compile('^ta') })
        # should be exactly two of these:
        # 1st = field[0] == Activity
        if len(reflections) >= 1:
            self.activityTextArea.content_wo_resourcePaths = \
                    reflections[0].renderContents().decode('utf-8')
            # and add the LOCAL resource paths back in:
            self.activityTextArea.content_w_resourcePaths = \
                    self.activityTextArea.MassageResourceDirsIntoContent( \
                        self.activityTextArea.content_wo_resourcePaths)
            self.activityTextArea.content = \
                    self.activityTextArea.content_w_resourcePaths

    def upgradeToVersion1(self):
        """
        Upgrades the node from version 0 to 1.
        """
        log.debug(u"Upgrading iDevice")
        self.icon       = u"correccionfpd"


    def upgradeToVersion2(self):
        """
        Upgrades the node from 1 (v0.5) to 2 (v0.6).
        Old packages will loose their icons, but they will load.
        """
        log.debug(u"Upgrading iDevice")
        self.emphasis = Idevice.NoEmphasis

        
    def upgradeToVersion3(self):
        """
        Upgrades v0.6 to v0.7.
        """
        self.lastIdevice = False


    def upgradeToVersion4(self):
        """
        Upgrades to exe v0.10
        """
        self._upgradeIdeviceToVersion1()
        self._activityInstruc = self.__dict__['activityInstruc']

    def upgradeToVersion5(self):
        """
        Upgrades to exe v0.10
        """
        self._upgradeIdeviceToVersion1()


    def upgradeToVersion6(self):
        """
        Upgrades to v0.12
        """
        self._upgradeIdeviceToVersion2()
        self.systemResources += ["common.js"]


    def upgradeToVersion7(self):
        """ 
        Upgrades to somewhere before version 0.25 (post-v0.24) 
        Taking the old unicode string fields, and converting them 
        into image-enabled TextAreaFields:
        """
        self.activityTextArea = TextAreaField(_(u'Texto Destacado:'), 
                                    self._activityInstruc, self.activity)
        self.activityTextArea.idevice = self
# ===========================================================================
