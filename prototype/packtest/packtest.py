#!/usr/bin/python
from twisted.internet import reactor
from twisted.web import static
from twisted.web import server
from twisted.web import script
import os
import sys

def main():
    root = static.File("web") 
    root.processors = {".rpy": script.ResourceScript}
    root.indexNames = ['packtest.rpy']

    reactor.listenTCP(8080, server.Site(root))
    reactor.callWhenRunning(launchBrowser)
    reactor.run()

def launchBrowser():
    if sys.platform[:3] == "win":
        os.system("start http://localhost:8080")
    else:
        os.system("htmlview http://localhost:8080&")
    print "Welcome to the eXe: packtest"

if __name__ == "__main__":
    main()
