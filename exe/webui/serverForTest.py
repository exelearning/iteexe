#!/usr/bin/python
# ===========================================================================
# eXe
# Copyright 2004-2005, University of Auckland
#
# This module is for the TwiSteD web server.
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


from twisted.internet import reactor
from twisted.web import server
import os
import sys
from twisted.web.resource import Resource
from propertiespane import PropertiesPane
from exe.engine.packagestore import g_packageStore

class TestPage(Resource):
    def __init__(self):
        Resource.__init__(self)
        self.pane = PropertiesPane()

    def getChild(self, name, request):
        if name == '':
            return self
        else:
            return Resource.getChild(self, name, request)

    def render_GET(self, request):
        self.pane.process(request)
        html = "<html><head><title>TestPage</title></head><body>"
        html += self.pane.render()
        html += "</body></html>"
        return html
    render_POST = render_GET
#JUST FOR TESTING
g_packageStore.createPackage("course1")

def main():
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print "Usage:",sys.argv[0],"[port]"
            sys.exit(1)
    else:
        port = 8081

    
    root = TestPage()
    root.putChild("course1", TestPage())
    
    reactor.listenTCP(port, server.Site(root))
    reactor.callWhenRunning(launchBrowser, port)
    reactor.run()

def launchBrowser(port):
    if sys.platform[:3] == "win":
        os.system("start http://localhost:%d/course1"%port)
    else:
        os.system("htmlview http://localhost:%d/course1&"%port)
    print "Welcome to the eXe: packtest"

if __name__ == "__main__":
    main()
