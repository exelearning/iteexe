from xpcom import _xpcom
from xpcom import components

class PythonTestComponent:
    _com_interfaces_ = components.interfaces.nsIEXESimple
    _reg_clsid_ = "{1cc6a324-ca3a-11db-8c4d-000c76eeac0f}"
    _reg_contractid_ = "@exe.org/simpleTest;1"
    def __init__(self):
        self.yourName = ''

    def write(self):
        print self.yourName

    def change(self, newName):
        self.yourName = newName
