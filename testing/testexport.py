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

class TestWebsiteExport(unittest.TestCase):

    def testExport(self):
        # Delete the output dir
        outdir = TempDirPath()
        # Load a package
        package = Package.load('testPackage.elp')
        # Do the export
        exporter = WebsiteExport('../exe/webui/style/default', outdir)
        exporter.export(package)
        # Check that it all exists now
        assert outdir.isdir()
        assert (outdir / 'index.html').isfile()
        # Check that the style sheets have been copied
        for fn in path('../exe/webui/style/default').files():
            assert ((outdir / fn.basename()).exists(),
                    'Style file "%s" not copied' % (outdir / fn.basename()))
        # Check that each node in the package has had
        # a page made
        self._testNode(package.root, outdir)

    def _testNode(self, node, outdir):
        """Tests for more or less correct creation
        of webpages"""
        if node is node.package.root:
            fn = outdir / 'index.html'
        else:
            fn = outdir / node.id + '.html'
        assert fn.exists(), 'HTML file "%s" not created' % fn
        html = open(fn).read()
        assert (node.title in html,
                'Node title (%s) not found in "%s"' % (node.title, fn))
        for child in node.children:
            self._testNode(child, outdir)
        
class BaseTestScormExport(unittest.TestCase):
    
    def doTest(self, withMeta):
        """Exports a package with meta data"""
        # Load our test package
        package = Package.load('testPackage.elp')
        # Do the export
        outfn = path('scormtest.zip')
        exporter = ScormExport('../exe/webui/style/default', '../exe/webui/scripts', outfn)
        exporter.export(package, withMeta)
        # Check that it made a nice zip file
        assert outfn.exists()
        # See if the manifest file was created
        zf = ZipFile(outfn)
        fns = zf.namelist()
        assert 'imsmanifest.xml' in fns, fns
        self._testManifest(zf.read('imsmanifest.xml'))
        # Test that all the node's html files have been generated
        self._testNode(package.root, zf)
        # Clean up
        zf.close()

    def _testManifest(self, content):
        """Override this func to test different types of manifest files"""

    def _testNode(self, node, zf):
        """Tests for more or less correct creation
        of webpages"""
        if node is node.package.root:
            fn = 'index.html'
        else:
            fn = node.id + '.html'
        assert fn in zf.namelist(), 'HTML file "%s" not created' % fn
        html = zf.read(fn)
        assert (node.title in html,
                'Node title (%s) not found in "%s"' % (node.title, fn))
        for child in node.children:
            self._testNode(child, zf)
        

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
