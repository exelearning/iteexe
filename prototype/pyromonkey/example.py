#!/usr/bin/python

# This file is released into the public domain.
# Originally Written by Andrew McCall - <andrew@textux.com>

import os
import sys
import gtk
import _pyromonkey

class PyGtkMozExample:
    def __init__(self, URL = None, parent = None):        
        if parent == None:
            self.parent = gtk.Window(gtk.WINDOW_TOPLEVEL)
            self.parent.set_border_width(10)
        else:
            self.parent = parent
        
        # Initialize the widgets...
        self.widget = _pyromonkey.MozEmbed()
        self.vbox = gtk.VBox(False, 5)
        self.hbox = gtk.HBox(False, 5)
        self.entry = gtk.Entry(256)
        self.button = gtk.Button("Go")
        self.back = gtk.Button(stock=gtk.STOCK_GO_BACK)
        self.forward = gtk.Button(stock=gtk.STOCK_GO_FORWARD)
        
        # Arrange them...
        self.hbox.pack_start(self.back, expand=False, padding=2)
        self.hbox.pack_start(self.forward, expand=False, padding=2)
        self.hbox.pack_start(self.entry, expand=True, padding=5)
        self.hbox.pack_start(self.button, expand=False, padding=2)
        self.vbox.pack_start(self.hbox, expand=False, padding=5)
        self.vbox.pack_start(self.widget)
        
        # Connect signals
        self.widget.connect("location", self.on_location_changed)
        self.button.connect("clicked", self.on_entry_changed)
        self.forward.connect("clicked", self.on_forward)
        self.back.connect("clicked", self.on_back)
        self.entry.connect('key_press_event', self.on_key_press)
        
        self.parent.add(self.vbox)
        
        if URL != None:
            self.widget.load_url(URL)
        
        self.parent.show_all()
        self.widget.load_url('http://exe.cfdl.auckland.ac.nz')

    def on_key_press(self, widget, event, *args):
        if event.keyval == gtk.keysyms.Return:
            self.on_entry_changed()
            
    #def on_forward(self, data = None): self.widget.go_forward()
    def on_forward(self, data = None):
        from xpcom import components, xpt
        import xpcom.client
        br = self.widget.get_xpcom_browser()
        import pdb
        pdb.set_trace()
        #wb = client.Component(br, 'nsISupports')
        wb = components.classes['@mozilla.org/embedding/browser/nsWebBrowser;1'].createInstance(components.interfaces.nsIWebNavigation)
        wb = xpcom.client.Component(br, wb._interfaces_[components.interfaces.nsIWebNavigation])
        #wb2 = components.classes['@mozilla.org/embedding/browser/nsWebBrowser;1'].getService()
        print br
        print wb
    
    def on_back(self, data = None):
        self.widget.go_back()
    
    def on_location_changed(self, data):
        self.entry.set_text(self.widget.get_location())
    
    def on_entry_changed(self, data = None):
        self.widget.load_url(self.entry.get_text())
        

# Support this being called as a standalone script

def __windowExit(widget, data=None):
    gtk.main_quit()
    
def main():
    # Library Initialization
    
    try:
        HomeDir = os.environ["HOME"]
    except KeyError:
        raise "No Home Directory, Don't Know What to Do"
        
    ProfileDir = HomeDir + "/.gtkmozembedexample/"
    print "Note: a mozilla profile has been created in : " + ProfileDir
    
    _pyromonkey.gtk_moz_embed_set_profile_path(ProfileDir, "helpsys")

    window = PyGtkMozExample()
    window.parent.connect("destroy", __windowExit)
    gtk.main()

if __name__ == "__main__":
    main()
