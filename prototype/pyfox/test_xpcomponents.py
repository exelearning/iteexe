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
        # Here we connect the "delete-event" event to a signal handler.
        # This event occurs when we the user closes window,
        # We connect it to gtk.main_quit, so it quits the main loop
        # and the program terminates
        self.window.connect("delete-event", gtk.main_quit)
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



if __name__ == '__main__':
    unittest.main()
