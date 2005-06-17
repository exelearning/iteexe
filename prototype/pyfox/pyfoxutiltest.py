import pygtk
pygtk.require('2.0')
import gtk
from xpcom import components
from xpcom.server import WrapObject
from pyfoxutil import *

window = gtk.Window()

# Create a web browser instance
wbInterface = components.interfaces.nsIWebBrowser
wbContractId = '@mozilla.org/embedding/browser/nsWebBrowser;1'
wbClass = components.classes[wbContractId]
wb = wbClass.createInstance(wbInterface)

if sys.platform=='win32': handle = self.widget.window.handle
else: handle = self.widget.window.xid

# Init PyXPCOM
import os
home = os.envoron.get('MOZILLA_FIVE_HOME',
                      '/home/matthew/work/downloads/mozilla/dist/firefox')
InitEmbedding(home)
InitWindow(wb, handle, 100, 100, 320, 240)
