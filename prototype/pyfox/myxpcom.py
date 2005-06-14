"""
Embeds mozilla gecko in a pygtk window
"""

import pygtk
pygtk.require('2.0')

import gtk

# Create a new window
window = gtk.Window()

# Here we connect the "delete-event" event to a signal handler.
# This event occurs when we the user closes window,
# We connect it to gtk.main_quit, so it quits the main loop
# and the program terminates
window.connect("delete-event", gtk.main_quit)

# Sets the border width of the window.
window.set_border_width(10)
window.set_default_size(320,240)

# Show the window
window.show_all()

# Run the main loop, to process events such a key presses
# and mouse movements.
##gtk.main()


# Now import the pyxpcom stuff

from xpcom import components
from xpcomponents import *
import sys

iface = components.interfaces
create = lambda name, intfc=None: components.classes[name].createInstance(intfc)
wbc = components.classes['@mozilla.org/embedding/browser/nsWebBrowser;1']
wbi = iface['nsIWebBrowser']
sm = components.serviceManager

def initEmbedding():
    """Tell mozilla we'll be embedding it"""
    from ctypes import cdll, c_int
    embedlib = cdll.LoadLibrary('/home/matthew/work/downloads/mozilla/dist/firefox/libgtkembedmoz.so')
    # TODO: Pass this the right parameters
    # Path to mozilla binary directory
    fn = '/home/matthew/work/downloads/mozilla/dist/firefox'
    f = create('@mozilla.org/file/local;1', iface.nsILocalFile)
    f.initWithPath(fn)
    address = c_int(id(f._comobj_))
    address = c_int(id(f._interfaces_.items()[-1]))
    address = c_int(id(f))
    print address
    # Get the address of the com object to pass to the dll
    print embedlib.NS_InitEmbedding(None, None)

from ctypes import cdll, c_int
embedlib = cdll.LoadLibrary('/home/matthew/work/downloads/mozilla/dist/firefox/libgtkembedmoz.so')

def rubbish():
    #smi = components.interfaces['nsIServiceManager']
    #print '**********************'
    #sm = sm.queryInterface(smi)
    #print sm
    #print sm._interface_infos_
    print '**********************'
    cls = create('@mozilla.org/appshell/commandLineService;1')
    app = components.classes['@mozilla.org/appshell/appShellService;1'].getService(iface['nsIAppShellService'])
    print app
    native = app.hiddenWindow
    print native

    #print app.initialize(cls, None)
    print native.start()
