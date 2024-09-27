# Copyright (c) 2001-2004 Twisted Matrix Laboratories.
# See LICENSE for details.

#

import sys

from twisted.trial import unittest

from twisted.python import log
from twisted.python import failure
import importlib

class LogTest(unittest.TestCase):

    def setUp(self):
        self.catcher = []
        log.addObserver(self.catcher.append)

    def tearDown(self):
        log.removeObserver(self.catcher.append)

    def testObservation(self):
        catcher = self.catcher
        log.msg("test", testShouldCatch=True)
        i = catcher.pop()
        self.assertEqual(i["message"][0], "test")
        self.assertEqual(i["testShouldCatch"], True)
        self.assertTrue("time" in i)
        self.assertEqual(len(catcher), 0)

    def testContext(self):
        catcher = self.catcher
        log.callWithContext({"subsystem": "not the default",
                             "subsubsystem": "a",
                             "other": "c"},
                            log.callWithContext,
                            {"subsubsystem": "b"}, log.msg, "foo", other="d")
        i = catcher.pop()
        self.assertEqual(i['subsubsystem'], 'b')
        self.assertEqual(i['subsystem'], 'not the default')
        self.assertEqual(i['other'], 'd')
        self.assertEqual(i['message'][0], 'foo')

    def testErrors(self):
        for e, ig in [("hello world","hello world"),
                      (KeyError(), KeyError),
                      (failure.Failure(RuntimeError()), RuntimeError)]:
            log.err(e)
            i = self.catcher.pop()
            self.assertEqual(i['isError'], 1)
            log.flushErrors(ig)

    def testErroneousErrors(self):
        L1 = []
        L2 = []
        log.addObserver(lambda events: events['isError'] or L1.append(events))
        log.addObserver(lambda events: 1/0)
        log.addObserver(lambda events: events['isError'] or L2.append(events))
        log.msg("Howdy, y'all.")

        excs = [f.type for f in log.flushErrors(ZeroDivisionError)]
        self.assertEqual([ZeroDivisionError], excs)

        self.assertEqual(len(L1), 2)
        self.assertEqual(len(L2), 2)

        self.assertEqual(L1[1]['message'], ("Howdy, y'all.",))
        self.assertEqual(L2[0]['message'], ("Howdy, y'all.",))

        # The observer has been removed, there should be no exception
        log.msg("Howdy, y'all.")

        self.assertEqual(len(L1), 3)
        self.assertEqual(len(L2), 3)
        self.assertEqual(L1[2]['message'], ("Howdy, y'all.",))
        self.assertEqual(L2[2]['message'], ("Howdy, y'all.",))


class FakeFile(list):
    def write(self, bytes):
        self.append(bytes)

    def flush(self):
        pass

class EvilStr:
    def __str__(self):
        1/0

class EvilRepr:
    def __str__(self):
        return "Happy Evil Repr"
    def __repr__(self):
        1/0

class EvilReprStr(EvilStr, EvilRepr):
    pass

class LogPublisherTestCaseMixin:
    def setUp(self):
        # Fuck you Python.
        importlib.reload(sys)
        self._origEncoding = sys.getdefaultencoding()
        sys.setdefaultencoding('ascii')

        self.out = FakeFile()
        self.lp = log.LogPublisher()
        self.flo = log.FileLogObserver(self.out)
        self.lp.addObserver(self.flo.emit)

    def tearDown(self):
        for chunk in self.out:
            self.assertTrue(isinstance(chunk, str), "%r was not a string" % (chunk,))
        # Fuck you very much.
        sys.setdefaultencoding(self._origEncoding)
        del sys.setdefaultencoding

class LogPublisherTestCase(LogPublisherTestCaseMixin, unittest.TestCase):

    def testSingleString(self):
        self.lp.msg("Hello, world.")
        self.assertEqual(len(self.out), 1)

    def testMultipleString(self):
        # Test some stupid behavior that will be deprecated real soon.
        # If you are reading this and trying to learn how the logging
        # system works, *do not use this feature*.
        self.lp.msg("Hello, ", "world.")
        self.assertEqual(len(self.out), 1)

    def testSingleUnicode(self):
        self.lp.msg("Hello, \N{VULGAR FRACTION ONE HALF} world.")
        self.assertEqual(len(self.out), 1)
        self.assertIn('with str error Traceback', self.out[0])
        self.assertIn('UnicodeEncodeError', self.out[0])

class FileObserverTestCase(LogPublisherTestCaseMixin, unittest.TestCase):
    def testLoggingAnObjectWithBroken__str__(self):
        #HELLO, MCFLY
        self.lp.msg(EvilStr())
        self.assertEqual(len(self.out), 1)
        # Logging system shouldn't need to crap itself for this trivial case
        self.assertNotIn('UNFORMATTABLE', self.out[0])

    def testFormattingAnObjectWithBroken__str__(self):
        self.lp.msg(format='%(blat)s', blat=EvilStr())
        self.assertEqual(len(self.out), 1)
        self.assertIn('Invalid format string or unformattable object', self.out[0])

    def testBrokenSystem__str__(self):
        self.lp.msg('huh', system=EvilStr())
        self.assertEqual(len(self.out), 1)
        self.assertIn('Invalid format string or unformattable object', self.out[0])

    def testFormattingAnObjectWithBroken__repr__Indirect(self):
        self.lp.msg(format='%(blat)s', blat=[EvilRepr()])
        self.assertEqual(len(self.out), 1)
        self.assertIn('UNFORMATTABLE OBJECT', self.out[0])

    def testSystemWithBroker__repr__Indirect(self):
        self.lp.msg('huh', system=[EvilRepr()])
        self.assertEqual(len(self.out), 1)
        self.assertIn('UNFORMATTABLE OBJECT', self.out[0])

    def testSimpleBrokenFormat(self):
        self.lp.msg(format='hooj %s %s', blat=1)
        self.assertEqual(len(self.out), 1)
        self.assertIn('Invalid format string or unformattable object', self.out[0])

    def testRidiculousFormat(self):
        self.lp.msg(format=42, blat=1)
        self.assertEqual(len(self.out), 1)
        self.assertIn('Invalid format string or unformattable object', self.out[0])

    def testEvilFormat__repr__And__str__(self):
        self.lp.msg(format=EvilReprStr(), blat=1)
        self.assertEqual(len(self.out), 1)
        self.assertIn('PATHOLOGICAL', self.out[0])
