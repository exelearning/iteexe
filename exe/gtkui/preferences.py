# ===========================================================================
# Copyright 2003, D J Moore
# Copyright 2005, University of Auckland
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


import os
import os.path
import gtk
from exe.gtkui.layout import Layout

# ==== Class definition ==================================================

class Preferences(gtk.Dialog):
    def __init__(self, parent, config):
        gtk.Dialog.__init__(self, 
                            _(u"eXe Preferences"),
                            parent,
                            gtk.DIALOG_MODAL,
                            (gtk.STOCK_CANCEL, gtk.RESPONSE_CANCEL,
                             gtk.STOCK_OK,     gtk.RESPONSE_OK))
        self.connect("response", self.onResponse)
        
        self.config = config
        layout = Layout(logo=gtk.STOCK_PREFERENCES)
        self.vbox.pack_start(layout)

        layout.heading(_(u"eXe Preferences"))
        layout.text("")

        layout.subheading(_(u"Language"))
        self.localeCombo = gtk.Combo()
        layout.vbox.pack_start(self.localeCombo)
        self.localeCombo.entry.set_text(config.locale)
        self.localeCombo.set_popdown_strings(config.locales.keys())

        self.show_all()


    def onResponse(self, widget, responseId):
        if responseId == gtk.RESPONSE_OK:
            self.config.locale = self.localeCombo.entry.get_text()
            self.config.configParser.set('user', 'locale', self.config.locale)


