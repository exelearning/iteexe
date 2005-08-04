#!/usr/bin/python
# ===========================================================================
# burningrats.py
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


#import pygtk
#pygtk.require ('2.0')

import gtk
import gtkmozembed

class AppWin(gtk.Window):
#    def destroy(self, widget):
#        gtk.mainquit()

    def __init__(self, title, iconFile):
        gtk.Window.__init__(self)
        self.connect('destroy', lambda win: gtk.main_quit())
        self.set_title(title)
#        self.set_icon(gtk.gdk.pixbuf_new_from_file(iconFile))
        self.set_size_request(500, 300)

        # VBox
        self.vbox = gtk.VBox()
        self.add(self.vbox)

        # Status Bar
        self.statusbar = gtk.Statusbar()
        self.statusbar.set_has_resize_grip(True)
        self.vbox.pack_end(self.statusbar, expand=False)



# ==== Class definition ==================================================

IdeviceData  = "Will this work?<br/>\n"
IdeviceData += "<textarea cols=\"40\" rows=\"3\"></textarea> <br/>\n"
IdeviceData += "<a href=\"yes\">yes</a> \n"
IdeviceData += "<a href=\"no\">no</a> \n"
IdeviceData += "<br/>\n"

class ExeApp:
    """Main class for the eXe application
    Owns the main window and starts the various action dialogs
    """
    def __init__(self):
        # Window
        self.data = IdeviceData
        self.window = AppWin("BurningRats", "img/rats.png")
        self.window.connect("delete-event", self.quit)

        # Menu and Toolbar

        # HBox
        hbox = gtk.HBox(spacing=12)
        self.window.vbox.pack_start(hbox)

        # LeftBox
        leftBox = gtk.VBox()                           
        leftBox.set_border_width(6)
        hbox.pack_start(leftBox, expand=False)

        leftBox.pack_start(gtk.Label("Tree goes here"))
        
        ideviceBtn = gtk.Button("Add Idevice")
        ideviceBtn.connect("clicked", self.addIdevice)
        leftBox.pack_start(ideviceBtn, expand=False)


        # Browser
        gtkmozembed.gtk_moz_embed_set_comp_path("c:\\djm\\mozilla\\dist\\bin")

        self.browser = gtkmozembed.MozEmbed()
#        self.browser.connect("location", self.on_browser_location)
        self.browser.connect("realize", self.render)
#        self.browser.connect("link_message", self.linkHover)
        self.browser.connect("open_uri", self.linkClicked)
#        self.browser.load_url("http://software.net.nz")
        hbox.pack_start(self.browser, expand=True)

        self.window.show_all()
                            
    def render(self, widget):
        data  = "<html><head><title>BurningRats</title></head>"
        data += "<body><h1>BurningRats</h1>"
        data += self.data
        data += "</body></html>"""
        self.browser.render_data(data, long(len(data)), "file://", "text/html")

    def addIdevice(self, widget):
        self.data += IdeviceData
        self.render(None)
        return True

    def linkHover(self, widget):
        print "linkHover", widget
        return True

    def linkClicked(self, widget, data):
        print "linkClicked", widget, data
        print self.browser.get_link_message()
        return True

    def quit(self, *ignore):
        gtk.main_quit()
        return False



if __name__ == "__main__":
    app = ExeApp()

    gtk.main()

