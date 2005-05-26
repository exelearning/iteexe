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
Functions for handling persistance in eXe
"""

import logging
import gettext

import cStringIO
from twisted.persisted.styles import Versioned, doUpgrade
from twisted.spread  import jelly
from twisted.spread  import banana

log = logging.getLogger(__name__)
_   = gettext.gettext


class Persistable(object, jelly.Jellyable, jelly.Unjellyable, Versioned):
    """
    Base class for persistent classes
    """
    # List of variables to avoid persisting
    nonpersistant = []

    def getStateFor(self, jellier):
        """
        Call Versioned.__getstate__ to store
        persistenceVersion etc...
        """
        return self.__getstate__()


    def __getstate__(self):
        """
        Return which variables we should persist
        """
        toPersist = dict([(key, value) for key, value in self.__dict__.items()
                          if key not in self.nonpersistant])

        return Versioned.__getstate__(self, toPersist)




def encodeObject(toEncode):
    """
    Take a object and turn it into an string
    """
    log.debug("encodeObject")

    encoder = banana.Banana()
    encoder.connectionMade()
    encoder._selectDialect("none")
    strBuffer = cStringIO.StringIO()
    encoder.transport = strBuffer
    encoder.sendEncoded(jelly.jelly(toEncode))

    return strBuffer.getvalue()


def decodeObject(toDecode):
    """
    Take a string and turn it into an object
    """
    log.debug("decodeObject")

    decoder = banana.Banana()
    decoder.connectionMade()
    decoder._selectDialect("none")
    data = []
    decoder.expressionReceived = data.append
    decoder.dataReceived(toDecode)
    decoded = jelly.unjelly(data[0])
    doUpgrade()

    return decoded

