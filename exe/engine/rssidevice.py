# ===========================================================================
# eXe 
# Copyright 2004-2006, University of Auckland
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
A RSS Idevice is one built from a RSS feed.
"""

import re

from exe.engine               import feedparser
from exe.engine.idevice       import Idevice
from exe.engine.field         import TextAreaField
from exe.engine.translate     import lateTranslate
from exe.engine.path          import Path, TempDirPath
from exe.engine.resource      import Resource


# ===========================================================================
class RssIdevice(Idevice):
    """
    A RSS Idevice is one built from a RSS feed.
    """
    def __init__(self):
        Idevice.__init__(self,
                         x_(u"RSS"), 
                         x_(u"Auckland Univeristy of Technology"), 
                         u"", 
                         u"",
                         u"")
        self.emphasis         = Idevice.NoEmphasis
        self.rss              = TextAreaField(x_(u"RSS"))
        self.rss.idevice      = self
        self.icon             = u"inter"
        self._urlInstruc      = x_(u"some help tip here.")
        self.url              = ""
        

        
    # Properties
    urlInstruc      = lateTranslate('urlInstruc')

   
    def loadRss(self, url):
        """
        Load the rss
        """
        content = ""
        rssDic = feedparser.parse(url)
        length = len(rssDic['entries'])
        print str(length)
        if length > 0 :
            for i in range(0, length):
                content += '<p><A href="%s">%s</A></P>' %(
                    rssDic['entries'][i].link, rssDic['entries'][i].title)          

        self.rss.content = unicode(content)



# ===========================================================================
