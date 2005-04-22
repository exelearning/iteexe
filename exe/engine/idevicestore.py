# ===========================================================================
# eXe 
# Copyright 2004-2005, University of Auckland
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

#from exe.engine.config  import g_config

import logging

log = logging.getLogger(__name__)

# ===========================================================================
class IdeviceStore:
    """
    The collection of iDevices available
    at the moment this class is not being used
    """
    def __init__(self):
        # TODO I originally planned Extended and Generic iDevices to
        # be handled polymorphically, need to reconsider this
        self.extended = []
        self.generic  = []


    def addIdevice(self, idevice):
        """
        Register another iDevice as available
        """
        log.debug("IdeviceStore.addIdevice")


    def load(self):
        """
        Load iDevices from the generic iDevices and the extended ones
        """
        log.debug("load iDevices")
        self.loadExtended()
        self.loadGeneric()

    def loadExtended(self):
        from exe.engine.freetextidevice    import FreeTextIdevice
        from exe.engine.multichoiceidevice import MultichoiceIdevice
        from exe.engine.reflectionidevice  import ReflectionIdevice
        from exe.engine.casestudyidevice   import CasestudyIdevice

        self.extended.append(FreeTextIdevice())
        
        multichoice = MultichoiceIdevice()
        multichoice.addOption()
        self.extended.append(multichoice)
                
        self.extended.append(ReflectionIdevice())
                
        self.extended.append(CasestudyIdevice())
  

    def loadGeneric(self):
        """
        Load the Generic iDevices from the appdata directory
        """
        pass



     

# ===========================================================================
