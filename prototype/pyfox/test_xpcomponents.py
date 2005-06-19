import pygtk
pygtk.require('2.0')
import gtk
import unittest
from xpcomponents import BrowserImpl
from xpcom import components
from xpcom.server import WrapObject


class TestXPComponentsBase(unittest.TestCase):
    """
    Tests all the xpcomonents stuff...
    """

    def setUp(self):
        """
        Create a real xpcom component just like mozilla would use
        """
        self.window = gtk.Window()
        self.wbInterface = components.interfaces.nsIWebBrowser
        self.wbContractId = '@mozilla.org/embedding/browser/nsWebBrowser;1'
        self.wbClass = components.classes[self.wbContractId]
        self.wb = self.wbClass.createInstance(self.wbInterface)
        self.bi_raw = BrowserImpl(self.window, self.wb)
        self.bi = WrapObject(self.bi_raw, 
                             components.interfaces.nsIWebBrowserChrome)


class TestXPComponentsSimple(TestXPComponentsBase):
    """
    Just tests that the setUp method works
    """

    def test_simple(self):
        """
        Created OK
        """
        assert self.window
        assert self.wb
        assert self.bi

class TestWebBrowserChromeBase(TestXPComponentsBase):
    """
    Tests the web browser chrome functions
    """

    def setUp(self):
        TestXPComponentsBase.setUp(self)
        self.bi.QueryInterface(components.interfaces.nsIWebBrowserChrome)

    def test_setStatus(self):
        """
        Should be able to set the status bar of the web browser chrome
        without error. We don't care if it does anything, we just 
        want to be able to call it.
        """
        nsIWebBrowserChrome = components.interfaces.nsIWebBrowserChrome
        self.bi.setStatus(nsIWebBrowserChrome.STATUS_SCRIPT, 
                          u'Something is happening')
        self.bi.setStatus(nsIWebBrowserChrome.STATUS_SCRIPT_DEFAULT,
                          u'This is cool')
        self.bi.setStatus(nsIWebBrowserChrome.STATUS_LINK,
                          'Are we there yet?')

    def test_destroyBrowserWindow(self):
        """
        Should destroy self.window
        """
        mainLives = True
        def onMainDie(widget, event):
            print '********************************************************************************'
            mainLives = False
        id1 = self.window.connect("destroy-event", onMainDie)
        id2 = self.window.connect("delete-event", onMainDie)
        assert self.window.handler_is_connected(id1)
        assert self.window.handler_is_connected(id2)
        #self.bi.destroyBrowserWindow()
        self.window.destroy()
        gtk.main_iteration(block=True)
        assert not mainLives, 'Main window not destroyed'

if __name__ == '__main__':
    unittest.main()
