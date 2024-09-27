from twisted.trial import unittest

from twisted.pb import referenceable

class URL(unittest.TestCase):
    def testURL(self):
        sr = referenceable.SturdyRef("pb://1234@localhost:9900/name")
        self.assertEqual(sr.tubID, "1234")
        self.assertEqual(sr.locationHints, ["localhost:9900"])
        self.assertEqual(sr.name, "name")

    def testCompare(self):
        sr1 = referenceable.SturdyRef("pb://1234@localhost:9900/name")
        sr2 = referenceable.SturdyRef("pb://1234@localhost:9999/name")
        # only tubID and name matter
        self.assertEqual(sr1, sr2)
        sr1 = referenceable.SturdyRef("pb://9999@localhost:9900/name")
        sr2 = referenceable.SturdyRef("pb://1234@localhost:9900/name")
        self.assertNotEqual(sr1, sr2)
        sr1 = referenceable.SturdyRef("pb://1234@localhost:9900/name1")
        sr2 = referenceable.SturdyRef("pb://1234@localhost:9900/name2")
        self.assertNotEqual(sr1, sr2)

    def testLocationHints(self):
        url = "pb://ABCD@localhost:9900,remote:8899/name"
        sr = referenceable.SturdyRef(url)
        self.assertEqual(sr.tubID, "ABCD")
        self.assertEqual(sr.locationHints, ["localhost:9900",
                                                "remote:8899"])
        self.assertEqual(sr.name, "name")
