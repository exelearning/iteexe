
# Copyright (c) 2001-2004 Twisted Matrix Laboratories.
# See LICENSE for details.


from twisted.trial import unittest

# system imports
import os, shutil, time

# twisted imports
from twisted.python import logfile


class LogFileTestCase(unittest.TestCase):
    """Test the rotating log file."""
    
    def setUp(self):
        self.dir = self.mktemp()
        os.makedirs(self.dir)
        self.name = "test.log"
        self.path = os.path.join(self.dir, self.name)
    
    def tearDown(self):
        shutil.rmtree(self.dir)
        pass
    
    def testWriting(self):
        log = logfile.LogFile(self.name, self.dir)
        log.write("123")
        log.write("456")
        log.flush()
        log.write("7890")
        log.close()
        
        f = open(self.path, "r")
        self.assertEqual(f.read(), "1234567890")
        f.close()
    
    def testRotation(self):
        # this logfile should rotate every 10 bytes
        log = logfile.LogFile(self.name, self.dir, rotateLength=10)
        
        # test automatic rotation
        log.write("123")
        log.write("4567890")
        log.write("1" * 11)
        self.assertTrue(os.path.exists("%s.1" % self.path))
        self.assertTrue(not os.path.exists("%s.2" % self.path))
        log.write('')
        self.assertTrue(os.path.exists("%s.1" % self.path))
        self.assertTrue(os.path.exists("%s.2" % self.path))
        self.assertTrue(not os.path.exists("%s.3" % self.path))
        log.write("3")
        self.assertTrue(not os.path.exists("%s.3" % self.path))
        
        # test manual rotation
        log.rotate()
        self.assertTrue(os.path.exists("%s.3" % self.path))
        self.assertTrue(not os.path.exists("%s.4" % self.path))
        log.close()

        self.assertEqual(log.listLogs(), [1, 2, 3])
    
    def testAppend(self):
        log = logfile.LogFile(self.name, self.dir)
        log.write("0123456789")
        log.close()
        
        log = logfile.LogFile(self.name, self.dir)
        self.assertEqual(log.size, 10)
        self.assertEqual(log._file.tell(), log.size)
        log.write("abc")
        self.assertEqual(log.size, 13)
        self.assertEqual(log._file.tell(), log.size)
        f = log._file
        f.seek(0, 0)
        self.assertEqual(f.read(), "0123456789abc")
        log.close()

    def testLogReader(self):
        log = logfile.LogFile(self.name, self.dir)
        log.write("abc\n")
        log.write("def\n")
        log.rotate()
        log.write("ghi\n")
        log.flush()
        
        # check reading logs
        self.assertEqual(log.listLogs(), [1])
        reader = log.getCurrentLog()
        reader._file.seek(0)
        self.assertEqual(reader.readLines(), ["ghi\n"])
        self.assertEqual(reader.readLines(), [])
        reader.close()
        reader = log.getLog(1)
        self.assertEqual(reader.readLines(), ["abc\n", "def\n"])
        self.assertEqual(reader.readLines(), [])
        reader.close()
        
        # check getting illegal log readers
        self.assertRaises(ValueError, log.getLog, 2)
        self.assertRaises(TypeError, log.getLog, "1")

        # check that log numbers are higher for older logs
        log.rotate()
        self.assertEqual(log.listLogs(), [1, 2])
        reader = log.getLog(1)
        reader._file.seek(0)
        self.assertEqual(reader.readLines(), ["ghi\n"])
        self.assertEqual(reader.readLines(), [])
        reader.close()
        reader = log.getLog(2)
        self.assertEqual(reader.readLines(), ["abc\n", "def\n"])
        self.assertEqual(reader.readLines(), [])
        reader.close()

    def testModePreservation(self):
        "logfile: check rotated files have same permissions as original."
        if not hasattr(os, "chmod"): return
        f = open(self.path, "w").close()
        os.chmod(self.path, 0o707)
        mode = os.stat(self.path)[0]
        log = logfile.LogFile(self.name, self.dir)
        log.write("abc")
        log.rotate()
        self.assertEqual(mode, os.stat(self.path)[0])

    def testNoPermission(self):
        "logfile: check it keeps working when permission on dir changes."
        log = logfile.LogFile(self.name, self.dir)
        log.write("abc")

        # change permissions so rotation would fail
        os.chmod(self.dir, 444)

        # if this succeeds, chmod doesn't restrict us, so we can't
        # do the test
        try:
            f = open(os.path.join(self.dir,"xxx"), "w")
        except (OSError, IOError):
            pass
        else:
            f.close()
            return
        
        log.rotate() # this should not fail

        log.write("def")
        log.flush()

        f = log._file
        self.assertEqual(f.tell(), 6)
        f.seek(0, 0)
        self.assertEqual(f.read(), "abcdef")
        log.close()

        # reset permission so tearDown won't fail
        os.chmod(self.dir, 0o777)

        
class RiggedDailyLogFile(logfile.DailyLogFile):
    _clock = 0.0

    def _openFile(self):
        logfile.DailyLogFile._openFile(self)
        # rig the date to match _clock, not mtime
        self.lastDate = self.toDate()

    def toDate(self, *args):
        if args:
            return time.gmtime(*args)[:3]
        return time.gmtime(self._clock)[:3]

class DailyLogFileTestCase(unittest.TestCase):
    """Test the rotating log file."""
    
    def setUp(self):
        self.dir = self.mktemp()
        os.makedirs(self.dir)
        self.name = "testdaily.log"
        self.path = os.path.join(self.dir, self.name)
    
    def tearDown(self):
        shutil.rmtree(self.dir)
        pass
    
    def testWriting(self):
        log = RiggedDailyLogFile(self.name, self.dir)
        log.write("123")
        log.write("456")
        log.flush()
        log.write("7890")
        log.close()
        
        f = open(self.path, "r")
        self.assertEqual(f.read(), "1234567890")
        f.close()
    
    def testRotation(self):
        # this logfile should rotate every 10 bytes
        log = RiggedDailyLogFile(self.name, self.dir)
        days = [(self.path + '.' + log.suffix(day * 86400)) for day in range(3)]
        
        # test automatic rotation
        log._clock = 0.0    # 1970/01/01 00:00.00
        log.write("123")
        log._clock = 43200  # 1970/01/01 12:00.00
        log.write("4567890")
        log._clock = 86400  # 1970/01/02 00:00.00
        log.write("1" * 11)
        self.assertTrue(os.path.exists(days[0]))
        self.assertTrue(not os.path.exists(days[1]))
        log._clock = 172800 # 1970/01/03 00:00.00
        log.write('')
        self.assertTrue(os.path.exists(days[0]))
        self.assertTrue(os.path.exists(days[1]))
        self.assertTrue(not os.path.exists(days[2]))
        log._clock = 259199 # 1970/01/03 23:59.59
        log.write("3")
        self.assertTrue(not os.path.exists(days[2]))
