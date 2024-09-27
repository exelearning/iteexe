
import os, time, pickle, errno

from twisted.python import filepath
from twisted.python.runtime import platform
from twisted.trial import unittest

class FilePathTestCase(unittest.TestCase):

    f1content = "file 1"
    f2content = "file 2"

    def _mkpath(self, *p):
        x = os.path.abspath(os.path.join(self.cmn, *p))
        self.all.append(x)
        return x

    def subdir(self, *dirname):
        os.mkdir(self._mkpath(*dirname))

    def subfile(self, *dirname):
        return open(self._mkpath(*dirname), "wb")

    def setUp(self):
        self.now = time.time()
        cmn = self.cmn = os.path.abspath(self.mktemp())
        self.all = [cmn]
        os.mkdir(cmn)
        self.subdir("sub1")
        f = self.subfile("file1")
        f.write(self.f1content)
        f = self.subfile("sub1", "file2")
        f.write(self.f2content)
        self.subdir('sub3')
        f = self.subfile("sub3", "file3.ext1")
        f = self.subfile("sub3", "file3.ext2")
        f = self.subfile("sub3", "file3.ext3")
        self.all.sort()

        self.path = filepath.FilePath(cmn)

    def testWalk(self):
        x = [foo.path for foo in self.path.walk()]
        x.sort()
        self.assertEqual(x, self.all)

    def testGetAndSet(self):
        content = 'newcontent'
        self.path.child('new').setContent(content)
        newcontent = self.path.child('new').getContent()
        self.assertEqual(content, newcontent)
        content = 'content'
        self.path.child('new').setContent(content, '.tmp')
        newcontent = self.path.child('new').getContent()
        self.assertEqual(content, newcontent)

    if platform.getType() == 'win32':
        testGetAndSet.todo = "os.rename in FilePath.setContent doesn't work too well on Windows"

    def testValidSubdir(self):
        sub1 = self.path.child('sub1')
        self.assertTrue(sub1.exists(),
                        "This directory does exist.")
        self.assertTrue(sub1.isdir(),
                        "It's a directory.")
        self.assertTrue(not sub1.isfile(),
                        "It's a directory.")
        self.assertTrue(not sub1.islink(),
                        "It's a directory.")
        self.assertEqual(sub1.listdir(),
                             ['file2'])

    def testMultiExt(self):
        f3 = self.path.child('sub3').child('file3')
        exts = '.foo','.bar', 'ext1','ext2','ext3'
        self.assertFalse(f3.siblingExtensionSearch(*exts))
        f3e = f3.siblingExtension(".foo")
        f3e.touch()
        self.assertFalse(not f3.siblingExtensionSearch(*exts).exists())
        self.assertFalse(not f3.siblingExtensionSearch('*').exists())
        f3e.remove()
        self.assertFalse(f3.siblingExtensionSearch(*exts))

    def testInvalidSubdir(self):
        sub2 = self.path.child('sub2')
        self.assertFalse(sub2.exists(),
                    "This directory does not exist.")

    def testValidFiles(self):
        f1 = self.path.child('file1')
        self.assertEqual(f1.open().read(), self.f1content)
        f2 = self.path.child('sub1').child('file2')
        self.assertEqual(f2.open().read(), self.f2content)

    def testPreauthChild(self):
        fp = filepath.FilePath('.')
        fp.preauthChild('foo/bar')
        self.assertRaises(filepath.InsecurePath, fp.child, '/foo')

    def testStatCache(self):
        p = self.path.child('stattest')
        p.touch()
        self.assertEqual(p.getsize(), 0)
        self.assertEqual(abs(p.getmtime() - time.time()) // 20, 0)
        self.assertEqual(abs(p.getctime() - time.time()) // 20, 0)
        self.assertEqual(abs(p.getatime() - time.time()) // 20, 0)
        self.assertEqual(p.exists(), True)
        self.assertEqual(p.exists(), True)
        # OOB removal: FilePath.remove() will automatically restat
        os.remove(p.path)
        # test caching
        self.assertEqual(p.exists(), True)
        p.restat(reraise=False)
        self.assertEqual(p.exists(), False)
        self.assertEqual(p.islink(), False)
        self.assertEqual(p.isdir(), False)
        self.assertEqual(p.isfile(), False)

    def testPersist(self):
        newpath = pickle.loads(pickle.dumps(self.path))
        self.assertEqual(self.path.__class__, newpath.__class__)
        self.assertEqual(self.path.path, newpath.path)

    def testInsecureUNIX(self):
        self.assertRaises(filepath.InsecurePath, self.path.child, "..")
        self.assertRaises(filepath.InsecurePath, self.path.child, "/etc")
        self.assertRaises(filepath.InsecurePath, self.path.child, "../..")

    def testInsecureWin32(self):
        self.assertRaises(filepath.InsecurePath, self.path.child, r"..\..")
        self.assertRaises(filepath.InsecurePath, self.path.child, r"C:randomfile")

    if platform.getType() != 'win32':
        testInsecureWin32.skip = "Consider yourself lucky."

    def testInsecureWin32Whacky(self):
        """Windows has 'special' filenames like NUL and CON and COM1 and LPR
        and PRN and ... god knows what else.  They can be located anywhere in
        the filesystem.  For obvious reasons, we do not wish to normally permit
        access to these.
        """
        self.assertRaises(filepath.InsecurePath, self.path.child, "CON")
        self.assertRaises(filepath.InsecurePath, self.path.child, "C:CON")
        self.assertRaises(filepath.InsecurePath, self.path.child, r"C:\CON")

    if platform.getType() != 'win32':
        testInsecureWin32Whacky.skip = "Consider yourself lucky."

    def testComparison(self):
        self.assertEqual(filepath.FilePath('a'),
                          filepath.FilePath('a'))
        self.assertTrue(filepath.FilePath('z') >
                        filepath.FilePath('a'))
        self.assertTrue(filepath.FilePath('z') >=
                        filepath.FilePath('a'))
        self.assertTrue(filepath.FilePath('a') >=
                        filepath.FilePath('a'))
        self.assertTrue(filepath.FilePath('a') <=
                        filepath.FilePath('a'))
        self.assertTrue(filepath.FilePath('a') <
                        filepath.FilePath('z'))
        self.assertTrue(filepath.FilePath('a') <=
                        filepath.FilePath('z'))
        self.assertTrue(filepath.FilePath('a') !=
                        filepath.FilePath('z'))
        self.assertTrue(filepath.FilePath('z') !=
                        filepath.FilePath('a'))

        self.assertFalse(filepath.FilePath('z') !=
                    filepath.FilePath('z'))

    def testSibling(self):
        p = self.path.child('sibling_start')
        ts = p.sibling('sibling_test')
        self.assertEqual(ts.dirname(), p.dirname())
        self.assertEqual(ts.basename(), 'sibling_test')
        ts.createDirectory()
        self.assertIn(ts, self.path.children())

    def testTemporarySibling(self):
        ts = self.path.temporarySibling()
        self.assertEqual(ts.dirname(), self.path.dirname())
        self.assertNotIn(ts.basename(), self.path.listdir())
        ts.createDirectory()
        self.assertIn(ts, self.path.parent().children())

    def testRemove(self):
        self.path.remove()
        self.assertFalse(self.path.exists())

    def testCopyTo(self):
        self.assertRaises((OSError, IOError), self.path.copyTo, self.path.child('file1'))
        oldPaths = list(self.path.walk()) # Record initial state
        fp = filepath.FilePath(self.mktemp())
        self.path.copyTo(fp)
        self.path.remove()
        fp.copyTo(self.path)
        newPaths = list(self.path.walk()) # Record double-copy state
        newPaths.sort()
        oldPaths.sort()
        self.assertEqual(newPaths, oldPaths)

    def testMoveTo(self):
        self.assertRaises((OSError, IOError), self.path.moveTo, self.path.child('file1'))
        oldPaths = list(self.path.walk()) # Record initial state
        fp = filepath.FilePath(self.mktemp())
        self.path.moveTo(fp)
        fp.moveTo(self.path)
        newPaths = list(self.path.walk()) # Record double-move state
        newPaths.sort()
        oldPaths.sort()
        self.assertEqual(newPaths, oldPaths)

    def testCrossMountMoveTo(self):
        """
        """
        # Bit of a whitebox test - force os.rename, which moveTo tries
        # before falling back to a slower method, to fail, forcing moveTo to
        # use the slower behavior.
        invokedWith = []
        def faultyRename(src, dest):
            invokedWith.append((src, dest))
            if len(invokedWith) == 2:
                raise OSError(errno.EXDEV, 'Test-induced failure simulating cross-device rename failure')
            return originalRename(src, dest)

        originalRename = os.rename
        os.rename = faultyRename
        try:
            self.testMoveTo()
            # A bit of a sanity check for this whitebox test - if our rename
            # was never invoked, the test has probably fallen into
            # disrepair!
            self.assertTrue(len(invokedWith) >= 2)
        finally:
            os.rename = originalRename

    def testOpen(self):
        # Opening a file for reading when it does not already exist is an error
        nonexistent = self.path.child('nonexistent')
        e = self.assertRaises(IOError, nonexistent.open)
        self.assertEqual(e.errno, errno.ENOENT)

        # Opening a file for writing when it does not exist is okay
        writer = self.path.child('writer')
        f = writer.open('w')
        f.write('abc\ndef')
        f.close()

        # Make sure those bytes ended up there - and test opening a file for
        # reading when it does exist at the same time
        f = writer.open()
        self.assertEqual(f.read(), 'abc\ndef')
        f.close()

        # Re-opening that file in write mode should erase whatever was there.
        f = writer.open('w')
        f.close()
        f = writer.open()
        self.assertEqual(f.read(), '')
        f.close()

        # Put some bytes in a file so we can test that appending does not
        # destroy them.
        appender = self.path.child('appender')
        f = appender.open('w')
        f.write('abc')
        f.close()

        f = appender.open('a')
        f.write('def')
        f.close()

        f = appender.open('r')
        self.assertEqual(f.read(), 'abcdef')
        f.close()

        # read/write should let us do both without erasing those bytes
        f = appender.open('r+')
        self.assertEqual(f.read(), 'abcdef')
        # ANSI C *requires* an fseek or an fgetpos between an fread and an
        # fwrite or an fwrite and a fread.  We can't reliable get Python to
        # invoke fgetpos, so we seek to a 0 byte offset from the current
        # position instead.  Also, Python sucks for making this seek
        # relative to 1 instead of a symbolic constant representing the
        # current file position.
        f.seek(0, 1)
        # Put in some new bytes for us to test for later.
        f.write('ghi')
        f.close()

        # Make sure those new bytes really showed up
        f = appender.open('r')
        self.assertEqual(f.read(), 'abcdefghi')
        f.close()

        # write/read should let us do both, but erase anything that's there
        # already.
        f = appender.open('w+')
        self.assertEqual(f.read(), '')
        f.seek(0, 1) # Don't forget this!
        f.write('123')
        f.close()

        # super append mode should let us read and write and also position the
        # cursor at the end of the file, without erasing everything.
        f = appender.open('a+')

        # The order of these lines may seem surprising, but it is necessary.
        # The cursor is not at the end of the file until after the first write.
        f.write('456')
        f.seek(0, 1) # Asinine.
        self.assertEqual(f.read(), '')

        f.seek(0, 0)
        self.assertEqual(f.read(), '123456')
        f.close()

        # Opening a file exclusively must fail if that file exists already.
        nonexistent.requireCreate(True)
        nonexistent.open('w').close()
        existent = nonexistent
        del nonexistent
        self.assertRaises((OSError, IOError), existent.open)


from twisted.python import urlpath

class URLPathTestCase(unittest.TestCase):
    def setUp(self):
        self.path = urlpath.URLPath.fromString("http://example.com/foo/bar?yes=no&no=yes#footer")

    def testStringConversion(self):
        self.assertEqual(str(self.path), "http://example.com/foo/bar?yes=no&no=yes#footer")

    def testChildString(self):
        self.assertEqual(str(self.path.child('hello')), "http://example.com/foo/bar/hello")
        self.assertEqual(str(self.path.child('hello').child('')), "http://example.com/foo/bar/hello/")

    def testSiblingString(self):
        self.assertEqual(str(self.path.sibling('baz')), 'http://example.com/foo/baz')
        
        # The sibling of http://example.com/foo/bar/
        #     is http://example.comf/foo/bar/baz
        # because really we are constructing a sibling of
        # http://example.com/foo/bar/index.html
        self.assertEqual(str(self.path.child('').sibling('baz')), 'http://example.com/foo/bar/baz')

    def testParentString(self):
        # parent should be equivalent to '..'
        # 'foo' is the current directory, '/' is the parent directory
        self.assertEqual(str(self.path.parent()), 'http://example.com/')
        self.assertEqual(str(self.path.child('').parent()), 'http://example.com/foo/')
        self.assertEqual(str(self.path.child('baz').parent()), 'http://example.com/foo/')
        self.assertEqual(str(self.path.parent().parent().parent().parent().parent()), 'http://example.com/')

    def testHereString(self):
        # here should be equivalent to '.'
        self.assertEqual(str(self.path.here()), 'http://example.com/foo/')
        self.assertEqual(str(self.path.child('').here()), 'http://example.com/foo/bar/')

