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
import os, sys, unittest
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
        self.app.webServer.root.bindNewPackage(self.package)
        self.mainpage = self.app.webServer.root.children['temp']

    def tearDown(self):
        """
        Remove the global app instance
        """
        from exe import application
        application.application = None

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
        system.localeDir = '../exe/locale'
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


class HTMLChecker(object):
    """Use this to check html output with xmllint.
    Only works on *nix
    """

    def __init__(self, resToIgnore=[]):
        """
        'resToIgnore' a sequence of strings or regular expressions to filter out
        some errors
        filter them out of the list of warnings/errors
        """
        self.resToIgnore = resToIgnore
        
    def check(self, html, wrap, addForm):
        """
        Actually runs xmllint to check the html
        'html' is the html/xhtml that you want to check
        if 'wrap' is true, we'll wrap the html in a nice header so as not to
        kill xmllint
        if 'addForm' is true, we'll include a form in the wrapping
        """
        # Wrap the html in proper document tags if necessary
        if wrap:
            template = ('<?xml version="1.0" encoding="iso-8859-1"?>'
                        '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 '
                        'Transitional//EN" '
                        '"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'
                        '<html xmlns="http://www.w3.org/1999/xhtml">'
                        '<head><title>No Title</title></head><body>'
                        '%s</body></html>')
            if addForm:
                template = template % \
                    ('<form method="post" action="NO_ACTION"'
                     ' id="contentForm">%s</form>')
            html = template % html
        # Use xmllint
        htmlFile = open('tmp.html', 'wb')
        htmlFile.write(html.encode('utf-8'))
        htmlFile.close()
        #stdin, stdout, stderr = os.popen3('xmllint --encode utf8 --dtdvalid xhtml1-strict.dtd tmp.html', True)
        stdin, stdout, stderr = os.popen3('xmllint --encode utf8 --dtdvalid xhtml1-transitional.dtd tmp.html', True)
        out = stdout.read()
        err = stderr.read()
        ret = os.wait()[1] >> 8
        if ret == 0:
            # Perfect!
            return True
        elif ret in (1, 3,4):
            # Here we have errors and must filter some out before returning
            return self.filterErrors(err, ret)
        else:
            raise ValueError('Unknown return code returned by xmllint: %d' % ret) 

    def filterErrors(self, stderr, returnCode):
        """
        Takes the stderr output of xmllint and filters it against our
        regularExpressions, prints the result and raises
        an assertion error if 
        """
        # Each error consists of one or more lines, the first line can be told
        # because it starts with "tmp.html:\d+:"
        stderr = stderr.split('\n')
        if stderr[-1] == '':
            # Ignore last two lines of rubbish :)
            del stderr[-2:] 
        errors = {}
        for line in stderr:
            if line.startswith('tmp.html:'):
                key = line
                errors[key] = [line]
            else:
                errors[key].append(line)
        # Filter only the first line of each error against the regexps
        for reg in self.resToIgnore:
            if hasattr(reg, 'search'):
                # Regular expression search filter
                check = lambda k: reg.search(k)
            else:
                # String in filter
                check = lambda k: reg in k
            for key in errors.keys():
                if check(key):
                    del errors[key]
        # Now if there are any left print them out and fail the test
        if errors:
            errorFile = open('tmp.html.errors', 'w')
            def output(line=''):
                print line
                errorFile.write(line+'\n')
            keys = errors.keys()
            keys.sort()
            if returnCode == 1:
                output("Invalid XML:")
            else:
                output("Errors in HTML:")
            for key in keys:
                error = errors[key]
                for line in error:
                    output(line)
            output()
            output('Run this test on its own and then examing "tmp.html" ')
            output('for more info. Error output save to "tmp.html.errors"')
            errorFile.close()
            return False
        else:
            return True

        
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
