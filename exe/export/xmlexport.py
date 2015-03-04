#!/usr/bin/python
# -*- coding: utf-8 -*-
# ===========================================================================
# eXe
# Copyright 2004-2005, University of Auckland
# Copyright 2004-2007 eXe Project, New Zealand Tertiary Education Commission
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
"""
XMLExport will export a package as a collection of XML files
Extends WebsiteExport for convenience

"""

import logging
import re
import imp
from cgi                      import escape
from exe.webui.blockfactory   import g_blockFactory
from exe.engine.error         import Error
from exe.engine.path          import Path, TempDirPath
from exe.export.pages         import uniquifyNames
from exe.export.websitepage   import WebsitePage
from zipfile                  import ZipFile, ZIP_DEFLATED
from exe.export.websiteexport import *
from exe.export.websitepage   import *
from exe.export.xmlpage         import XMLPage
from exe.export.exportmediaconverter    import ExportMediaConverter

import sys, os, fnmatch, glob, shutil, codecs, md5

log = logging.getLogger(__name__)


# ===========================================================================
class XMLExport(WebsiteExport):

    """
    WebsiteExport will export a package as a website of HTML pages
    """
    def __init__(self, config, styleDir, filename, langOverride=None, forceMediaOnly=False):
        WebsiteExport.__init__(self, config, styleDir, filename)
        self.langOverride = langOverride
        self.forceMediaOnly = forceMediaOnly

    @staticmethod
    def encodeEntities(html):
        import cgi
        return cgi.escape(html)

    def export(self, package):
        """
        Export to XML files
        Cleans up the previous packages pages and performs the export
        TODO: Make output directory for each type of export media profile
        """
        outputDir = self.filename

        # Command line option to override language for export
        if self.langOverride != None:
            package.dublinCore.language = self.langOverride

        # track the number of working idevices on a page
        # if 0 do not put page in TOC
        numDevicesByPage = {}

        # track idevices that dont really  export
        nonDevices = []

        # copy needed files
        if not outputDir.exists():
            outputDir.mkdir()

        #
        # This is passed from the command line export
        #
        if self.forceMediaOnly == True:
            package.mxmlforcemediaonly = "true"

        """
        Now go through the list of target media profiles and do the conversion
        for each one here.

        For now this will just go through and create them - will settle on the
        last one
        """

        if package.mxmlprofilelist is None or package.mxmlprofilelist == "":
            package.mxmlprofilelist = "nokia"

        profileList = package.mxmlprofilelist.split(",")
        """
        Go through all the profiles in the list - and make a directory if
        it not just 'default'.  For each one make a exportmediaconverter
        and then go through the export routine
        """
        for currentProfile in profileList:
            mediaConverter = None
            currentOutputDir = outputDir

            if currentProfile != "default":
                mediaConverter = ExportMediaConverter(currentProfile)
                mediaConverter.loadConfigVals()
                mediaConverter.setCurrentPackage(package)
                ExportMediaConverter.autoMediaOnly = package.mxmlforcemediaonly

                currentOutputDir = outputDir.joinpath(currentProfile)
                if not currentOutputDir.exists():
                    currentOutputDir.mkdir()

                ExportMediaConverter.setWorkingDir(currentOutputDir)

            self.copyFiles(package, currentOutputDir)
            self.pages = [XMLPage("index", 1, package.root)]
            self.generatePages(package.root, 1)
            uniquifyNames(self.pages)

            prevPage = None
            thisPage = self.pages[0]

            for nextPage in self.pages[1:]:
                pageDevCount = thisPage.save(currentOutputDir, prevPage,
                                             nextPage, self.pages, nonDevices)
                numDevicesByPage[thisPage.name] = pageDevCount
                prevPage = thisPage
                thisPage = nextPage

            pageDevCount = thisPage.save(currentOutputDir, prevPage, None, self.pages, nonDevices)
            numDevicesByPage[thisPage.name] = pageDevCount

            self._writeTOCXML(currentOutputDir, numDevicesByPage, nonDevices, package)


    """
    Makes the table of contents XML file
    """
    def _writeTOCXML(self, outputDir, numDevicesByPage, nonDevices, package):
        xmlDirectoryFile = open(outputDir + "/exetoc.xml", "w")
        xmlDirectoryFile.write('<?xml version="1.0" encoding="UTF-8"?>\n')

        lang = package.dublinCore.language
        langAttrib = ""

        if lang is not None and lang != '':
            langAttrib = " xml:lang='%s' " % lang

        xmlDirectoryFile.write("<exebase%s>\n" % langAttrib)

        for page in self.pages:
            if len(page.node.idevices) == 0:
                continue
            # Check the real number of devices on the page
            if numDevicesByPage[page.name] == 0:
                continue

            lineStr = u"<page href='%(link)s.xml' title='%(title)s'>\n" \
                % {"link": page.name, "title": XMLExport.encodeEntities(page.node.titleShort)}
            xmlDirectoryFile.write(lineStr.encode("UTF-8"))
            xmlDirectoryFile.write("\n")
            for idevice in page.node.idevices:
                # TODO: Make sure that we do not have an idevice entry for
                # something on a page with real idevices
                if idevice.__class__.__name__ in nonDevices:
                    pass
                else:
                    ideviceLine = u"\t<idevice id='%(ideviceid)s' title='%(title)s'/>\n" % \
                        {"ideviceid": idevice.id, "title": XMLExport.encodeEntities(idevice.get_title())}
                    xmlDirectoryFile.write(ideviceLine.encode("UTF-8"))

            xmlDirectoryFile.write("</page>\n")

        xmlDirectoryFile.write("</exebase>")
        xmlDirectoryFile.close()

    def generatePages(self, node, depth):
        """
        Recursively generate pages and store in pages member variable
        for retrieving later
        """
        for child in node.children:
            pageName = child.titleShort.lower().replace(" ", "_")
            pageName = re.sub(r"\W", "", pageName)
            if not pageName:
                pageName = "__"

            self.pages.append(XMLPage(pageName, depth, child))
            self.generatePages(child, depth + 1)

    def copyFiles(self, package, outputDir):

        # copy defined items from the style directory for the mobile output
        styleFiles = self.stylesDir.files("icon_*.png")
        self.stylesDir.copylist(styleFiles, outputDir)

        styleFiles = self.stylesDir.parent.files("icon_*.png")
        self.stylesDir.copylist(styleFiles, outputDir)

        styleFiles = self.stylesDir.files("icon_*.gif")
        self.stylesDir.copylist(styleFiles, outputDir)

        # copy the package's resource files
        package.resourceDir.copyfiles(outputDir)


"""
Utility method
"""


def remove_html_tags(data):
    p = re.compile(r'<.*?>')
    return p.sub('', data)
