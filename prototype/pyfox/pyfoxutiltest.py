# Global variables
currentStage = -1
wb = None
bi = None
handle = None
window = None


def initXPCOM():
    # Init PyXPCOM
    import os
    home = os.environ.get('MOZILLA_FIVE_HOME', '/home/matthew/work/downloads/mozilla/dist/firefox')
    from _pyfoxutil import initEmbedding, initWindow
    initEmbedding(home)
    globals().update(locals())

def imports():
    import pygtk
    pygtk.require('2.0')
    import gtk
    from xpcom import components
    from xpcom.server import WrapObject
    from xpcomponents import BrowserImpl
    import sys
    globals().update(locals())

def makeWindow():
    global window
    window = gtk.Window()
    window.set_border_width(10)
    #window.set_default_position(100,100)
    window.set_default_size(320,240)
    window.connect("delete-event", gtk.main_quit)
    window.show_all()

def makeBrowser():
    # Create a web browser instance
    global wb
    wbInterface = components.interfaces.nsIWebBrowser
    wbContractId = '@mozilla.org/embedding/browser/nsWebBrowser;1'
    wbClass = components.classes[wbContractId]
    wb = wbClass.createInstance(wbInterface)

def initWindow_():
    global handle
    if sys.platform=='win32': handle = window.window.handle
    else:
        if hasattr(window, 'xid'):
            handle = window.xid
        elif hasattr(window, 'window'):
            handle = window.window.xid
        else:
            raise AssertionError("Couldn't get xid. Is window ok?")
    print 'python:', hex(handle)
    return initWindow(wb, handle, 100, 100, 320, 240)

def wrap():
    global bi
    bi = WrapObject(BrowserImpl(window, wb), components.interfaces.nsIWebProgressListener)
    addListener(wb, bi)
    print 'Listener added'

def mainloop():
    gtk.main()

def toStage(stage):
    global currentStage, wb, window, handle
    stages = [
        initXPCOM,
        imports,
        makeWindow,
        makeBrowser,
        initWindow_,
        wrap]
    for i in range(currentStage+1, max(stage, len(stages))):
        stages[i]()
        currentStage = i
