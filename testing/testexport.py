"""
Tests website and scorm exports.
"""
# ===========================================================================
# testexport
# Copyright 2005, University of Auckland
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

import unittest
from exe.engine.package       import Package
from exe.engine.path          import path, TempDirPath
from exe.export.websiteexport import WebsiteExport
from exe.export.scormexport   import ScormExport
from zipfile                  import ZipFile
from sets                     import Set

class TestWebsiteExport(unittest.TestCase):

    def testExport(self):
        # Delete the output dir
        outdir = TempDirPath()
        # Load a package
        package = Package.load('testPackage.elp')
        # Do the export
        exporter = WebsiteExport('../exe/webui/style/default', outdir,
                                 '../exe/webui/images', '../exe/webui/scripts')
        exporter.export(package)
        # Check that it all exists now
        assert outdir.isdir()
        assert (outdir / 'index.html').isfile()
        # Check that the style sheets have been copied
        for filename in path('../exe/webui/style/default').files():
            assert ((outdir / filename.basename()).exists(),
                    'Style file "%s" not copied' % (outdir / filename.basename()))

        # Check that each node in the package has had a page made
        pagenodes  = Set([p.node for p in exporter.pages])
        othernodes = Set(self._getNodes([], package.root))
        assert pagenodes == othernodes

        for page in exporter.pages:
            self._testPage(page, outdir)

        
    def _getNodes(self, nodes, node):
        nodes.append(node)
        for child in node.children:
            self._getNodes(nodes, child)
        return nodes 


    def _testPage(self, page, outdir):
        """
        Tests for more or less correct creation of webpages
        """
        node = page.node
        pageName = outdir/page.name+'.html'
        assert pageName.exists(), 'HTML file "%s" not created' % pageName
        html = open(pageName).read()
        assert (node.title in html,
                'Node title (%s) not found in "%s"' % (node.title, pageName))


class BaseTestScormExport(unittest.TestCase):
    
    def doTest(self, withMeta):
        """Exports a package with meta data"""
        # Load our test package
        package = Package.load('testPackage.elp')
        # Do the export
        outFilename = path('scormtest.zip')
        class MyConfig:
            def __init__(self):
                self.exePath = ""
        exporter = ScormExport(MyConfig(),
                               '../exe/webui/style/default', 
                               '../exe/webui/scripts', 
                               outFilename)
        exporter.export(package, withMeta)
        # Check that it made a nice zip file
        assert outFilename.exists()
        # See if the manifest file was created
        zipped = ZipFile(outFilename)
        filenames = zipped.namelist()
        assert 'imsmanifest.xml' in filenames, filenames
        self._testManifest(zipped.read('imsmanifest.xml'))

        # Test that all the node's html files have been generated
        pagenodes  = Set([p.node for p in exporter.pages])
        othernodes = Set(self._getNodes([], package.root))
        assert pagenodes == othernodes

        for page in exporter.pages:
            self._testPage(page, zipped)

        # Clean up
        zipped.close()

    def _testManifest(self, content):
        """Override this func to test different types of manifest files"""
        
    def _getNodes(self, nodes, node):
        nodes.append(node)
        for child in node.children:
            self._getNodes(nodes, child)
        return nodes 

    def _testPage(self, page, zipped):
        """Tests for more or less correct creation
        of webpages"""
        node     = page.node
        filename = page.name + '.html'
        assert (filename in zipped.namelist(), 
                'HTML file "%s" not created' % filename)
        html = zipped.read(filename)
        assert (node.title in html,
                'Node title (%s) not found in "%s"' % (node.title, filename))
        

class TestScormMetaExport(BaseTestScormExport):
    
    def testMeta(self):
        """Tests exporting of scorm packages with meta data"""
        self.doTest(True)

    def _testManifest(self, content):
        """Checks that there is meta data in 'content'"""
        assert '<metadata>' in content
        assert '</metadata>' in content
        assert 'xmlns:dc' in content
        assert 'dc:title' in content
        assert 'dc:creator' in content
        assert 'dc:description' in content
        assert 'dc:language' in content
        
class TestScormNoMetaExport(BaseTestScormExport):
    
    def testMeta(self):
        """Tests exporting of scorm packages without meta data"""
        self.doTest(False)

    def _testManifest(self, content):
        """Checks that there is meta data in 'content'"""
        assert '<metadata>' in content
        assert '</metadata>' in content
        assert 'xmlns:dc' not in content
        assert 'dc:title' not in content
        assert 'dc:creator' not in content
        assert 'dc:description' not in content
        assert 'dc:language' not in content
        



if __name__ == "__main__":
    unittest.main()
