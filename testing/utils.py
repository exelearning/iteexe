# ===========================================================================
# testing utils
# Copyright 2004, University of Auckland
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

import logging
from logging import DEBUG, INFO, WARNING, ERROR, CRITICAL
import sys, unittest
#TODO Popen3 not available on Windows!!!  from popen2                  import Popen3
from exe.application         import Application
from exe.engine.config       import Config
from exe.engine.configparser import ConfigParser
from exe.engine.package      import Package
from exe.engine.path         import Path

# Choose which ConfigParser we'll use
if sys.platform[:3] == "win":
    from exe.engine.winconfig import WinConfig
    Config = WinConfig
elif sys.platform[:6] == "darwin":
    from exe.engine.macconfig import MacConfig
    Config = MacConfig
else:
    from exe.engine.linuxconfig import LinuxConfig
    Config = LinuxConfig

class FakeClient(object):
    """Pretends to be a webnow client object"""

    def __init__(self):
        self.calls = [] # All methods called on this object

    def logCall(self, _name_, *args, **kwargs):
        self.calls.append((_name_, args, kwargs))

    def __getattr__(self, name):
        """Always returns a callable"""
        return lambda *args, **kwargs: self.logCall(name, *args, **kwargs)


class FakeRequest(object):
    """
    Allows you to make a fake request, Just pass it keyword args that will be
    put into self.args and stuck in lists as appropriate for reading.
    """ 

    def __init__(self, method='POST', path='/temp', **kwargs):
        """
        Example usage:
        myrequest = FakeRequest(action='AddIdevice')
        allows you to go:
        myrequest.args['action'][0] == 'AddIdevice'
        """
        self.args = {}
        for key, value in kwargs.items():
            self.args[key] = [value]
        self.method = method
        self.path   = path


class SuperTestCase(unittest.TestCase):
    """
    Provides a base for higher level test cases.
    """

    def setUp(self):
        """
        Creates an application and 
        almost launches it.
        """
        # Make whatever config class that application uses only look for our
        # Set up our customised config file
        logFileName = Path('tmp/app data/test.conf')
        Config._getConfigPathOptions = lambda s: [logFileName]
        if not logFileName.dirname().exists():
            logFileName.dirname().makedirs()
        confParser = ConfigParser()
        self._setupConfigFile(confParser)
        confParser.write(logFileName)
        # Start up the app and friends
        self.app = Application()
        self.app.loadConfiguration()
        self.app.preLaunch()
        self.client = FakeClient()
        self.package = Package('temp')
        self.app.server.root.bindNewPackage(self.package)
        self.mainpage = self.app.server.root.children['temp']

    def _setupConfigFile(self, configParser):
        """
        Override this to setup any customised config
        settings
        """
        # Set up the system section
        system = configParser.addSection('system')
        system.exePath = '../exe/exe'
        system.exeDir = '../exe'
        system.webDir = '../exe/webui'
        system.port = 8081
        # Make a temporary dir where we can save packages and exports etc
        tmpDir = Path('tmp')
        if not tmpDir.exists(): tmpDir.mkdir()
        dataDir = tmpDir/'data'
        if not dataDir.exists():
            dataDir.mkdir()
        system.dataDir = dataDir
        system.browserPath = 'not really used in tests so far'
        # Setup the logging section
        logging = configParser.addSection('logging')
        logging.root = 'DEBUG'

    def _request(self, **kwargs):
        """
        Pass me args and I return you a fake request object.
        eg. self._request(action='addIdevice').args['action'][0] == 'addIdevice'
        """
        return FakeRequest(**kwargs)


class HTMLTidy(object):
    """Use this to check html output with htmltidy.
    Only works on *nix
    """

    def __init__(self, html):
        """
        'html' is the html/xhtml that you want to check
        """
        self.html = html
        
    def check(self):
        """
        Actually runs htmltidy to check the html
        """
        htmlFile = open('tmp.html', 'wb')
        #htmlFile.write(self.html)
            
        htmlFile.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0'
                       'Strict//EN"'
                       '"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n'
                       '<html><head><title>testing</title></head><body>'
                       '<notag>hello</body></html>')
        htmlFile.close()
        process = Popen3('tidy tmp.html', True)
        ret = process.wait()
        print dir(self)
        if ret == 0:
            print 'ok'
        elif ret == 256:
            print 'Warnings'
        elif ret == 512:
            print 'Errors'
        else:
            print ret
        print process.childerr.read()


        

class TestSuperTestCase(SuperTestCase):
    """
    Just provides a simple test to check that the initialisation code is running
    without adding any complications.
    """

    def testSetup(self):
        """
        Tests that the setup runs.
        To run type: python utils.py
        """

if __name__ == '__main__':
    unittest.main()
