import pygtk
pygtk.require('2.0')
import gtk
from xpcom import components
from xpcom.server import WrapObject
from _pyfoxutil import *
import sys

window = gtk.Window()
window.set_border_width(10)
#window.set_default_position(100,100)
window.set_default_size(320,240)
window.connect("delete-event", gtk.main_quit)
window.show_all()

# Create a web browser instance
wbInterface = components.interfaces.nsIWebBrowser
wbContractId = '@mozilla.org/embedding/browser/nsWebBrowser;1'
wbClass = components.classes[wbContractId]
wb = wbClass.createInstance(wbInterface)

if sys.platform=='win32': handle = window.window.handle
else: handle = window.window.xid

# Init PyXPCOM
import os
home = os.environ.get('MOZILLA_FIVE_HOME',
                      '/home/matthew/work/downloads/mozilla/dist/firefox')
initEmbedding(home)
print 'python:', hex(handle)
initWindow(wb, handle, 100, 100, 320, 240)
print 'Done'
gtk.main()
