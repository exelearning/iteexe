#!/usr/bin/env python
# -*- coding: utf-8 -*-
import unittest
import sys


class TestLOM(unittest.TestCase):

    def setUp(self):
        from exe.engine.lom import lomsubs
        self.root = lomsubs.parse('exe/engine/lom/test/examplelomes.xml')

    def test_encode_decode(self):
        from exe.engine.persistxml import encodeObjectToXML, decodeObjectFromXML
        xml = encodeObjectToXML(self.root)
        root, success = decodeObjectFromXML(xml)
        self.assertTrue(success)
        root.export(sys.stdout, 0, namespacedef_='', pretty_print=True)

if __name__ == '__main__':
    unittest.main()
