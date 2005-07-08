#!/usr/bin/python

# This file is released into the public domain.
# Originally Written by Andrew McCall - <andrew@textux.com>

from xpcom import components, xpt, _xpcom
import xpcom.client
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
        self.widget = _pyromonkey.PyroMonkey()
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
        print '++++++++++++++++++++++++++++++++++++++++++++++++++++++++++'
        print 'Getting gtk browser'
        br = self.widget.get_xpcom_browser()
        print '++++++++++++++++++++++++++++++++++++++++++++++++++++++++++'
        print 'Creating web browser'
        wb = components.classes['@mozilla.org/embedding/browser/nsWebBrowser;1'].createInstance(components.interfaces.nsIWebNavigation)
        print '++++++++++++++++++++++++++++++++++++++++++++++++++++++++++'
        print 'Wrapping created browser'
        wb = xpcom.client.Component(wb._comobj_, components.interfaces.nsIWebNavigation)
        print '++++++++++++++++++++++++++++++++++++++++++++++++++++++++++'
        print 'Wrapping gtk browser'
        wb = xpcom.client.Component(br, components.interfaces.nsIWebNavigation)
        #wb = xpcom.client.Component(br, xpt.Interface(components.interfaces.nsIWebNavigation))
        #wb = xpcom.client.Component(br, _xpcom.IID_nsISupports)

        #wb = xpcom.client.Component(br, 'nsIWebNavigation')
        #self.wb = components.classes['@mozilla.org/embedding/browser/nsWebBrowser;1'].getService()
        #self.wb.QueryInterface(components.interfaces.nsIWebNavigation)
        print br
        #print self.wb
        print wb
    
    def on_back(self, data = None):
        if hasattr(self, 'wb'):
            self.wb.goBack()
        else:
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
