#!/usr/bin/python
# -*- coding: utf-8 -*-
# ===========================================================================
# iDevice Caso práctico creado para la FPD por José Ramón Jiménez Reyes
# ===========================================================================
"""
FPD - Situation
Caso practico mas iDevice
"""

import logging
from exe.engine.idevice   import Idevice
from exe.engine.translate import lateTranslate
from exe.engine.field     import TextAreaField
import re
log = logging.getLogger(__name__)

# ===========================================================================
class CasopracticofpdIdevice(Idevice):
    """
    El iDevice Caso practico permite al alumnado introducirse en una historia que le guiara a traves de su aprendizaje
    """
    persistenceVersion = 8
    
    def __init__(self, activity = "", answer = ""):
        """
        Initialize 
        """
        Idevice.__init__(self, 
                         x_(u"FPD - Situation"),
                         x_(u"Jose Ramon Jimenez Reyes"), 
                         x_(u"""Situation is an iDevice that provides the student with a story that will guide her along the learning process."""), u"", u"casopracticofpd")
#        self.emphasis         = Idevice.SomeEmphasis
        self.emphasis         = "_casopracticofpd"
        self._activityInstruc = x_(u"""Enter the text that will appear on this iDevice""")
#        self.systemResources += ["common.js"]
        
        self.activityTextArea = TextAreaField(x_(u'Situation Text:'), 
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
        # Casopracticofpd Idevice:
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
        self.icon       = u"casopracticofpd"


    def upgradeToVersion2(self):
        """
        Upgrades the node from 1 (v0.5) to 2 (v0.6).
        Old packages will loose their icons, but they will load.
        """
        log.debug(u"Upgrading iDevice")
#        self.emphasis         = Idevice.SomeEmphasis
        self.emphasis         = "_casopracticofpd"
        
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
#        self.systemResources += ["common.js"]


    def upgradeToVersion7(self):
        """ 
        Upgrades to somewhere before version 0.25 (post-v0.24) 
        Taking the old unicode string fields, and converting them 
        into image-enabled TextAreaFields:
        """
        self.activityTextArea = TextAreaField(x_(u'Situation Text:'), 
                                    self._activityInstruc, self.activity)
        self.activityTextArea.idevice = self

    def upgradeToVersion8(self):
        """
        Delete icon from system resources
        """
        self._upgradeIdeviceToVersion3()

# ===========================================================================
