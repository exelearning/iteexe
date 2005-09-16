# ===========================================================================
# Layout.py
# Copyright 2003, D J Moore
#
# Customised VBox for my applications
# Helps keep a consistent look an feel
# Spacing - see hig-1.0/layout.html#window-layout-spacing
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


import gtk
import pango
from types import *

# ==== Helper function ===================================================

def makeLabel(str, font="", xalign=0):
    label = gtk.Label(str)
    label.modify_font(pango.FontDescription(font))
    label.set_alignment(xalign, 0.5)
    return label

# ==== Class definition ==================================================

class Layout(gtk.VBox):

    # ---- Ctor ----------------------------------------------------------

    def __init__(self, top=None, logo=None):
        gtk.VBox.__init__(self)
        self.set_border_width(6)

        if top:
            self.pack_start(makeLabel(top, "sans 12"), expand=False)

        hbox = gtk.HBox(spacing=12)
        hbox.set_border_width(6)
        self.pack_start(hbox)
        if logo:
            img = gtk.Image()
            iconSet = gtk.Style().lookup_icon_set(logo)
            if iconSet:
                img.set_from_icon_set(iconSet, gtk.ICON_SIZE_DIALOG)
            else:
                img.set_from_file(logo)

            img.set_alignment(0, 0)
            hbox.pack_start(img, expand=False)

        self.vbox = gtk.VBox()
        self.vbox.set_border_width(6)
        hbox.pack_start(self.vbox)
        
    # ---- Labels --------------------------------------------------------

    def title(self, str):
        if str is not None:
            self.vbox.pack_start(makeLabel(str, "sans bold 32", 0.5), 
                                 expand=False)
            self.vbox.pack_start(gtk.Label(""), expand=False)

    def heading(self, str):
        if str is not None:
            self.vbox.pack_start(makeLabel(str, "sans bold 12"), 
                                 expand=False)

    def subheading(self, str):
        if str is not None:
            self.vbox.pack_start(makeLabel(str, "sans bold"), 
                                 expand=False)

    def text(self, str):
        if str is not None:
            self.vbox.pack_start(makeLabel(str), expand=False)
