import io
from twisted.internet import defer
from twisted.trial import unittest
from twisted.trial import runner, reporter, util
from twisted.trial.test import detests


class TestSetUp(unittest.TestCase):
    def _loadSuite(self, klass):
        loader = runner.TestLoader()
        r = reporter.TestResult()
        s = loader.loadClass(klass)
        return r, s

    def test_success(self):
        result, suite = self._loadSuite(detests.DeferredSetUpOK)
        suite(result)
        self.assertTrue(result.wasSuccessful())
        self.assertEqual(result.testsRun, 1)

    def test_fail(self):
        self.assertFalse(detests.DeferredSetUpFail.testCalled)
        result, suite = self._loadSuite(detests.DeferredSetUpFail)
        suite(result)
        self.assertFalse(result.wasSuccessful())
        self.assertEqual(result.testsRun, 1)
        self.assertEqual(len(result.failures), 0)
        self.assertEqual(len(result.errors), 1)
        self.assertFalse(detests.DeferredSetUpFail.testCalled)

    def test_callbackFail(self):
        self.assertFalse(detests.DeferredSetUpCallbackFail.testCalled)
        result, suite = self._loadSuite(detests.DeferredSetUpCallbackFail)
        suite(result)
        self.assertFalse(result.wasSuccessful())
        self.assertEqual(result.testsRun, 1)
        self.assertEqual(len(result.failures), 0)
        self.assertEqual(len(result.errors), 1)
        self.assertFalse(detests.DeferredSetUpCallbackFail.testCalled)
        
    def test_error(self):
        self.assertFalse(detests.DeferredSetUpError.testCalled)
        result, suite = self._loadSuite(detests.DeferredSetUpError)
        suite(result)
        self.assertFalse(result.wasSuccessful())
        self.assertEqual(result.testsRun, 1)
        self.assertEqual(len(result.failures), 0)
        self.assertEqual(len(result.errors), 1)
        self.assertFalse(detests.DeferredSetUpError.testCalled)

    def test_skip(self):
        self.assertFalse(detests.DeferredSetUpSkip.testCalled)
        result, suite = self._loadSuite(detests.DeferredSetUpSkip)
        suite(result)
        self.assertTrue(result.wasSuccessful())
        self.assertEqual(result.testsRun, 1)
        self.assertEqual(len(result.failures), 0)
        self.assertEqual(len(result.errors), 0)
        self.assertEqual(len(result.skips), 1)
        self.assertFalse(detests.DeferredSetUpSkip.testCalled)
        

class TestNeverFire(unittest.TestCase):
    def setUp(self):
        self._oldTimeout = util.DEFAULT_TIMEOUT_DURATION
        util.DEFAULT_TIMEOUT_DURATION = 0.1

    def tearDown(self):
        util.DEFAULT_TIMEOUT_DURATION = self._oldTimeout

    def _loadSuite(self, klass):
        loader = runner.TestLoader()
        r = reporter.TestResult()
        s = loader.loadClass(klass)
        return r, s

    def test_setUp(self):
        self.assertFalse(detests.DeferredSetUpNeverFire.testCalled)        
        result, suite = self._loadSuite(detests.DeferredSetUpNeverFire)
        suite(result)
        self.assertFalse(result.wasSuccessful())
        self.assertEqual(result.testsRun, 1)
        self.assertEqual(len(result.failures), 0)
        self.assertEqual(len(result.errors), 1)
        self.assertFalse(detests.DeferredSetUpNeverFire.testCalled)
        self.assertTrue(result.errors[0][1].check(defer.TimeoutError))


class TestTester(unittest.TestCase):
    def getTest(self, name):
        raise NotImplementedError("must override me")

    def runTest(self, name):
        result = reporter.TestResult()
        self.getTest(name).run(result)
        return result


class TestDeferred(TestTester):
    def getTest(self, name):
        return detests.DeferredTests(name)

    def test_pass(self):
        result = self.runTest('test_pass')
        self.assertTrue(result.wasSuccessful())
        self.assertEqual(result.testsRun, 1)

    def test_passGenerated(self):
        result = self.runTest('test_passGenerated')
        self.assertTrue(result.wasSuccessful())
        self.assertEqual(result.testsRun, 1)
        self.assertTrue(detests.DeferredTests.touched)

    def test_fail(self):
        result = self.runTest('test_fail')
        self.assertFalse(result.wasSuccessful())
        self.assertEqual(result.testsRun, 1)
        self.assertEqual(len(result.failures), 1)

    def test_failureInCallback(self):
        result = self.runTest('test_failureInCallback')
        self.assertFalse(result.wasSuccessful())
        self.assertEqual(result.testsRun, 1)
        self.assertEqual(len(result.failures), 1)
        
    def test_errorInCallback(self):
        result = self.runTest('test_errorInCallback')
        self.assertFalse(result.wasSuccessful())
        self.assertEqual(result.testsRun, 1)
        self.assertEqual(len(result.errors), 1)

    def test_skip(self):
        result = self.runTest('test_skip')
        self.assertTrue(result.wasSuccessful())
        self.assertEqual(result.testsRun, 1)
        self.assertEqual(len(result.skips), 1)
        self.assertFalse(detests.DeferredTests.touched)

    def test_todo(self):
        result = self.runTest('test_expectedFailure')
        self.assertTrue(result.wasSuccessful())
        self.assertEqual(result.testsRun, 1)
        self.assertEqual(len(result.errors), 0)
        self.assertEqual(len(result.failures), 0)
        self.assertEqual(len(result.expectedFailures), 1)
        
    def test_thread(self):
        result = self.runTest('test_thread')
        self.assertEqual(result.testsRun, 1)
        self.assertTrue(result.wasSuccessful(), result.errors)


class TestTimeout(TestTester):
    def getTest(self, name):
        return detests.TimeoutTests(name)

    def _wasTimeout(self, error):
        self.assertEqual(error.check(defer.TimeoutError),
                             defer.TimeoutError)

    def test_pass(self):
        result = self.runTest('test_pass')
        self.assertTrue(result.wasSuccessful())
        self.assertEqual(result.testsRun, 1)

    def test_passDefault(self):
        result = self.runTest('test_passDefault')
        self.assertTrue(result.wasSuccessful())
        self.assertEqual(result.testsRun, 1)

    def test_timeout(self):
        result = self.runTest('test_timeout')
        self.assertFalse(result.wasSuccessful())
        self.assertEqual(result.testsRun, 1)
        self.assertEqual(len(result.errors), 1)
        self._wasTimeout(result.errors[0][1])

    def test_timeoutZero(self):
        result = self.runTest('test_timeoutZero')
        self.assertFalse(result.wasSuccessful())
        self.assertEqual(result.testsRun, 1)
        self.assertEqual(len(result.errors), 1)
        self._wasTimeout(result.errors[0][1])
    
    def test_skip(self):
        result = self.runTest('test_skip')
        self.assertTrue(result.wasSuccessful())
        self.assertEqual(result.testsRun, 1)
        self.assertEqual(len(result.skips), 1)
    
    def test_todo(self):
        result = self.runTest('test_expectedFailure')
        self.assertTrue(result.wasSuccessful())
        self.assertEqual(result.testsRun, 1)
        self.assertEqual(len(result.expectedFailures), 1)
        self._wasTimeout(result.expectedFailures[0][1])

    def test_errorPropagation(self):
        result = self.runTest('test_errorPropagation')
        self.assertFalse(result.wasSuccessful())
        self.assertEqual(result.testsRun, 1)
        self._wasTimeout(detests.TimeoutTests.timedOut)

    def test_classTimeout(self):
        loader = runner.TestLoader()
        suite = loader.loadClass(detests.TestClassTimeoutAttribute)
        result = reporter.TestResult()
        suite.run(result)
        self.assertEqual(len(result.errors), 1)
        self._wasTimeout(result.errors[0][1])
        
    def test_callbackReturnsNonCallingDeferred(self):
        #hacky timeout
        # raises KeyboardInterrupt because Trial sucks
        from twisted.internet import reactor
        call = reactor.callLater(2, reactor.crash)
        result = self.runTest('test_calledButNeverCallback')
        if call.active():
            call.cancel()
        self.assertFalse(result.wasSuccessful())
        self.assertEqual(len(result.errors), 1)
        self._wasTimeout(result.errors[0][1])
