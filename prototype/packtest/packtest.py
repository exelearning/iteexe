#!/usr/bin/python
from twisted.internet import reactor
from twisted.web import static
from twisted.web import server
from twisted.web import script
import os
import sys

def main():
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print "Usage:",sys.argv[0],"[port]"
            sys.exit(1)
    else:
        port = 8081

    root = static.File("web") 
    root.processors = {".rpy": script.ResourceScript}
    root.indexNames = ['packtest.rpy']

    reactor.listenTCP(port, server.Site(root))
    reactor.callWhenRunning(launchBrowser, port)
    reactor.run()

def launchBrowser(port):
    if sys.platform[:3] == "win":
        os.system("start http://localhost:%d"%port)
    else:
        os.system("htmlview http://localhost:%d&"%port)
    print "Welcome to the eXe: packtest"

if __name__ == "__main__":
    main()
